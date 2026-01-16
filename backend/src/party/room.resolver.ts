import { Resolver, Query, Args, ID, Context } from '@nestjs/graphql';
import { RoomService } from './party.service';
import { PartyEntity } from './entities/party.entity';;
import { GetUsersInput } from './dto/get-users-input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { PartyOutput } from './dto/party.output';

  @Resolver(() => PartyEntity)
  export class RoomResolver {
    constructor(private readonly roomService: RoomService) {}

    @UseGuards(JwtAuthGuard)
    @Query(() => PartyOutput, { name: 'getConnectedUsers' })
    async getConnectedUsers(
      @Context() ctx: any,
      @Args('input') input: GetUsersInput,
    ) {
      const userId = ctx.req.user.id || ctx.req.user.userId;
      return await this.roomService.getConnectedUsers(input.roomId, userId);
    }

  }
