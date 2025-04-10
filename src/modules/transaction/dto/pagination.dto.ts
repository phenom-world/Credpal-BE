import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { Pagination } from 'nestjs-typeorm-paginate';
import { OrderBy } from 'src/common/constants/paginate.constant';

import { TransactionStatus } from '../enum/transaction.enum';
import { TransactionResponseDto } from './transaction-response.dto';

export class TransactionRequestDto {
  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;

  @IsOptional()
  @IsEnum(OrderBy)
  orderBy?: OrderBy;

  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @IsOptional()
  @IsDateString()
  createdAt?: string;
}

export class ListTransactionResponseDto extends Pagination<TransactionResponseDto> {}
