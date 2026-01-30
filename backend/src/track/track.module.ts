import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackResolver } from './track.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from 'src/favorite/entities/favorite.entity';
import { Track } from './entities/track.entity';
import { Artist } from '../artist/entities/artist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Track, Favorite, Artist])],
  providers: [TrackResolver, TrackService],
  exports: [TrackService]
})
export class TrackModule {}
