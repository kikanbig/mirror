import { Request, Response, NextFunction } from 'express';

const rateLimits = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(maxRequests: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = `${(req as any).telegramUser?.id || req.ip}-${req.path}`;
    const now = Date.now();
    const record = rateLimits.get(key);

    if (!record || now > record.resetTime) {
      rateLimits.set(key, { count: 1, resetTime: now + windowMs });
      next();
      return;
    }

    if (record.count >= maxRequests) {
      res.status(429).json({ message: 'Превышен лимит запросов. Попробуйте позже.' });
      return;
    }

    record.count++;
    next();
  };
}
