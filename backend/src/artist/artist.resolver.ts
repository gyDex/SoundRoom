import { ArtistService } from "./artist.service";
import { CreateArtistInput } from "./dto/create-artist.input";
import { Artist } from "./entities/artist.entity";
import { Resolver, Mutation, Args, Query, ID } from '@nestjs/graphql';

@Resolver(() => Artist)
export class ArtistResolver {
  constructor(private readonly artistService: ArtistService) {}

  @Mutation(() => Artist)
  createArtist(
    @Args('createArtistInput') input: CreateArtistInput,
  ): Promise<Artist> {
    return this.artistService.create(input);
  }

  @Query(() => [Artist])
  artists(): Promise<Artist[]> {
    return this.artistService.findAll();
  }

  @Query(() => Artist)
  artist(@Args('id', { type: () => ID }) id: string): Promise<Artist> {
    return this.artistService.findOne(id);
  }

  @Mutation(() => Boolean)
  removeArtist(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.artistService.remove(id);
  }
}
