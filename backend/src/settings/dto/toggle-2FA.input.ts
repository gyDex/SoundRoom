import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class toggle2FAInput {
    @Field()
    enable: boolean;
}
