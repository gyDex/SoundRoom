import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: '***REMOVED***',

  ssl: {
    rejectUnauthorized: false,
  },

  synchronize: false,
  logging: true,

  entities: ['dist/**/*.entity{.ts,.js}'],

  migrations: ['src/migrations/*.ts'],
});
