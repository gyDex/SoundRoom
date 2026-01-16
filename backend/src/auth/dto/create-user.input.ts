import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class CreateUserInput { 
    @Field(() => ID)
    id: string;

    @Field()
    username: string;

    @Field()
    email: string;

    @Field()
    password: string;

@   Field(() => String, { nullable: true })
    refreshToken: string;

    @Field()
    userAvatar: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}