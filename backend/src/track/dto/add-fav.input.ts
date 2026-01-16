import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddFavoriteInput {
  @Field()
  trackId: string;
}