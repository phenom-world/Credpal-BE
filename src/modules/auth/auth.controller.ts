import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiDataResponse, ResponseDto } from '../../common/dto/response.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { AuthUser } from './decorators/get-user.decorator';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly UserService: UserService
  ) {}

  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login user and get access token' })
  @ApiDataResponse(LoginResponseDto, 'Login successful')
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 400, description: 'Invalid request', type: ResponseDto })
  async login(@Request() request: any): Promise<ResponseDto<LoginResponseDto>> {
    const response = await this.authService.login(request.user);
    return {
      statusCode: 200,
      data: response,
      message: 'Login successful',
    };
  }

  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiDataResponse(UserResponseDto, 'User created successfully')
  @ApiResponse({ status: 400, description: 'Invalid request', type: ResponseDto })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<ResponseDto<UserResponseDto>> {
    const user = await this.UserService.create(createUserDto);
    return {
      statusCode: 200,
      data: user,
      message: 'Application created successfully',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth()
  @ApiDataResponse(UserResponseDto, 'User profile retrieved successfully')
  @ApiResponse({ status: 400, description: 'Invalid request', type: ResponseDto })
  async getProfile(@AuthUser() user: User): Promise<ResponseDto<UserResponseDto>> {
    const userProfile = await this.authService.getUserProfile(user);
    return {
      statusCode: 200,
      data: userProfile,
      message: 'User profile retrieved successfully',
    };
  }
}
