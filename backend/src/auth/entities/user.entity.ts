import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column,  CreateDateColumn, UpdateDateColumn, Unique, OneToMany } from 'typeorm';
import { Playlist } from 'src/track/entities/playlist.entity';
import { Favorite } from 'src/favorite/entities/favorite.entity';

@ObjectType()
@Entity('user')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ default: 'local' })
  provider: 'google' | 'local'

  @Field({ nullable: true })
  @Column({ nullable: true })
  username: string;

  @Field()
  @Column({unique: true})
  email: string;

  @Field()
  @Column()
  password: string;

  @Field()
  @Column({ length: 4 })
  tag: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  refreshToken: string | null;

  @Field()
  @Column({ 
      nullable: false,
      default: '' 
  })
  userAvatar: string;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Playlist, playlist => playlist)
  @Field(() => [Playlist], { nullable: true })
  playlists: Playlist[];

  @OneToMany(() => Favorite, fav => fav.user)
  favorites: Favorite[];
}