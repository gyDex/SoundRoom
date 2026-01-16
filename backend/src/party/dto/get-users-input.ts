import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class GetUsersInput {
    @Field(() => ID)
    roomId: string;
}