import { Telegraf, Markup } from 'telegraf';
import type { Express } from 'express';

export function setupBot(app: Express) {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  if (!BOT_TOKEN) {
    console.warn('[Bot] BOT_TOKEN not set, skipping');
    return;
  }

  const bot = new Telegraf(BOT_TOKEN);
  const WEBAPP_URL = process.env.WEBAPP_URL || `https://${process.env.RAILWAY_PUBLIC_DOMAIN || 'localhost:3000'}`;
  const WEBHOOK_DOMAIN = process.env.RAILWAY_PUBLIC_DOMAIN || process.env.WEBAPP_URL?.replace('https://', '');
  const WEBHOOK_PATH = `/bot${BOT_TOKEN}`;

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

  if (WEBHOOK_DOMAIN && process.env.NODE_ENV === 'production') {
    const webhookUrl = `https://${WEBHOOK_DOMAIN}${WEBHOOK_PATH}`;
    app.use(WEBHOOK_PATH, (req, res) => bot.handleUpdate(req.body, res));
    bot.telegram.setWebhook(webhookUrl)
      .then(() => console.log(`[Bot] Webhook set: ${webhookUrl}`))
      .catch((err: Error) => console.error('[Bot] Webhook failed:', err.message));
  } else {
    bot.launch()
      .then(() => console.log('[Bot] Long-polling started'))
      .catch((err: Error) => console.error('[Bot] Launch failed:', err.message));
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  }
}
