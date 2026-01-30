import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, OneToMany, ManyToOne } from 'typeorm';
import { Playlist } from './playlist.entity';
import { IsOptional } from 'class-validator';
import { Favorite } from '../../favorite/entities/favorite.entity';
import { Artist } from '../../artist/entities/artist.entity';

@Entity('track')
@ObjectType()
export class Track {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field(() => Int)
  duration: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  urlFile?: string;

  @Column()
  @Field()
  genre: string;

  @CreateDateColumn({ 
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  @Field(() => Date, { nullable: true })
  @IsOptional()
  created_at?: Date;

  @ManyToMany(() => Playlist, playlist => playlist.tracks)
  @Field(() => [Playlist], { nullable: true })
  playlists: Playlist[];

  @OneToMany(() => Favorite, fav => fav.track)
  favorites: Favorite[];

  @ManyToOne(() => Artist, artist => artist.tracks, { onDelete: 'CASCADE' })
  @Field(() => Artist)
  artist: Artist;
}