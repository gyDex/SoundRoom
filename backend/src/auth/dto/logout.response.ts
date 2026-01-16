import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LogoutResponse {
  @Field(() => String, { description: 'Logs out the current user and clears authentication tokens' })
  success: boolean;
}