import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users') // Nama tabel di Postgres
export class User {
  @PrimaryGeneratedColumn('uuid') // Menggunakan UUID agar lebih aman daripada ID angka biasa
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // Password tidak akan ikut terpanggil saat kita melakukan query biasa
  password: string;

  @Column()
  full_name: string;

  @Column({ default: 'user' })
  role: string;

  @CreateDateColumn()
  created_at: Date;
}
