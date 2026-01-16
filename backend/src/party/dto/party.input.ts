import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class GetPartyInput {
  @Field(() => ID)
  id: string;
}