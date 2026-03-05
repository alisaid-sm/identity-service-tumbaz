/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password, full_name } = createUserDto;

    // 1. Cek apakah user sudah ada
    const existingUser = await this.userRepository.findOneBy({ email });

    if (existingUser) {
      throw new ConflictException('Email sudah digunakan');
    }

    // 2. Hashing password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Simpan user baru ke database
    const newUser = this.userRepository.create({
      email,
      full_name,
      password: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }

  async validateUser(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    // 1. Cari user berdasarkan email
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'full_name', 'role'], // Kita perlu password untuk dibandingkan
    });

    // 2. Jika user ada, bandingkan passwordnya
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user; // Buang password dari objek hasil
      return result;
    }

    // 3. Jika tidak cocok, lempar error umum
    throw new UnauthorizedException('Email atau password salah');
  }
}
