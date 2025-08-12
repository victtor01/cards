import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1755032745051 implements MigrationInterface {
    name = 'InitialSchema1755032745051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tasks" ("id" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying, "repeat" character varying, "startAt" date NOT NULL, "endAt" date, "completed" text, "deleted" text, "days" text NOT NULL, "hour" TIME, "color" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(100) NOT NULL, "photo" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cards" ("id" character varying NOT NULL, "title" character varying, "content" text, "background" text, "publicId" character varying, "userId" uuid NOT NULL, "workspaceId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0e4f8e24cb1bbc45d97db00f967" UNIQUE ("publicId"), CONSTRAINT "PK_5f3269634705fdff4a9935860fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."workspaces_status_enum" AS ENUM('disabled', 'activated')`);
        await queryRunner.query(`CREATE TABLE "workspaces" ("id" character varying NOT NULL, "name" character varying NOT NULL, "status" "public"."workspaces_status_enum" NOT NULL DEFAULT 'activated', "userId" uuid NOT NULL, "code" character varying(12) NOT NULL, "parentId" character varying, "background" character varying, "isPublic" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_d3fe9fbf2cec194b3fcf7c03b3b" UNIQUE ("code"), CONSTRAINT "PK_098656ae401f3e1a4586f47fd8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_166bd96559cb38595d392f75a35" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cards" ADD CONSTRAINT "FK_7b7230897ecdeb7d6b0576d907b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cards" ADD CONSTRAINT "FK_6c4d6f436db3691185c054e59d9" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workspaces" ADD CONSTRAINT "FK_dc53b3d0b16419a8f5f17458403" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workspaces" ADD CONSTRAINT "FK_2f8851116026f41f33d4f9420cf" FOREIGN KEY ("parentId") REFERENCES "workspaces"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workspaces" DROP CONSTRAINT "FK_2f8851116026f41f33d4f9420cf"`);
        await queryRunner.query(`ALTER TABLE "workspaces" DROP CONSTRAINT "FK_dc53b3d0b16419a8f5f17458403"`);
        await queryRunner.query(`ALTER TABLE "cards" DROP CONSTRAINT "FK_6c4d6f436db3691185c054e59d9"`);
        await queryRunner.query(`ALTER TABLE "cards" DROP CONSTRAINT "FK_7b7230897ecdeb7d6b0576d907b"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_166bd96559cb38595d392f75a35"`);
        await queryRunner.query(`DROP TABLE "workspaces"`);
        await queryRunner.query(`DROP TYPE "public"."workspaces_status_enum"`);
        await queryRunner.query(`DROP TABLE "cards"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
    }

}
