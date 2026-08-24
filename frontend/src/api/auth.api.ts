/**
 * API-клиент для аутентификации
 */
import { http } from './http';
import type { LoginResponse, User } from './types';

export const authApi = {
  /**
   * Вход в систему
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await http.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    return data;
  },

  /**
   * Получение текущего пользователя
   */
  async getMe(): Promise<User> {
    const { data } = await http.get<User>('/auth/me');
    return data;
  },
};
