import express from 'express';
import crypto from 'crypto';
import { collectContributions, attachCommitStats } from './fetchContributions.js';
import { analyzeContributor } from './aiAnalyzer.js';
import { computeCredits } from './creditEngine.js';
import { printReport } from './report.js';
import { config } from './config.js';

function verifySignature(req) {
  if (!config.githubWebhookSecret) {
    console.warn(' GITHUB_WEBHOOK_SECRET not set — accepting unsigned requests. Local testing only!');
    return true;
  }
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) return false;

  const expected = 'sha256=' + crypto
    .createHmac('sha256', config.githubWebhookSecret)
    .update(req.rawBody)
    .digest('hex');

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export const webhookRouter = express.Router();

webhookRouter.post(
  '/webhook',
  express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }),
  async (req, res) => {
    if (!verifySignature(req)) {
      return res.status(401).send('bad signature');
    }

    const event = req.headers['x-github-event'];
    console.log(`Webhook received: ${event}`);

    res.status(202).send('accepted');

    if (event !== 'push' && event !== 'pull_request') return;

    try {
      const byAuthor = await collectContributions();
      await attachCommitStats(byAuthor);

      const aiResults = {};
      for (const [login, data] of Object.entries(byAuthor)) {
        aiResults[login] = await analyzeContributor(login, data.commits);
      }

      printReport(computeCredits(byAuthor, aiResults));
    } catch (err) {
      console.error('Dune webhook processing error:', err.message);
    }
  }
);