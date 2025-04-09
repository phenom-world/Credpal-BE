import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'express';
import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppModule } from './app.module';
import { validationPipeException } from './common/factory/exception.factory';
import { appPort, isProd } from './config';
import { LoginDto } from './modules/auth/dto/login.dto';
import { LoginResponseDto } from './modules/auth/dto/login-response.dto';
import { TransactionResponseDto } from './modules/transaction/dto/transaction-response.dto';
import { UpdateUserDto } from './modules/user/dto/update-user.dto';
import { UserResponseDto } from './modules/user/dto/user-response.dto';
import { WalletResponseDto } from './modules/wallet/dto/wallet-response.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );
  app.use(json({ limit: '10mb' }));
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: validationPipeException,
    })
  );

  // Swagger configuration
  if (!isProd) {
    const config = new DocumentBuilder()
      .setTitle('CredPal')
      .setDescription('CredPal API')
      .setVersion('1.0')
      .addTag('credpal-api')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      deepScanRoutes: true,
      extraModels: [
        LoginResponseDto,
        UserResponseDto,
        LoginDto,
        UpdateUserDto,
        WalletResponseDto,
        TransactionResponseDto,
      ],
    });
    SwaggerModule.setup('docs', app, document);
  }

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  await app.listen(appPort);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation available at: ${await app.getUrl()}/docs`);
}
bootstrap();
