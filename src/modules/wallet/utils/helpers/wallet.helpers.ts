import { BadRequestException, Logger } from '@nestjs/common';

import { Wallet } from '../../entities/wallet.entity';

const logger = new Logger('WalletUtils');

export interface WalletValidationInput {
  wallet: Wallet;
  currency: string;
  customError?: string;
}

export function validateCurrency({ wallet, currency, customError }: WalletValidationInput): void {
  if (wallet.currency !== currency) {
    logger.error(customError || 'Currency mismatch for wallet');
    throw new BadRequestException(customError || 'Currency mismatch for wallet');
  }
}

export function validateSufficientFunds(wallet: Wallet, amount: number): void {
  if (wallet.balance < amount) {
    logger.error('Insufficient funds');
    throw new BadRequestException('Insufficient funds');
  }
}
