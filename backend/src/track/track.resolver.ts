import { Resolver, Query, Mutation, Args, Int, ID, Context } from '@nestjs/graphql';
import { TrackService } from './track.service';
import { Track } from './entities/track.entity';
import { CreateTrackInput } from './dto/create-track.input';
import { UpdateTrackInput } from './dto/update-track.input';
import { Favorite } from 'src/favorite/entities/favorite.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AddFavoriteInput } from './dto/add-fav.input';

@Resolver(() => Track)
export class TrackResolver {
  constructor(private readonly trackService: TrackService) {}

  @Mutation(() => Track)
  createTrack(@Args('createTrackInput') createTrackInput: CreateTrackInput) {
    return this.trackService.create(createTrackInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  addFavorite(
    @Args('input') input: AddFavoriteInput,
    @Context() ctx: any,
  ) {
    const userId = ctx.req.user.userId;
    return this.trackService.addFavorite(userId, input.trackId);
  }
  
  @Query(() => [Track], { name: 'tracks' })
  findAll() {
    return this.trackService.findAll();
  }

  @Query(() => [Track], { name: 'getFavorite'})
  @UseGuards(JwtAuthGuard)
  getFavTracks(
    @Context() ctx: any,
  )
  {
    console.log(ctx.req)
    const userId = ctx.req.user.userId;
    return this.trackService.getFavorite(userId);
  }

  

  @Query(() => Boolean, { name: 'checkFavorite'})
  @UseGuards(JwtAuthGuard)
  checkFavorite(
    @Args('input') input: AddFavoriteInput,
    @Context() ctx: any,
  )
  {
    const userId = ctx.req.user.userId;
    return this.trackService.checkFavorite(userId, input.trackId);
  }

  @Query(() => Track, { name: 'track' })
  findOne(@Args('id', { type: () => ID }) id: string) { 
    return this.trackService.findOne(id);
  }

  @Mutation(() => Track)
  updateTrack(@Args('updateTrackInput') updateTrackInput: UpdateTrackInput) {
    return this.trackService.update(updateTrackInput.id, updateTrackInput);
  }

  @Mutation(() => Track)
  removeTrack(@Args('id', { type: () => Int }) id: any) {
    return this.trackService.remove(id);
  }
}
