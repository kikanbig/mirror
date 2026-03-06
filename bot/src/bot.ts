import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error('BOT_TOKEN is required');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

const WEBAPP_URL = process.env.WEBAPP_URL || 'https://your-app.vercel.app';

bot.start(async (ctx) => {
  await ctx.reply(
    '🔮 *Добро пожаловать в Зеркало Судьбы!*\n\n' +
    '✨ Мистическое приложение для самопознания и предсказаний.\n\n' +
    '🃏 Таро • ᚱ Руны • 🔢 Нумерология • 🌙 Лунный календарь\n\n' +
    'Нажмите кнопку ниже, чтобы открыть приложение:',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.webApp('🔮 Открыть Зеркало Судьбы', WEBAPP_URL)],
      ]),
    }
  );
});

bot.command('daily', async (ctx) => {
  await ctx.reply(
    '🃏 *Карта дня ждёт вас!*\n\nОткройте приложение, чтобы узнать послание Вселенной:',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.webApp('🃏 Узнать карту дня', `${WEBAPP_URL}?tab=home`)],
      ]),
    }
  );
});

bot.command('tarot', async (ctx) => {
  await ctx.reply(
    '🃏 *Гадание на Таро*\n\nВыберите расклад и получите предсказание:',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.webApp('🃏 Начать гадание', `${WEBAPP_URL}?tab=tarot`)],
      ]),
    }
  );
});

bot.command('help', async (ctx) => {
  await ctx.reply(
    '🔮 *Зеркало Судьбы — Помощь*\n\n' +
    '📋 Доступные команды:\n' +
    '/start — Открыть приложение\n' +
    '/daily — Карта дня\n' +
    '/tarot — Гадание на таро\n' +
    '/help — Эта справка\n\n' +
    '✨ Функции приложения:\n' +
    '• 🃏 Гадание на таро (7 типов раскладов)\n' +
    '• ᚱ Гадание на рунах\n' +
    '• 🔢 Нумерологический расчёт\n' +
    '• 🌙 Лунный календарь\n' +
    '• 📔 Дневник предсказаний\n' +
    '• ✨ Синтез Судьбы\n' +
    '• 🧘 Медитации',
    { parse_mode: 'Markdown' }
  );
});

bot.launch()
  .then(() => console.log('Bot started'))
  .catch(console.error);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
