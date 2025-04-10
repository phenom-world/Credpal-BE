import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';

import { OrderBy } from '../../common/constants/paginate.constant';
import { AppException } from '../../common/factory/exception.factory';
import { User } from '../user/entities/user.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionRequestDto } from './dto/pagination.dto';
import { Transaction } from './entities/transaction.entity';
import {
  Currency,
  PaymentMethod,
  TransactionStatus,
  TransactionType,
} from './enum/transaction.enum';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;

  const mockUser: Partial<User> = {
    id: 'user-1',
    email: 'test@example.com',
  };

  const mockWallet: Partial<Wallet> = {
    id: 'wallet-1',
    balance: 1000,
    currency: Currency.NGN,
    user: mockUser as User,
  };

  const mockTransaction: Transaction = {
    id: 'transaction-1',
    amount: 100,
    type: TransactionType.CREDIT,
    status: TransactionStatus.APPROVED,
    paymentMethod: PaymentMethod.TRANSFER,
    currency: Currency.NGN,
    reference: 'TXN-123',
    user: mockUser as User,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    note: '',
  };

  const mockTransactionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockWalletRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Wallet),
          useValue: mockWalletRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const userId = 'user-1';
    const createTransactionDto: CreateTransactionDto = {
      amount: 100,
      type: TransactionType.CREDIT,
      paymentMethod: PaymentMethod.TRANSFER,
      currency: Currency.NGN,
      walletId: 'wallet-1',
      reference: 'TXN-123',
    };

    it('should throw AppException if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createTransactionDto, userId)).rejects.toThrow(
        new AppException('User not found', HttpStatus.NOT_FOUND)
      );
    });

    it('should throw AppException if wallet is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockWalletRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createTransactionDto, userId)).rejects.toThrow(
        new AppException('Wallet not found or does not belong to the user', HttpStatus.NOT_FOUND)
      );
    });

    it('should create transaction successfully', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockWalletRepository.findOne.mockResolvedValue(mockWallet);
      mockTransactionRepository.create.mockReturnValue(mockTransaction);
      mockTransactionRepository.save.mockResolvedValue(mockTransaction);

      const result = await service.create(createTransactionDto, userId);

      expect(result).toEqual(mockTransaction);
      expect(mockTransactionRepository.create).toHaveBeenCalledWith({
        ...createTransactionDto,
        user: { id: userId },
      });
    });
  });

  describe('findAll', () => {
    const userId = 'user-1';
    const query: TransactionRequestDto = {
      page: 1,
      limit: 10,
      orderBy: OrderBy.createdAt_DESC,
      status: TransactionStatus.APPROVED,
    };

    it('should return paginated transactions', async () => {
      const mockPaginatedResult: Pagination<Transaction, IPaginationMeta> = {
        items: [mockTransaction],
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      };

      jest.spyOn(service, 'paginateTransactions').mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll(userId, query);

      expect(result).toEqual(mockPaginatedResult);
      expect(service.paginateTransactions).toHaveBeenCalledWith(
        { limit: query.limit, page: query.page },
        {
          where: {
            user: { id: userId },
            status: query.status,
          },
          order: { createdAt: 'DESC' },
        }
      );
    });
  });

  describe('findOne', () => {
    const userId = 'user-1';
    const transactionId = 'transaction-1';

    it('should throw AppException if transaction is not found', async () => {
      mockTransactionRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(transactionId, userId)).rejects.toThrow(
        new AppException('Transaction not found', HttpStatus.NOT_FOUND)
      );
    });

    it('should return transaction successfully', async () => {
      mockTransactionRepository.findOne.mockResolvedValue(mockTransaction);

      const result = await service.findOne(transactionId, userId);

      expect(result).toEqual(mockTransaction);
      expect(mockTransactionRepository.findOne).toHaveBeenCalledWith({
        where: { id: transactionId, user: { id: userId } },
      });
    });
  });
});
