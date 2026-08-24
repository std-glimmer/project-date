/**
 * InviteStore — управление состоянием публичного приглашения
 *
 * Хранит:
 * - Данные приглашения
 * - Текущий шаг wizard
 * - Выбранные дату и место
 * - Прогресс (сохраняется в localStorage)
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { inviteApi } from '@/api/invite.api';
import type { PublicInvitation } from '@/api/types';

// Ключ для сохранения прогресса в localStorage
const progressKey = (token: string) => `invite-progress-${token}`;

export type WizardStep = 'welcome' | 'date' | 'place' | 'farewell' | 'success';

interface SavedProgress {
  step: WizardStep;
  dateStepId?: string;
  placeStepId?: string;
}

export const useInviteStore = defineStore('invite', () => {
  // ============================================================
  // Состояние
  // ============================================================

  const invitation = ref<PublicInvitation | null>(null);
  const token = ref<string>('');
  const step = ref<WizardStep>('welcome');
  const dateStepId = ref<string | null>(null);
  const placeStepId = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const submitting = ref(false);
  // Режим предпросмотра (админ просматривает приглашение без отправки ответа)
  const preview = ref(false);

  // ============================================================
  // Геттеры
  // ============================================================

  const selectedDate = computed(() =>
    invitation.value?.dates.find((d) => d.id === dateStepId.value) ?? null,
  );
  const selectedPlace = computed(() =>
    invitation.value?.places.find((p) => p.id === placeStepId.value) ?? null,
  );

  // ============================================================
  // Действия
  // ============================================================

  /**
   * Загрузка приглашения по токену.
   *
   * В обычном режиме восстанавливает прогресс из localStorage.
   * В режиме предпросмотра всегда начинает с первого шага,
   * чтобы админ мог пройти весь wizard с самого начала.
   */
  async function loadInvitation(inviteToken: string) {
    token.value = inviteToken;
    loading.value = true;
    error.value = null;

    try {
      invitation.value = await inviteApi.getByToken(inviteToken);
      if (preview.value) {
        // Предпросмотр: всегда начинаем с приветствия
        step.value = 'welcome';
        dateStepId.value = null;
        placeStepId.value = null;
      } else {
        restoreProgress();
      }
    } catch (e: any) {
      error.value = e.response?.data?.message ?? 'Приглашение не найдено';
    } finally {
      loading.value = false;
    }
  }

  /**
   * Переход к следующему шагу.
   */
  function nextStep() {
    const order: WizardStep[] = ['welcome', 'date', 'place', 'farewell', 'success'];
    const currentIndex = order.indexOf(step.value);
    if (currentIndex < order.length - 1) {
      step.value = order[currentIndex + 1];
      saveProgress();
    }
  }

  /**
   * Возврат к предыдущему шагу.
   * Позволяет пользователю изменить ранее сделанный выбор
   * (например, вернуться от выбора места к выбору даты).
   */
  function previousStep() {
    const order: WizardStep[] = ['welcome', 'date', 'place', 'farewell', 'success'];
    const currentIndex = order.indexOf(step.value);
    if (currentIndex > 0) {
      step.value = order[currentIndex - 1];
      saveProgress();
    }
  }

  /**
   * Выбор даты.
   */
  function selectDate(id: string) {
    dateStepId.value = id;
    saveProgress();
  }

  /**
   * Выбор места.
   */
  function selectPlace(id: string) {
    placeStepId.value = id;
    saveProgress();
  }

  /**
   * Отправка ответа.
   */
  async function submitAnswer() {
    if (!dateStepId.value || !placeStepId.value) return;

    submitting.value = true;
    try {
      await inviteApi.submitAnswer(token.value, {
        dateStepId: dateStepId.value,
        placeStepId: placeStepId.value,
      });
      step.value = 'success';
      saveProgress();
    } finally {
      submitting.value = false;
    }
  }

  /**
   * Установка режима предпросмотра.
   */
  function setPreview(value: boolean) {
    preview.value = value;
  }

  /**
   * Сброс состояния (при новом приглашении).
   */
  function reset() {
    invitation.value = null;
    token.value = '';
    step.value = 'welcome';
    dateStepId.value = null;
    placeStepId.value = null;
    error.value = null;
    preview.value = false;
    localStorage.removeItem(progressKey(token.value));
  }

  // ============================================================
  // Вспомогательные
  // ============================================================

  /**
   * Сохранение прогресса в localStorage.
   */
  function saveProgress() {
    if (!token.value) return;
    const progress: SavedProgress = {
      step: step.value,
      dateStepId: dateStepId.value ?? undefined,
      placeStepId: placeStepId.value ?? undefined,
    };
    localStorage.setItem(progressKey(token.value), JSON.stringify(progress));
  }

  /**
   * Восстановление прогресса из localStorage.
   */
  function restoreProgress() {
    const saved = localStorage.getItem(progressKey(token.value));
    if (!saved) return;

    try {
      const progress = JSON.parse(saved) as SavedProgress;
      step.value = progress.step;
      dateStepId.value = progress.dateStepId ?? null;
      placeStepId.value = progress.placeStepId ?? null;
    } catch {
      // Некорректные данные — игнорируем
    }
  }

  return {
    invitation,
    token,
    step,
    dateStepId,
    placeStepId,
    loading,
    error,
    submitting,
    preview,
    selectedDate,
    selectedPlace,
    loadInvitation,
    nextStep,
    previousStep,
    selectDate,
    selectPlace,
    submitAnswer,
    setPreview,
    reset,
  };
});
