import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, type AuthRequest } from '../middleware/auth';
import { getPremiumStatus } from '../middleware/premium';

const router = Router();
const prisma = new PrismaClient();

const PRODUCTS = {
  premium_month: {
    title: 'Premium подписка (1 месяц)',
    description: 'Все расклады, полная нумерология, матрица судьбы, AI-интерпретации без лимитов',
    amount: 149,
    durationDays: 30,
  },
  fate_report: {
    title: 'Полный отчёт Матрицы Судьбы',
    description: 'Персональный отчёт на 50+ страниц — таланты, предназначение, здоровье, карма, отношения, деньги и многое другое. Сохраняется навсегда.',
    amount: 499,
    durationDays: null,
  },
};

// GET /api/payments/status
router.get('/status', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const status = await getPremiumStatus(req.telegramUser!.id);
    res.json(status);
  } catch (err) {
    console.error('[Payments] Status error:', err);
    res.status(500).json({ message: 'Failed to get status' });
  }
});

// POST /api/payments/create-invoice
router.post('/create-invoice', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { product } = req.body as { product: string };
    const productInfo = PRODUCTS[product as keyof typeof PRODUCTS];

    if (!productInfo) {
      res.status(400).json({ message: 'Invalid product' });
      return;
    }

    const BOT_TOKEN = process.env.BOT_TOKEN;
    if (!BOT_TOKEN) {
      res.status(500).json({ message: 'Bot not configured' });
      return;
    }

    // Create invoice via Telegram Bot API (Stars)
    const invoicePayload = JSON.stringify({
      product,
      telegramId: req.telegramUser!.id,
      ts: Date.now(),
    });

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: productInfo.title,
        description: productInfo.description,
        payload: invoicePayload,
        currency: 'XTR',
        prices: [{ label: productInfo.title, amount: productInfo.amount }],
      }),
    });

    const data = await response.json() as { ok: boolean; result?: string; description?: string };

    if (!data.ok) {
      console.error('[Payments] Invoice creation failed:', data);
      res.status(500).json({ message: data.description || 'Failed to create invoice' });
      return;
    }

    res.json({ invoiceUrl: data.result });
  } catch (err) {
    console.error('[Payments] Create invoice error:', err);
    res.status(500).json({ message: 'Failed to create invoice' });
  }
});

// POST /api/payments/verify — called by client after successful payment
router.post('/verify', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const status = await getPremiumStatus(req.telegramUser!.id);
    res.json(status);
  } catch (err) {
    console.error('[Payments] Verify error:', err);
    res.status(500).json({ message: 'Failed to verify' });
  }
});

export { router as paymentsRouter, PRODUCTS };
