import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { telegramId: BigInt(req.telegramUser!.id) },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ ...user, telegramId: user.telegramId.toString() });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/', async (req: AuthRequest, res) => {
  try {
    const { birthDate, birthTime, birthPlace, zodiacSign, lifePathNumber, soulNumber, destinyNumber, interests } = req.body;

    const user = await prisma.user.update({
      where: { telegramId: BigInt(req.telegramUser!.id) },
      data: {
        birthDate: birthDate ? new Date(birthDate) : undefined,
        birthTime,
        birthPlace,
        zodiacSign,
        lifePathNumber,
        soulNumber,
        destinyNumber,
        interests,
      },
    });

    res.json({ ...user, telegramId: user.telegramId.toString() });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { router as profileRouter };
