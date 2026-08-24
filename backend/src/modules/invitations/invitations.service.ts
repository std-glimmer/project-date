/**
 * InvitationsService — бизнес-логика управления приглашениями
 *
 * Отвечает за:
 * - CRUD приглашений
 * - Генерацию уникальных токенов
 * - Управление шагами (даты и места)
 */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';

@Injectable()
export class InvitationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Список всех приглашений со статистикой.
   */
  async findAll() {
    const invitations = await this.prisma.invitation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { answers: true },
        },
      },
    });

    return invitations.map((inv) => ({
      id: inv.id,
      title: inv.title,
      status: inv.status,
      views: inv.views,
      answersCount: inv._count.answers,
      createdAt: inv.createdAt,
      updatedAt: inv.updatedAt,
      token: inv.token,
    }));
  }

  /**
   * Детали приглашения с шагами.
   */
  async findOne(id: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id },
      include: {
        steps: {
          orderBy: [{ type: 'asc' }, { order: 'asc' }],
        },
      },
    });

    if (!invitation) {
      throw new NotFoundException('Приглашение не найдено');
    }

    return invitation;
  }

  /**
   * Создание приглашения.
   * Генерирует уникальный токен и создаёт шаги.
   */
  async create(dto: CreateInvitationDto) {
    const token = this.generateToken();

    // Разделяем шаги на даты и места, присваиваем порядок
    const dateSteps = dto.steps
      .filter((s) => s.type === 'DATE')
      .map((s, i) => ({ ...s, order: s.order ?? i + 1 }));
    const placeSteps = dto.steps
      .filter((s) => s.type === 'PLACE')
      .map((s, i) => ({ ...s, order: s.order ?? i + 1 }));

    if (dateSteps.length === 0) {
      throw new BadRequestException('Добавьте хотя бы одну дату');
    }
    if (placeSteps.length === 0) {
      throw new BadRequestException('Добавьте хотя бы одно место');
    }

    const invitation = await this.prisma.invitation.create({
      data: {
        title: dto.title,
        headline: dto.headline,
        greetingText: dto.greetingText,
        gifUrl: dto.gifUrl,
        token,
        steps: {
          create: [...dateSteps, ...placeSteps],
        },
      },
      include: {
        steps: true,
      },
    });

    return invitation;
  }

  /**
   * Обновление приглашения.
   * Если переданы шаги — пересоздаём их (удаляем старые, создаём новые).
   */
  async update(id: string, dto: UpdateInvitationDto) {
    await this.findOne(id);

    const { steps, ...rest } = dto;

    // Обновляем основные поля
    const invitation = await this.prisma.invitation.update({
      where: { id },
      data: rest,
    });

    // Если переданы шаги — пересоздаём их
    if (steps) {
      const dateSteps = steps
        .filter((s) => s.type === 'DATE')
        .map((s, i) => ({ ...s, order: s.order ?? i + 1 }));
      const placeSteps = steps
        .filter((s) => s.type === 'PLACE')
        .map((s, i) => ({ ...s, order: s.order ?? i + 1 }));

      if (dateSteps.length === 0) {
        throw new BadRequestException('Добавьте хотя бы одну дату');
      }
      if (placeSteps.length === 0) {
        throw new BadRequestException('Добавьте хотя бы одно место');
      }

      // Удаляем старые шаги и создаём новые
      await this.prisma.invitationStep.deleteMany({
        where: { invitationId: id },
      });

      await this.prisma.invitationStep.createMany({
        data: [...dateSteps, ...placeSteps].map((s) => ({
          invitationId: id,
          type: s.type,
          label: s.label,
          emoji: s.emoji,
          order: s.order,
        })),
      });
    }

    return this.findOne(id);
  }

  /**
   * Удаление приглашения.
   */
  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.invitation.delete({ where: { id } });
    return { success: true };
  }

  /**
   * Генерация уникального токена для публичной ссылки.
   */
  private generateToken(): string {
    return randomBytes(12).toString('base64url');
  }
}
