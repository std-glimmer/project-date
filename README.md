# 💌 Date Invitation

**Персональные приглашения на свидание** — веб-приложение для создания красивых романтических приглашений с пошаговым wizard'ом, GIF-анимациями и аналитикой.

> Сайт вызывает улыбку, ощущение заботы, нежности и легкой романтики. 💖

---

## ✨ Возможности

### Для получателя (публичная часть)
- **Пошаговый wizard** из 5 экранов:
  1. Приветствие с GIF-анимацией
  2. Выбор даты
  3. Выбор места
  4. Прощание и отправка ответа
  5. Экран успеха
- **Плавающие сердечки** на фоне
- **Плавные анимации** (fade, slide, scale)
- **Сохранение прогресса** при обновлении страницы
- **Mobile First** адаптивный дизайн
- Большие кнопки для удобства на телефоне

### Для администратора (админ-панель)
- **JWT-авторизация**
- **Список приглашений** с таблицей:
  - Название, дата создания, статус
  - Количество просмотров и ответов
- **Создание/редактирование** приглашений:
  - Название, заголовок, текст приветствия
  - URL GIF-анимации
  - Произвольное количество дат и мест
- **Статистика** по каждому приглашению:
  - Просмотры, ответы, конверсия
  - Разбивка по датам и местам
  - Список всех ответов с временем

---

## 🛠 Технологический стек

| Слой | Технологии |
|------|-----------|
| **Frontend** | Vue 3, TypeScript, Vite, Pinia, Vue Router, Axios |
| **UI** | Tailwind CSS, Headless UI |
| **Backend** | Node.js, NestJS, TypeScript |
| **База данных** | PostgreSQL |
| **ORM** | Prisma |
| **Аутентификация** | JWT |
| **Деплой** | Docker, Docker Compose |

---

## 📁 Структура проекта

```
project-date/
├── backend/                    # NestJS API
│   ├── prisma/
│   │   ├── schema.prisma       # Схема БД
│   │   └── seed.ts             # Демо-данные
│   ├── src/
│   │   ├── common/             # Guards, декораторы
│   │   ├── modules/
│   │   │   ├── auth/           # JWT-авторизация
│   │   │   ├── invitations/    # CRUD приглашений
│   │   │   ├── responses/      # Публичные ответы
│   │   │   └── analytics/      # Статистика
│   │   ├── prisma/             # PrismaService
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # Vue 3 SPA
│   ├── src/
│   │   ├── api/                # API-клиенты
│   │   ├── components/
│   │   │   └── invite/         # Шаги wizard
│   │   ├── composables/        # Хуки (плавающие сердечки)
│   │   ├── router/             # Маршрутизация
│   │   ├── stores/             # Pinia-сторы
│   │   ├── styles/             # Глобальные стили
│   │   └── views/
│   │       ├── invite/         # Публичное приглашение
│   │       └── admin/          # Админ-панель
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docs/
│   └── ARCHITECTURE.md         # Архитектурный документ
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Быстрый старт

### Вариант 1: Docker Compose (рекомендуется)

```bash
# 1. Клонируйте репозиторий
git clone <repo-url>
cd project-date

# 2. Создайте .env из примера
cp .env.example .env

# 3. Запустите все сервисы
docker-compose up --build
```

После запуска:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **Админ-панель**: http://localhost:8080/admin/login

> **Демо-доступ**: `admin@example.com` / `admin123`

### Сидирование базы данных (первый запуск)

Миграции применяются автоматически при старте backend-контейнера. Для создания администратора и демо-приглашения выполните seed **внутри контейнера** (это надёжнее, чем с хоста, т.к. избегает конфликтов портов с локальной PostgreSQL):

```bash
# Скомпилируйте seed в JS (из папки backend)
cd backend
npx tsc prisma/seed.ts --outDir /tmp/seed-compile --module commonjs --target es2021 --esModuleInterop --skipLibCheck

# Скопируйте и выполните внутри контейнера
docker cp /tmp/seed-compile/seed.js date-invitation-backend:/app/seed.js
docker exec date-invitation-backend node /app/seed.js
```

После этого будет доступен демо-администратор `admin@example.com` / `admin123` и демо-приглашение по ссылке `http://localhost:8080/invite/demo-invite-2026`.


### Вариант 2: Локальная разработка

#### Backend

```bash
cd backend

# Установка зависимостей
npm install

# Настройка окружения
cp .env.example .env
# Отредактируйте DATABASE_URL под вашу PostgreSQL

# Миграции и сиды
npx prisma migrate dev
npm run prisma:seed

# Запуск
npm run start:dev
```

#### Frontend

```bash
cd frontend

# Установка зависимостей
npm install

# Запуск dev-сервера (проксирует /api на localhost:3000)
npm run dev
```

Frontend: http://localhost:5173

---

## 🔌 REST API

| Метод | URL | Описание | Доступ |
|-------|-----|----------|--------|
| `POST` | `/api/auth/login` | Вход в систему | Публичный |
| `GET` | `/api/auth/me` | Текущий пользователь | JWT |
| `GET` | `/api/invitations` | Список приглашений | JWT |
| `POST` | `/api/invitations` | Создать приглашение | JWT |
| `GET` | `/api/invitations/:id` | Детали приглашения | JWT |
| `PATCH` | `/api/invitations/:id` | Обновить приглашение | JWT |
| `DELETE` | `/api/invitations/:id` | Удалить приглашение | JWT |
| `GET` | `/api/invite/:token` | Получить приглашение по токену | Публичный |
| `POST` | `/api/invite/:token/answer` | Отправить ответ | Публичный |
| `GET` | `/api/analytics/:id` | Статистика приглашения | JWT |

---

## 🗄 Модель данных

```
User
├── id, email, password (hash), name
└── createdAt

Invitation
├── id, title, headline, greetingText, gifUrl
├── token (уникальный, для публичной ссылки)
├── status (ACTIVE | ARCHIVED)
├── views (счётчик просмотров)
├── createdAt, updatedAt
└── steps[] → InvitationStep

InvitationStep
├── id, type (DATE | PLACE), label, emoji, order
└── invitationId → Invitation

Answer
├── id
├── invitationId → Invitation
├── dateStepId → InvitationStep (DATE)
├── placeStepId → InvitationStep (PLACE)
└── createdAt
```

---

## 📚 Документация

Подробный архитектурный документ с обоснованием решений находится в [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## 🔮 Возможности масштабирования

- **Загрузка GIF-файлов** — сейчас GIF задаётся URL, можно добавить загрузку файлов (S3/MinIO)
- **Мульти-администраторы** — расширить модель User ролями
- **Email-уведомления** — отправка ссылки получателю по email
- **WebSocket** — live-обновление статистики
- **i18n** — поддержка нескольких языков
- **Rate limiting** — защита публичных эндпоинтов
- **Кэширование** — Redis для горячих данных
- **Тесты** — unit (Jest) и e2e (Supertest)

---

## 📄 Лицензия

MIT
