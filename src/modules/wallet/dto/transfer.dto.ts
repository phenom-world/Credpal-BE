import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

import { Currency } from './create-wallet.dto';

export class TransferDto {
  @ApiProperty({
    description: 'Amount to transfer',
    example: 1000,
    minimum: 0.01,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'Currency',
    enum: Currency,
    example: Currency.NGN,
  })
  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;

  @ApiProperty({
    description: 'Recipient wallet ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  recipientId: string;
}
