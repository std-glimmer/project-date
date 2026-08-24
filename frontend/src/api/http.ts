/**
 * Базовая конфигурация Axios
 *
 * Настраивает:
 * - Базовый URL (проксируется через Vite в dev, Nginx в prod)
 * - Интерцептор для добавления JWT-токена
 * - Интерцептор для обработки ошибок авторизации
 */
import axios from 'axios';

const TOKEN_KEY = 'date_invitation_token';

export const http = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор запроса: добавляем JWT-токен
http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерцептор ответа: обрабатываем ошибки
http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Если токен истёк или невалиден — разлогиниваем
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      // Перенаправляем на страницу входа, если мы в админке
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  },
);

export { TOKEN_KEY };
