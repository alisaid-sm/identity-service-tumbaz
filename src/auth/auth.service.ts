import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async login(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    // 1. Generate kedua token
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // 2. Simpan hash Refresh Token ke database
    await this.userService.setCurrentRefreshToken(refreshToken, user.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);

    // Cek apakah user ada dan punya token di DB
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Akses ditolak');
    }

    console.log('Refresh token yang diterima:', refreshToken);
    console.log('Hash token di DB:', user.hashedRefreshToken);

    // Bandingkan token mentah dengan hash di DB
    const isTokenMatch = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (!isTokenMatch) {
      throw new UnauthorizedException('Token tidak valid');
    }

    // Jika semua oke, buatkan token baru (seperti proses login)
    return this.login(user);
  }
}
