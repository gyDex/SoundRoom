import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistResolver } from './playlist.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from 'src/track/entities/playlist.entity';
import { TrackModule } from 'src/track/track.module';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist]), TrackModule],
  providers: [PlaylistResolver, PlaylistService],
  exports: [PlaylistResolver, PlaylistService]
})
export class PlaylistModule {}
