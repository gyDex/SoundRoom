import { CreateDateColumn } from 'typeorm';
import { Playlist } from '../entities/playlist.entity';
import { CreateTrackInput } from './create-track.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdateTrackInput extends PartialType(CreateTrackInput) {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  artist: string;

  @CreateDateColumn({ 
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  @Field(() => Date, { nullable: true })
  created_at?: Date;

  @Field(() => Int)
  duration: number

  @Field(() => String)
  urlFile: string

  @Field(() => String)
  genre: string

  @Field(() => [ID], { nullable: true })
  playlistIds?: string[];
}
