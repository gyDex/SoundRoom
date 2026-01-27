import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class EditPlaylistInput {
    @Field(() => ID)
    @IsUUID()
    id: string;   

    @Field(() => ID)
    @IsUUID()
    userId: string;     

    @Field()
    @IsString()
    name: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    imageUrl?: string;

    @Field(() => [ID], { nullable: true })
    trackIds?: string[];
}