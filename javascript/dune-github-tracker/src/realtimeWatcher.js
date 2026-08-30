// The simplest version of "report in real time, per each user" from the brief.
// Re-checks GitHub on a timer, calls out anything new since the last check,
// then reprints the full leaderboard. No public URL or GitHub App needed —
// just `npm run watch` and leave it running.
//
// For TRUE instant (push-based) updates instead of polling, see webhookServer.js.

import { collectContributions, attachCommitStats } from './fetchContributions.js';
import { analyzeContributor } from './aiAnalyzer.js';
import { computeCredits } from './creditEngine.js';
import { printReport } from './report.js';
import { verifyAccess } from './githubClient.js';
import { config } from './config.js';

let lastSeenShas = new Set();

async function runOnce() {
  const byAuthor = await collectContributions();
  await attachCommitStats(byAuthor);

  const newCommits = [];
  for (const [login, data] of Object.entries(byAuthor)) {
    for (const commit of data.commits) {
      if (!lastSeenShas.has(commit.sha)) {
        newCommits.push(`${login} → ${commit.message.split('\n')[0]}`);
      }
    }
  }
  lastSeenShas = new Set(
    Object.values(byAuthor).flatMap((data) => data.commits.map((c) => c.sha))
  );

  if (newCommits.length) {
    console.log(`\nNew since last check:\n${newCommits.map((line) => `  - ${line}`).join('\n')}`);
  }

  const aiResults = {};
  for (const [login, data] of Object.entries(byAuthor)) {
    aiResults[login] = await analyzeContributor(login, data.commits);
  }

  printReport(computeCredits(byAuthor, aiResults));
}

async function startWatching() {
  const repo = await verifyAccess();
  console.log(`Watching ${repo.full_name} every ${config.pollIntervalMs / 1000}s. Ctrl+C to stop.`);

  await runOnce();
  setInterval(() => {
    runOnce().catch((err) => console.error('Dune watch error:', err.message));
  }, config.pollIntervalMs);
}

startWatching().catch((err) => {
  console.error('Dune failed to start:', err.message);
  process.exit(1);
});
