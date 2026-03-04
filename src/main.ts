import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // 1. Aplikasi HTTP untuk API (Login/Register)
  const app = await NestFactory.create(AppModule);

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
