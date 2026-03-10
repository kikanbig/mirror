import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from './auth';

const prisma = new PrismaClient();

export interface PremiumStatus {
  tier: 'free' | 'premium';
  hasFateReport: boolean;
  premiumUntil: string | null;
}

export async function getPremiumStatus(telegramId: number): Promise<PremiumStatus> {
  const user = await prisma.user.findUnique({
    where: { telegramId: BigInt(telegramId) },
    include: {
      subscriptions: {
        where: { status: 'active', expiresAt: { gt: new Date() } },
        orderBy: { expiresAt: 'desc' },
        take: 1,
      },
      purchases: {
        where: { product: 'fate_report' },
        take: 1,
      },
    },
  });

  if (!user) return { tier: 'free', hasFateReport: false, premiumUntil: null };

  const activeSub = user.subscriptions[0];
  const hasFateReport = user.purchases.length > 0;

  // Also check legacy premiumUntil field
  const legacyPremium = user.premiumUntil && user.premiumUntil > new Date();

  const isPremium = !!activeSub || !!legacyPremium;
  const premiumUntil = activeSub?.expiresAt?.toISOString() ?? user.premiumUntil?.toISOString() ?? null;

  return {
    tier: isPremium ? 'premium' : 'free',
    hasFateReport,
    premiumUntil: isPremium ? premiumUntil : null,
  };
}

export function requirePremium(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.telegramUser) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  getPremiumStatus(req.telegramUser.id).then(status => {
    if (status.tier !== 'premium') {
      res.status(403).json({ message: 'Premium subscription required', tier: status.tier });
      return;
    }
    next();
  }).catch(() => {
    res.status(500).json({ message: 'Failed to check subscription' });
  });
}
