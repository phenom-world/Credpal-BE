import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppException } from '../../common/factory/exception.factory';
import { User } from '../user/entities/user.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>
  ) {}

  async create(createTransactionDto: CreateTransactionDto, userId: string): Promise<Transaction> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppException('User not found', HttpStatus.NOT_FOUND);
    }

    const wallet = await this.walletRepository.findOne({
      where: { id: createTransactionDto.walletId, user: { id: userId } },
    });
    if (!wallet) {
      throw new AppException(
        'Wallet not found or does not belong to the user',
        HttpStatus.NOT_FOUND
      );
    }
    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      user: { id: userId },
    });

    return await this.transactionRepository.save(transaction);
  }

  async findAll(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!transaction) {
      throw new AppException('Transaction not found', HttpStatus.NOT_FOUND);
    }
    return transaction;
  }
}
