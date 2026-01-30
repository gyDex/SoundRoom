import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Track } from '../../track/entities/track.entity';

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('artist')
@ObjectType()
export class Artist {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    imageUrl: string;

    @Field()
    @Column()
    genre: string;

    @Field(() => [Track], { nullable: true })
    @OneToMany(() => Track, track => track.artist)
    tracks: Track[];
}
