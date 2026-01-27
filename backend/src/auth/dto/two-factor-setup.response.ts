import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TwoFactorSetupResponse {
  @Field()
  qrCode: string;

  @Field()
  secret: string;
}
