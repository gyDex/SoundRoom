import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsResolver } from './friends.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship } from './entities/friend-ship.entity';
import { User } from 'src/auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Friendship])],
  providers: [FriendsResolver, FriendsService],
})
export class FriendsModule {}
