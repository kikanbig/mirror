import { Telegraf, Markup } from 'telegraf';
import { PrismaClient } from '@prisma/client';
import type { Express } from 'express';
import { getAllBotTokens } from './middleware/auth';

const prisma = new PrismaClient();

type Lang = 'ru' | 'en' | 'es';

const MESSAGES: Record<Lang, {
  commands: { command: string; description: string }[];
  description: string;
  shortDescription: string;
  menuButton: string;
  start: string;
  startBtn: string;
  daily: string;
  dailyBtn: string;
  tarot: string;
  tarotBtn: string;
  help: string;
  premiumActivated: (date: string) => string;
  reportPurchased: string;
}> = {
  ru: {
    commands: [
      { command: 'start', description: 'Открыть NUMA — таро, руны, нумерология' },
      { command: 'daily', description: 'Карта дня — ежедневное предсказание таро' },
      { command: 'tarot', description: 'Гадание на таро — 7 раскладов с ИИ толкованием' },
      { command: 'help', description: 'Помощь — все функции и возможности' },
    ],
    description:
      'NUMA — Числа. Карты. Ты.\n\n' +
      'Мистическое приложение для самопознания и предсказаний с ИИ.\n\n' +
      '🃏 Гадание на таро — 7 типов раскладов с умной интерпретацией\n' +
      'ᚱ Гадание на рунах — древняя мудрость Футарка\n' +
      '🔢 Нумерология — расчёт числа судьбы, души и жизненного пути\n' +
      '🌙 Лунный календарь — фазы луны и их влияние\n' +
      '✨ Синтез Судьбы — объединение таро, рун, астрологии и нумерологии\n' +
      '📔 Дневник предсказаний — история всех ваших гаданий\n\n' +
      'Бесплатно • Без рекламы • Ежедневные предсказания',
    shortDescription: 'NUMA: Числа. Карты. Ты. — таро, руны, нумерология и астрология с ИИ',
    menuButton: '🔮 Открыть',
    start:
      '🔮 *Добро пожаловать в NUMA!*\n\n' +
      '_Числа. Карты. Ты._\n\n' +
      '🃏 *Таро* — 7 типов раскладов с глубокой интерпретацией\n' +
      'ᚱ *Руны* — древняя мудрость Старшего Футарка\n' +
      '🔢 *Нумерология* — числа судьбы, души и жизненного пути\n' +
      '🌙 *Лунный календарь* — фазы луны и их влияние\n' +
      '✨ *Синтез Судьбы* — уникальное предсказание из всех систем\n\n' +
      '📔 Все ваши гадания сохраняются в личном дневнике.\n\n' +
      'Нажмите кнопку, чтобы начать:',
    startBtn: '🔮 Открыть NUMA',
    daily:
      '🃏 *Карта дня ждёт вас!*\n\n' +
      'Каждый день Вселенная посылает вам послание через одну карту Таро.\n' +
      'Откройте приложение и узнайте, что приготовил для вас сегодняшний день:',
    dailyBtn: '🃏 Узнать карту дня',
    tarot:
      '🃏 *Гадание на Таро*\n\n' +
      'Выберите один из 7 раскладов:\n' +
      '• Одна карта — быстрый ответ\n' +
      '• Три карты — прошлое, настоящее, будущее\n' +
      '• Кельтский крест — глубокий анализ\n' +
      '• И другие...\n\n' +
      'ИИ-таролог даст подробную интерпретацию:',
    tarotBtn: '🃏 Начать гадание',
    help:
      '🔮 *NUMA — Помощь*\n\n' +
      '📋 *Команды:*\n' +
      '/start — Открыть приложение\n' +
      '/daily — Карта дня\n' +
      '/tarot — Гадание на таро\n' +
      '/help — Эта справка\n\n' +
      '✨ *Все возможности:*\n' +
      '• 🃏 Гадание на таро — 7 раскладов с ИИ интерпретацией\n' +
      '• ᚱ Гадание на рунах — Старший Футарк\n' +
      '• 🔢 Нумерология — расчёт по дате рождения\n' +
      '• 🌙 Лунный календарь — текущая фаза\n' +
      '• ✨ Синтез Судьбы — все системы в одном предсказании\n' +
      '• 📔 Дневник — история всех ваших гаданий\n\n' +
      '💡 *Совет:* Делайте карту дня каждое утро!',
    premiumActivated: (d) =>
      '✅ *Premium активирован!*\n\n' +
      'Теперь вам доступны все расклады, полная нумерология, ' +
      `матрица судьбы и AI-интерпретации без ограничений.\n\nДействует до: ${d}`,
    reportPurchased:
      '✅ *Полный отчёт Матрицы Судьбы оплачен!*\n\n' +
      'Откройте раздел Нумерологии, введите дату рождения ' +
      'и нажмите «Получить полный отчёт» для генерации.',
  },
  en: {
    commands: [
      { command: 'start', description: 'Open NUMA — tarot, runes, numerology' },
      { command: 'daily', description: 'Card of the Day — daily tarot prediction' },
      { command: 'tarot', description: 'Tarot reading — 7 spreads with AI interpretation' },
      { command: 'help', description: 'Help — all features and capabilities' },
    ],
    description:
      'NUMA — Numbers. Cards. You.\n\n' +
      'A mystical self-discovery and AI-powered prediction app.\n\n' +
      '🃏 Tarot — 7 types of spreads with smart interpretation\n' +
      'ᚱ Runes — ancient Elder Futhark wisdom\n' +
      '🔢 Numerology — life path, soul & destiny numbers\n' +
      '🌙 Lunar calendar — moon phases and their influence\n' +
      '✨ Fate Synthesis — tarot, runes, astrology & numerology combined\n' +
      '📔 Prediction journal — history of all your readings\n\n' +
      'Free • No ads • Daily predictions',
    shortDescription: 'NUMA: Numbers. Cards. You. — tarot, runes, numerology & astrology with AI',
    menuButton: '🔮 Open',
    start:
      '🔮 *Welcome to NUMA!*\n\n' +
      '_Numbers. Cards. You._\n\n' +
      '🃏 *Tarot* — 7 spreads with deep AI interpretation\n' +
      'ᚱ *Runes* — ancient Elder Futhark wisdom\n' +
      '🔢 *Numerology* — life path, soul & destiny numbers\n' +
      '🌙 *Lunar calendar* — moon phases and their influence\n' +
      '✨ *Fate Synthesis* — a unique prediction combining all systems\n\n' +
      '📔 All your readings are saved in your personal journal.\n\n' +
      'Tap the button to begin:',
    startBtn: '🔮 Open NUMA',
    daily:
      '🃏 *Your Card of the Day awaits!*\n\n' +
      'Every day the Universe sends you a message through a Tarot card.\n' +
      'Open the app and discover what today holds for you:',
    dailyBtn: '🃏 Reveal card of the day',
    tarot:
      '🃏 *Tarot Reading*\n\n' +
      'Choose from 7 spreads:\n' +
      '• Single card — quick answer\n' +
      '• Three cards — past, present, future\n' +
      '• Celtic Cross — deep analysis\n' +
      '• And more...\n\n' +
      'AI reader will give you a detailed interpretation:',
    tarotBtn: '🃏 Start reading',
    help:
      '🔮 *NUMA — Help*\n\n' +
      '📋 *Commands:*\n' +
      '/start — Open the app\n' +
      '/daily — Card of the Day\n' +
      '/tarot — Tarot reading\n' +
      '/help — This help\n\n' +
      '✨ *All features:*\n' +
      '• 🃏 Tarot — 7 spreads with AI interpretation\n' +
      '• ᚱ Runes — Elder Futhark\n' +
      '• 🔢 Numerology — birth date calculations\n' +
      '• 🌙 Lunar calendar — current phase\n' +
      '• ✨ Fate Synthesis — all systems in one prediction\n' +
      '• 📔 Journal — history of all readings\n\n' +
      '💡 *Tip:* Draw your daily card every morning!',
    premiumActivated: (d) =>
      '✅ *Premium activated!*\n\n' +
      'You now have access to all spreads, full numerology, ' +
      `fate matrix and unlimited AI interpretations.\n\nValid until: ${d}`,
    reportPurchased:
      '✅ *Fate Matrix Report purchased!*\n\n' +
      'Open the Numerology section, enter your birth date ' +
      'and tap "Generate report" to create it.',
  },
  es: {
    commands: [
      { command: 'start', description: 'Abrir NUMA — tarot, runas, numerología' },
      { command: 'daily', description: 'Carta del Día — predicción diaria de tarot' },
      { command: 'tarot', description: 'Lectura de tarot — 7 tiradas con interpretación IA' },
      { command: 'help', description: 'Ayuda — todas las funciones y posibilidades' },
    ],
    description:
      'NUMA — Números. Cartas. Tú.\n\n' +
      'Una aplicación mística de autoconocimiento y predicciones con IA.\n\n' +
      '🃏 Tarot — 7 tipos de tiradas con interpretación inteligente\n' +
      'ᚱ Runas — sabiduría ancestral del Futhark Antiguo\n' +
      '🔢 Numerología — número del camino de vida, alma y destino\n' +
      '🌙 Calendario lunar — fases de la luna y su influencia\n' +
      '✨ Síntesis del Destino — tarot, runas, astrología y numerología combinados\n' +
      '📔 Diario de predicciones — historial de todas tus lecturas\n\n' +
      'Gratis • Sin anuncios • Predicciones diarias',
    shortDescription: 'NUMA: Números. Cartas. Tú. — tarot, runas, numerología y astrología con IA',
    menuButton: '🔮 Abrir',
    start:
      '🔮 *¡Bienvenido a NUMA!*\n\n' +
      '_Números. Cartas. Tú._\n\n' +
      '🃏 *Tarot* — 7 tiradas con interpretación profunda de IA\n' +
      'ᚱ *Runas* — sabiduría ancestral del Futhark Antiguo\n' +
      '🔢 *Numerología* — números del camino de vida, alma y destino\n' +
      '🌙 *Calendario lunar* — fases de la luna y su influencia\n' +
      '✨ *Síntesis del Destino* — una predicción única combinando todos los sistemas\n\n' +
      '📔 Todas tus lecturas se guardan en tu diario personal.\n\n' +
      'Toca el botón para comenzar:',
    startBtn: '🔮 Abrir NUMA',
    daily:
      '🃏 *¡Tu Carta del Día te espera!*\n\n' +
      'Cada día el Universo te envía un mensaje a través de una carta de Tarot.\n' +
      'Abre la app y descubre lo que te depara hoy:',
    dailyBtn: '🃏 Revelar carta del día',
    tarot:
      '🃏 *Lectura de Tarot*\n\n' +
      'Elige entre 7 tiradas:\n' +
      '• Una carta — respuesta rápida\n' +
      '• Tres cartas — pasado, presente, futuro\n' +
      '• Cruz Celta — análisis profundo\n' +
      '• Y más...\n\n' +
      'El lector de IA te dará una interpretación detallada:',
    tarotBtn: '🃏 Comenzar lectura',
    help:
      '🔮 *NUMA — Ayuda*\n\n' +
      '📋 *Comandos:*\n' +
      '/start — Abrir la aplicación\n' +
      '/daily — Carta del Día\n' +
      '/tarot — Lectura de tarot\n' +
      '/help — Esta ayuda\n\n' +
      '✨ *Todas las funciones:*\n' +
      '• 🃏 Tarot — 7 tiradas con interpretación IA\n' +
      '• ᚱ Runas — Futhark Antiguo\n' +
      '• 🔢 Numerología — cálculos por fecha de nacimiento\n' +
      '• 🌙 Calendario lunar — fase actual\n' +
      '• ✨ Síntesis del Destino — todos los sistemas en una predicción\n' +
      '• 📔 Diario — historial de todas tus lecturas\n\n' +
      '💡 *Consejo:* ¡Saca tu carta del día cada mañana!',
    premiumActivated: (d) =>
      '✅ *¡Premium activado!*\n\n' +
      'Ahora tienes acceso a todas las tiradas, numerología completa, ' +
      `matriz del destino e interpretaciones IA ilimitadas.\n\nVálido hasta: ${d}`,
    reportPurchased:
      '✅ *¡Informe de la Matriz del Destino comprado!*\n\n' +
      'Abre la sección de Numerología, ingresa tu fecha de nacimiento ' +
      'y toca "Generar informe" para crearlo.',
  },
};

