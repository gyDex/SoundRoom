module.exports = {
  type: 'postgres',
  host: 'REMOVED',
  port: 5432,
  username: 'postgres',
  password: 'REMOVED',
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