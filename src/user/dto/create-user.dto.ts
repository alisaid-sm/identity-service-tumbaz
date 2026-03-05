/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'budi@example.com',
    description: 'Alamat email user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Minimal 8 karakter',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: 'Budi Santoso',
    description: 'Nama lengkap user',
  })
  @IsString()
  @IsNotEmpty()
  full_name: string;
}
