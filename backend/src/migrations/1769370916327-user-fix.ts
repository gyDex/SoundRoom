import { MigrationInterface, QueryRunner } from "typeorm";

export class UserFix1769370916327 implements MigrationInterface {
    name = 'UserFix1769370916327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "twoFactorSecret" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "twoFactorEnabled" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "twoFactorEnabled"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "twoFactorSecret"`);
    }

}
