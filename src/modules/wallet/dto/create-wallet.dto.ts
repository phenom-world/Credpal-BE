import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum Currency {
  NGN = 'NGN',
}

export class CreateWalletDto {
  @ApiProperty({ description: 'Wallet name', example: 'My Savings Wallet' })
  @IsNotEmpty()
  @IsString()
  readonly name!: string;

  @ApiProperty({
    description: 'Currency',
    enum: Currency,
    example: Currency.NGN,
  })
  @IsNotEmpty()
  @IsEnum(Currency)
  readonly currency!: Currency;

  @ApiProperty({
    description: 'Wallet description',
    example: 'My personal savings account',
    required: false,
  })
  @IsString()
  readonly description?: string;
}
