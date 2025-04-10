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
import { Currency } from '../../dto/create-wallet.dto';
import { Wallet } from '../../entities/wallet.entity';
import { validateCurrency } from '../helpers/wallet.helpers';

interface TxnInput {
  data: {
    amount: number;
    currency: Currency;
    paymentMethod: PaymentMethod;
  };
  userId: string;
}

@Injectable()
export class FundTransaction extends DbTransactionBase<TxnInput, { wallet: Wallet }> {
  constructor(
    dataSource: DataSource,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    super(dataSource);
  }

  protected async execute(data: TxnInput, manager: EntityManager): Promise<{ wallet: Wallet }> {
    // Get wallet with pessimistic lock
    const wallet = await manager.findOne(Wallet, {
      where: { user: { id: data.userId } },
      lock: { mode: 'pessimistic_write' },
    });

    if (!wallet) {
      this.logger.error('Wallet not found');
      throw new BadRequestException('Wallet not found');
    }

    validateCurrency({ wallet, currency: data.data.currency });

    // Update wallet balance within the transaction
    wallet.balance += data.data.amount;
    await manager.save(wallet);

    // Create transaction within the same transaction
    const transaction = manager.create(Transaction, {
      amount: data.data.amount,
      type: TransactionType.CREDIT,
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
