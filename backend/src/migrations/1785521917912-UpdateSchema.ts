import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1785521917912 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Включаем расширение pgvector (если еще не включено)
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector;`);
        
        // 2. Добавляем колонку embedding в таблицу track
        // Тип vector(384) означает вектор размерностью 384
        await queryRunner.query(`ALTER TABLE "track" ADD COLUMN "embedding" vector(384);`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Откат: удаляем колонку
        await queryRunner.query(`ALTER TABLE "track" DROP COLUMN "embedding";`);
    }

}