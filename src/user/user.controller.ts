/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Body, UseGuards, Get, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt')) // Mengunci seluruh method di bawahnya
  @Get('profile')
  getProfile(@Request() req) {
    // Data user sudah tersedia di sini berkat JwtStrategy!
    return req.user;
  }
}
