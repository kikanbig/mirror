import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';
import { generateTarotInterpretation, generateSynthesis, generateRuneInterpretation } from '../services/gemini';

const router = Router();

router.use(authMiddleware);

router.post('/', rateLimit(5, 60 * 60 * 1000), async (req: AuthRequest, res) => {
  try {
    const { spreadType, cards, question, area, userProfile, lang } = req.body;

    const interpretation = await generateTarotInterpretation({
      spreadType,
      cards,
      question,
      area,
      userProfile,
      telegramId: req.telegramUser?.id,
      lang: lang || req.botLang || 'ru',
    });

    res.json({ interpretation });
  } catch (error) {
    console.error('Interpretation error:', error);
    res.status(500).json({ message: 'Generation error. Please try again later.' });
  }
});

router.post('/synthesis', rateLimit(1, 7 * 24 * 60 * 60 * 1000), async (req: AuthRequest, res) => {
  try {
    const { card, rune, zodiac, lifePathNumber, moonPhase, personalYear, lang } = req.body;

    const interpretation = await generateSynthesis({
      card,
      rune,
      zodiac,
      lifePathNumber,
      moonPhase,
      personalYear,
      telegramId: req.telegramUser?.id,
      lang: lang || req.botLang || 'ru',
    });

    res.json({ interpretation });
  } catch (error) {
    console.error('Synthesis error:', error);
    res.status(500).json({ message: 'Generation error. Please try again later.' });
  }
});

router.post('/runes', rateLimit(5, 60 * 60 * 1000), async (req: AuthRequest, res) => {
  try {
    const { spread, runes, lang } = req.body;

    const interpretation = await generateRuneInterpretation({
      spread,
      runes,
      telegramId: req.telegramUser?.id,
      lang: lang || req.botLang || 'ru',
    });

    res.json({ interpretation });
  } catch (error) {
    console.error('Rune interpretation error:', error);
    res.status(500).json({ message: 'Generation error. Please try again later.' });
  }
});

export { router as interpretRouter };
