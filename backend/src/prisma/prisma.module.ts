/**
 * PrismaModule — глобальный модуль доступа к базе данных
 *
 * Экспортирует PrismaService, который инжектируется во все модули.
 */
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
