/**
 * API-клиент для аналитики
 */
import { http } from './http';
import type { AnalyticsResponse } from './types';

export const analyticsApi = {
  /**
   * Получить аналитику по приглашению
   */
  async getById(id: string): Promise<AnalyticsResponse> {
    const { data } = await http.get<AnalyticsResponse>(`/analytics/${id}`);
    return data;
  },
};
