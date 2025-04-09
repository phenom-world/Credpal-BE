import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiDataResponse, ResponseDto } from '../../common/dto/response.dto';
import { AuthUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { FundDto } from './dto/fund-wallet';
import { TransferDto } from './dto/transfer.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletResponseDto } from './dto/wallet-response.dto';
import { WithdrawDto } from './dto/withdraw-wallet.dto';
import { WalletService } from './wallet.service';

@ApiTags('Wallets')
@Controller('wallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateWalletDto })
  @ApiOperation({ summary: 'Create a new wallet' })
  @ApiDataResponse(WalletResponseDto, 'Wallet created successfully')
  @ApiResponse({ status: 400, description: 'Invalid request', type: ResponseDto })
  async create(
    @AuthUser('id') id: string,
    @Body() createWalletDto: CreateWalletDto
  ): Promise<ResponseDto<WalletResponseDto>> {
    const wallet = await this.walletService.create(id, createWalletDto);
    return {
      statusCode: HttpStatus.CREATED,
      data: wallet,
      message: 'Wallet created successfully',
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get User Wallet' })
  @ApiDataResponse(WalletResponseDto, 'Wallet retrieved successfully')
  @ApiResponse({ status: 400, description: 'Invalid request', type: ResponseDto })
  async findOne(@AuthUser('id') id: string): Promise<ResponseDto<WalletResponseDto>> {
    const wallet = await this.walletService.getUserWallet(id);
    return {
      statusCode: HttpStatus.OK,
      data: wallet,
      message: 'User wallet retrieved successfully',
    };
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update wallet' })
  @ApiDataResponse(WalletResponseDto, 'Wallet updated successfully')
  @ApiResponse({ status: 400, description: 'Invalid request', type: ResponseDto })
  @ApiBody({ type: UpdateWalletDto })
  async update(
    @AuthUser('id') id: string,
    @Body() updateWalletDto: UpdateWalletDto
  ): Promise<ResponseDto<WalletResponseDto>> {
    const wallet = await this.walletService.update(id, updateWalletDto);
    return {
      statusCode: HttpStatus.OK,
      data: wallet,
      message: 'Wallet updated successfully',
    };
  }

  @Post('fund')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fund wallet' })
  @ApiDataResponse(WalletResponseDto, 'Funding successful')
  @ApiResponse({ status: 400, description: 'Invalid request', type: ResponseDto })
  async fundWallet(
    @AuthUser('id') userId: string,
    @Body() fundDto: FundDto
  ): Promise<ResponseDto<WalletResponseDto>> {
    const wallet = await this.walletService.fundWallet(userId, fundDto);
    return {
      statusCode: HttpStatus.OK,
      data: wallet,
      message: 'Funding successful',
    };
  }

  @Post('withdraw')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Withdraw from wallet' })
  @ApiDataResponse(WalletResponseDto, 'Withdrawal successful')
  @ApiResponse({ status: 400, description: 'Invalid request', type: ResponseDto })
  async withdraw(
    @AuthUser('id') userId: string,
    @Body() withdrawDto: WithdrawDto
  ): Promise<ResponseDto<WalletResponseDto>> {
    const wallet = await this.walletService.withdraw(userId, withdrawDto);
    return {
      statusCode: HttpStatus.OK,
      data: wallet,
      message: 'Withdrawal successful',
    };
  }

  @Post('transfer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Transfer money to another user' })
  @ApiDataResponse(WalletResponseDto, 'Transfer successful')
  @ApiResponse({ status: 400, description: 'Invalid request', type: ResponseDto })
  async transfer(
    @AuthUser('id') userId: string,
    @Body() transferDto: TransferDto
  ): Promise<ResponseDto<WalletResponseDto>> {
    const wallet = await this.walletService.transfer(userId, transferDto);
    return {
      statusCode: HttpStatus.OK,
      data: wallet,
      message: 'Transfer successful',
    };
  }
}
