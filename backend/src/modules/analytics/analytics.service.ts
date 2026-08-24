/**
 * AnalyticsService — бизнес-логика аналитики приглашений
 *
 * Отвечает за:
 * - Общую статистику (просмотры, ответы)
 * - Детализацию по каждому ответу
 * - Агрегацию по датам и местам
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Полная аналитика по приглашению.
   */
  async getAnalytics(id: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id },
      include: {
        steps: {
          orderBy: [{ type: 'asc' }, { order: 'asc' }],
        },
        answers: {
          include: {
            dateStep: true,
            placeStep: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!invitation) {
      throw new NotFoundException('Приглашение не найдено');
    }

    // Агрегация ответов по датам
    const dateCounts = this.countByStep(invitation.answers, 'dateStep');
    // Агрегация ответов по местам
    const placeCounts = this.countByStep(invitation.answers, 'placeStep');

    return {
      invitation: {
        id: invitation.id,
        title: invitation.title,
        status: invitation.status,
        views: invitation.views,
        createdAt: invitation.createdAt,
      },
      summary: {
        totalViews: invitation.views,
        totalAnswers: invitation.answers.length,
        conversionRate: invitation.views > 0
          ? Math.round((invitation.answers.length / invitation.views) * 100)
          : 0,
      },
      answers: invitation.answers.map((a) => ({
        id: a.id,
        date: a.dateStep.label,
        place: a.placeStep.label,
        answeredAt: a.createdAt,
      })),
      dateBreakdown: dateCounts,
      placeBreakdown: placeCounts,
    };
  }

  /**
   * Подсчёт количества ответов по каждому шагу.
   */
  private countByStep(
    answers: Array<{ dateStep: { id: string; label: string }; placeStep: { id: string; label: string } }>,
    field: 'dateStep' | 'placeStep',
  ) {
    const counts = new Map<string, { id: string; label: string; count: number }>();

    for (const answer of answers) {
      const step = answer[field];
      const existing = counts.get(step.id);

      if (existing) {
        existing.count += 1;
      } else {
        counts.set(step.id, { id: step.id, label: step.label, count: 1 });
      }
    }

    return Array.from(counts.values()).sort((a, b) => b.count - a.count);
  }
}