function setupSingleBot(app: Express, token: string, lang: Lang) {
  const bot = new Telegraf(token);
  const WEBAPP_URL = process.env.WEBAPP_URL || `https://${process.env.RAILWAY_PUBLIC_DOMAIN || 'localhost:3000'}`;
  const WEBAPP_LANG = `${WEBAPP_URL}?lang=${lang}`;
  const WEBHOOK_DOMAIN = process.env.RAILWAY_PUBLIC_DOMAIN || process.env.WEBAPP_URL?.replace('https://', '');
  const WEBHOOK_PATH = `/bot${token}`;
  const msg = MESSAGES[lang];
  const dateLocale = lang === 'es' ? 'es-ES' : lang === 'en' ? 'en-US' : 'ru-RU';

  bot.telegram.setMyCommands(msg.commands)
    .catch((err: Error) => console.warn(`[Bot:${lang}] setMyCommands failed:`, err.message));

  bot.telegram.setMyDescription(msg.description)
    .catch((err: Error) => console.warn(`[Bot:${lang}] setMyDescription failed:`, err.message));

  bot.telegram.setMyShortDescription(msg.shortDescription)
    .catch((err: Error) => console.warn(`[Bot:${lang}] setMyShortDescription failed:`, err.message));

  bot.telegram.setChatMenuButton({
    menuButton: { type: 'web_app', text: msg.menuButton, web_app: { url: WEBAPP_LANG } },
  }).catch((err: Error) => console.warn(`[Bot:${lang}] setChatMenuButton failed:`, err.message));

  bot.start(async (ctx) => {
    await ctx.reply(msg.start, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([[Markup.button.webApp(msg.startBtn, WEBAPP_LANG)]]),
    });
  });

  bot.command('daily', async (ctx) => {
    await ctx.reply(msg.daily, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([[Markup.button.webApp(msg.dailyBtn, `${WEBAPP_LANG}&tab=home`)]]),
    });
  });

  bot.command('tarot', async (ctx) => {
    await ctx.reply(msg.tarot, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([[Markup.button.webApp(msg.tarotBtn, `${WEBAPP_LANG}&tab=tarot`)]]),
    });
  });

  bot.command('help', async (ctx) => {
    await ctx.reply(msg.help, { parse_mode: 'Markdown' });
  });

  bot.on('pre_checkout_query', async (ctx) => {
    try {
      await ctx.answerPreCheckoutQuery(true);
      console.log(`[Bot:${lang}] Pre-checkout approved:`, ctx.preCheckoutQuery.id);
    } catch (err) {
      console.error(`[Bot:${lang}] Pre-checkout error:`, err);
    }
  });

  bot.on('message', async (ctx, next) => {
    const m = ctx.message;
    if (!('successful_payment' in m)) return next();

    const payment = m.successful_payment;
    console.log(`[Bot:${lang}] Successful payment:`, JSON.stringify(payment));

    try {
      const payload = JSON.parse(payment.invoice_payload) as { product: string; telegramId: number };

      const user = await prisma.user.findUnique({
        where: { telegramId: BigInt(payload.telegramId) },
      });
      if (!user) {
        console.error(`[Bot:${lang}] Payment user not found:`, payload.telegramId);
        return;
      }

      if (payload.product === 'premium_month') {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        await prisma.subscription.create({
          data: {
            userId: user.id, type: 'premium', status: 'active', expiresAt,
            telegramPayId: payment.telegram_payment_charge_id, amount: payment.total_amount,
          },
        });
        await prisma.user.update({ where: { id: user.id }, data: { premiumUntil: expiresAt } });

        await ctx.reply(msg.premiumActivated(expiresAt.toLocaleDateString(dateLocale)), { parse_mode: 'Markdown' });
      } else if (payload.product === 'fate_report') {
        await prisma.purchase.create({
          data: {
            userId: user.id, product: 'fate_report',
            telegramPayId: payment.telegram_payment_charge_id, amount: payment.total_amount,
          },
        });
        await ctx.reply(msg.reportPurchased, { parse_mode: 'Markdown' });
      }
    } catch (err) {
      console.error(`[Bot:${lang}] Payment processing error:`, err);
    }
  });

  if (WEBHOOK_DOMAIN && process.env.NODE_ENV === 'production') {
    const webhookUrl = `https://${WEBHOOK_DOMAIN}${WEBHOOK_PATH}`;
    app.use(WEBHOOK_PATH, (req, res) => bot.handleUpdate(req.body, res));
    bot.telegram.setWebhook(webhookUrl)
      .then(() => console.log(`[Bot:${lang}] Webhook set: ${webhookUrl}`))
      .catch((err: Error) => console.error(`[Bot:${lang}] Webhook failed:`, err.message));
  } else {
    bot.launch()
      .then(() => console.log(`[Bot:${lang}] Long-polling started`))
      .catch((err: Error) => console.error(`[Bot:${lang}] Launch failed:`, err.message));
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  }
}

export function setupBot(app: Express) {
  const tokens = getAllBotTokens();
  if (tokens.length === 0) {
    console.warn('[Bot] No BOT_TOKEN set, skipping bot setup');
    return;
  }
  for (const { token, lang } of tokens) {
    setupSingleBot(app, token, lang as Lang);
  }
  console.log(`[Bot] Set up ${tokens.length} bot(s): ${tokens.map(t => t.lang).join(', ')}`);
}
