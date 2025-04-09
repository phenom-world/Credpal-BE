import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

import { PaymentMethod } from '../../transaction/enum/transaction.enum';
import { Currency } from './create-wallet.dto';

export class FundDto {
  @ApiProperty({
    description: 'The amount to fund',
    example: 1000,
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'The currency of the transaction',
    enum: Currency,
  })
  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;

  @ApiProperty({
    description: 'The payment method to use',
    enum: PaymentMethod,
    default: PaymentMethod.TRANSFER,
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}
