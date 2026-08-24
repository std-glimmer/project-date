<script setup lang="ts">
/**
 * LoginView — страница входа в админ-панель
 */
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const error = ref<string | null>(null);
const loading = ref(false);

async function handleSubmit() {
  error.value = null;
  loading.value = true;

  try {
    await authStore.login(email.value, password.value);
    router.push({ name: 'admin-invitations' });
  } catch (e: any) {
    error.value = e.response?.data?.message ?? 'Не удалось войти. Проверьте данные.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blush-50 via-white to-lavender-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Логотип -->
      <div class="text-center mb-8 animate-scale-in">
        <div class="text-6xl mb-4 animate-bounce-soft">💌</div>
        <h1 class="heading">Date Invitation</h1>
        <p class="subheading mt-2">Админ-панель</p>
      </div>

      <!-- Форма входа -->
      <form class="card animate-slide-up" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-600 mb-2">Email</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="admin@example.com"
              class="input-field"
              autocomplete="email"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-600 mb-2">Пароль</label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="input-field"
              autocomplete="current-password"
            />
          </div>

          <!-- Ошибка -->
          <Transition name="fade">
            <p v-if="error" class="text-red-500 text-sm bg-red-50 rounded-xl p-3">
              {{ error }}
            </p>
          </Transition>

          <!-- Кнопка -->
          <button type="submit" class="btn-primary w-full" :disabled="loading">
            <span v-if="loading" class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span v-else>Войти ❤️</span>
          </button>
        </div>
      </form>

      <!-- Подсказка -->
      <p class="text-center text-sm text-gray-400 mt-6">
        Демо-доступ: admin@example.com / admin123
      </p>
    </div>
  </div>
</template>
