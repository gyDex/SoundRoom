import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class DeletePlaylistInput {
    @Field(() => ID)
    @IsUUID()
    playlistId: string;     
}