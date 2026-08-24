/**
 * Конфигурация маршрутизации
 *
 * Маршруты:
 * - /invite/:token — публичное приглашение
 * - /admin/login — вход в админку
 * - /admin — список приглашений (protected)
 * - /admin/invitations/new — создание (protected)
 * - /admin/invitations/:id/edit — редактирование (protected)
 * - /admin/invitations/:id/analytics — статистика (protected)
 */
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ============================================================
    // Публичное приглашение
    // ============================================================
    {
      path: '/invite/:token',
      name: 'invite',
      component: () => import('@/views/invite/InviteView.vue'),
      meta: { public: true },
    },

    // ============================================================
    // Админ-панель
    // ============================================================
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/admin',
      name: 'admin-invitations',
      component: () => import('@/views/admin/InvitationsListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/invitations/new',
      name: 'admin-invitation-new',
      component: () => import('@/views/admin/InvitationFormView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/invitations/:id/edit',
      name: 'admin-invitation-edit',
      component: () => import('@/views/admin/InvitationFormView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/invitations/:id/analytics',
      name: 'admin-invitation-analytics',
      component: () => import('@/views/admin/AnalyticsView.vue'),
      meta: { requiresAuth: true },
    },

    // ============================================================
    // Редиректы
    // ============================================================
    {
      path: '/',
      redirect: '/admin',
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/admin',
    },
  ],
});

// Глобальный guard: проверка авторизации
router.beforeEach((to) => {
  const authStore = useAuthStore();

  // Если маршрут требует авторизации, а пользователь не авторизован
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'admin-login' };
  }

  // Если пользователь авторизован и идёт на страницу входа
  if (to.name === 'admin-login' && authStore.isAuthenticated) {
    return { name: 'admin-invitations' };
  }

  return true;
});

export default router;
