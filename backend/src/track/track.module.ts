import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackResolver } from './track.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from './track.entity';
import { Favorite } from 'src/favorite/entities/favorite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Track, Favorite])],
  providers: [TrackResolver, TrackService],
  exports: [TrackService]
})
export class TrackModule {}
