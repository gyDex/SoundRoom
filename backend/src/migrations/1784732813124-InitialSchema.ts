import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1784732813124 implements MigrationInterface {
    name = 'InitialSchema1784732813124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "playlist" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying NOT NULL, "user_id" character varying NOT NULL, "imageUrl" character varying NOT NULL DEFAULT '', "trackIds" uuid array, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_538c2893e2024fabc7ae65ad142" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."party_status_enum" AS ENUM('active', 'closed')`);
        await queryRunner.query(`CREATE TABLE "party" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "hostId" character varying NOT NULL, "isPrivate" boolean NOT NULL DEFAULT false, "status" "public"."party_status_enum" NOT NULL DEFAULT 'active', "password" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying NOT NULL, CONSTRAINT "PK_e6189b3d533e140bb33a6d2cec1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "provider" character varying NOT NULL DEFAULT 'local', "username" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, "tag" character varying(4) NOT NULL, "refreshToken" text, "userAvatar" character varying NOT NULL DEFAULT '', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "twoFactorSecret" character varying, "twoFactorEnabled" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favorite" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "userId" uuid, "trackId" uuid, CONSTRAINT "UQ_a9a4a3745c820d55572b9aed0b6" UNIQUE ("userId", "trackId"), CONSTRAINT "PK_495675cec4fb09666704e4f610f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "artist" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying NOT NULL, "imageUrl" character varying NOT NULL, "genre" character varying NOT NULL, CONSTRAINT "PK_55b76e71568b5db4d01d3e394ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "track" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying NOT NULL, "duration" integer NOT NULL, "urlFile" character varying, "genre" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "artistId" uuid, CONSTRAINT "PK_0631b9bcf521f8fab3a15f2c37e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."friendships_status_enum" AS ENUM('pending', 'accepted', 'blocked')`);
        await queryRunner.query(`CREATE TABLE "friendships" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "status" "public"."friendships_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "requesterId" uuid, "addresseeId" uuid, CONSTRAINT "UQ_ae267b922c295ac548dd498e540" UNIQUE ("requesterId", "addresseeId"), CONSTRAINT "PK_08af97d0be72942681757f07bc8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c6ee540bba37d2b09b12dddd28" ON "friendships" ("addresseeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4f47ed519abe1ced044af26042" ON "friendships" ("requesterId") `);
        await queryRunner.query(`CREATE TABLE "playlist_tracks" ("playlist_id" uuid NOT NULL, "track_id" uuid NOT NULL, CONSTRAINT "PK_522db0958bac1f7edf51bf02d47" PRIMARY KEY ("playlist_id", "track_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7ef165e08a3b87eae8cf4275cd" ON "playlist_tracks" ("playlist_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_54ef043760f89cdf4d660cf601" ON "playlist_tracks" ("track_id") `);
        await queryRunner.query(`CREATE TABLE "party_users" ("party_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_d793c0adb9ab01d09430ef35686" PRIMARY KEY ("party_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ce6ede4faa54db7453e36cafb5" ON "party_users" ("party_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_6d84ed77cfd5694a2f0fd524f8" ON "party_users" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_83b775fdebbe24c29b2b5831f2d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_a1aa0ad0d3036ae303984b553d7" FOREIGN KEY ("trackId") REFERENCES "track"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track" ADD CONSTRAINT "FK_997cfd9e91fd00a363500f72dc2" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friendships" ADD CONSTRAINT "FK_4f47ed519abe1ced044af260420" FOREIGN KEY ("requesterId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friendships" ADD CONSTRAINT "FK_c6ee540bba37d2b09b12dddd282" FOREIGN KEY ("addresseeId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "playlist_tracks" ADD CONSTRAINT "FK_7ef165e08a3b87eae8cf4275cda" FOREIGN KEY ("playlist_id") REFERENCES "playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "playlist_tracks" ADD CONSTRAINT "FK_54ef043760f89cdf4d660cf601c" FOREIGN KEY ("track_id") REFERENCES "track"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "party_users" ADD CONSTRAINT "FK_ce6ede4faa54db7453e36cafb51" FOREIGN KEY ("party_id") REFERENCES "party"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "party_users" ADD CONSTRAINT "FK_6d84ed77cfd5694a2f0fd524f85" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "party_users" DROP CONSTRAINT "FK_6d84ed77cfd5694a2f0fd524f85"`);
        await queryRunner.query(`ALTER TABLE "party_users" DROP CONSTRAINT "FK_ce6ede4faa54db7453e36cafb51"`);
        await queryRunner.query(`ALTER TABLE "playlist_tracks" DROP CONSTRAINT "FK_54ef043760f89cdf4d660cf601c"`);
        await queryRunner.query(`ALTER TABLE "playlist_tracks" DROP CONSTRAINT "FK_7ef165e08a3b87eae8cf4275cda"`);
        await queryRunner.query(`ALTER TABLE "friendships" DROP CONSTRAINT "FK_c6ee540bba37d2b09b12dddd282"`);
        await queryRunner.query(`ALTER TABLE "friendships" DROP CONSTRAINT "FK_4f47ed519abe1ced044af260420"`);
        await queryRunner.query(`ALTER TABLE "track" DROP CONSTRAINT "FK_997cfd9e91fd00a363500f72dc2"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_a1aa0ad0d3036ae303984b553d7"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_83b775fdebbe24c29b2b5831f2d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6d84ed77cfd5694a2f0fd524f8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ce6ede4faa54db7453e36cafb5"`);
        await queryRunner.query(`DROP TABLE "party_users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_54ef043760f89cdf4d660cf601"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7ef165e08a3b87eae8cf4275cd"`);
        await queryRunner.query(`DROP TABLE "playlist_tracks"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4f47ed519abe1ced044af26042"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c6ee540bba37d2b09b12dddd28"`);
        await queryRunner.query(`DROP TABLE "friendships"`);
        await queryRunner.query(`DROP TYPE "public"."friendships_status_enum"`);
        await queryRunner.query(`DROP TABLE "track"`);
        await queryRunner.query(`DROP TABLE "artist"`);
        await queryRunner.query(`DROP TABLE "favorite"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "party"`);
        await queryRunner.query(`DROP TYPE "public"."party_status_enum"`);
        await queryRunner.query(`DROP TABLE "playlist"`);
    }

}
