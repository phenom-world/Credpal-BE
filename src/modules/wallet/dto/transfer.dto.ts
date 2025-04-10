import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

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
    description: 'Recipient email',
    example: 'recipient@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  recipientEmail: string;

  @ApiProperty({
    description: 'The note of the transaction',
    example: 'Funding wallet',
  })
  @IsString()
  @IsOptional()
  note?: string;
}
