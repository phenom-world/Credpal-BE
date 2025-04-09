import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';

import { getTypeOrmConfig } from './config';
import { loggerOptions } from './config/logger.config';
import { AuthModule } from './modules/auth/auth.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { UserModule } from './modules/user/user.module';
import { WalletModule } from './modules/wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(getTypeOrmConfig()),
    WinstonModule.forRoot(loggerOptions),

    UserModule,
    AuthModule,
    WalletModule,
    TransactionModule,
  ],
})
export class AppModule {}
