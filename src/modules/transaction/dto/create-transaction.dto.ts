import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

import { Currency, PaymentMethod, TransactionType } from '../enum/transaction.enum';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Amount of the transaction',
    example: 100.5,
    minimum: 0.01,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Type of transaction',
    enum: TransactionType,
    example: TransactionType.DEBIT,
  })
  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    description: 'Payment method',
    enum: PaymentMethod,
    example: PaymentMethod.CARD,
  })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Reference of the transaction',
    example: 'TXN-1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiProperty({
    description: 'Currency of the transaction',
    enum: Currency,
    example: Currency.NGN,
  })
  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({
    example: {
      description: 'Monthly salary deposit',
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  memo?: object;

  @ApiProperty({
    description: 'ID of the recipient (required for TRANSFER type)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsString()
  recipientId?: string;

  @ApiProperty({
    description: 'ID of the wallet associated with the transaction',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsNotEmpty()
  @IsUUID()
  walletId: string;
}
