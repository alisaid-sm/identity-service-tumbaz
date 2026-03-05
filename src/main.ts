import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // 1. Aplikasi HTTP untuk API (Login/Register)
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Identity Service API')
    .setDescription('Layanan manajemen pengguna dan autentikasi')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Mengaktifkan validasi global 🛡️
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Menghapus properti yang tidak ada di DTO
      forbidNonWhitelisted: true, // Memberikan error jika ada properti asing
      transform: true, // Otomatis mengubah tipe data sesuai DTO
    }),
  );

  // 2. Hybrid App: Tambahkan layer Microservice (untuk dipanggil service lain)
  app.connectMicroservice<MicroserviceOptions>({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    transport: Transport.TCP,
    options: { host: '0.0.0.0', port: 8888 },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
