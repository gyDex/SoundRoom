import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';

import { Track } from './track/entities/track.entity';
import { User } from './auth/entities/user.entity';
import { Favorite } from './favorite/entities/favorite.entity';
import { Playlist } from './track/entities/playlist.entity';
import { Friendship } from './friends/entities/friend-ship.entity';
import { PartyEntity } from './party/entities/party.entity';
import { Artist } from './artist/entities/artist.entity';

// console.log({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USERNAME,
//   database: process.env.DB_DATABASE,
//   port: process.env.DB_PORT,
// });

export const MigrationDataSource = new DataSource({
    type: 'postgres',

  // host: process.env.DB_HOST,
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'soundroom_db',

  // ssl: {
  //   rejectUnauthorized: false,
  // },

  ssl: false,

  uuidExtension: 'pgcrypto',

  extra: {
    max: 1, 
  },

  entities: [
    Track,
    User,
    Favorite,
    Playlist,
    Friendship,
    PartyEntity,
    Artist,
  ],

  migrations: ['src/migrations/*.ts'],

  synchronize: true,

  logging: true,
});