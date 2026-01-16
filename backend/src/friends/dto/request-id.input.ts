import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RequestIdInput {
  @Field()
  id: string;
}