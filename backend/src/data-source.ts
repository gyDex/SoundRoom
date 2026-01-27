import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Track } from './track/entities/track.entity';
import { User } from './auth/entities/user.entity';
import { Favorite } from './favorite/entities/favorite.entity';
import { Playlist } from './track/entities/playlist.entity';
import { Friendship } from './friends/entities/friend-ship.entity';
import { PartyEntity } from './party/entities/party.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: 'REMOVED',

  ssl: {
    rejectUnauthorized: false,
  },
  
  extra: {
    max: 10
  },

  synchronize: false,
  logging: true,

  entities: [Track, User, Favorite,PartyEntity,  Playlist, Friendship],

  migrations: ['src/migrations/*.ts'],
});
