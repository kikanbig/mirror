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

    const uniqueApiUsers = await prisma.apiLog.groupBy({
      by: ['telegramId'],
      where: { telegramId: { not: null } },
    });

    const monthStart = new Date(todayStart);
    monthStart.setDate(monthStart.getDate() - 30);

    const [
      totalUsers,
      usersToday,
      usersThisWeek,
      usersThisMonth,
      totalReadings,
      readingsToday,
      readingsThisWeek,
      totalDailyCards,
      dailyCardsToday,
      totalJournalEntries,
      recentUsers,
      topUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { lastActiveDate: { gte: todayStart } } }),
      prisma.user.count({ where: { lastActiveDate: { gte: weekStart } } }),
      prisma.user.count({ where: { lastActiveDate: { gte: monthStart } } }),
      prisma.reading.count(),
      prisma.reading.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.reading.count({ where: { createdAt: { gte: weekStart } } }),
      prisma.dailyCard.count(),
      prisma.dailyCard.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.journalEntry.count(),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          telegramId: true,
          username: true,
          firstName: true,
          level: true,
          streak: true,
          lastActiveDate: true,
          createdAt: true,
          _count: { select: { readings: true, dailyCards: true } },
        },
      }),
      prisma.user.findMany({
        orderBy: { experience: 'desc' },
        take: 10,
        select: {
          telegramId: true,
          username: true,
          firstName: true,
          level: true,
          experience: true,
          streak: true,
          _count: { select: { readings: true, dailyCards: true } },
        },
      }),
    ]);

    const readingsByType = await prisma.reading.groupBy({
      by: ['type'],
      _count: true,
    });

    // Revenue stats
    const [
      totalSubscriptions,
      activeSubscriptions,
      totalPurchases,
      totalFateReports,
      subscriptionRevenue,
      purchaseRevenue,
    ] = await Promise.all([
      prisma.subscription.count(),
      prisma.subscription.count({ where: { status: 'active', expiresAt: { gt: now } } }),
      prisma.purchase.count(),
      prisma.fateReport.count({ where: { status: 'ready' } }),
      prisma.subscription.aggregate({ _sum: { amount: true } }),
      prisma.purchase.aggregate({ _sum: { amount: true } }),
    ]);

    const totalStarsEarned = (subscriptionRevenue._sum.amount || 0) + (purchaseRevenue._sum.amount || 0);

    // Bot Stars balance via Telegram API
    let botStarsBalance: number | null = null;
    const BOT_TOKEN = process.env.BOT_TOKEN;
    if (BOT_TOKEN) {
      try {
        const resp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getStarTransactions?limit=1`);
        const data = await resp.json() as any;
        if (data.ok) {
          botStarsBalance = data.result?.balance ?? null;
        }
      } catch { /* ignore */ }
    }

    res.json({
      users: {
        total: totalUsers,
        activeToday: usersToday,
        activeThisWeek: usersThisWeek,
        activeThisMonth: usersThisMonth,
      },
      content: {
        totalReadings,
        readingsToday,
        readingsThisWeek,
        readingsByType: readingsByType.map((r) => ({
          type: r.type,
          count: r._count,
        })),
        totalDailyCards,
        dailyCardsToday,
        totalJournalEntries,
      },
      api: {
        totalCalls,
        todayCalls,
        weekCalls,
        successRate: totalCalls > 0 ? `${((successCalls / totalCalls) * 100).toFixed(1)}%` : 'N/A',
        failedCalls,
        uniqueApiUsers: uniqueApiUsers.length,
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
      recentUsers: recentUsers.map((u) => ({
        telegramId: u.telegramId.toString(),
        username: u.username,
        firstName: u.firstName,
        level: u.level,
        streak: u.streak,
        lastActive: u.lastActiveDate,
        joined: u.createdAt,
        readings: u._count.readings,
        dailyCards: u._count.dailyCards,
      })),
      topUsers: topUsers.map((u) => ({
        telegramId: u.telegramId.toString(),
        username: u.username,
        firstName: u.firstName,
        level: u.level,
        experience: u.experience,
        streak: u.streak,
        readings: u._count.readings,
        dailyCards: u._count.dailyCards,
      })),
      revenue: {
        botStarsBalance,
        totalStarsEarned,
        subscriptions: {
          total: totalSubscriptions,
          active: activeSubscriptions,
          starsEarned: subscriptionRevenue._sum.amount || 0,
        },
        purchases: {
          total: totalPurchases,
          starsEarned: purchaseRevenue._sum.amount || 0,
        },
        fateReports: {
          generated: totalFateReports,
        },
      },
      recentErrors,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Ошибка получения статистики' });
  }
});

export { router as statsRouter };
