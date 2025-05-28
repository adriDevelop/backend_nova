import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true
    })
  )
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
    app.use('/upload', express.static(join(__dirname, '..', 'upload')));
}
bootstrap();
