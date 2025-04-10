import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { User } from '../../user/entities/user.entity';
import { PaymentMethod, TransactionStatus, TransactionType } from '../enum/transaction.enum';

export class TransactionResponseDto {
  @ApiProperty({
    description: 'Amount of the transaction',
    example: 100.5,
  })
  amount: number;

  @ApiProperty({
    description: 'Type of transaction',
    enum: TransactionType,
    example: TransactionType.DEBIT,
  })
  type: TransactionType;

  @ApiProperty({
    description: 'Status of the transaction',
    enum: TransactionStatus,
    example: TransactionStatus.APPROVED,
  })
  status: TransactionStatus;

  @ApiProperty({
    description: 'Payment method used',
    enum: PaymentMethod,
    example: PaymentMethod.CARD,
  })
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Transaction reference',
    example: 'TXN-1234567890',
  })
  reference: string;

  @ApiProperty({
    description: 'Transaction note',
    example: 'Monthly salary deposit',
    required: false,
  })
  note?: string;

  @Exclude()
  user: User;
}
