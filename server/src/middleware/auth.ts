import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const BOT_TOKEN = process.env.BOT_TOKEN || '';

export function validateTelegramData(initData: string, botToken: string): { valid: boolean; user?: any } {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) return { valid: false };

    params.delete('hash');

    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (calculatedHash !== hash) return { valid: false };

    const userParam = params.get('user');
    const user = userParam ? JSON.parse(userParam) : null;

    return { valid: true, user };
  } catch {
    return { valid: false };
  }
}

export interface AuthRequest extends Request {
  telegramUser?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const initData = req.headers['x-telegram-init-data'] as string;

  if (process.env.NODE_ENV === 'development' && !initData) {
    req.telegramUser = { id: 12345, first_name: 'Dev' };
    next();
    return;
  }

  if (!initData) {
    res.status(401).json({ message: 'Missing init data' });
    return;
  }

  const result = validateTelegramData(initData, BOT_TOKEN);
  if (!result.valid || !result.user) {
    res.status(401).json({ message: 'Invalid init data' });
    return;
  }

  req.telegramUser = result.user;
  next();
}
