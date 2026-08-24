/**
 * Точка входа во frontend-приложение
 *
 * Настраивает:
 * - Pinia (управление состоянием)
 * - Vue Router (маршрутизация)
 * - Глобальные стили
 */
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './styles/main.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
