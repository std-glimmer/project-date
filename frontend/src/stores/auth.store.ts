/**
 * AuthStore — управление состоянием аутентификации
 *
 * Хранит:
 * - JWT-токен (в localStorage)
 * - Данные текущего пользователя
 * - Состояние загрузки
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '@/api/auth.api';
import { TOKEN_KEY } from '@/api/http';
import type { User } from '@/api/types';

export const useAuthStore = defineStore('auth', () => {
  // ============================================================
  // Состояние
  // ============================================================

  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY));
  const user = ref<User | null>(null);
  const loading = ref(false);

  // ============================================================
  // Геттеры
  // ============================================================

  const isAuthenticated = computed(() => !!token.value);

  // ============================================================
  // Действия
  // ============================================================

  /**
   * Вход в систему
   */
  async function login(email: string, password: string) {
    loading.value = true;
    try {
      const response = await authApi.login(email, password);
      token.value = response.accessToken;
      user.value = response.user;
      localStorage.setItem(TOKEN_KEY, response.accessToken);
      return response;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Загрузка профиля (при старте приложения)
   */
  async function fetchProfile() {
    if (!token.value) return;

    loading.value = true;
    try {
      user.value = await authApi.getMe();
    } catch {
      // Токен невалиден — разлогиниваем
      logout();
    } finally {
      loading.value = false;
    }
  }

  /**
   * Выход из системы
   */
  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem(TOKEN_KEY);
  }

  return {
    token,
    user,
    loading,
    isAuthenticated,
    login,
    fetchProfile,
    logout,
  };
});
