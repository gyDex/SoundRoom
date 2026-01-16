import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Track } from '../../track/entities/track.entity';

@ObjectType()
@Entity('playlist')
export class Playlist {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field(() => ID)
  @Column({ name: 'user_id' })
  userId: string;

  @Field({ nullable: true })
  @Column({ default: '' })
  imageUrl: string;

  @ManyToMany(() => Track, track => track.playlists)
  @JoinTable({
    name: 'playlist_tracks',
    joinColumn: { name: 'playlist_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'track_id', referencedColumnName: 'id' }
  })
  @Field(() => [Track], { nullable: true })
  tracks: Track[];

  @Column({ type: 'uuid', array: true, nullable: true })
  @Field(() => [ID], { nullable: true })
  trackIds?: string[];

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}