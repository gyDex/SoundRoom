import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Friendship } from './entities/friend-ship.entity';
import { CreateFriendInput } from './dto/create-friend.input';
import { User } from 'src/auth/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestIdInput } from './dto/request-id.input';
import { IncomingFriendRequest } from './dto/incoming-friend-request.dto';

@Resolver()
@UseGuards(JwtAuthGuard)
export class FriendsResolver {
  constructor(
    @InjectRepository(Friendship)
    private readonly friendshipRepo: Repository<Friendship>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  @Query(() => [IncomingFriendRequest]) 
  async getIncomingFriendRequests(@Context() ctx: any) {
    const userFromToken = ctx.req.user;
    const userId = userFromToken.id || userFromToken.userId;

    const friendships = await this.friendshipRepo.find({
      where: {
        addressee: { id: userId },
        status: 'pending' 
      },
      relations: ['requester'], 
      order: { createdAt: 'DESC' }
    });

    return friendships.map(f => ({
      id: f.id,
      requester: f.requester
    }));
  }
  
  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async rejectRequest(
    @Args('input') input: RequestIdInput
  )
  {
    const friendship = await this.friendshipRepo.findOne({
      where: { id: input.id },
      relations: ['addressee']
    });

    if (!friendship) {
      throw new BadRequestException('Заявка не найдена');
    }

    await this.friendshipRepo.delete(input.id);

    return true;
  }

  @Mutation(() => Boolean)
  async applyRequest(
    @Context() ctx: any,
    @Args('input') input: RequestIdInput,
  ) {
    const userId = ctx.req.user.id || ctx.req.user.userId;

    const friendship = await this.friendshipRepo.findOne({
      where: { id: input.id },
      relations: ['addressee'],
    });

    if (!friendship) {
      throw new BadRequestException('Заявка не найдена');
    }

    if (friendship.addressee.id !== userId) {
      throw new BadRequestException('Это не ваша заявка');
    }

    friendship.status = 'accepted';
    await this.friendshipRepo.save(friendship);

    return true;
  }


  @Query(() => [User])
  @UseGuards(JwtAuthGuard)
  async getAllFriends(
    @Context() ctx: any,
  )
  {
    const userFromToken = ctx.req.user;

    const userId = userFromToken.id || userFromToken.userId;
    
    if (!userId) {
      throw new BadRequestException('Не удалось идентифицировать пользователя');
    }

    const friendships = await this.friendshipRepo.find({
      where: [
        { requester: { id: userId }, status: 'accepted' },
        { addressee: { id: userId }, status: 'accepted' },
      ],
      relations: ['requester', 'addressee'],
    });

    return friendships.map(f =>
      f.requester.id === userId ? f.addressee : f.requester
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async sendFriendRequest(
    @Context() ctx: any,
    @Args('input') input: CreateFriendInput,
  ) {
    const userFromToken = ctx.req.user;
  
    const userId = userFromToken.id || userFromToken.userId;
    
    if (!userId) {
      throw new BadRequestException('Не удалось идентифицировать пользователя');
    }
  
    const me = await this.userRepo.findOne({
      where: { id: userId }, // Убедитесь, что в БД id тоже UUID
    });
    
    if (!me) {
      throw new NotFoundException('Пользователь не найден');
    }
    
    console.log('User from DB:', me);
    
    const [username, tag] = input.tag.split('#');

    if (!username || !tag) {
      throw new BadRequestException('Неверный формат тега');
    }

    const target = await this.userRepo.findOne({
      where: { username, tag },
    });

    if (!target) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (target.id === me.id) {
      throw new BadRequestException('Нельзя добавить себя');
    }

    const exists = await this.friendshipRepo
      .createQueryBuilder('friendship')
      .where('friendship.requesterId = :requesterId AND friendship.addresseeId = :addresseeId', {
        requesterId: me.id,
        addresseeId: target.id,
      })
      .orWhere('friendship.requesterId = :addresseeId AND friendship.addresseeId = :requesterId', {
        requesterId: me.id,
        addresseeId: target.id,
      })
      .getOne();

    console.log('Exists query result:', exists);

    if (exists) {
      throw new ConflictException('Заявка уже существует');
    }

    await this.friendshipRepo.save({
      requester: me,
      addressee: target,
      status: 'pending',
    });

    return true;
  }
}
