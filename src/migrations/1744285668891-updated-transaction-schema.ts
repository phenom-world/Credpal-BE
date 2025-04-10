import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedTransactionSchema1744285668891 implements MigrationInterface {
    name = 'UpdatedTransactionSchema1744285668891'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transactions\` CHANGE \`payment_method\` \`payment_method\` enum ('CARD', 'TRANSFER', 'WITHDRAWAL') NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transactions\` CHANGE \`payment_method\` \`payment_method\` enum ('CARD', 'TRANSFER') NULL`);
    }

}
