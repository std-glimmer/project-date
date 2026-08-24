/**
 * ResponsesService — бизнес-логика публичных ответов на приглашение
 *
 * Отвечает за:
 * - Получение приглашения по токену (инкрементирует счётчик просмотров)
 * - Сохранение ответа получателя
 */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAnswerDto } from './dto/create-answer.dto';

@Injectable()
export class ResponsesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Получение публичного приглашения по токену.
   * Инкрементирует счётчик просмотров.
   */
  async getInvitationByToken(token: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { token },
      include: {
        steps: {
          orderBy: [{ type: 'asc' }, { order: 'asc' }],
        },
      },
    });

    if (!invitation) {
      throw new NotFoundException('Приглашение не найдено');
    }

    if (invitation.status !== 'ACTIVE') {
      throw new NotFoundException('Приглашение недоступно');
    }

    // Инкрементируем счётчик просмотров
    await this.prisma.invitation.update({
      where: { id: invitation.id },
      data: { views: { increment: 1 } },
    });

    // Разделяем шаги на даты и места для удобства фронтенда
    const dates = invitation.steps
      .filter((s) => s.type === 'DATE')
      .map((s) => ({ id: s.id, label: s.label, emoji: s.emoji }));
    const places = invitation.steps
      .filter((s) => s.type === 'PLACE')
      .map((s) => ({ id: s.id, label: s.label, emoji: s.emoji }));

    return {
      id: invitation.id,
      headline: invitation.headline,
      greetingText: invitation.greetingText,
      gifUrl: invitation.gifUrl,
      dates,
      places,
    };
  }

  /**
   * Сохранение ответа на приглашение.
   * Проверяет, что выбранные шаги принадлежат этому приглашению.
   */
  async submitAnswer(token: string, dto: CreateAnswerDto) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { token },
      include: { steps: true },
    });

    if (!invitation) {
      throw new NotFoundException('Приглашение не найдено');
    }

    if (invitation.status !== 'ACTIVE') {
      throw new BadRequestException('Приглашение недоступно');
    }

    // Проверяем, что выбранные шаги принадлежат приглашению
    const dateStep = invitation.steps.find(
      (s) => s.id === dto.dateStepId && s.type === 'DATE',
    );
    const placeStep = invitation.steps.find(
      (s) => s.id === dto.placeStepId && s.type === 'PLACE',
    );

    if (!dateStep) {
      throw new BadRequestException('Выбранная дата недействительна');
    }
    if (!placeStep) {
      throw new BadRequestException('Выбранное место недействительно');
    }

    const answer = await this.prisma.answer.create({
      data: {
        invitationId: invitation.id,
        dateStepId: dto.dateStepId,
        placeStepId: dto.placeStepId,
      },
    });

    return {
      success: true,
      answerId: answer.id,
      message: 'Ответ успешно отправлен ❤️',
    };
  }
}
