<script setup lang="ts">
/**
 * InviteView — публичное приглашение (wizard)
 *
 * Отображает пошаговый процесс:
 * 1. Приветствие
 * 2. Выбор даты
 * 3. Выбор места
 * 4. Прощание
 * 5. Успех
 *
 * Поддерживает режим предпросмотра (?preview=1) — используется
 * администратором для просмотра приглашения без отправки ответа.
 */
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useInviteStore } from '@/stores/invite.store';
import { useFloatingHearts } from '@/composables/useFloatingHearts';
import WelcomeStep from '@/components/invite/WelcomeStep.vue';
import DateStep from '@/components/invite/DateStep.vue';
import PlaceStep from '@/components/invite/PlaceStep.vue';
import FarewellStep from '@/components/invite/FarewellStep.vue';
import SuccessStep from '@/components/invite/SuccessStep.vue';

const route = useRoute();
const store = useInviteStore();
const { hearts, emojis } = useFloatingHearts(10);

onMounted(() => {
  const token = route.params.token as string;
  // Режим предпросмотра: админ смотрит приглашение без отправки ответа
  store.setPreview(route.query.preview === '1');
  store.loadInvitation(token);
});

// При смене токена в URL — перезагружаем
watch(
  () => route.params.token,
  (token) => {
    if (token) {
      store.reset();
      store.setPreview(route.query.preview === '1');
      store.loadInvitation(token as string);
    }
  },
);
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-blush-50 via-white to-lavender-50 relative overflow-hidden">
    <!-- Плавающие сердечки на фоне -->
    <div class="pointer-events-none fixed inset-0 z-0">
      <span
        v-for="heart in hearts"
        :key="heart.id"
        class="absolute bottom-0 animate-float-heart"
        :style="{
          left: `${heart.left}%`,
          fontSize: `${heart.size}px`,
          animationDelay: `${heart.delay}s`,
          animationDuration: `${heart.duration}s`,
          opacity: heart.opacity,
        }"
      >
        {{ emojis[heart.id % emojis.length] }}
      </span>
    </div>

    <!-- Баннер режима предпросмотра -->
    <div
      v-if="store.preview"
      class="fixed top-0 inset-x-0 z-20 bg-blush-500 text-white text-center py-2 px-4 text-sm font-semibold shadow-soft"
    >
      👁️ Режим предпросмотра — ответ не будет отправлен
    </div>

    <!-- Контент -->
    <div
      class="relative z-10 min-h-screen flex items-center justify-center p-4"
      :class="store.preview ? 'pt-16' : ''"
    >
      <!-- Загрузка -->
      <div v-if="store.loading" class="text-center">
        <div class="w-20 h-20 mx-auto mb-6 animate-bounce-soft text-5xl">💌</div>
        <div class="skeleton h-6 w-48 mx-auto mb-3"></div>
        <div class="skeleton h-4 w-64 mx-auto"></div>
      </div>

      <!-- Ошибка -->
      <div v-else-if="store.error" class="card max-w-md w-full text-center animate-scale-in">
        <div class="text-6xl mb-6">😢</div>
        <h1 class="heading mb-4">Ой...</h1>
        <p class="subheading mb-8">{{ store.error }}</p>
        <p class="text-gray-400 text-sm">Проверьте ссылку или попросите отправить её заново</p>
      </div>

      <!-- Wizard -->
      <div v-else-if="store.invitation" class="w-full max-w-lg">
        <Transition name="fade" mode="out-in">
          <WelcomeStep v-if="store.step === 'welcome'" />
          <DateStep v-else-if="store.step === 'date'" />
          <PlaceStep v-else-if="store.step === 'place'" />
          <FarewellStep v-else-if="store.step === 'farewell'" />
          <SuccessStep v-else-if="store.step === 'success'" />
        </Transition>
      </div>
    </div>
  </div>
</template>
