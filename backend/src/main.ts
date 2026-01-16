import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import * as cookieParser from 'cookie-parser';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  process.on('SIGTERM', async () => {
    console.log('SIGTERM received');
    const dataSource = app.get(DataSource);
    await dataSource.destroy();
    await app.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT received');
    const dataSource = app.get(DataSource);
    await dataSource.destroy();
    await app.close();
    process.exit(0);
  });

  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cross-Origin-Opener-Policy',
      'Cross-Origin-Embedder-Policy',
    ],
    exposedHeaders: ['Cross-Origin-Opener-Policy', 'Cross-Origin-Embedder-Policy'],
    credentials: true,
  });

  app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
