import { Field, InputType } from "@nestjs/graphql";
import { CreateTrackInput } from "../../track/dto/create-track.input";

@InputType()
export class CreateArtistInput {
  @Field()
  name: string;

  @Field()
  genre: string;

  @Field()
  imageUrl: string;

  @Field(() => [CreateTrackInput], { nullable: true })
  tracks?: CreateTrackInput[];
}
