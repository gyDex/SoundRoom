import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from 'src/auth/entities/user.entity';

@ObjectType()
export class IncomingFriendRequest {
  @Field(() => ID)
  id: string;

  @Field(() => User)
  requester: User;
}
