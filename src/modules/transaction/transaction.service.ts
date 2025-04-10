import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { FindManyOptions, FindOptionsOrderValue, Repository } from 'typeorm';

import { OrderBy } from '../../common/constants/paginate.constant';
import { AppException } from '../../common/factory/exception.factory';
import { User } from '../user/entities/user.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ListTransactionResponseDto, TransactionRequestDto } from './dto/pagination.dto';
import { Transaction } from './entities/transaction.entity';

const orderMap: Record<OrderBy, FindOptionsOrderValue> = {
  [OrderBy.createdAt_DESC]: 'DESC',
  [OrderBy.createdAt_ASC]: 'ASC',
};

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

  async findAll(userId: string, query: TransactionRequestDto): Promise<ListTransactionResponseDto> {
    const { limit = 10, page = 1, orderBy = OrderBy.createdAt_DESC, createdAt, status } = query;

    const result = await this.paginateTransactions(
      { limit, page },
      {
        where: {
          user: { id: userId },
          status,
          ...(createdAt ? { createdAt: new Date(createdAt) } : {}),
        },
        order: { createdAt: orderMap[orderBy] },
      }
    );

    return result;
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

  async paginateTransactions(
    options: IPaginationOptions,
    filter: FindManyOptions<Transaction>
  ): Promise<Pagination<Transaction>> {
    return paginate<Transaction>(this.transactionRepository, options, filter);
  }
}
