import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistResolver } from './playlist.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from 'src/track/entities/playlist.entity';
import { TrackModule } from 'src/track/track.module';
import { Track } from 'src/track/entities/track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, Track]), TrackModule],
  providers: [PlaylistResolver, PlaylistService],
  exports: [PlaylistResolver, PlaylistService]
})
export class PlaylistModule {}
