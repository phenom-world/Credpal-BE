import { ApiProperty } from '@nestjs/swagger';

import { Wallet } from '../entities/wallet.entity';
import { Currency } from './create-wallet.dto';

export class WalletResponseDto {
  @ApiProperty({ description: 'The unique identifier of the user' })
  id: string;

  @ApiProperty({ description: 'Wallet name', example: 'My Wallet' })
  name!: string;

  @ApiProperty({ description: 'Currency', enum: Currency, example: Currency.NGN })
  currency!: Currency;

  @ApiProperty({
    description: 'Wallet description',
    example: 'My personal wallet',
    required: false,
  })
  description?: string;

  @ApiProperty({ description: 'Date of creation', example: '2024-04-08T12:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ description: 'Date of last update', example: '2024-04-08T12:00:00.000Z' })
  updatedAt!: Date;

  constructor(partial: Partial<Wallet>) {
    Object.assign(this, partial);
  }
}
