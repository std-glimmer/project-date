<script setup lang="ts">
/**
 * FarewellStep — экран 4: Прощание
 *
 * Показывает GIF счастливого котика/мишки и текст благодарности.
 *
 * В обычном режиме ответ отправляется автоматически через короткую паузу,
 * чтобы пользователь успел увидеть прощальное сообщение.
 *
 * В режиме предпросмотра (?preview=1) ответ НЕ отправляется —
 * администратор просто просматривает приглашение.
 */
import { onMounted, onUnmounted } from 'vue';
import { useInviteStore } from '@/stores/invite.store';

const store = useInviteStore();

// Задержка перед автоматической отправкой (мс)
const AUTO_SUBMIT_DELAY = 2500;
let timer: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
  // В режиме предпросмотра ответ не отправляем
  if (store.preview) return;

  // Автоматически отправляем ответ после короткой паузы
  timer = setTimeout(() => {
    store.submitAnswer();
  }, AUTO_SUBMIT_DELAY);
});

onUnmounted(() => {
  if (timer) clearTimeout(timer);
});

/**
 * Завершение предпросмотра: закрываем вкладку.
 * Если вкладка не может быть закрыта скриптом — возвращаемся назад.
 */
function closePreview() {
  window.close();
  // Fallback, если window.close() не сработал
  if (window.history.length > 1) {
    window.history.back();
  }
}
</script>

<template>
  <div class="card text-center animate-scale-in">
    <!-- GIF счастливого животного (полное изображение) -->
    <div class="mb-8">
      <img
        src="https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif"
        alt="Счастливый котик"
        class="w-full max-w-xs mx-auto rounded-3xl shadow-soft-lg border-4 border-lavender-100"
      />
    </div>

    <!-- Текст -->
    <h1 class="heading mb-4 animate-slide-up">Спасибо ❤️</h1>
    <p class="text-gray-600 text-lg leading-relaxed mb-10 animate-slide-up" style="animation-delay: 0.1s">
      Я уже с нетерпением жду нашей встречи.
    </p>

    <!-- Сводка выбора -->
    <div class="bg-blush-50 rounded-2xl p-4 mb-8 animate-slide-up" style="animation-delay: 0.15s">
      <p class="text-sm text-gray-500 mb-2">Твой выбор:</p>
      <p class="font-bold text-blush-600">
        {{ store.selectedDate?.emoji }} {{ store.selectedDate?.label }}
      </p>
      <p class="font-bold text-blush-600">
        {{ store.selectedPlace?.emoji }} {{ store.selectedPlace?.label }}
      </p>
    </div>

    <!-- Режим предпросмотра: кнопка завершения -->
    <button
      v-if="store.preview"
      class="btn-primary w-full animate-slide-up"
      style="animation-delay: 0.2s"
      @click="closePreview"
    >
      Завершить предпросмотр
    </button>

    <!-- Обычный режим: индикатор автоматической отправки -->
    <div
      v-else
      class="flex items-center justify-center gap-3 text-blush-500 animate-slide-up"
      style="animation-delay: 0.2s"
    >
      <span
        v-if="store.submitting"
        class="inline-block w-5 h-5 border-2 border-blush-300 border-t-transparent rounded-full animate-spin"
      ></span>
      <span class="text-sm font-medium">
        {{ store.submitting ? 'Отправляем твой ответ...' : 'Отправляем твой ответ...' }}
      </span>
    </div>
  </div>
</template>
