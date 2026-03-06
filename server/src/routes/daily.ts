import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/card', async (req: AuthRequest, res) => {
  try {
    const userId = req.telegramUser!.id;
    const today = new Date().toISOString().split('T')[0];

    let hash = 0;
    const str = `${userId}-${today}`;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    const seed = Math.abs(hash);

    const cardIndex = seed % 78;
    const reversed = seed % 3 === 0;

    res.json({
      cardIndex,
      reversed,
      date: today,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/moon', async (_req, res) => {
  const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0);
  const LUNATION_CYCLE = 29.530588853;

  const now = new Date();
  const diffMs = now.getTime() - KNOWN_NEW_MOON;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const age = ((diffDays % LUNATION_CYCLE) + LUNATION_CYCLE) % LUNATION_CYCLE;
  const fraction = age / LUNATION_CYCLE;
  const illumination = (1 - Math.cos(2 * Math.PI * fraction)) / 2;

  let phase: string;
  if (fraction < 0.0625) phase = 'new_moon';
  else if (fraction < 0.1875) phase = 'waxing_crescent';
  else if (fraction < 0.3125) phase = 'first_quarter';
  else if (fraction < 0.4375) phase = 'waxing_gibbous';
  else if (fraction < 0.5625) phase = 'full_moon';
  else if (fraction < 0.6875) phase = 'waning_gibbous';
  else if (fraction < 0.8125) phase = 'last_quarter';
  else if (fraction < 0.9375) phase = 'waning_crescent';
  else phase = 'new_moon';

  res.json({
    phase,
    illumination: Math.round(illumination * 100),
    age: Math.round(age * 10) / 10,
    isWaxing: fraction < 0.5,
  });
});

export { router as dailyRouter };
