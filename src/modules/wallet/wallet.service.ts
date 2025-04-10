import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type Repository } from 'typeorm';

import { AppException } from '../../common/factory/exception.factory';
import type { CreateWalletDto } from './dto/create-wallet.dto';
import { FundDto } from './dto/fund-wallet';
import type { TransferDto } from './dto/transfer.dto';
import type { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletResponseDto } from './dto/wallet-response.dto';
import type { WithdrawDto } from './dto/withdraw-wallet.dto';
import { Wallet } from './entities/wallet.entity';
import { FundTransaction } from './utils/db-transactions/fund.transaction';
import { TransferTransaction } from './utils/db-transactions/transfer.transaction';
import { WithdrawTransaction } from './utils/db-transactions/withdraw.transaction';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private readonly transferTransaction: TransferTransaction,
    private readonly fundTransaction: FundTransaction,
    private readonly withdrawTransaction: WithdrawTransaction
  ) {}

  async create(userId: string, createWalletDto: CreateWalletDto): Promise<WalletResponseDto> {
    const activeWallet = await this.walletRepository.findOne({ where: { user: { id: userId } } });
    if (activeWallet) {
      throw new AppException('User already has an active wallet', HttpStatus.BAD_REQUEST);
    }
    const wallet = this.walletRepository.create({ ...createWalletDto, user: { id: userId } });
    const savedWallet = await this.walletRepository.save(wallet);
    return new WalletResponseDto(savedWallet);
  }

  async getUserWallet(userId: string): Promise<WalletResponseDto> {
    const wallet = await this.getWallet(userId);
    return new WalletResponseDto(wallet);
  }

  async update(userId: string, updateWalletDto: UpdateWalletDto): Promise<WalletResponseDto> {
    const wallet = await this.getWallet(userId);
    Object.assign(wallet, updateWalletDto);
    const updatedWallet = await this.walletRepository.save(wallet);
    return new WalletResponseDto(updatedWallet);
  }

  async fundWallet(userId: string, fundDto: FundDto): Promise<WalletResponseDto> {
    const { wallet: updatedWallet } = await this.fundTransaction.run({
      data: {
        amount: fundDto.amount,
        currency: fundDto.currency,
        paymentMethod: fundDto.paymentMethod,
      },
      userId,
    });

    return new WalletResponseDto(updatedWallet);
  }

  async withdraw(userId: string, withdrawDto: WithdrawDto): Promise<WalletResponseDto> {
    const { wallet: updatedWallet } = await this.withdrawTransaction.run({
      data: {
        amount: withdrawDto.amount,
        currency: withdrawDto.currency,
      },
      userId,
    });

    return new WalletResponseDto(updatedWallet);
  }

  async transfer(userId: string, transferDto: TransferDto): Promise<WalletResponseDto> {
    const { senderWallet: updatedWallet } = await this.transferTransaction.run({
      data: {
        amount: transferDto.amount,
        currency: transferDto.currency,
        recipientEmail: transferDto.recipientEmail,
      },
      userId,
    });

    return new WalletResponseDto(updatedWallet);
  }

  async getWallet(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({ where: { user: { id: userId } } });
    if (!wallet) {
      throw new AppException('Wallet not found', HttpStatus.NOT_FOUND);
    }
    return wallet;
  }
}
