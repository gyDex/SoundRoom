import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { PartyEntity } from './entities/party.entity';
import { User } from '../auth/entities/user.entity';

export type RoomState = {
  hostId: string;
  isPlaying: boolean;
  position: number;
  updatedAt: number;
  audio: string | undefined | null,
  duration,

  id: string;                  
  name: string;                  
  description?: string;         
  createdAt: Date;               
  createdBy: string;             
  isPrivate: boolean;            
  password?: string;             
  maxUsers?: number;             
};

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(PartyEntity)
    private readonly partyRepo: Repository<PartyEntity>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /** WebSocket runtime state (НЕ БД) */
  private rooms = new Map<string, RoomState>();

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

    async getUserRooms(userId: string): Promise<string[]> {
    try {
      const parties = await this.partyRepo
        .createQueryBuilder('party')
        .leftJoinAndSelect('party.connectedUsers', 'user')
        .where('user.id = :userId', { userId })
        .select(['party.id'])
        .getMany();
      
      return parties.map(party => party.id);
    } catch (error) {
      console.error('Error getting user rooms:', error);
      return [];
    }
  }

  async leave(userId: string, roomId: string, server: any) {
    const party = await this.partyRepo.findOne({
      where: { id: roomId },
      relations: ['connectedUsers'],
    });

    if (!party) return null;

    party.connectedUsers = party.connectedUsers.filter(
      u => u.id !== userId,
    );

if (party.createdBy === userId) {
  const newHost = party.connectedUsers[0]?.id ?? null;
  party.createdBy = newHost;

  const state = this.rooms.get(roomId);
  if (state && newHost) {
    state.hostId = newHost;
    this.rooms.set(roomId, state);
  }
}

    if (party.connectedUsers.length === 0) {
      server.in(roomId).emit('room-deleted', { roomId })
      this.rooms.delete(roomId);
      await this.partyRepo.delete(roomId);
      return null;
    }

    await this.partyRepo.save(party);
    return party;
  }

  async join(userId: string, roomId: string) {
    const party = await this.partyRepo.findOne({
      where: { id: roomId },
      relations: ['connectedUsers'] // загружаем connectedUsers
    });
    
    if (!party) {
      throw new NotFoundException(`Party ${roomId} not found`);
    }
    
    if (party.isPrivate) {
      // логика проверки пароля
      // throw new UnauthorizedException('Invalid password');
    }
    
    const isAlreadyJoined = party.connectedUsers?.some(
      user => user.id === userId
    );
    
    if (isAlreadyJoined) {
      throw new ConflictException(`User ${userId} already joined this party`);
    }
    
    const user = await this.userRepo.findOne({
      where: { id: userId }
    });
    
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }
    
    party.connectedUsers = [...(party.connectedUsers || []), user];
    
    await this.partyRepo.save(party);
    
    return this.partyRepo.findOne({
      where: { id: roomId },
      relations: ['connectedUsers']
    });
  }

  async create(roomId: string, hostId: string, audio: any, state: any) {
    console.log(roomId)
    console.log(roomId)

    const roomState: RoomState = {
      id: roomId,
      hostId,
      isPlaying: false,
      position: 0,
      createdAt: new Date(),
      createdBy: hostId,
      updatedAt: Date.now(),
      audio: audio,
      duration: 0,
      ...state,
    };

        const {  isPlaying, 
              duration, 
              updatedAt,
              position,
              ...otherProps } = roomState;

    const room = await this.partyRepo.create({
      ...otherProps,
      password: state.password
        ? await bcrypt.hash(state.password, 10)
        : undefined,
    });

    await this.partyRepo.save(room)

    this.rooms.set(roomId, roomState);

    return roomState;
  }

  async get(roomId: string) {
    return await this.partyRepo.findOne({
      where: {
        id: roomId
      }});
  }

  exists(roomId: string): boolean {
    return this.rooms.has(roomId);
  }

  isHost(roomId: string, userId: string): boolean {
    return this.rooms.get(roomId)?.hostId === userId;
  }

  update(roomId: string, data: Partial<RoomState>) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const updated: RoomState = {
      ...room,
      ...data,
      updatedAt: Date.now(),
    };

    this.rooms.set(roomId, updated);
    return updated;
  }
}
