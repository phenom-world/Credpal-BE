import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AppException } from '../../common/factory/exception.factory';
import { Currency } from '../wallet/dto/create-wallet.dto';
import { Wallet } from '../wallet/entities/wallet.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';
import { UserRole } from './enum/user.enum';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
    manager: {
      transaction: jest.fn(),
    },
  };

  const mockWalletRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
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

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      fullName: 'Test User',
      password: 'password123',
      tocAgreed: true,
      role: UserRole.USER,
    };

    const mockUser = {
      id: '1',
      email: 'test@example.com',
      fullName: 'Test User',
      password: 'hashedPassword',
      isActive: true,
      role: UserRole.USER,
      tocAgreed: true,
    };

    const mockWallet = {
      id: '1',
      name: 'Default Wallet',
      currency: Currency.NGN,
      description: 'Default wallet for user',
      user: { id: '1' },
    };

    it('should create a new user with a default wallet', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockWalletRepository.create.mockReturnValue(mockWallet);
      mockUserRepository.manager.transaction.mockImplementation(async (callback) => {
        return callback({
          save: jest.fn().mockResolvedValue(mockUser),
        });
      });

      const result = await service.create(createUserDto);

      expect(result).toBeInstanceOf(UserResponseDto);
      expect(result.email).toBe(createUserDto.email);
      expect(result.fullName).toBe(createUserDto.fullName);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(mockUserRepository.manager.transaction).toHaveBeenCalled();
    });

    it('should throw an error if user with email already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        new AppException('User with this email already exists', HttpStatus.CONFLICT)
      );
    });
  });

  describe('findAll', () => {
    const mockUsers = [
      {
        id: '1',
        email: 'test1@example.com',
        fullName: 'Test User 1',
        isActive: true,
        role: UserRole.USER,
      },
      {
        id: '2',
        email: 'test2@example.com',
        fullName: 'Test User 2',
        isActive: true,
        role: UserRole.USER,
      },
    ];

    it('should return all users', async () => {
      mockUserRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(UserResponseDto);
      expect(result[1]).toBeInstanceOf(UserResponseDto);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      fullName: 'Test User',
      isActive: true,
      role: UserRole.USER,
    };

    it('should return a user by id', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne('1');

      expect(result).toBeInstanceOf(UserResponseDto);
      expect(result.id).toBe('1');
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw an error if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(
        new AppException('User not found', HttpStatus.NOT_FOUND)
      );
    });
  });

  describe('findByEmail', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      fullName: 'Test User',
      isActive: true,
      role: UserRole.USER,
    };

    it('should return a user by email', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toBeInstanceOf(UserResponseDto);
      expect(result.email).toBe('test@example.com');
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should throw an error if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findByEmail('test@example.com')).rejects.toThrow(
        new AppException('User with email test@example.com not found', HttpStatus.NOT_FOUND)
      );
    });
  });

  describe('update', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      fullName: 'Test User',
      isActive: true,
      role: UserRole.USER,
    };

    const updateUserDto: UpdateUserDto = {
      fullName: 'Updated User',
    };

    it('should update a user', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue({ ...mockUser, ...updateUserDto });

      const result = await service.update('1', updateUserDto);

      expect(result).toBeInstanceOf(UserResponseDto);
      expect(result.fullName).toBe('Updated User');
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw an error if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.update('1', updateUserDto)).rejects.toThrow(
        new AppException('User not found', HttpStatus.NOT_FOUND)
      );
    });
  });

  describe('remove', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      fullName: 'Test User',
      isActive: true,
      role: UserRole.USER,
    };

    it('should soft delete a user', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.softDelete.mockResolvedValue({ affected: 1 });

      await service.remove('1');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(mockUserRepository.softDelete).toHaveBeenCalledWith('1');
    });

    it('should throw an error if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(
        new AppException('User not found', HttpStatus.NOT_FOUND)
      );
    });
  });

  describe('getUserWithPasswordByEmail', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      fullName: 'Test User',
      password: 'hashedPassword',
      isActive: true,
      role: UserRole.USER,
    };

    it('should return a user with password by email', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getUserWithPasswordByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: ['id', 'email', 'fullName', 'password', 'isActive'],
      });
    });

    it('should return null if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.getUserWithPasswordByEmail('test@example.com');

      expect(result).toBeNull();
    });
  });
});
