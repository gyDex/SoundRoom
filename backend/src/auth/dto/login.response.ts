import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LoginResponse {
    @Field()
    success: boolean;

    @Field({ nullable: true })
    twoFactorRequired?: boolean;

    @Field({ nullable: true })
    accessToken?: string;

    @Field({ nullable: true })
    refreshToken?: string;

    @Field({ nullable: true })
    expiresIn?: number;

    @Field({ nullable: true })
    tokenType?: string;

    @Field({ nullable: true })
    twoFaToken?: string;
}
