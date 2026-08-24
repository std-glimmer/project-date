<script setup lang="ts">
/**
 * InvitationFormView — создание/редактирование приглашения
 *
 * Позволяет настроить:
 * - Основную информацию (название, заголовок, текст)
 * - GIF (URL)
 * - Даты (произвольное количество)
 * - Места (произвольное количество)
 */
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { invitationsApi } from '@/api/invitations.api';
import type { CreateStepInput, StepType } from '@/api/types';

const route = useRoute();
const router = useRouter();

const isEdit = ref(false);
const invitationId = ref<string | null>(null);
const loading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);

// ============================================================
// Форма
// ============================================================

const title = ref('');
const headline = ref('');
const greetingText = ref('');
const gifUrl = ref('');

interface StepForm {
  type: StepType;
  label: string;
  emoji: string;
}

const dateSteps = ref<StepForm[]>([]);
const placeSteps = ref<StepForm[]>([]);

// ============================================================
// Загрузка данных для редактирования
// ============================================================

onMounted(async () => {
  if (route.params.id) {
    isEdit.value = true;
    invitationId.value = route.params.id as string;
    await loadInvitation();
  }
});

async function loadInvitation() {
  loading.value = true;
  try {
    const inv = await invitationsApi.getById(invitationId.value!);
    title.value = inv.title;
    headline.value = inv.headline;
    greetingText.value = inv.greetingText;
    gifUrl.value = inv.gifUrl;

    dateSteps.value = inv.steps
      .filter((s) => s.type === 'DATE')
      .map((s) => ({ type: 'DATE', label: s.label, emoji: s.emoji ?? '' }));
    placeSteps.value = inv.steps
      .filter((s) => s.type === 'PLACE')
      .map((s) => ({ type: 'PLACE', label: s.label, emoji: s.emoji ?? '' }));
  } catch (e: any) {
    error.value = e.response?.data?.message ?? 'Не удалось загрузить приглашение';
  } finally {
    loading.value = false;
  }
}

// ============================================================
// Управление шагами
// ============================================================

function addDateStep() {
  dateSteps.value.push({ type: 'DATE', label: '', emoji: '📅' });
}

function addPlaceStep() {
  placeSteps.value.push({ type: 'PLACE', label: '', emoji: '📍' });
}

function removeStep(steps: StepForm[], index: number) {
  steps.splice(index, 1);
}

/**
 * Обработчик ошибки загрузки GIF-превью.
 * Скрывает изображение, если оно не загрузилось.
 */
function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement;
  target.style.display = 'none';
}


// ============================================================
// Сохранение
// ============================================================

function buildSteps(): CreateStepInput[] {
  const dates: CreateStepInput[] = dateSteps.value
    .filter((s) => s.label.trim())
    .map((s, i) => ({
      type: 'DATE',
      label: s.label.trim(),
      emoji: s.emoji || '📅',
      order: i + 1,
    }));

  const places: CreateStepInput[] = placeSteps.value
    .filter((s) => s.label.trim())
    .map((s, i) => ({
      type: 'PLACE',
      label: s.label.trim(),
      emoji: s.emoji || '📍',
      order: i + 1,
    }));

  return [...dates, ...places];
}

