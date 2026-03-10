import { Telegraf, Markup } from 'telegraf';
import { PrismaClient } from '@prisma/client';
import type { Express } from 'express';

const prisma = new PrismaClient();

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

  bot.telegram.setChatMenuButton({
    menuButton: {
      type: 'web_app',
      text: '🔮 Открыть',
      web_app: { url: WEBAPP_URL },
    },
  }).then(() => console.log('[Bot] Menu button set'))
    .catch((err: Error) => console.warn('[Bot] setChatMenuButton failed:', err.message));

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

  // ── Payment handlers ──
  bot.on('pre_checkout_query', async (ctx) => {
    try {
      await ctx.answerPreCheckoutQuery(true);
      console.log('[Bot] Pre-checkout approved:', ctx.preCheckoutQuery.id);
    } catch (err) {
      console.error('[Bot] Pre-checkout error:', err);
    }
  });

  bot.on('message', async (ctx, next) => {
    const msg = ctx.message;
    if (!('successful_payment' in msg)) return next();

    const payment = msg.successful_payment;
    console.log('[Bot] Successful payment:', JSON.stringify(payment));

    try {
      const payload = JSON.parse(payment.invoice_payload) as {
        product: string;
        telegramId: number;
      };

      const user = await prisma.user.findUnique({
        where: { telegramId: BigInt(payload.telegramId) },
      });

      if (!user) {
        console.error('[Bot] Payment user not found:', payload.telegramId);
        return;
      }

      if (payload.product === 'premium_month') {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        await prisma.subscription.create({
          data: {
            userId: user.id,
            type: 'premium',
            status: 'active',
            expiresAt,
            telegramPayId: payment.telegram_payment_charge_id,
            amount: payment.total_amount,
          },
        });

        await prisma.user.update({
          where: { id: user.id },
          data: { premiumUntil: expiresAt },
        });

        await ctx.reply(
          '✅ *Premium активирован!*\n\n' +
          'Теперь вам доступны все расклады, полная нумерология, ' +
          'матрица судьбы и AI-интерпретации без ограничений.\n\n' +
          `Действует до: ${expiresAt.toLocaleDateString('ru-RU')}`,
          { parse_mode: 'Markdown' }
        );
      } else if (payload.product === 'fate_report') {
        await prisma.purchase.create({
          data: {
            userId: user.id,
            product: 'fate_report',
            telegramPayId: payment.telegram_payment_charge_id,
            amount: payment.total_amount,
          },
        });

        await ctx.reply(
          '✅ *Полный отчёт Матрицы Судьбы оплачен!*\n\n' +
          'Откройте раздел Нумерологии, введите дату рождения ' +
          'и нажмите «Получить полный отчёт» для генерации.',
          { parse_mode: 'Markdown' }
        );
      }
    } catch (err) {
      console.error('[Bot] Payment processing error:', err);
    }
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
