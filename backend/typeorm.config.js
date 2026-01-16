// typeorm.config.js
const { DataSource } = require("typeorm");

module.exports = new DataSource({
    type: 'postgres',
    url: 'REMOVED',
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/db/migrations/*{.ts,.js}'],
    migrationsRun: true,
    synchronize: false,
    ssl: true,
    port: 5432,
    extra: {
        ssl: {
            rejectUnauthorized: false
        },
        connectionTimeout: 60000, // Increase timeout
        idleTimeout: 60000
    },
    connectTimeoutMS: 60000,
});