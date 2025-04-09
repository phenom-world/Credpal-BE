import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionModule } from '../transaction/transaction.module';
import { Wallet } from './entities/wallet.entity';
import { FundTransaction } from './utils/db-transactions/fund.transaction';
import { TransferTransaction } from './utils/db-transactions/transfer.transaction';
import { WithdrawTransaction } from './utils/db-transactions/withdraw.transaction';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet]), TransactionModule],
  controllers: [WalletController],
  providers: [WalletService, TransferTransaction, FundTransaction, WithdrawTransaction],
  exports: [WalletService],
})
export class WalletModule {}
