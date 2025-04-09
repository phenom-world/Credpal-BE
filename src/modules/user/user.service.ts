import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import type { Repository } from 'typeorm';

import { AppException } from '../../common/factory/exception.factory';
import { Currency } from '../wallet/dto/create-wallet.dto';
import { Wallet } from '../wallet/entities/wallet.entity';
import { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new AppException('User with this email already exists', HttpStatus.CONFLICT);
    }

    // Hash password
    const hashedPassword = await this.hashPassword(createUserDto.password);

    return await this.usersRepository.manager.transaction(async (txn) => {
      const user = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      const savedUser = await txn.save(user);

      const wallet = this.walletRepository.create({
        name: 'Default Wallet',
        currency: Currency.NGN,
        description: 'Default wallet for user',
        user: { id: savedUser.id },
      });

      await txn.save(wallet);

      return new UserResponseDto(savedUser);
    });
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.find();
    return users.map((user) => new UserResponseDto(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new AppException('User not found', HttpStatus.NOT_FOUND);
    }

    return new UserResponseDto(user);
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new AppException(`User with email ${email} not found`, HttpStatus.NOT_FOUND);
    }

    return new UserResponseDto(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.findById(id);
    if (!user) {
      throw new AppException('User not found', HttpStatus.NOT_FOUND);
    }
    Object.assign(user, updateUserDto);
    const updatedUser = await this.usersRepository.save(user);
    return new UserResponseDto(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new AppException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.usersRepository.softDelete(user.id);
  }

  async findById(id: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { id },
    });
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async getUserWithPasswordByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'fullName', 'password', 'isActive'],
    });
  }
}
