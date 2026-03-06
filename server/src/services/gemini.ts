import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const MODELS = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash'];

async function callWithRetry(prompt: string, maxRetries = 3): Promise<string> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    for (const modelName of MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch (err: any) {
        const is429 = err?.status === 429 || err?.message?.includes('429');
        console.warn(`[Gemini] ${modelName} attempt ${attempt + 1} failed:`, is429 ? '429 rate limit' : err?.message);

        if (is429 && modelName === MODELS[MODELS.length - 1] && attempt < maxRetries - 1) {
          const delay = Math.min(5000 * (attempt + 1), 20000);
          console.log(`[Gemini] Waiting ${delay}ms before retry...`);
          await new Promise((r) => setTimeout(r, delay));
        }

        if (!is429) throw err;
      }
    }
  }
  throw new Error('All Gemini models exhausted after retries');
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

  return callWithRetry(prompt);
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

  return callWithRetry(prompt);
}
