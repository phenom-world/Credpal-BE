import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { ApiDataResponse, ResponseDto } from '../../common/dto/response.dto';
import { AppException, UnauthorizedRouteException } from '../../common/factory/exception.factory';
import { AuthUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import type { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(
    private readonly UserService: UserService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiDataResponse(UserResponseDto, 'User updated successfully')
  @ApiResponse({ status: 400, description: 'Invalid request', type: ResponseDto })
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @AuthUser() user: User
  ): Promise<ResponseDto<UserResponseDto>> {
    if (id !== user.id) {
      throw new UnauthorizedRouteException();
    }
    try {
      const updatedUser = await this.UserService.update(id, updateUserDto);
      return {
        statusCode: 200,
        data: updatedUser,
        message: 'User updated successfully',
      };
    } catch (error) {
      this.logger.error({ message: error.message, error: JSON.stringify({ error }) });
      throw new AppException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
