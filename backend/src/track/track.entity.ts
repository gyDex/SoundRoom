// import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, ManyToOne } from 'typeorm';

// import { IsOptional } from 'class-validator';
// import { Playlist } from './entities/playlist.entity';
// import { Artist } from '../artist/entities/artist.entity';

// @Entity('track')
// @ObjectType()
// export class Track {
//   @PrimaryGeneratedColumn('uuid')
//   @Field(() => ID)
//   id: string;

//   @Column()
//   @Field()
//   name: string;

//   // @Column()
//   // @Field()
//   // artist: string;

//   @Column()
//   @Field(() => Int)
//   duration: number;

//   @Column({ nullable: true })
//   @Field({ nullable: true })
//   urlFile?: string;

//   @Column()
//   @Field()
//   genre: string;

//   @CreateDateColumn({ 
//     name: 'created_at',
//     type: 'timestamp',
//     default: () => 'CURRENT_TIMESTAMP'
//   })
//   @Field(() => Date, { nullable: true })
//   @IsOptional()
//   created_at?: Date;

//   @ManyToMany(() => Playlist, playlist => playlist.trackIds)
//   @Field(() => [Playlist], { nullable: true })
//   playlists: Playlist[];

//   @ManyToOne(() => Artist, artist => artist.tracks, { onDelete: 'CASCADE' })
//   @Field(() => Artist)
//   artist: Artist;
// }