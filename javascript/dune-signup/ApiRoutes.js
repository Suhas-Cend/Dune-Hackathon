import { Router } from 'express';
import { requireAuth } from './authMiddleware.js';
import { prisma } from './db.js';
import { verifyAccess } from './githubClient.js';
import { collectContributions, attachCommitStats } from './fetchContributions.js';
import { analyzeContributor } from './aiAnalyzer.js';
import { computeCredits } from './creditEngine.js';
import { toMarkdown } from './report.js';
import { config } from './config.js';

const router = Router();

router.use(requireAuth);

router.get('/repositories', async (req, res) => {
  const repositories = await prisma.repository.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ repositories });
});

router.post('/repositories', async (req, res) => {
  const { owner, name } = req.body || {};
  if (typeof owner !== 'string' || !owner.trim() || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'owner and name are required.' });
  }

  try {
    const repository = await prisma.repository.upsert({
      where: {
        userId_owner_name: {
          userId: req.user.id,
          owner: owner.trim(),
          name: name.trim(),
        },
      },
      update: {},
      create: {
        userId: req.user.id,
        owner: owner.trim(),
        name: name.trim(),
      },
    });
    res.status(201).json({ repository });
  } catch (err) {
    res.status(500).json({ error: 'Could not save repository.' });
  }
});

router.delete('/repositories/:id', async (req, res) => {
  const repository = await prisma.repository.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });
  if (!repository) return res.status(404).json({ error: 'Repository not found.' });

  await prisma.repository.delete({ where: { id: repository.id } });
  res.status(204).end();
});

router.get('/analyses', async (req, res) => {
  const analyses = await prisma.analysis.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    include: { repository: true },
  });
  res.json({ analyses });
});

router.get('/analyses/:id', async (req, res) => {
  const analysis = await prisma.analysis.findFirst({
    where: { id: req.params.id, userId: req.user.id },
    include: { repository: true },
  });
  if (!analysis) return res.status(404).json({ error: 'Analysis not found.' });
  res.json({ analysis });
});

router.post('/repositories/:id/analyses', async (req, res) => {
  const repository = await prisma.repository.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });
  if (!repository) return res.status(404).json({ error: 'Repository not found.' });

  const requestedLookback = Number(req.body?.lookbackDays);
  const lookbackDays = Number.isFinite(requestedLookback) && requestedLookback > 0
    ? Math.min(requestedLookback, 365)
    : config.lookbackDays;

  try {
    await verifyAccess({ owner: repository.owner, repo: repository.name });
  } catch (err) {
    return res.status(502).json({ error: err.message });
  }

  try {
    const byAuthor = await collectContributions({
      owner: repository.owner,
      repo: repository.name,
      sinceDays: lookbackDays,
    });
    await attachCommitStats(byAuthor, { owner: repository.owner, repo: repository.name });

    const aiResults = {};
    for (const login of Object.keys(byAuthor)) {
      aiResults[login] = await analyzeContributor(login, byAuthor[login].commits);
    }

    const credits = computeCredits(byAuthor, aiResults);
    const reportMarkdown = toMarkdown(credits);

    const analysis = await prisma.analysis.create({
      data: {
        userId: req.user.id,
        repositoryId: repository.id,
        lookbackDays,
        contributors: credits,
        reportMarkdown,
      },
    });

    res.status(201).json({ analysis });
  } catch (err) {
    console.error('Dune analysis error:', err.message);
    res.status(500).json({ error: 'Analysis failed. Check server logs for details.' });
  }
});

export default router;