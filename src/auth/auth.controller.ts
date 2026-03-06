/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { LoginDto } from 'src/user/dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from 'src/user/dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Request() req) {
    // req.user.userId didapat dari JwtStrategy yang kita buat tadi
    await this.userService.removeRefreshToken(req.user.userId);
    return { message: 'Logout berhasil' };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Menukarkan refresh token untuk access token baru' })
  async refresh(@Body() body: RefreshTokenDto) {
    // 1. Dekode token untuk mendapatkan userId (tanpa verifikasi penuh dulu)
    const decoded = this.jwtService.decode(body.refresh_token);

    if (!decoded || !decoded.sub) {
      throw new UnauthorizedException('Token tidak valid');
    }

    // 2. Jalankan logika refresh di AuthService
    return this.authService.refreshTokens(decoded.sub, body.refresh_token);
  }
}
