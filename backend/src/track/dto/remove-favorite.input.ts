import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RemoveFavoriteInput {
  @Field()
  trackId: string;
}