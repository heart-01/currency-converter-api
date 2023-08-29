import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { CustomExceptionFilter } from './errors/custom-exception-filter';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: ['*', 'http://example.com'],
    methods: 'GET,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept',
    exposedHeaders: 'Authorization',
    maxAge: 3600,
    optionsSuccessStatus: 204,
    preflightContinue: false,
  });
  app.use(express.json({ limit: '10mb' }));

  /* Global check token
  const jwtService = app.get(JwtService);
  app.useGlobalGuards(new JwtAuthGuard(jwtService)); */

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new CustomExceptionFilter());

  await app.listen(port);
}
bootstrap();
