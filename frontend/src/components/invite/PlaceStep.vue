<script setup lang="ts">
/**
 * PlaceStep — экран 3: Выбор места
 *
 * Показывает список мест, пользователь выбирает одно.
 * После выбора отображается анимация сердечка.
 *
 * Есть кнопка «Назад», чтобы вернуться к выбору даты
 * и изменить ранее сделанный выбор.
 */
import { ref } from 'vue';
import { useInviteStore } from '@/stores/invite.store';

const store = useInviteStore();
const selected = ref<string | null>(store.placeStepId);

function handleSelect(id: string) {
  selected.value = id;
  store.selectPlace(id);
}
</script>

<template>
  <div class="card text-center animate-scale-in">
    <div class="text-5xl mb-4 animate-bounce-soft">📍</div>

    <h1 class="heading mb-2">Куда пойдем?</h1>
    <p class="subheading mb-8">Выбери место для нашего свидания</p>

    <!-- Список мест -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
      <button
        v-for="(place, index) in store.invitation?.places"
        :key="place.id"
        class="flex items-center justify-center gap-2
          rounded-2xl border-2 px-4 py-5 text-lg font-semibold
          transition-all duration-300 animate-slide-up
          hover:scale-[1.03] active:scale-[0.97]"
        :style="{ animationDelay: `${index * 0.08}s` }"
        :class="selected === place.id
          ? 'border-blush-400 bg-blush-50 text-blush-600 shadow-soft'
          : 'border-gray-100 bg-white text-gray-700 hover:border-blush-200 hover:bg-blush-50/50'"
        @click="handleSelect(place.id)"
      >
        <span class="text-2xl">{{ place.emoji || '📍' }}</span>
        {{ place.label }}
      </button>
    </div>

    <!-- Анимация сердечка при выборе -->
    <Transition name="fade">
      <div v-if="selected" class="mb-6">
        <span class="inline-block text-5xl animate-pulse-heart">💖</span>
      </div>
    </Transition>

    <!-- Кнопка -->
    <button class="btn-primary w-full" :disabled="!selected" @click="store.nextStep()">
      Продолжить
    </button>

    <!-- Возврат к выбору даты -->
    <button
      class="mt-3 w-full py-3 rounded-2xl text-sm font-semibold text-gray-400 hover:text-blush-500 hover:bg-blush-50 transition-colors"
      @click="store.previousStep()"
    >
      ← Назад к выбору даты
    </button>
  </div>
</template>
