import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, type AuthRequest } from '../middleware/auth';
import { generateFateReport } from '../services/fate-report';

const router = Router();
const prisma = new PrismaClient();

// POST /api/fate-report/generate
router.post('/generate', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { birthDate } = req.body as { birthDate: string };
    if (!birthDate) {
      res.status(400).json({ message: 'birthDate is required' });
      return;
    }

    const bd = new Date(birthDate);
    if (isNaN(bd.getTime())) {
      res.status(400).json({ message: 'Invalid date' });
      return;
    }

    const telegramId = req.telegramUser!.id;

    // Find user
    const user = await prisma.user.findUnique({
      where: { telegramId: BigInt(telegramId) },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if user has purchased fate_report
    const purchase = await prisma.purchase.findFirst({
      where: { userId: user.id, product: 'fate_report' },
    });

    if (!purchase) {
      // Check if user has active premium (premium users can also access for free? or not)
      // For now, require purchase
      res.status(403).json({ message: 'Purchase required', product: 'fate_report' });
      return;
    }

    // Check if report already exists for this date
    const bdDate = new Date(bd.getFullYear(), bd.getMonth(), bd.getDate());
    const existing = await prisma.fateReport.findUnique({
      where: { userId_birthDate: { userId: user.id, birthDate: bdDate } },
    });

    if (existing && existing.status === 'ready') {
      res.json({
        id: existing.id,
        chapters: existing.chapters,
        wordCount: existing.wordCount,
        status: 'ready',
        cached: true,
      });
      return;
    }

    // Mark as generating
    await prisma.fateReport.upsert({
      where: { userId_birthDate: { userId: user.id, birthDate: bdDate } },
      create: { userId: user.id, birthDate: bdDate, chapters: {}, status: 'generating' },
      update: { status: 'generating' },
    });

    // Generate report (this takes 40-60 seconds)
    const result = await generateFateReport(bdDate, user.id, telegramId);

    res.json({
      id: result.id,
      chapters: result.chapters,
      wordCount: Object.values(result.chapters).reduce(
        (sum, ch) => sum + ch.content.split(/\s+/).length, 0
      ),
      status: 'ready',
      cached: false,
    });
  } catch (err) {
    console.error('[FateReport] Generation error:', err);
    res.status(500).json({ message: 'Report generation failed' });
  }
});

// GET /api/fate-report/:birthDate
router.get('/:birthDate', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const telegramId = req.telegramUser!.id;
    const user = await prisma.user.findUnique({
      where: { telegramId: BigInt(telegramId) },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const bd = new Date(req.params.birthDate as string);
    if (isNaN(bd.getTime())) {
      res.status(400).json({ message: 'Invalid date' });
      return;
    }

    const bdDate = new Date(bd.getFullYear(), bd.getMonth(), bd.getDate());

    const report = await prisma.fateReport.findUnique({
      where: { userId_birthDate: { userId: user.id, birthDate: bdDate } },
    });

    if (!report) {
      res.status(404).json({ message: 'Report not found' });
      return;
    }

    res.json({
      id: report.id,
      chapters: report.chapters,
      wordCount: report.wordCount,
      status: report.status,
      createdAt: report.createdAt,
    });
  } catch (err) {
    console.error('[FateReport] Get error:', err);
    res.status(500).json({ message: 'Failed to get report' });
  }
});

// GET /api/fate-report — list user's reports
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { telegramId: BigInt(req.telegramUser!.id) },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const reports = await prisma.fateReport.findMany({
      where: { userId: user.id },
      select: { id: true, birthDate: true, wordCount: true, status: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(reports);
  } catch (err) {
    console.error('[FateReport] List error:', err);
    res.status(500).json({ message: 'Failed to list reports' });
  }
});

export { router as fateReportRouter };
