/**
 * Seed-скрипт для проекта "Date Invitation"
 *
 * Создаёт:
 * 1. Администратора (admin@example.com / admin123)
 * 2. Демо-приглашение с датами и местами
 *
 * Запуск: npm run prisma:seed
 */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем сидирование базы данных...');

  // ============================================================
  // 1. Создаём администратора
  // ============================================================
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Администратор',
      },
    });
    console.log(`✅ Администратор создан: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log(`ℹ️ Администратор уже существует: ${adminEmail}`);
  }

  // ============================================================
  // 2. Создаём демо-приглашение
  // ============================================================
  const demoToken = 'demo-invite-2026';

  const existingInvitation = await prisma.invitation.findUnique({
    where: { token: demoToken },
  });

  if (!existingInvitation) {
    const invitation = await prisma.invitation.create({
      data: {
        title: 'Наше первое свидание ❤️',
        headline: 'Привет ❤️',
        greetingText:
          'У меня есть для тебя небольшое предложение.\n\nДавай вместе выберем наше следующее свидание.',
        gifUrl:
          'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
        token: demoToken,
        status: 'ACTIVE',
        steps: {
          create: [
            // Даты
            { type: 'DATE', label: 'Суббота 18:00', emoji: '📅', order: 1 },
            { type: 'DATE', label: 'Воскресенье 17:00', emoji: '📅', order: 2 },
            { type: 'DATE', label: 'Следующая пятница 19:00', emoji: '📅', order: 3 },
            // Места
            { type: 'PLACE', label: 'Кофейня', emoji: '☕', order: 1 },
            { type: 'PLACE', label: 'Пиццерия', emoji: '🍕', order: 2 },
            { type: 'PLACE', label: 'Кино', emoji: '🎬', order: 3 },
            { type: 'PLACE', label: 'Прогулка в парке', emoji: '🌳', order: 4 },
            { type: 'PLACE', label: 'Суши', emoji: '🍣', order: 5 },
          ],
        },
      },
    });

    console.log(`✅ Демо-приглашение создано. Ссылка: /invite/${invitation.token}`);
  } else {
    console.log(`ℹ️ Демо-приглашение уже существует: /invite/${demoToken}`);
  }

  console.log('🌱 Сидирование завершено!');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при сидировании:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
