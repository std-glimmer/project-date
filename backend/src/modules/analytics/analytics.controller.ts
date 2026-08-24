/**
 * AnalyticsController — HTTP-слой аналитики (protected)
 */
import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * GET /api/analytics/:id — статистика по приглашению
   */
  @Get(':id')
  getAnalytics(@Param('id') id: string) {
    return this.analyticsService.getAnalytics(id);
  }
}
