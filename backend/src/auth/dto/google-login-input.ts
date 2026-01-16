import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class GoogleLoginInput {
  @Field()
  token: string;
}