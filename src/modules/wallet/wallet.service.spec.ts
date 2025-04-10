/* eslint-disable */
import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { AppException } from '../../common/factory/exception.factory';
import { PaymentMethod } from '../transaction/enum/transaction.enum';
import { Currency } from './dto/create-wallet.dto';
import { FundDto } from './dto/fund-wallet';
import { TransferDto } from './dto/transfer.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletResponseDto } from './dto/wallet-response.dto';
import { WithdrawDto } from './dto/withdraw-wallet.dto';
import { Wallet } from './entities/wallet.entity';
import { FundTransaction } from './utils/db-transactions/fund.transaction';
import { TransferTransaction } from './utils/db-transactions/transfer.transaction';
import { WithdrawTransaction } from './utils/db-transactions/withdraw.transaction';
import { WalletService } from './wallet.service';

describe('WalletService', () => {
  let service: WalletService;
  let walletRepository: Repository<Wallet>;
  let fundTransaction: FundTransaction;
  let withdrawTransaction: WithdrawTransaction;
  let transferTransaction: TransferTransaction;

  const mockWallet: Partial<Wallet> = {
    id: '1',
    name: 'Test Wallet',
    balance: 1000,
    currency: Currency.NGN,
    description: 'Test wallet description',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockWalletRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockFundTransaction = {
    run: jest.fn(),
  };

  const mockWithdrawTransaction = {
    run: jest.fn(),
  };

  const mockTransferTransaction = {
    run: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: 'WalletRepository',
          useValue: mockWalletRepository,
        },
        {
          provide: FundTransaction,
          useValue: mockFundTransaction,
        },
        {
          provide: WithdrawTransaction,
          useValue: mockWithdrawTransaction,
        },
        {
          provide: TransferTransaction,
          useValue: mockTransferTransaction,
        },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
    walletRepository = module.get<Repository<Wallet>>('WalletRepository');
    fundTransaction = module.get<FundTransaction>(FundTransaction);
    withdrawTransaction = module.get<WithdrawTransaction>(WithdrawTransaction);
    transferTransaction = module.get<TransferTransaction>(TransferTransaction);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const userId = 'user-1';
    const createWalletDto = {
      name: 'Test Wallet',
      currency: Currency.NGN,
      description: 'Test wallet description',
    };

    it('should throw AppException if user already has a wallet', async () => {
      mockWalletRepository.findOne.mockResolvedValue(mockWallet);

      await expect(service.create(userId, createWalletDto)).rejects.toThrow(
        new AppException('User already has an active wallet', HttpStatus.BAD_REQUEST)
      );
    });

    it('should create a new wallet successfully', async () => {
      mockWalletRepository.findOne.mockResolvedValue(null);
      mockWalletRepository.create.mockReturnValue(mockWallet);
      mockWalletRepository.save.mockResolvedValue(mockWallet);

      const result = await service.create(userId, createWalletDto);

      expect(result).toBeInstanceOf(WalletResponseDto);
      expect(mockWalletRepository.create).toHaveBeenCalledWith({
        ...createWalletDto,
        user: { id: userId },
      });
    });
  });

  describe('getUserWallet', () => {
    const userId = 'user-1';

    it('should throw AppException if wallet is not found', async () => {
      mockWalletRepository.findOne.mockResolvedValue(null);

      await expect(service.getUserWallet(userId)).rejects.toThrow(
        new AppException('Wallet not found', HttpStatus.NOT_FOUND)
      );
    });

    it('should return user wallet successfully', async () => {
      mockWalletRepository.findOne.mockResolvedValue(mockWallet);

      const result = await service.getUserWallet(userId);

      expect(result).toBeInstanceOf(WalletResponseDto);
      expect(result).toEqual(new WalletResponseDto(mockWallet));
    });
  });

  describe('update', () => {
    const userId = 'user-1';
    const updateWalletDto: UpdateWalletDto = {
      name: 'Updated Wallet Name',
    };

    it('should throw AppException if wallet is not found', async () => {
      mockWalletRepository.findOne.mockResolvedValue(null);

      await expect(service.update(userId, updateWalletDto)).rejects.toThrow(
        new AppException('Wallet not found', HttpStatus.NOT_FOUND)
      );
    });

    it('should update wallet successfully', async () => {
      const updatedWallet = { ...mockWallet, ...updateWalletDto };
      mockWalletRepository.findOne.mockResolvedValue(mockWallet);
      mockWalletRepository.save.mockResolvedValue(updatedWallet);

      const result = await service.update(userId, updateWalletDto);

      expect(result).toBeInstanceOf(WalletResponseDto);
      expect(result).toEqual(new WalletResponseDto(updatedWallet));
    });
  });

  describe('fundWallet', () => {
    const userId = 'user-1';
    const fundDto: FundDto = {
      amount: 500,
      currency: Currency.NGN,
      paymentMethod: PaymentMethod.TRANSFER,
    };

    it('should fund wallet successfully', async () => {
      const updatedWallet = { ...mockWallet, balance: (mockWallet.balance || 0) + fundDto.amount };
      mockFundTransaction.run.mockResolvedValue({ wallet: updatedWallet });

      const result = await service.fundWallet(userId, fundDto);

      expect(result).toBeInstanceOf(WalletResponseDto);
      expect(mockFundTransaction.run).toHaveBeenCalledWith({
        data: {
          amount: fundDto.amount,
          currency: fundDto.currency,
          paymentMethod: fundDto.paymentMethod,
        },
        userId,
      });
    });
  });

  describe('withdraw', () => {
    const userId = 'user-1';
    const withdrawDto: WithdrawDto = {
      amount: 500,
      currency: Currency.NGN,
    };

    it('should withdraw from wallet successfully', async () => {
      const updatedWallet = {
        ...mockWallet,
        balance: (mockWallet.balance || 0) - withdrawDto.amount,
      };
      mockWithdrawTransaction.run.mockResolvedValue({ wallet: updatedWallet });

      const result = await service.withdraw(userId, withdrawDto);

      expect(result).toBeInstanceOf(WalletResponseDto);
      expect(mockWithdrawTransaction.run).toHaveBeenCalledWith({
        data: {
          amount: withdrawDto.amount,
          currency: withdrawDto.currency,
        },
        userId,
      });
    });
  });

  describe('transfer', () => {
    const userId = 'user-1';
    const transferDto: TransferDto = {
      amount: 500,
      currency: Currency.NGN,
      recipientEmail: 'recipient@example.com',
    };

    it('should transfer funds successfully', async () => {
      const updatedWallet = {
        ...mockWallet,
        balance: (mockWallet.balance || 0) - transferDto.amount,
      };
      mockTransferTransaction.run.mockResolvedValue({ senderWallet: updatedWallet });

      const result = await service.transfer(userId, transferDto);

      expect(result).toBeInstanceOf(WalletResponseDto);
      expect(mockTransferTransaction.run).toHaveBeenCalledWith({
        data: {
          amount: transferDto.amount,
          currency: transferDto.currency,
          recipientEmail: transferDto.recipientEmail,
        },
        userId,
      });
    });
  });
});
