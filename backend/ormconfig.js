module.exports = {
  type: 'postgres',
  host: 'db.dbewlidfconvgnyulifx.supabase.co',
  port: 5432,
  username: 'postgres',
  password: 'tqgWiD4jsXrYU776',
  database: 'postgres',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  }
};