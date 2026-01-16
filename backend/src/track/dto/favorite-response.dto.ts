import { ObjectType, Field } from '@nestjs/graphql';
import { Track } from '../track.entity';


@ObjectType()
export class FavoriteResponse {
  @Field()
  id: string;

  @Field(() => Track)
  track: Track;
}