import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedInitialMigrations1744123172253 implements MigrationInterface {
    name = 'AddedInitialMigrations1744123172253'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`transactions\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`amount\` decimal(10,2) NOT NULL, \`type\` enum ('DEBIT', 'CREDIT') NOT NULL, \`status\` enum ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'PENDING', \`payment_method\` enum ('CARD', 'TRANSFER') NULL, \`currency\` enum ('NGN') NULL, \`reference\` varchar(255) NOT NULL, \`memo\` json NULL, \`recipient_id\` varchar(255) NULL, \`user_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`email\` varchar(255) NOT NULL, \`full_name\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`role\` enum ('user', 'admin') NOT NULL DEFAULT 'user', \`toc_agreed\` tinyint NOT NULL DEFAULT 0, \`last_login\` timestamp NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`wallets\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`balance\` decimal(10,2) NOT NULL DEFAULT '0.00', \`currency\` enum ('NGN') NOT NULL DEFAULT 'NGN', \`description\` text NULL, \`user_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`transactions\` ADD CONSTRAINT \`FK_e9acc6efa76de013e8c1553ed2b\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`wallets\` ADD CONSTRAINT \`FK_92558c08091598f7a4439586cda\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`wallets\` DROP FOREIGN KEY \`FK_92558c08091598f7a4439586cda\``);
        await queryRunner.query(`ALTER TABLE \`transactions\` DROP FOREIGN KEY \`FK_e9acc6efa76de013e8c1553ed2b\``);
        await queryRunner.query(`DROP TABLE \`wallets\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`transactions\``);
    }

}
