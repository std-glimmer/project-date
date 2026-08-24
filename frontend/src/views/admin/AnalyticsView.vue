<script setup lang="ts">
/**
 * AnalyticsView — статистика приглашения
 *
 * Отображает:
 * - Общее количество просмотров
 * - Количество ответов
 * - Конверсию
 * - Разбивку по датам и местам
 * - Список всех ответов
 */
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { analyticsApi } from '@/api/analytics.api';
import type { AnalyticsResponse } from '@/api/types';

const route = useRoute();
const router = useRouter();

const analytics = ref<AnalyticsResponse | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  await loadAnalytics();
});

async function loadAnalytics() {
  loading.value = true;
  error.value = null;
  try {
    analytics.value = await analyticsApi.getById(route.params.id as string);
  } catch (e: any) {
    error.value = e.response?.data?.message ?? 'Не удалось загрузить статистику';
  } finally {
    loading.value = false;
  }
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function maxCount(items: Array<{ count: number }>) {
  return Math.max(...items.map((i) => i.count), 1);
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Шапка -->
    <header class="bg-white shadow-soft sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button
            class="text-gray-400 hover:text-blush-500 transition-colors text-xl"
            @click="router.push({ name: 'admin-invitations' })"
          >
            ←
          </button>
          <div>
            <h1 class="font-extrabold text-xl text-gray-900">Статистика</h1>
            <p class="text-xs text-gray-400">{{ analytics?.invitation.title }}</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Контент -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- Загрузка -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="card"><div class="skeleton h-16 w-full"></div></div>
      </div>

      <!-- Ошибка -->
      <div v-else-if="error" class="card text-center">
        <p class="text-red-500 mb-4">{{ error }}</p>
        <button class="btn-secondary" @click="loadAnalytics">Повторить</button>
      </div>

      <!-- Данные -->
      <div v-else-if="analytics" class="space-y-6">
        <!-- Сводка -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="card text-center animate-slide-up">
            <div class="text-4xl mb-2">👀</div>
            <div class="text-3xl font-extrabold text-gray-900">{{ analytics.summary.totalViews }}</div>
            <div class="text-sm text-gray-500 mt-1">Просмотров</div>
          </div>
          <div class="card text-center animate-slide-up" style="animation-delay: 0.1s">
            <div class="text-4xl mb-2">💌</div>
            <div class="text-3xl font-extrabold text-blush-500">{{ analytics.summary.totalAnswers }}</div>
            <div class="text-sm text-gray-500 mt-1">Ответов</div>
          </div>
          <div class="card text-center animate-slide-up" style="animation-delay: 0.2s">
            <div class="text-4xl mb-2">📈</div>
            <div class="text-3xl font-extrabold text-green-500">{{ analytics.summary.conversionRate }}%</div>
            <div class="text-sm text-gray-500 mt-1">Конверсия</div>
          </div>
        </div>

        <!-- Разбивка по датам -->
        <div class="card">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Выбор дат</h2>
          <div v-if="analytics.dateBreakdown.length === 0" class="text-gray-400 text-center py-4">
            Пока нет ответов
          </div>
          <div v-else class="space-y-3">
            <div v-for="item in analytics.dateBreakdown" :key="item.id">
              <div class="flex items-center justify-between text-sm mb-1">
                <span class="font-semibold text-gray-700">📅 {{ item.label }}</span>
                <span class="text-blush-500 font-bold">{{ item.count }}</span>
              </div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-blush-300 to-blush-500 rounded-full transition-all duration-1000"
                  :style="{ width: `${(item.count / maxCount(analytics.dateBreakdown)) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Разбивка по местам -->
        <div class="card">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Выбор мест</h2>
          <div v-if="analytics.placeBreakdown.length === 0" class="text-gray-400 text-center py-4">
            Пока нет ответов
          </div>
          <div v-else class="space-y-3">
            <div v-for="item in analytics.placeBreakdown" :key="item.id">
              <div class="flex items-center justify-between text-sm mb-1">
                <span class="font-semibold text-gray-700">📍 {{ item.label }}</span>
                <span class="text-blush-500 font-bold">{{ item.count }}</span>
              </div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-lavender-300 to-lavender-500 rounded-full transition-all duration-1000"
                  :style="{ width: `${(item.count / maxCount(analytics.placeBreakdown)) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Список ответов -->
        <div class="card">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Все ответы</h2>
          <div v-if="analytics.answers.length === 0" class="text-gray-400 text-center py-4">
            Пока никто не ответил
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full min-w-[500px]">
              <thead>
                <tr class="text-left text-sm text-gray-400 border-b border-gray-100">
                  <th class="pb-3 pr-4 font-semibold">Дата</th>
                  <th class="pb-3 pr-4 font-semibold">Место</th>
                  <th class="pb-3 font-semibold">Время ответа</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="answer in analytics.answers"
                  :key="answer.id"
                  class="border-b border-gray-50"
                >
                  <td class="py-3 pr-4 font-semibold text-gray-700">📅 {{ answer.date }}</td>
                  <td class="py-3 pr-4 text-gray-600">📍 {{ answer.place }}</td>
                  <td class="py-3 text-gray-400 text-sm">{{ formatDateTime(answer.answeredAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
