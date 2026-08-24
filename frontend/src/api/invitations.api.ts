/**
 * API-клиент для управления приглашениями (админ)
 */
import { http } from './http';
import type {
  CreateInvitationInput,
  InvitationDetail,
  InvitationListItem,
} from './types';

export const invitationsApi = {
  /**
   * Список приглашений
   */
  async getAll(): Promise<InvitationListItem[]> {
    const { data } = await http.get<InvitationListItem[]>('/invitations');
    return data;
  },

  /**
   * Детали приглашения
   */
  async getById(id: string): Promise<InvitationDetail> {
    const { data } = await http.get<InvitationDetail>(`/invitations/${id}`);
    return data;
  },

  /**
   * Создать приглашение
   */
  async create(input: CreateInvitationInput): Promise<InvitationDetail> {
    const { data } = await http.post<InvitationDetail>('/invitations', input);
    return data;
  },

  /**
   * Обновить приглашение
   */
  async update(
    id: string,
    input: Partial<CreateInvitationInput>,
  ): Promise<InvitationDetail> {
    const { data } = await http.patch<InvitationDetail>(
      `/invitations/${id}`,
      input,
    );
    return data;
  },

  /**
   * Удалить приглашение
   */
  async remove(id: string): Promise<void> {
    await http.delete(`/invitations/${id}`);
  },
};
