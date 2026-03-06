import { Telegraf, Markup } from 'telegraf';

export function startBot() {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  if (!BOT_TOKEN) {
    console.warn('BOT_TOKEN not set, skipping bot startup');
    return;
  }

  const bot = new Telegraf(BOT_TOKEN);
  const WEBAPP_URL = process.env.WEBAPP_URL || `https://${process.env.RAILWAY_PUBLIC_DOMAIN || 'localhost:3000'}`;

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
      '• ✨ Синтез Судьбы',
      { parse_mode: 'Markdown' }
    );
  });

  bot.launch()
    .then(() => console.log('Telegram bot started'))
    .catch((err) => console.error('Bot launch failed:', err));

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