async function handleSubmit() {
  error.value = null;

  // Валидация
  if (!title.value.trim()) {
    error.value = 'Введите название приглашения';
    return;
  }
  if (!headline.value.trim()) {
    error.value = 'Введите заголовок';
    return;
  }
  if (!greetingText.value.trim()) {
    error.value = 'Введите текст приветствия';
    return;
  }
  if (!gifUrl.value.trim()) {
    error.value = 'Введите URL GIF-анимации';
    return;
  }

  const steps = buildSteps();
  if (steps.filter((s) => s.type === 'DATE').length === 0) {
    error.value = 'Добавьте хотя бы одну дату';
    return;
  }
  if (steps.filter((s) => s.type === 'PLACE').length === 0) {
    error.value = 'Добавьте хотя бы одно место';
    return;
  }

  saving.value = true;
  try {
    const payload = {
      title: title.value.trim(),
      headline: headline.value.trim(),
      greetingText: greetingText.value.trim(),
      gifUrl: gifUrl.value.trim(),
      steps,
    };

    if (isEdit.value) {
      await invitationsApi.update(invitationId.value!, payload);
    } else {
      await invitationsApi.create(payload);
    }

    router.push({ name: 'admin-invitations' });
  } catch (e: any) {
    error.value = e.response?.data?.message ?? 'Не удалось сохранить приглашение';
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Шапка -->
    <header class="bg-white shadow-soft sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button
            class="text-gray-400 hover:text-blush-500 transition-colors text-xl"
            @click="router.push({ name: 'admin-invitations' })"
          >
            ←
          </button>
          <div>
            <h1 class="font-extrabold text-xl text-gray-900">
              {{ isEdit ? 'Редактирование приглашения' : 'Новое приглашение' }}
            </h1>
            <p class="text-xs text-gray-400">Настройте все детали</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Контент -->
    <main class="max-w-4xl mx-auto px-4 py-8">
      <!-- Загрузка -->
      <div v-if="loading" class="space-y-4">
        <div class="card"><div class="skeleton h-8 w-64 mb-4"></div><div class="skeleton h-4 w-full"></div></div>
        <div class="card"><div class="skeleton h-8 w-64 mb-4"></div><div class="skeleton h-4 w-full"></div></div>
      </div>

      <!-- Ошибка загрузки -->
      <div v-else-if="error && !saving" class="card text-center">
        <p class="text-red-500 mb-4">{{ error }}</p>
        <button class="btn-secondary" @click="router.push({ name: 'admin-invitations' })">Назад</button>
      </div>

      <!-- Форма -->
      <form v-else class="space-y-6" @submit.prevent="handleSubmit">
        <!-- Основная информация -->
        <div class="card">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Основная информация</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-600 mb-2">Название приглашения</label>
              <input v-model="title" type="text" placeholder="Наше первое свидание ❤️" class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-600 mb-2">Заголовок</label>
              <input v-model="headline" type="text" placeholder="Привет ❤️" class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-600 mb-2">Текст приветствия</label>
              <textarea
                v-model="greetingText"
                rows="4"
                placeholder="У меня есть для тебя небольшое предложение..."
                class="input-field resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- GIF -->
        <div class="card">
          <h2 class="text-lg font-bold text-gray-900 mb-4">GIF-анимация</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-600 mb-2">URL GIF</label>
              <input
                v-model="gifUrl"
                type="url"
                placeholder="https://media.giphy.com/media/..."
                class="input-field"
              />
            </div>
            <!-- Предпросмотр -->
            <div v-if="gifUrl" class="flex justify-center">
              <img
                :src="gifUrl"
                alt="Предпросмотр GIF"
                class="w-32 h-32 object-cover rounded-full border-4 border-blush-100"
                @error="handleImageError"
              />

            </div>
          </div>
        </div>

        <!-- Даты -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-gray-900">Даты</h2>
            <button type="button" class="btn-secondary !py-2 !px-4 !text-sm" @click="addDateStep">
              + Добавить дату
            </button>
          </div>

          <div v-if="dateSteps.length === 0" class="text-center text-gray-400 py-6">
            Добавьте варианты дат для свидания
          </div>

          <div class="space-y-3">
            <div
              v-for="(step, index) in dateSteps"
              :key="index"
              class="flex items-center gap-2 animate-slide-up"
            >
              <input
                v-model="step.emoji"
                type="text"
                class="w-14 input-field text-center"
                placeholder="📅"
              />
              <input
                v-model="step.label"
                type="text"
                placeholder="Суббота 18:00"
                class="input-field flex-1"
              />
              <button
                type="button"
                class="text-red-400 hover:text-red-500 transition-colors px-2"
                @click="removeStep(dateSteps, index)"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <!-- Места -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-gray-900">Места</h2>
            <button type="button" class="btn-secondary !py-2 !px-4 !text-sm" @click="addPlaceStep">
              + Добавить место
            </button>
          </div>

          <div v-if="placeSteps.length === 0" class="text-center text-gray-400 py-6">
            Добавьте варианты мест для свидания
          </div>

          <div class="space-y-3">
            <div
              v-for="(step, index) in placeSteps"
              :key="index"
              class="flex items-center gap-2 animate-slide-up"
            >
              <input
                v-model="step.emoji"
                type="text"
                class="w-14 input-field text-center"
                placeholder="📍"
              />
              <input
                v-model="step.label"
                type="text"
                placeholder="Кофейня"
                class="input-field flex-1"
              />
              <button
                type="button"
                class="text-red-400 hover:text-red-500 transition-colors px-2"
                @click="removeStep(placeSteps, index)"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <!-- Ошибка валидации -->
        <Transition name="fade">
          <p v-if="error" class="text-red-500 text-sm bg-red-50 rounded-xl p-3">
            {{ error }}
          </p>
        </Transition>

        <!-- Кнопки -->
        <div class="flex gap-3">
          <button
            type="button"
            class="btn-secondary flex-1"
            @click="router.push({ name: 'admin-invitations' })"
          >
            Отмена
          </button>
          <button type="submit" class="btn-primary flex-1" :disabled="saving">
            <span v-if="saving" class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span v-else>{{ isEdit ? 'Сохранить' : 'Создать приглашение' }} 💌</span>
          </button>
        </div>
      </form>
    </main>
  </div>
</template>
