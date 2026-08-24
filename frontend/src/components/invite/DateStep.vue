<script setup lang="ts">
/**
 * DateStep — экран 2: Выбор даты
 *
 * Показывает список дат, пользователь выбирает одну.
 *
 * Есть кнопка «Назад», чтобы вернуться к приветствию.
 */
import { ref } from 'vue';
import { useInviteStore } from '@/stores/invite.store';

const store = useInviteStore();
const selected = ref<string | null>(store.dateStepId);

function handleSelect(id: string) {
  selected.value = id;
  store.selectDate(id);
}
</script>

<template>
  <div class="card text-center animate-scale-in">
    <div class="text-5xl mb-4 animate-bounce-soft">📅</div>

    <h1 class="heading mb-2">Когда тебе будет удобно?</h1>
    <p class="subheading mb-8">Выбери один вариант</p>

    <!-- Список дат -->
    <div class="space-y-3 mb-8">
      <button
        v-for="(date, index) in store.invitation?.dates"
        :key="date.id"
        class="w-full flex items-center justify-between gap-3
          rounded-2xl border-2 px-5 py-4 text-left text-lg font-semibold
          transition-all duration-300 animate-slide-up
          hover:scale-[1.02] active:scale-[0.98]"
        :style="{ animationDelay: `${index * 0.08}s` }"
        :class="selected === date.id
          ? 'border-blush-400 bg-blush-50 text-blush-600 shadow-soft'
          : 'border-gray-100 bg-white text-gray-700 hover:border-blush-200 hover:bg-blush-50/50'"
        @click="handleSelect(date.id)"
      >
        <span class="flex items-center gap-3">
          <span class="text-2xl">{{ date.emoji || '📅' }}</span>
          {{ date.label }}
        </span>
        <span
          class="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs transition-all"
          :class="selected === date.id ? 'border-blush-500 bg-blush-500 text-white' : 'border-gray-200'"
        >
          {{ selected === date.id ? '✓' : '' }}
        </span>
      </button>
    </div>

    <!-- Подтверждение выбора -->
    <Transition name="fade">
      <p v-if="selected" class="text-blush-500 font-bold text-lg mb-6 animate-pulse-heart">
        Отличный выбор ❤️
      </p>
    </Transition>

    <!-- Кнопка -->
    <button class="btn-primary w-full" :disabled="!selected" @click="store.nextStep()">
      Далее
    </button>

    <!-- Возврат к приветствию -->
    <button
      class="mt-3 w-full py-3 rounded-2xl text-sm font-semibold text-gray-400 hover:text-blush-500 hover:bg-blush-50 transition-colors"
      @click="store.previousStep()"
    >
      ← Назад
    </button>
  </div>
</template>
