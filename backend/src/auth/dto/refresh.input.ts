    import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class RefreshInput {
  @Field(() => String, { description: 'Refresh token' })
  @IsNotEmpty()
  refreshToken: string;
}