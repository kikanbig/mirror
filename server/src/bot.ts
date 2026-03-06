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

  bot.telegram.setMyCommands([
    { command: 'start', description: 'Открыть Зеркало Судьбы — таро, руны, нумерология' },
    { command: 'daily', description: 'Карта дня — ежедневное предсказание таро' },
    { command: 'tarot', description: 'Гадание на таро — 7 раскладов с ИИ толкованием' },
    { command: 'help', description: 'Помощь — все функции и возможности' },
  ]).catch((err: Error) => console.warn('[Bot] setMyCommands failed:', err.message));

  bot.telegram.setMyDescription(
    'Зеркало Судьбы — мистическое приложение для самопознания и предсказаний с ИИ.\n\n' +
    '🃏 Гадание на таро — 7 типов раскладов с умной интерпретацией\n' +
    'ᚱ Гадание на рунах — древняя мудрость Футарка\n' +
    '🔢 Нумерология — расчёт числа судьбы, души и жизненного пути\n' +
    '🌙 Лунный календарь — фазы луны и их влияние\n' +
    '✨ Синтез Судьбы — объединение таро, рун, астрологии и нумерологии\n' +
    '📔 Дневник предсказаний — история всех ваших гаданий\n\n' +
    'Бесплатно • Без рекламы • Ежедневные предсказания'
  ).catch((err: Error) => console.warn('[Bot] setMyDescription failed:', err.message));

  bot.telegram.setMyShortDescription(
    'Таро, руны, нумерология и астрология с ИИ — бесплатные предсказания каждый день'
  ).catch((err: Error) => console.warn('[Bot] setMyShortDescription failed:', err.message));

  bot.start(async (ctx) => {
    await ctx.reply(
      '🔮 *Добро пожаловать в Зеркало Судьбы!*\n\n' +
      '✨ Мистическое приложение для самопознания и предсказаний с искусственным интеллектом.\n\n' +
      '🃏 *Таро* — 7 типов раскладов с глубокой интерпретацией\n' +
      'ᚱ *Руны* — древняя мудрость Старшего Футарка\n' +
      '🔢 *Нумерология* — числа судьбы, души и жизненного пути\n' +
      '🌙 *Лунный календарь* — фазы луны и их влияние\n' +
      '✨ *Синтез Судьбы* — уникальное предсказание из всех систем\n\n' +
      '📔 Все ваши гадания сохраняются в личном дневнике.\n\n' +
      'Нажмите кнопку, чтобы начать:',
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
      '🃏 *Карта дня ждёт вас!*\n\n' +
      'Каждый день Вселенная посылает вам послание через одну карту Таро.\n' +
      'Откройте приложение и узнайте, что приготовил для вас сегодняшний день:',
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
      '🃏 *Гадание на Таро*\n\n' +
      'Выберите один из 7 раскладов:\n' +
      '• Одна карта — быстрый ответ\n' +
      '• Три карты — прошлое, настоящее, будущее\n' +
      '• Кельтский крест — глубокий анализ\n' +
      '• И другие...\n\n' +
      'ИИ-таролог даст подробную интерпретацию:',
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
      '📋 *Команды:*\n' +
      '/start — Открыть приложение\n' +
      '/daily — Карта дня (ежедневное предсказание)\n' +
      '/tarot — Гадание на таро (7 раскладов)\n' +
      '/help — Эта справка\n\n' +
      '✨ *Все возможности:*\n' +
      '• 🃏 Гадание на таро — 7 раскладов с ИИ интерпретацией\n' +
      '• ᚱ Гадание на рунах — Старший Футарк\n' +
      '• 🔢 Нумерология — расчёт по дате рождения\n' +
      '• 🌙 Лунный календарь — текущая фаза\n' +
      '• ✨ Синтез Судьбы — все системы в одном предсказании\n' +
      '• 📔 Дневник — история всех ваших гаданий\n\n' +
      '💡 *Совет:* Делайте карту дня каждое утро — ваш стрик покажет вашу приверженность!',
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
