/**
 * Корневой модуль приложения
 *
 * Объединяет все бизнес-модули и глобальную конфигурацию.
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { InvitationsModule } from './modules/invitations/invitations.module';
import { ResponsesModule } from './modules/responses/responses.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    // Глобальная конфигурация из .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    InvitationsModule,
    ResponsesModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
