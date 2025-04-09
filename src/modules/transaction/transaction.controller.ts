import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiDataResponse, ResponseDto } from '../../common/dto/response.dto';
import { AuthUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { TransactionService } from './transaction.service';

@ApiTags('transactions')
@ApiBearerAuth()
@Controller('transaction')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all transactions for the current user' })
  @ApiDataResponse(TransactionResponseDto, 'Transactions retrieved successfully')
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ResponseDto })
  async findAll(@AuthUser('id') userId: string): Promise<ResponseDto<TransactionResponseDto[]>> {
    const transactions = await this.transactionService.findAll(userId);
    return {
      statusCode: HttpStatus.OK,
      data: transactions,
      message: 'Transactions retrieved successfully',
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a specific transaction' })
  @ApiParam({
    name: 'id',
    description: 'Transaction ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiDataResponse(TransactionResponseDto, 'Transaction retrieved successfully')
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ResponseDto })
  @ApiResponse({ status: 404, description: 'Transaction not found', type: ResponseDto })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthUser('id') userId: string
  ): Promise<ResponseDto<TransactionResponseDto>> {
    const transaction = await this.transactionService.findOne(id, userId);
    return {
      statusCode: HttpStatus.OK,
      data: transaction,
      message: 'Transaction retrieved successfully',
    };
  }
}
