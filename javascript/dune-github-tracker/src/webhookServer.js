// This is the "research GitHub Apps" path from the brief: instead of Dune
// polling GitHub every few minutes, GitHub pushes an event to US the instant
// someone commits or opens/merges a PR. That's true real-time.
//
// To actually use this mode:
//   1. Get a URL GitHub can reach. While testing locally, run `npx ngrok http 3000`
//      and use the https URL it gives you. Later, host this file anywhere
//      (Render, Railway, a small VM, etc.) for a permanent URL.
//   2. Register either:
//        a) A simple repo webhook — Settings → Webhooks → Add webhook on the repo, or
//        b) A full GitHub App — Settings → Developer settings → GitHub Apps
//           (do this if you want Dune installable across multiple org repos
//           at once, rather than one webhook per repo).
//      Either way: set the Payload URL to https://<your-url>/webhook,
//      content type to application/json, and subscribe to "push" and
//      "pull_request" events.
//   3. Set GITHUB_WEBHOOK_SECRET in .env to the same secret you enter on GitHub's
//      side — that's what verifySignature() below checks, so random people
//      can't POST fake events at your server.
//
// Run with: npm run webhook

import express from 'express';
import crypto from 'crypto';
import { collectContributions, attachCommitStats } from './fetchContributions.js';
import { analyzeContributor } from './aiAnalyzer.js';
import { computeCredits } from './creditEngine.js';
import { printReport } from './report.js';
import { config } from './config.js';

const app = express();

// We need the raw request body (not just the parsed JSON) to check the
// signature GitHub sends, so we capture it here before express parses it.
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));

function verifySignature(req) {
  if (!config.githubWebhookSecret) {
    console.warn('⚠ GITHUB_WEBHOOK_SECRET not set — accepting unsigned requests. Local testing only!');
    return true;
  }
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) return false;

  const expected = 'sha256=' + crypto
    .createHmac('sha256', config.githubWebhookSecret)
    .update(req.rawBody)
    .digest('hex');

  // timingSafeEqual needs equal-length buffers, so guard against a length mismatch first
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

app.post('/webhook', async (req, res) => {
  if (!verifySignature(req)) {
    return res.status(401).send('bad signature');
  }

  const event = req.headers['x-github-event'];
  console.log(`Webhook received: ${event}`);

  // Acknowledge immediately — GitHub expects a fast response and will retry
  // (and eventually disable the webhook) if we take too long.
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
});

app.get('/', (req, res) => res.send('Dune webhook listener is running.'));

app.listen(config.port, () => {
  console.log(`Dune webhook listener on port ${config.port} — POST GitHub events to /webhook`);
});
