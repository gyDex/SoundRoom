import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column,  CreateDateColumn, UpdateDateColumn, Unique, OneToMany, ManyToMany } from 'typeorm';
import { Playlist } from '../../track/entities/playlist.entity';
import { Favorite } from '../../favorite/entities/favorite.entity';
import { PartyEntity } from '../../party/entities/party.entity';

@ObjectType()
@Entity('user')
export class 
User {
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

  @Column()
  @Field()
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

  @ManyToMany(() => PartyEntity, party => party.connectedUsers, {
    lazy: true, 
  })
  parties: Promise<PartyEntity[]>;
}