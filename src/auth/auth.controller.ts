import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { LoginDto } from 'src/user/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login untuk mendapatkan access token' })
  async login(@Body() loginDto: LoginDto) {
    // 1. Validasi user melalui UserService
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user = await this.userService.validateUser(loginDto);

    // 2. Jika valid, buatkan token melalui AuthService
    return this.authService.login(user);
  }
}
