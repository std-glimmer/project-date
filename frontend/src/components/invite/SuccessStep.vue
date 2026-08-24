<script setup lang="ts">
/**
 * SuccessStep — экран успешного завершения
 *
 * Показывается после отправки ответа.
 */
</script>

<template>
  <div class="card text-center animate-scale-in">
    <!-- Большая анимация -->
    <div class="mb-8">
      <span class="inline-block text-7xl animate-pulse-heart">💖</span>
    </div>

    <!-- Текст -->
    <h1 class="heading mb-4 animate-slide-up">Ответ успешно отправлен ❤️</h1>
    <p class="text-gray-600 text-lg leading-relaxed animate-slide-up" style="animation-delay: 0.1s">
      Я скоро свяжусь с тобой.
    </p>

    <!-- Декоративные сердечки -->
    <div class="flex justify-center gap-3 mt-8 text-2xl animate-slide-up" style="animation-delay: 0.2s">
      <span class="animate-bounce-soft">💕</span>
      <span class="animate-bounce-soft" style="animation-delay: 0.2s">💖</span>
      <span class="animate-bounce-soft" style="animation-delay: 0.4s">💗</span>
    </div>
  </div>
</template>
