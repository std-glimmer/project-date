<script setup lang="ts">
/**
 * WelcomeStep — экран 1: Приветствие
 *
 * Показывает GIF, заголовок и текст приглашения.
 */
import { useInviteStore } from '@/stores/invite.store';

const store = useInviteStore();
</script>

<template>
  <div class="card text-center animate-scale-in">
    <!-- GIF-анимация (полное изображение) -->
    <div class="mb-8">
      <img
        :src="store.invitation?.gifUrl"
        alt="Милый GIF"
        class="w-full max-w-xs mx-auto rounded-3xl shadow-soft-lg border-4 border-blush-100"
      />
    </div>


    <!-- Заголовок -->
    <h1 class="heading mb-4 animate-slide-up">
      {{ store.invitation?.headline }}
    </h1>

    <!-- Текст приглашения -->
    <p class="text-gray-600 text-lg leading-relaxed whitespace-pre-line mb-10 animate-slide-up" style="animation-delay: 0.1s">
      {{ store.invitation?.greetingText }}
    </p>

    <!-- Кнопка -->
    <button class="btn-primary w-full animate-slide-up" style="animation-delay: 0.2s" @click="store.nextStep()">
      Начать ✨
    </button>
  </div>
</template>
