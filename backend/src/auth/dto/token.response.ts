import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class TokenResponse {
  @Field(() => String, { description: 'JWT access token for authentication' })
  accessToken: string;

  @Field(() => String, { description: 'Refresh token for getting new access tokens' })
  refreshToken: string;

  @Field(() => Number, { description: 'Access token expiration time in seconds' })
  expiresIn: number;

  @Field(() => String, { description: 'Type of token', defaultValue: 'Bearer' })
  tokenType?: string;
}