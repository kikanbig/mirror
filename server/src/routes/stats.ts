import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (_req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    const [
      totalCalls,
      todayCalls,
      weekCalls,
      successCalls,
      failedCalls,
      byProvider,
      byEndpoint,
      todayByProvider,
      avgLatency,
      recentErrors,
    ] = await Promise.all([
      prisma.apiLog.count(),
      prisma.apiLog.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.apiLog.count({ where: { createdAt: { gte: weekStart } } }),
      prisma.apiLog.count({ where: { success: true } }),
      prisma.apiLog.count({ where: { success: false } }),
      prisma.apiLog.groupBy({
        by: ['provider'],
        _count: true,
        _avg: { latencyMs: true },
      }),
      prisma.apiLog.groupBy({
        by: ['endpoint'],
        _count: true,
      }),
      prisma.apiLog.groupBy({
        by: ['provider', 'model'],
        where: { createdAt: { gte: todayStart } },
        _count: true,
      }),
      prisma.apiLog.aggregate({
        _avg: { latencyMs: true },
        where: { success: true },
      }),
      prisma.apiLog.findMany({
        where: { success: false },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          provider: true,
          model: true,
          endpoint: true,
          error: true,
          latencyMs: true,
          createdAt: true,
        },
      }),
    ]);

    const uniqueUsers = await prisma.apiLog.groupBy({
      by: ['telegramId'],
      where: { telegramId: { not: null } },
    });

    res.json({
      overview: {
        totalCalls,
        todayCalls,
        weekCalls,
        successRate: totalCalls > 0 ? `${((successCalls / totalCalls) * 100).toFixed(1)}%` : 'N/A',
        failedCalls,
        uniqueUsers: uniqueUsers.length,
        avgLatencyMs: Math.round(avgLatency._avg.latencyMs || 0),
      },
      today: {
        total: todayCalls,
        byProvider: todayByProvider.map((p) => ({
          provider: p.provider,
          model: p.model,
          count: p._count,
        })),
      },
      allTime: {
        byProvider: byProvider.map((p) => ({
          provider: p.provider,
          count: p._count,
          avgLatencyMs: Math.round(p._avg.latencyMs || 0),
        })),
        byEndpoint: byEndpoint.map((e) => ({
          endpoint: e.endpoint,
          count: e._count,
        })),
      },
      recentErrors,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Ошибка получения статистики' });
  }
});

export { router as statsRouter };
