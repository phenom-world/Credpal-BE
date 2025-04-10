import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { DataSource, EntityManager } from 'typeorm';

import { DbTransactionBase } from '../../../../common/abstracts/transaction.base';
import { Transaction } from '../../../transaction/entities/transaction.entity';
import {
  PaymentMethod,
  TransactionStatus,
  TransactionType,
} from '../../../transaction/enum/transaction.enum';
import { Wallet } from '../../entities/wallet.entity';

interface FundWithdrawTransactionInput {
  data: {
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    type: TransactionType;
  };
  userId: string;
}

interface FundWithdrawTransactionOutput {
  wallet: Wallet;
}

@Injectable()
export class FundWithdrawTransaction extends DbTransactionBase<
  FundWithdrawTransactionInput,
  FundWithdrawTransactionOutput
> {
  constructor(
    dataSource: DataSource,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    super(dataSource);
  }

  protected async execute(
    data: FundWithdrawTransactionInput,
    manager: EntityManager
  ): Promise<FundWithdrawTransactionOutput> {
    // Get wallet with pessimistic lock
    const wallet = await manager.findOne(Wallet, {
      where: { user: { id: data.userId } },
      lock: { mode: 'pessimistic_write' },
    });

    if (!wallet) {
      this.logger.error('Wallet not found');
      throw new BadRequestException('Wallet not found');
    }

    if (wallet.currency !== data.data.currency) {
      this.logger.error('Currency mismatch for wallet');
      throw new BadRequestException('Currency mismatch for wallet');
    }

    if (data.data.type === TransactionType.DEBIT && wallet.balance < data.data.amount) {
      this.logger.error('Insufficient funds');
      throw new BadRequestException('Insufficient funds');
    }

    // Update wallet balance within the transaction
    if (data.data.type === TransactionType.CREDIT) {
      wallet.balance += data.data.amount;
    } else {
      wallet.balance = Math.max(wallet.balance - data.data.amount, 0);
    }

    await manager.save(wallet);

    // Create transaction within the same transaction
    const transaction = manager.create(Transaction, {
      amount: data.data.amount,
      type: data.data.type,
      paymentMethod: data.data.paymentMethod,
      reference: `TXN-${Date.now()}`,
      currency: data.data.currency,
      user: { id: data.userId },
      // Note: The actual funds transfer is handled by the payment processor's webhook system.
      status: TransactionStatus.APPROVED,
    });

    await manager.save(transaction);

    return { wallet };
  }
}
