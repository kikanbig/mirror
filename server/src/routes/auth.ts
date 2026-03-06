import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { validateTelegramData } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.post('/validate', async (req, res) => {
  try {
    const { initData } = req.body;
    const botToken = process.env.BOT_TOKEN || '';

    const result = validateTelegramData(initData, botToken);
    if (!result.valid || !result.user) {
      res.status(401).json({ message: 'Invalid init data' });
      return;
    }

    const telegramUser = result.user;

    const user = await prisma.user.upsert({
      where: { telegramId: BigInt(telegramUser.id) },
      update: {
        username: telegramUser.username,
        firstName: telegramUser.first_name,
        lastActiveDate: new Date(),
      },
      create: {
        telegramId: BigInt(telegramUser.id),
        username: telegramUser.username,
        firstName: telegramUser.first_name,
        lastActiveDate: new Date(),
      },
    });

    res.json({
      user: {
        ...user,
        telegramId: user.telegramId.toString(),
      },
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { router as authRouter };
