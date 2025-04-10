/* eslint-disable */
import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';

import { AppException } from '../../common/factory/exception.factory';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../user/enum/user.enum';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;

  const mockUser: Partial<User> = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    fullName: 'Test User',
    isActive: true,
    role: UserRole.USER,
    tocAgreed: true,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserService = {
    getUserWithPasswordByEmail: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should throw AppException if user is not found or inactive', async () => {
      mockUserService.getUserWithPasswordByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        new AppException('User is inactive', HttpStatus.UNAUTHORIZED)
      );
    });

    it('should return access token and user info on successful login', async () => {
      const mockToken = 'mock.jwt.token';
      const updatedUser = { ...mockUser, lastLogin: new Date() };

      mockUserService.getUserWithPasswordByEmail.mockResolvedValue(mockUser as User);
      mockJwtService.sign.mockReturnValue(mockToken);
      mockUserService.update.mockResolvedValue(updatedUser as User);

      const result = await service.login(loginDto);

      expect(result).toEqual({
        accessToken: mockToken,
        lastLogin: updatedUser.lastLogin,
        tokenExpiry: expect.any(Date),
      });
      expect(mockUserService.update).toHaveBeenCalledWith(mockUser.id, {
        lastLogin: expect.any(Date),
      });
    });
  });

  describe('validateUser', () => {
    it('should return null if user is not found', async () => {
      mockUserService.getUserWithPasswordByEmail.mockResolvedValue(null);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      mockUserService.getUserWithPasswordByEmail.mockResolvedValue(mockUser as User);

      const result = await service.validateUser('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
    });

    it('should return user without password if credentials are correct', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockUserService.getUserWithPasswordByEmail.mockResolvedValue(mockUser as User);

      const result = await service.validateUser('test@example.com', 'password123');

      const expectedUser = {
        id: mockUser.id,
        email: mockUser.email,
        fullName: mockUser.fullName,
        isActive: mockUser.isActive,
        role: mockUser.role,
        tocAgreed: mockUser.tocAgreed,
        lastLogin: mockUser.lastLogin,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      };

      expect(result).toEqual(expectedUser);
    });
  });

  describe('getUserProfile', () => {
    it('should return user profile', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser as User);
      const mockUserProfile = new UserResponseDto(mockUser as User);

      const result = await service.getUserProfile(mockUser as User);

      expect(result).toEqual(mockUserProfile);
      expect(mockUserService.findOne).toHaveBeenCalledWith(mockUser.id);
    });
  });
});
