/**
 * Composable для плавающих сердечек на фоне
 *
 * Создаёт массив сердечек с случайными позициями и задержками анимации.
 * Используется для создания романтической атмосферы.
 */
import { ref, onMounted, onUnmounted } from 'vue';

interface Heart {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

const HEART_EMOJIS = ['❤️', '💖', '💕', '💗', '💓', '🩷'];

export function useFloatingHearts(count = 12) {
  const hearts = ref<Heart[]>([]);
  let intervalId: number | null = null;

  /**
   * Создание одного сердечка со случайными параметрами.
   */
  function createHeart(): Heart {
    return {
      id: Date.now() + Math.random(),
      left: Math.random() * 100, // позиция по горизонтали (%)
      size: 16 + Math.random() * 24, // размер (px)
      delay: Math.random() * 6, // задержка старта (s)
      duration: 5 + Math.random() * 4, // длительность анимации (s)
      opacity: 0.3 + Math.random() * 0.5, // прозрачность
    };
  }

  /**
   * Запуск генерации сердечек.
   */
  function start() {
    hearts.value = Array.from({ length: count }, createHeart);

    // Периодически обновляем сердечки для бесконечной анимации
    intervalId = window.setInterval(() => {
      hearts.value = hearts.value.map((heart) =>
        heart.id === hearts.value[0]?.id ? createHeart() : heart,
      );
    }, 6000);
  }

  /**
   * Остановка генерации.
   */
  function stop() {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  }

  onMounted(start);
  onUnmounted(stop);

  return {
    hearts,
    emojis: HEART_EMOJIS,
  };
}
