import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import * as bcrypt from 'bcryptjs';

import { PartyEntity } from './entities/party.entity';
import { User } from '../auth/entities/user.entity';
import { RoomState } from './party.types';


@Injectable()
export class RoomService {
  private redis: Redis;

  constructor(
    @InjectRepository(PartyEntity)
    private readonly partyRepo: Repository<PartyEntity>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    this.redis = new Redis({
      host: '127.0.0.1',
      port: 6379,
    });
  }

  /* ---------------- helpers ---------------- */

  private roomKey(roomId: string) {
    return `room:${roomId}`;
  }

  /* ---------------- runtime ---------------- */

  async exists(roomId: string): Promise<boolean> {
    return (await this.redis.exists(this.roomKey(roomId))) === 1;
  }

  async getRuntime(roomId: string): Promise<RoomState | null> {
    const data = await this.redis.get(this.roomKey(roomId));
    console.log(data)

    return data ? JSON.parse(data) : null;
  }

  async setRuntime(roomId: string, state: RoomState) {
    await this.redis.set(
      this.roomKey(roomId),
      JSON.stringify(state),
      'EX',
      60 * 60, // 1 час TTL
    );
  }

  /* ---------------- create ---------------- */

  async create(roomId: string, hostId: string, audio: any, state: any) {
    const host = await this.userRepo.findOneBy({ id: hostId });
    if (!host) throw new NotFoundException('Host not found');

    const roomState: RoomState = {
      id: roomId,

      hostId,
      createdBy: hostId,
      createdAt: new Date(),

      name: state.name ?? 'Room',
      isPrivate: state.isPrivate ?? false,
      password: state.password
        ? await bcrypt.hash(state.password, 10)
        : undefined,

      isPlaying: false,
      position: 0,
      duration: 0,
      updatedAt: Date.now(),

      audio: audio ?? null,
    };

    const roomEntity = this.partyRepo.create({
      id: roomId,           // ← ОБЯЗАТЕЛЬНО
      hostId: hostId,
      createdBy: hostId,
      isPrivate: roomState.isPrivate,
      password: roomState.password,
      connectedUsers: [host],
    });

    await this.partyRepo.save(roomEntity);
    await this.setRuntime(roomId, roomState);

    return roomState;
  }

  /* ---------------- join ---------------- */

  async join(userId: string, roomId: string, password?: string) {
  const party = await this.partyRepo
    .createQueryBuilder('party')
    .leftJoinAndSelect('party.connectedUsers', 'user')
    .where('party.id = :roomId', { roomId })
    .select([
      'party.id',
      'party.isPrivate',
      'party.password',
      'party.createdBy',

      'user.id',
      'user.username',
      'user.userAvatar',
    ])
    .getOne();

    console.log(party, 'party')

    if (!party) throw new NotFoundException('Room not found');

    if (party.isPrivate && party.password) {
      const ok = await bcrypt.compare(password ?? '', party.password);
      if (!ok) throw new UnauthorizedException('Invalid password');
    }

    const already = party.connectedUsers.some(u => u.id === userId);
    if (!already) {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) throw new NotFoundException('User not found');

      party.connectedUsers.push(user);
      await this.partyRepo.save(party);
    }

    return this.getRuntime(roomId);
  }

  /* ---------------- update ---------------- */

  async update(roomId: string, patch: Partial<RoomState>) {
    const room = await this.getRuntime(roomId);
    if (!room) return null;

    const updated: RoomState = {
      ...room,
      ...patch,
      // updatedAt: Date.now(),
    };

    await this.setRuntime(roomId, updated);
    return updated;
  }

  /* ---------------- leave ---------------- */

  async leave(userId: string, roomId: string) {
  const party = await this.partyRepo
    .createQueryBuilder('party')
    .leftJoinAndSelect('party.connectedUsers', 'user')
    .where('party.id = :roomId', { roomId })
    .select([
      'party.id',
      'party.isPrivate',
      'party.password',
      'party.createdBy',

      'user.id',
      'user.username',
      'user.userAvatar',
    ])
    .getOne();

    if (!party) return null;

    if (party.createdBy === userId) {
      await this.partyRepo.delete(roomId);
      await this.redis.del(this.roomKey(roomId));
      return null;
    }

    party.connectedUsers = party.connectedUsers.filter(u => u.id !== userId);
    await this.partyRepo.save(party);

    return party;
  }


  async getConnectedUsers(partyId: string, currentUserId: string) {
    const party = await this.partyRepo.findOne({
      where: { id: partyId },
      select: {
        id: true,
        connectedUsers: true,
        createdBy: true
      },
      relations: ['connectedUsers']
    });

    if (!party) {
      throw new NotFoundException(`Party ${partyId} not found`);
    }
    
    const isUserInParty = party.connectedUsers.some(
      user => user.id === currentUserId
    );
    
    if (!isUserInParty) {
      throw new ForbiddenException('You are not a member of this party');
    }

    console.log(party)
    
    return {
      connectedUsers:party.connectedUsers,
      hostId: party.createdBy,
  }
  }
}
