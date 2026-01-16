import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://postgres.dbewlidfconvgnyulifx:tqgWiD4jsXrYU776@aws-1-eu-west-1.pooler.supabase.com:5432/postgres',

  ssl: {
    rejectUnauthorized: false,
  },

  synchronize: false,
  logging: true,

  entities: ['dist/**/*.entity{.ts,.js}'],

  migrations: ['src/migrations/*.ts'],
});
