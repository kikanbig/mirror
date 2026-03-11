import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

const GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-2.0-flash-lite'];
const GROQ_MODEL = 'llama-3.3-70b-versatile';

async function logApiCall(data: {
  provider: string;
  model: string;
  endpoint: string;
  success: boolean;
  latencyMs: number;
  promptLen: number;
  responseLen?: number;
  error?: string;
  telegramId?: number | bigint;
}) {
  try {
    await prisma.apiLog.create({
      data: {
        provider: data.provider,
        model: data.model,
        endpoint: data.endpoint,
        success: data.success,
        latencyMs: data.latencyMs,
        promptLen: data.promptLen,
        responseLen: data.responseLen || 0,
        error: data.error?.slice(0, 500),
        telegramId: data.telegramId ? BigInt(data.telegramId) : null,
      },
    });
  } catch (err) {
    console.warn('[ApiLog] Failed to write log:', (err as Error).message);
  }
}

async function callGemini(prompt: string, endpoint: string, telegramId?: number | bigint): Promise<string> {
  for (const modelName of GEMINI_MODELS) {
    const start = Date.now();
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const latency = Date.now() - start;
      console.log(`[AI] Gemini ${modelName} succeeded (${latency}ms)`);

      await logApiCall({
        provider: 'gemini',
        model: modelName,
        endpoint,
        success: true,
        latencyMs: latency,
        promptLen: prompt.length,
        responseLen: text.length,
        telegramId,
      });

      return text;
    } catch (err: any) {
      const latency = Date.now() - start;
      const status = err?.status;
      const errMsg = `${status || err?.message}`;
      console.warn(`[AI] Gemini ${modelName}: ${errMsg}`);

      await logApiCall({
        provider: 'gemini',
        model: modelName,
        endpoint,
        success: false,
        latencyMs: latency,
        promptLen: prompt.length,
        error: errMsg,
        telegramId,
      });

      if (status !== 429 && status !== 503 && status !== 500) continue;
    }
  }
  throw new Error('All Gemini models failed');
}

async function callGroq(prompt: string, endpoint: string, telegramId?: number | bigint): Promise<string> {
  const start = Date.now();
  try {
    const result = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 2048,
    });
    const text = result.choices[0]?.message?.content || '';
    const latency = Date.now() - start;
    console.log(`[AI] Groq succeeded (${latency}ms)`);

    await logApiCall({
      provider: 'groq',
      model: GROQ_MODEL,
      endpoint,
      success: true,
      latencyMs: latency,
      promptLen: prompt.length,
      responseLen: text.length,
      telegramId,
    });

    return text;
  } catch (err: any) {
    const latency = Date.now() - start;
    const errMsg = err?.message || 'Unknown error';
    console.warn(`[AI] Groq failed: ${errMsg}`);

    await logApiCall({
      provider: 'groq',
      model: GROQ_MODEL,
      endpoint,
      success: false,
      latencyMs: latency,
      promptLen: prompt.length,
      error: errMsg,
      telegramId,
    });

    throw err;
  }
}

async function generateWithFallback(prompt: string, endpoint: string, telegramId?: number | bigint): Promise<string> {
  try {
    return await callGemini(prompt, endpoint, telegramId);
  } catch (geminiErr: any) {
    console.warn(`[AI] Gemini failed, switching to Groq: ${geminiErr.message}`);
  }

  if (process.env.GROQ_API_KEY) {
    try {
      return await callGroq(prompt, endpoint, telegramId);
    } catch (groqErr: any) {
      console.warn(`[AI] Groq failed: ${groqErr.message}`);
    }
  }

  throw new Error('All AI providers failed');
}

const LANG_NAMES: Record<string, string> = { ru: 'Russian', en: 'English', es: 'Spanish' };

function langInstruction(lang: string): string {
  const name = LANG_NAMES[lang] || 'Russian';
  return lang === 'ru' ? 'Отвечай на русском языке' : `Respond in ${name}`;
}

const TAROT_SYSTEM_PROMPT = (lang: string) => `Ты — мудрый и проницательный таролог с 30-летним опытом. Ты интерпретируешь расклады таро глубоко, эмпатично и с практической мудростью.

Правила:
1. Начни с общей энергии расклада
2. Разбери каждую карту в контексте её позиции
3. Учитывай перевёрнутые карты
4. Учитывай взаимодействие между картами
5. Если есть вопрос пользователя — отвечай на него
6. Если предоставлены натальные данные — интегрируй их
7. Если указана фаза луны — учти её влияние
8. Дай конкретный практический совет
9. Заверши вдохновляющим посланием
10. Используй образный, но не перегруженный язык
11. НЕ давай медицинских, юридических или финансовых советов
12. ${langInstruction(lang)}
13. Длина ответа: 200-400 слов`;

