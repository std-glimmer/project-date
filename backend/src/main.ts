/**
 * Точка входа в backend-приложение "Date Invitation"
 *
 * Настраивает:
 * - Глобальный префикс API (/api)
 * - Валидацию DTO (class-validator)
 * - CORS
 * - Глобальный фильтр ошибок
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Глобальный префикс для всех API-эндпоинтов
  app.setGlobalPrefix('api');

  // Валидация всех входящих DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Удаляет поля, не описанные в DTO
      forbidNonWhitelisted: true, // Ошибка при неизвестных полях
      transform: true, // Трансформация типов
    }),
  );

  // CORS — разрешаем только origin фронтенда
  const corsOrigin = configService.get<string>('CORS_ORIGIN') || 'http://localhost:5173';
  app.enableCors({
    origin: corsOrigin.split(','),
    credentials: true,
  });

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  console.log(`🚀 Backend запущен на http://localhost:${port}/api`);
}

bootstrap();
