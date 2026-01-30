import { MigrationInterface, QueryRunner } from "typeorm";

export class Artistt1769547085300 implements MigrationInterface {
    name = 'Artistt1769547085300'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artist" ADD "imageUrl" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artist" DROP COLUMN "imageUrl"`);
    }

}
