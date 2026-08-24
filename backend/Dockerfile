# ============================================================
# Dockerfile для backend (NestJS)
# Multi-stage build: build → production
#
# Используем Debian-based образ (node:20-slim) вместо Alpine,
# потому что Prisma engine и NestJS/TypeScript работают
# надёжнее на glibc, чем на musl (Alpine).
# ============================================================

# ---------- Stage 1: Build ----------
FROM node:20-slim AS builder

WORKDIR /app

# Устанавливаем OpenSSL (требуется для Prisma engine)
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# Копируем package.json, lock-файлы и .npmrc
COPY package*.json ./
COPY .npmrc ./

# Устанавливаем зависимости (включая devDependencies для сборки)
# --fetch-retries и --network-concurrency повышают устойчивость
# к временным сетевым сбоям (ECONNRESET) при загрузке пакетов
RUN npm ci --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000 --network-concurrency=4


# Копируем исходники
COPY . .

# Генерируем Prisma client
RUN npx prisma generate

# Собираем приложение
RUN npm run build

# ---------- Stage 2: Production ----------
FROM node:20-slim AS production

WORKDIR /app

ENV NODE_ENV=production

# Устанавливаем OpenSSL (требуется для Prisma engine)
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# Копируем package.json и .npmrc
COPY package*.json ./
COPY .npmrc ./

# Устанавливаем только production-зависимости
# --fetch-retries и --network-concurrency повышают устойчивость
# к временным сетевым сбоям (ECONNRESET) при загрузке пакетов
RUN npm ci --omit=dev --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000 --network-concurrency=4


# Копируем собранное приложение
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
