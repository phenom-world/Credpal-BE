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
import { TransferDto } from '../../dto/transfer.dto';
import { Wallet } from '../../entities/wallet.entity';
import { validateCurrency, validateSufficientFunds } from '../helpers/wallet.helpers';
interface TransferTransactionInput {
  data: TransferDto;
  userId: string;
}

interface TransferTransactionOutput {
  senderWallet: Wallet;
  recipientWallet: Wallet;
}

@Injectable()
export class TransferTransaction extends DbTransactionBase<
  TransferTransactionInput,
  TransferTransactionOutput
> {
  constructor(
    dataSource: DataSource,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    super(dataSource);
  }

  protected async execute(
    data: TransferTransactionInput,
    manager: EntityManager
  ): Promise<TransferTransactionOutput> {
    // Get sender wallet with pessimistic lock
    const senderWallet = await manager.findOne(Wallet, {
      where: { user: { id: data.userId } },
      lock: { mode: 'pessimistic_write' },
    });

    if (!senderWallet) {
      this.logger.error('Sender wallet not found');
      throw new BadRequestException('Sender wallet not found');
    }

    validateCurrency({
      wallet: senderWallet,
      currency: data.data.currency,
      customError: 'Currency mismatch for sender wallet',
    });

    validateSufficientFunds(senderWallet, data.data.amount);

    // Get recipient wallet with pessimistic lock
    const recipientWallet = await manager.findOne(Wallet, {
      where: { user: { id: data.data.recipientId } },
      lock: { mode: 'pessimistic_write' },
    });

    if (!recipientWallet) {
      this.logger.error('Recipient wallet not found');
      throw new BadRequestException('Recipient wallet not found');
    }

    validateCurrency({
      wallet: recipientWallet,
      currency: data.data.currency,
      customError: 'Currency mismatch for recipient wallet',
    });

    // Update wallet balances within the transaction
    senderWallet.balance -= data.data.amount;
    recipientWallet.balance += data.data.amount;

    await manager.save([senderWallet, recipientWallet]);

    // Create a single transaction reference for both transactions
    const transactionReference = `TXN-${Date.now()}`;

    // Create transaction for sender
    const senderTransaction = manager.create(Transaction, {
      amount: data.data.amount,
      type: TransactionType.DEBIT,
      paymentMethod: PaymentMethod.TRANSFER,
      reference: transactionReference,
      user: { id: data.userId },
      currency: data.data.currency,
      // Note: The actual funds transfer is handled by the payment processor's webhook system.
      status: TransactionStatus.COMPLETED,
    });

    // Create transaction for recipient
    const recipientTransaction = manager.create(Transaction, {
      amount: data.data.amount,
      type: TransactionType.CREDIT,
      paymentMethod: PaymentMethod.TRANSFER,
      reference: transactionReference,
      currency: data.data.currency,
      user: { id: data.data.recipientId },
      // Note: The actual funds transfer is handled by the payment processor's webhook system.
      status: TransactionStatus.COMPLETED,
    });

    await manager.save([senderTransaction, recipientTransaction]);

    return { senderWallet, recipientWallet };
  }
}
