<script setup lang="ts">
/**
 * InvitationsListView — список приглашений (админ)
 *
 * Таблица с приглашениями и действиями:
 * - Создать
 * - Просмотреть (открыть предпросмотр без отправки ответа)
 * - Редактировать
 * - Удалить
 * - Открыть статистику
 * - Скопировать ссылку
 */
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { invitationsApi } from '@/api/invitations.api';
import type { InvitationListItem } from '@/api/types';

const router = useRouter();
const authStore = useAuthStore();

const invitations = ref<InvitationListItem[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const copiedId = ref<string | null>(null);

onMounted(async () => {
  await loadInvitations();
});

async function loadInvitations() {
  loading.value = true;
  error.value = null;
  try {
    invitations.value = await invitationsApi.getAll();
  } catch (e: any) {
    error.value = e.response?.data?.message ?? 'Не удалось загрузить приглашения';
  } finally {
    loading.value = false;
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getInviteLink(token: string) {
  return `${window.location.origin}/invite/${token}`;
}

/**
 * Открывает предпросмотр приглашения в новой вкладке.
 * Использует ?preview=1, чтобы ответ не отправлялся.
 */
function openInvite(token: string) {
  window.open(`${getInviteLink(token)}?preview=1`, '_blank', 'noopener,noreferrer');
}

async function copyLink(token: string, id: string) {
  const link = getInviteLink(token);
  try {
    await navigator.clipboard.writeText(link);
    copiedId.value = id;
    setTimeout(() => (copiedId.value = null), 2000);
  } catch {
    // Clipboard API может быть недоступен
  }
}

async function handleDelete(id: string) {
  if (!confirm('Удалить это приглашение?')) return;

  try {
    await invitationsApi.remove(id);
    await loadInvitations();
  } catch (e: any) {
    alert(e.response?.data?.message ?? 'Не удалось удалить приглашение');
  }
}

function handleLogout() {
  authStore.logout();
  router.push({ name: 'admin-login' });
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Шапка -->
    <header class="bg-white shadow-soft sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-3xl">💌</span>
          <div>
            <h1 class="font-extrabold text-xl text-gray-900">Date Invitation</h1>
            <p class="text-xs text-gray-400">Админ-панель</p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-500 hidden sm:block">
            {{ authStore.user?.name }}
          </span>
          <button
            class="text-sm text-gray-400 hover:text-blush-500 transition-colors"
            @click="handleLogout"
          >
            Выйти
          </button>
        </div>
      </div>
    </header>

    <!-- Контент -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- Заголовок и кнопка создания -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Приглашения</h2>
        <button class="btn-primary !py-3 !px-6 !text-base" @click="router.push({ name: 'admin-invitation-new' })">
          + Создать приглашение
        </button>
      </div>

      <!-- Ошибка -->
      <div v-if="error" class="card mb-6 text-center">
        <p class="text-red-500">{{ error }}</p>
        <button class="btn-secondary mt-4" @click="loadInvitations">Повторить</button>
      </div>

      <!-- Скелетон загрузки -->
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="card">
          <div class="skeleton h-6 w-48 mb-3"></div>
          <div class="skeleton h-4 w-32"></div>
        </div>
      </div>

      <!-- Пустое состояние -->
      <div v-else-if="invitations.length === 0" class="card text-center py-16">
        <div class="text-6xl mb-4">💌</div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Пока нет приглашений</h3>
        <p class="text-gray-500 mb-6">Создайте первое приглашение на свидание</p>
        <button class="btn-primary" @click="router.push({ name: 'admin-invitation-new' })">
          Создать приглашение
        </button>
      </div>

      <!-- Таблица -->
      <div v-else class="card overflow-x-auto">
        <table class="w-full min-w-[700px]">
          <thead>
            <tr class="text-left text-sm text-gray-400 border-b border-gray-100">
              <th class="pb-3 pr-4 font-semibold">Название</th>
              <th class="pb-3 pr-4 font-semibold">Дата создания</th>
              <th class="pb-3 pr-4 font-semibold">Статус</th>
              <th class="pb-3 pr-4 font-semibold text-center">Просмотры</th>
              <th class="pb-3 pr-4 font-semibold text-center">Ответы</th>
              <th class="pb-3 font-semibold text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="inv in invitations"
              :key="inv.id"
              class="border-b border-gray-50 hover:bg-blush-50/30 transition-colors"
            >
              <td class="py-4 pr-4">
                <div class="font-semibold text-gray-900">{{ inv.title }}</div>
                <button
                  class="text-xs text-blush-500 hover:text-blush-600 mt-1"
                  @click="copyLink(inv.token, inv.id)"
                >
                  {{ copiedId === inv.id ? '✓ Скопировано!' : '🔗 Скопировать ссылку' }}
                </button>
              </td>
              <td class="py-4 pr-4 text-gray-500">{{ formatDate(inv.createdAt) }}</td>
              <td class="py-4 pr-4">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                  :class="inv.status === 'ACTIVE'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-gray-100 text-gray-500'"
                >
                  {{ inv.status === 'ACTIVE' ? 'Активно' : 'Архив' }}
                </span>
              </td>
              <td class="py-4 pr-4 text-center font-semibold text-gray-700">{{ inv.views }}</td>
              <td class="py-4 pr-4 text-center font-semibold text-blush-500">{{ inv.answersCount }}</td>
              <td class="py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    class="px-3 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                    @click="openInvite(inv.token)"
                  >
                    👁️ Просмотреть
                  </button>
                  <button
                    class="px-3 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                    @click="router.push({ name: 'admin-invitation-edit', params: { id: inv.id } })"
                  >
                    ✏️ Редактировать
                  </button>

                  <button
                    class="px-3 py-2 rounded-xl text-sm font-semibold text-blush-500 hover:bg-blush-50 transition-colors"
                    @click="router.push({ name: 'admin-invitation-analytics', params: { id: inv.id } })"
                  >
                    📊 Статистика
                  </button>
                  <button
                    class="px-3 py-2 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-50 transition-colors"
                    @click="handleDelete(inv.id)"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>
