import { Module } from '@nestjs/common';
import { RoomService } from './party.service';
import { PartyGateway } from './party.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartyEntity } from './entities/party.entity';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RoomResolver } from './room.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([PartyEntity, User])],
  providers: [PartyGateway, RoomService, AuthService, JwtService, RoomResolver],
  exports: [RoomService]
})
export class PartyModule {}
