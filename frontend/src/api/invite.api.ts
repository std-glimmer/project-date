/**
 * API-клиент для публичного приглашения (получатель)
 */
import { http } from './http';
import type {
  PublicInvitation,
  SubmitAnswerInput,
  SubmitAnswerResponse,
} from './types';

export const inviteApi = {
  /**
   * Получить приглашение по токену
   */
  async getByToken(token: string): Promise<PublicInvitation> {
    const { data } = await http.get<PublicInvitation>(`/invite/${token}`);
    return data;
  },

  /**
   * Отправить ответ
   */
  async submitAnswer(
    token: string,
    input: SubmitAnswerInput,
  ): Promise<SubmitAnswerResponse> {
    const { data } = await http.post<SubmitAnswerResponse>(
      `/invite/${token}/answer`,
      input,
    );
    return data;
  },
};
