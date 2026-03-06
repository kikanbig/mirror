# 🔮 Зеркало Судьбы (Mirror of Fate)

Мистическое Telegram Mini App для самопознания и предсказаний.

## Функции

- 🃏 **Таро** — 78 карт, 7 типов раскладов с анимацией
- ᚱ **Руны** — 24 руны Старшего Футарка
- 🔢 **Нумерология** — полный расчёт по дате рождения и имени
- 🌙 **Лунный календарь** — фазы луны в реальном времени
- ✨ **Синтез Судьбы** — AI-интерпретация, объединяющая все системы
- 📔 **Дневник** — история всех предсказаний
- 🎮 **Геймификация** — уровни, XP, достижения

## Технический стек

**Frontend:** React 18, TypeScript, Vite, Framer Motion, Zustand, SCSS, Telegram Web App SDK

**Backend:** Node.js, Express, Prisma, PostgreSQL, Google Gemini AI

**Bot:** Telegraf

## Запуск

### Клиент
```bash
cd client
npm install
npm run dev
```

### Сервер
```bash
cd server
npm install
cp .env.example .env  # настройте переменные
npx prisma migrate dev
npm run dev
```

### Бот
```bash
cd bot
npm install
# Установите BOT_TOKEN в server/.env
npx ts-node src/bot.ts
```

## Структура

```
mirror-of-fate/
├── client/          # React Telegram Mini App
├── server/          # Express API + Prisma
├── bot/             # Telegram бот
└── README.md
```
