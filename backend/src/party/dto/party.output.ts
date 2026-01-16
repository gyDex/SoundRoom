import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../auth/entities/user.entity';

@ObjectType()
export class PartyOutput {
  @Field()
  hostId: string;

  @Field({nullable: true})
  createdAt: string;

  @Field(() => [User])
  connectedUsers: User[];
}