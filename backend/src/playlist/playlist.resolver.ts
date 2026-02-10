import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistInput } from './dto/create-playlist.input';
import { Playlist } from 'src/track/entities/playlist.entity';

import { TrackService } from 'src/track/track.service';
import { Track } from 'src/track/entities/track.entity';
import { DeletePlaylistInput } from './dto/delete-playlist.input';
import { EditPlaylistInput } from './dto/edit-playlist.input';

@Resolver(() => Playlist)
export class PlaylistResolver {
  constructor(
    private readonly playlistService: PlaylistService,         
    private readonly trackService: TrackService) {}

  @Query(() => [Playlist], { name: 'playlists' })
  async findAll(): Promise<Playlist[]> {
    return this.playlistService.findAll();
  }

@ResolveField(() => [Track], { name: 'tracks' })
async resolveTracks(@Parent() playlist: Playlist): Promise<Track[]> {
  if (!playlist.trackIds?.length) return [];
  return this.trackService.findByIds(playlist.trackIds); // обязательно relations: ['artist']
}

  @Query(() => [Playlist], { name: 'playlistsByUser' })
  async findByUserId(@Args('userId', { type: () => ID }) userId: string) { 
    return this.playlistService.findByUserID(userId);
  }

  @Query(() => Playlist, { name: 'playlist' })
  async findOne(@Args('id', { type: () => ID }) id: string) { 
    return this.playlistService.findOne(id);
  }

  @Query(() => [Track], { name: 'tracksByIds' })
  async findTracksByIds(
    @Args('ids', { type: () => [ID] }) ids: string[]
  ): Promise<Track[]> {
    return this.trackService.findByIds(ids);
  }

  @Mutation(() => Playlist, { name: 'createPlaylist' })
  async createPlaylist(
    @Args('createPlaylistInput') createPlaylistInput: CreatePlaylistInput
  ): Promise<Playlist> {
    return this.playlistService.create(createPlaylistInput);
  }

  @Mutation(() => Playlist, { name: 'editPlaylist' })
  async editPlaylist(
    @Args('editPlaylistInput') editPlaylistInput: EditPlaylistInput
  ): Promise<Playlist> {
    return this.playlistService.edit(editPlaylistInput);
  }

  @Mutation(() => Playlist, { name: 'deletePlaylist' })
  async deletePlaylist(
    @Args('deletePlaylistInput') deletePlaylistInput: DeletePlaylistInput
  ): Promise<Playlist>  {
    return this.playlistService.delete(deletePlaylistInput);
  }
}