import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

import { Currency } from './create-wallet.dto';

export class WithdrawDto {
  @ApiProperty({
    description: 'The amount to withdraw',
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
}
