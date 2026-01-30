import { CreateDateColumn } from 'typeorm';
import { CreateTrackInput } from './create-track.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { Artist } from '../../artist/entities/artist.entity';

@InputType()
export class UpdateTrackInput extends PartialType(CreateTrackInput) {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

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

  @Field(() => Artist)
  artist: Artist
}