interface TarotInterpretationRequest {
  spreadType: string;
  cards: Array<{
    position: string;
    cardName: string;
    reversed: boolean;
  }>;
  question?: string;
  area?: string;
  userProfile?: {
    zodiacSign?: string;
    lifePathNumber?: number;
    moonPhase?: string;
  };
  telegramId?: number | bigint;
  lang?: string;
}

export async function generateTarotInterpretation(req: TarotInterpretationRequest): Promise<string> {
  const lang = req.lang || 'ru';
  const reversed = lang === 'es' ? '(invertida)' : lang === 'en' ? '(reversed)' : '(перевёрнута)';

  const cardsDescription = req.cards
    .map((c) => `- "${c.position}": ${c.cardName}${c.reversed ? ' ' + reversed : ''}`)
    .join('\n');

  let prompt = `${TAROT_SYSTEM_PROMPT(lang)}\n\nРасклад: ${req.spreadType}\n\nКарты:\n${cardsDescription}`;

  if (req.question) prompt += `\n\nВопрос пользователя: ${req.question}`;
  if (req.area) prompt += `\n\nОбласть вопроса: ${req.area}`;
  if (req.userProfile?.zodiacSign) prompt += `\n\nЗнак зодиака: ${req.userProfile.zodiacSign}`;
  if (req.userProfile?.lifePathNumber) prompt += `\n\nЧисло Жизненного Пути: ${req.userProfile.lifePathNumber}`;
  if (req.userProfile?.moonPhase) prompt += `\n\nТекущая фаза луны: ${req.userProfile.moonPhase}`;

  return generateWithFallback(prompt, 'tarot', req.telegramId);
}

const RUNES_SYSTEM_PROMPT = (lang: string) => `Ты — древний рунический мудрец, знаток Старшего Футарка. Ты толкуешь расклады рун с глубокой мудростью, опираясь на скандинавскую традицию.

Правила:
1. Начни с общей энергии расклада
2. Разбери каждую руну в контексте её позиции
3. Перевёрнутые руны означают обратное или ослабленное значение
4. Покажи взаимосвязи между рунами
5. Дай конкретный практический совет
6. Заверши мудрым напутствием в духе скандинавских преданий
7. Используй образный, но не перегруженный язык
8. НЕ давай медицинских, юридических или финансовых советов
9. ${langInstruction(lang)}
10. Длина ответа: 200-400 слов`;

interface RuneInterpretationRequest {
  spread: string;
  runes: Array<{
    name: string;
    position: string;
    reversed: boolean;
  }>;
  telegramId?: number | bigint;
  lang?: string;
}

export async function generateRuneInterpretation(req: RuneInterpretationRequest): Promise<string> {
  const lang = req.lang || 'ru';
  const reversed = lang === 'es' ? '(invertida)' : lang === 'en' ? '(reversed)' : '(перевёрнута)';

  const runesDescription = req.runes
    .map((r) => `- "${r.position}": ${r.name}${r.reversed ? ' ' + reversed : ''}`)
    .join('\n');

  const prompt = `${RUNES_SYSTEM_PROMPT(lang)}\n\nРасклад: ${req.spread}\n\nРуны:\n${runesDescription}`;

  return generateWithFallback(prompt, 'runes', req.telegramId);
}

export async function generateSynthesis(data: {
  card: string;
  rune: string;
  zodiac: string;
  lifePathNumber: number;
  moonPhase: string;
  personalYear: number;
  telegramId?: number | bigint;
  lang?: string;
}): Promise<string> {
  const lang = data.lang || 'ru';
  const prompt = `Ты — мудрый оракул, объединяющий знания таро, рун, нумерологии и астрологии. Создай единое глубокое предсказание на основе всех данных.

Данные:
- Карта таро: ${data.card}
- Руна: ${data.rune}
- Знак зодиака: ${data.zodiac}
- Число Жизненного Пути: ${data.lifePathNumber}
- Фаза луны: ${data.moonPhase}
- Персональный год: ${data.personalYear}

Создай ЕДИНУЮ интерпретацию, объединяющую все системы. Покажи, как они перекликаются и дополняют друг друга. Дай практический совет и вдохновляющее послание. ${langInstruction(lang)}. 300-500 слов.`;

  return generateWithFallback(prompt, 'synthesis', data.telegramId);
}
