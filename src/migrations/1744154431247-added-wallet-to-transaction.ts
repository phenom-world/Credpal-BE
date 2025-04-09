import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedWalletToTransaction1744154431247 implements MigrationInterface {
    name = 'AddedWalletToTransaction1744154431247'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transactions\` ADD \`wallet_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`transactions\` ADD CONSTRAINT \`FK_0b171330be0cb621f8d73b87a9e\` FOREIGN KEY (\`wallet_id\`) REFERENCES \`wallets\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transactions\` DROP FOREIGN KEY \`FK_0b171330be0cb621f8d73b87a9e\``);
        await queryRunner.query(`ALTER TABLE \`transactions\` DROP COLUMN \`wallet_id\``);
    }

}
