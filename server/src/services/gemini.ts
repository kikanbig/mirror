import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

const GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-2.0-flash-lite'];
const GROQ_MODEL = 'llama-3.3-70b-versatile';

async function callGemini(prompt: string): Promise<string> {
  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      console.log(`[AI] Gemini ${modelName} succeeded`);
      return result.response.text();
    } catch (err: any) {
      const status = err?.status;
      console.warn(`[AI] Gemini ${modelName}: ${status || err?.message}`);
      if (status !== 429 && status !== 503 && status !== 500) continue;
    }
  }
  throw new Error('All Gemini models failed');
}

async function callGroq(prompt: string): Promise<string> {
  const result = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
    max_tokens: 2048,
  });
  console.log('[AI] Groq succeeded');
  return result.choices[0]?.message?.content || '';
}

async function generateWithFallback(prompt: string): Promise<string> {
  try {
    return await callGemini(prompt);
  } catch (geminiErr: any) {
    console.warn(`[AI] Gemini failed, switching to Groq: ${geminiErr.message}`);
  }

  if (process.env.GROQ_API_KEY) {
    try {
      return await callGroq(prompt);
    } catch (groqErr: any) {
      console.warn(`[AI] Groq failed: ${groqErr.message}`);
    }
  }

  throw new Error('All AI providers failed');
}

const TAROT_SYSTEM_PROMPT = `Ты — мудрый и проницательный таролог с 30-летним опытом. Ты интерпретируешь расклады таро глубоко, эмпатично и с практической мудростью.

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
12. Отвечай на русском языке
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
}

export async function generateTarotInterpretation(req: TarotInterpretationRequest): Promise<string> {
  const cardsDescription = req.cards
    .map((c) => `- Позиция "${c.position}": ${c.cardName}${c.reversed ? ' (перевёрнута)' : ''}`)
    .join('\n');

  let prompt = `${TAROT_SYSTEM_PROMPT}\n\nРасклад: ${req.spreadType}\n\nКарты:\n${cardsDescription}`;

  if (req.question) prompt += `\n\nВопрос пользователя: ${req.question}`;
  if (req.area) prompt += `\n\nОбласть вопроса: ${req.area}`;
  if (req.userProfile?.zodiacSign) prompt += `\n\nЗнак зодиака: ${req.userProfile.zodiacSign}`;
  if (req.userProfile?.lifePathNumber) prompt += `\n\nЧисло Жизненного Пути: ${req.userProfile.lifePathNumber}`;
  if (req.userProfile?.moonPhase) prompt += `\n\nТекущая фаза луны: ${req.userProfile.moonPhase}`;

  return generateWithFallback(prompt);
}

export async function generateSynthesis(data: {
  card: string;
  rune: string;
  zodiac: string;
  lifePathNumber: number;
  moonPhase: string;
  personalYear: number;
}): Promise<string> {
  const prompt = `Ты — мудрый оракул, объединяющий знания таро, рун, нумерологии и астрологии. Создай единое глубокое предсказание на основе всех данных.

Данные:
- Карта таро: ${data.card}
- Руна: ${data.rune}
- Знак зодиака: ${data.zodiac}
- Число Жизненного Пути: ${data.lifePathNumber}
- Фаза луны: ${data.moonPhase}
- Персональный год: ${data.personalYear}

Создай ЕДИНУЮ интерпретацию, объединяющую все системы. Покажи, как они перекликаются и дополняют друг друга. Дай практический совет и вдохновляющее послание. Отвечай на русском. 300-500 слов.`;

  return generateWithFallback(prompt);
}
