import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1775938559067 implements MigrationInterface {
  name = 'InitialSchema1775938559067';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sezone" ("id" SERIAL NOT NULL, "pocetak" date NOT NULL, "kraj" date NOT NULL, CONSTRAINT "PK_24ac7e820bb9f92c7293b662b65" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "clanovi" ("id" SERIAL NOT NULL, "ime" character varying NOT NULL, "prezime" character varying NOT NULL, CONSTRAINT "PK_b2ecb243ac4c08465c94f8e8341" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "clan_ucesce" ("id" SERIAL NOT NULL, "tim_id" integer, "clan_id" integer, "dogadjaj_id" integer, CONSTRAINT "PK_a20614f827672ffbe771a8a0be5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dogadjaji" ("id" SERIAL NOT NULL, "naziv" character varying NOT NULL, "datum_odrzavanja" date NOT NULL, "sezona_id" integer, CONSTRAINT "PK_7ab32e7feda0a200c97b31719bb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dogadjaj_tim" ("id" SERIAL NOT NULL, "score" integer NOT NULL DEFAULT '0', "dogadjaj_id" integer, "tim_id" integer, CONSTRAINT "PK_028e728824f41ac245d74e19905" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "timovi" ("id" SERIAL NOT NULL, "naziv" character varying NOT NULL, "logo" character varying, "profile_id" uuid, CONSTRAINT "REL_f06ba62e9bc7c717ffb70ef900" UNIQUE ("profile_id"), CONSTRAINT "PK_91f0dae1404812d1f6b44fc7ab7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."profiles_role_enum" AS ENUM('moderator', 'team', 'guest')`,
    );
    await queryRunner.query(
      `CREATE TABLE "profiles" ("id" uuid NOT NULL, "username" character varying NOT NULL, "role" "public"."profiles_role_enum" NOT NULL DEFAULT 'guest', CONSTRAINT "UQ_d1ea35db5be7c08520d70dc03f8" UNIQUE ("username"), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "clan_ucesce" ADD CONSTRAINT "FK_aab25a2b3d5e27a0164c54f4a67" FOREIGN KEY ("tim_id") REFERENCES "timovi"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "clan_ucesce" ADD CONSTRAINT "FK_2ff0b6624e3bcbc67a5638f99b6" FOREIGN KEY ("clan_id") REFERENCES "clanovi"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "clan_ucesce" ADD CONSTRAINT "FK_00bff019b08b9133ea9d04b1cc9" FOREIGN KEY ("dogadjaj_id") REFERENCES "dogadjaji"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dogadjaji" ADD CONSTRAINT "FK_a7272a1a1c277d9a5833e8b2dcf" FOREIGN KEY ("sezona_id") REFERENCES "sezone"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dogadjaj_tim" ADD CONSTRAINT "FK_2e77ef70cbf3c21219f4a1da404" FOREIGN KEY ("dogadjaj_id") REFERENCES "dogadjaji"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dogadjaj_tim" ADD CONSTRAINT "FK_b162448b0899ce1e9d6c8aadbd2" FOREIGN KEY ("tim_id") REFERENCES "timovi"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "timovi" ADD CONSTRAINT "FK_f06ba62e9bc7c717ffb70ef9002" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "timovi" DROP CONSTRAINT "FK_f06ba62e9bc7c717ffb70ef9002"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dogadjaj_tim" DROP CONSTRAINT "FK_b162448b0899ce1e9d6c8aadbd2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dogadjaj_tim" DROP CONSTRAINT "FK_2e77ef70cbf3c21219f4a1da404"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dogadjaji" DROP CONSTRAINT "FK_a7272a1a1c277d9a5833e8b2dcf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "clan_ucesce" DROP CONSTRAINT "FK_00bff019b08b9133ea9d04b1cc9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "clan_ucesce" DROP CONSTRAINT "FK_2ff0b6624e3bcbc67a5638f99b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "clan_ucesce" DROP CONSTRAINT "FK_aab25a2b3d5e27a0164c54f4a67"`,
    );
    await queryRunner.query(`DROP TABLE "profiles"`);
    await queryRunner.query(`DROP TYPE "public"."profiles_role_enum"`);
    await queryRunner.query(`DROP TABLE "timovi"`);
    await queryRunner.query(`DROP TABLE "dogadjaj_tim"`);
    await queryRunner.query(`DROP TABLE "dogadjaji"`);
    await queryRunner.query(`DROP TABLE "clan_ucesce"`);
    await queryRunner.query(`DROP TABLE "clanovi"`);
    await queryRunner.query(`DROP TABLE "sezone"`);
  }
}
