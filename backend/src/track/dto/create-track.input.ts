import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { CreateDateColumn } from 'typeorm';

@InputType()
export class CreateTrackInput { 
  @Field(() => String)
  name: string;
  
  @Field(() => Int)
  duration: number
  
  @Field({nullable: true})
  urlFile: string

  @CreateDateColumn({ 
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  @Field(() => Date, { nullable: true }) 
  created_at?: Date;
  
  @Field(() => String)
  genre: string

  @Field(() => [ID], { nullable: true })
  playlistIds?: string[];

  @Field(() => ID)
  artistId: string;
}
