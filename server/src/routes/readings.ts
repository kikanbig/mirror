import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

router.post('/tarot', rateLimit(10, 60 * 60 * 1000), async (req: AuthRequest, res) => {
  try {
    const { spreadType, question, cards, mood, area } = req.body;

    const user = await prisma.user.findUnique({
      where: { telegramId: BigInt(req.telegramUser!.id) },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const reading = await prisma.reading.create({
      data: {
        userId: user.id,
        type: 'TAROT',
        spreadType,
        question,
        cards,
        mood,
        area,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { experience: user.experience + 25 },
    });

    res.json(reading);
  } catch (error) {
    console.error('Reading error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/runes', rateLimit(10, 60 * 60 * 1000), async (req: AuthRequest, res) => {
  try {
    const { spreadType, question, cards } = req.body;

    const user = await prisma.user.findUnique({
      where: { telegramId: BigInt(req.telegramUser!.id) },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const reading = await prisma.reading.create({
      data: {
        userId: user.id,
        type: 'RUNES',
        spreadType,
        question,
        cards,
      },
    });

    res.json(reading);
  } catch (error) {
    console.error('Runes reading error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/', async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { telegramId: BigInt(req.telegramUser!.id) },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const readings = await prisma.reading.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json(readings);
  } catch (error) {
    console.error('Readings list error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const reading = await prisma.reading.findUnique({
      where: { id: req.params.id },
    });

    if (!reading) {
      res.status(404).json({ message: 'Reading not found' });
      return;
    }

    res.json(reading);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:id/bookmark', async (req: AuthRequest, res) => {
  try {
    const reading = await prisma.reading.update({
      where: { id: req.params.id },
      data: { isBookmarked: req.body.isBookmarked ?? true },
    });

    res.json(reading);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:id/note', async (req: AuthRequest, res) => {
  try {
    const reading = await prisma.reading.update({
      where: { id: req.params.id },
      data: { userNotes: req.body.note },
    });

    res.json(reading);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { router as readingsRouter };
