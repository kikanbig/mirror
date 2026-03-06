import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';
import { generateTarotInterpretation, generateSynthesis } from '../services/gemini';

const router = Router();

router.use(authMiddleware);

router.post('/', rateLimit(5, 60 * 60 * 1000), async (req: AuthRequest, res) => {
  try {
    const { spreadType, cards, question, area, userProfile } = req.body;

    const interpretation = await generateTarotInterpretation({
      spreadType,
      cards,
      question,
      area,
      userProfile,
    });

    res.json({ interpretation });
  } catch (error) {
    console.error('Interpretation error:', error);
    res.status(500).json({ message: 'Ошибка генерации интерпретации. Попробуйте позже.' });
  }
});

router.post('/synthesis', rateLimit(1, 7 * 24 * 60 * 60 * 1000), async (req: AuthRequest, res) => {
  try {
    const { card, rune, zodiac, lifePathNumber, moonPhase, personalYear } = req.body;

    const interpretation = await generateSynthesis({
      card,
      rune,
      zodiac,
      lifePathNumber,
      moonPhase,
      personalYear,
    });

    res.json({ interpretation });
  } catch (error) {
    console.error('Synthesis error:', error);
    res.status(500).json({ message: 'Ошибка генерации синтеза. Попробуйте позже.' });
  }
});

export { router as interpretRouter };
