// Run this with: npm start
// One full pass: connect → fetch every commit/PR per person → ask the AI to
// judge quality → compute credit scores → print + save a report.
// For a version that keeps running and reports as new commits land, use:
//   npm run watch     (polling, works anywhere, no setup)
//   npm run webhook   (instant, needs a GitHub App/webhook — see src/webhookServer.js)

import { writeFileSync } from 'fs';
import { verifyAccess } from './src/githubClient.js';
import { collectContributions, attachCommitStats } from './src/fetchContributions.js';
import { analyzeContributor } from './src/aiAnalyzer.js';
import { computeCredits } from './src/creditEngine.js';
import { printReport, toMarkdown } from './src/report.js';

async function main() {
  console.log('Connecting to GitHub...');
  const repo = await verifyAccess();
  console.log(`Connected: ${repo.full_name}\n`);

  console.log('Fetching commits & PRs across every branch...');
  const byAuthor = await collectContributions();
  await attachCommitStats(byAuthor);

  const people = Object.keys(byAuthor);
  console.log(`Found ${people.length} contributor(s): ${people.join(', ')}\n`);

  console.log('Running AI quality analysis per contributor...');
  const aiResults = {};
  for (const login of people) {
    process.stdout.write(`  - ${login}...\n`);
    aiResults[login] = await analyzeContributor(login, byAuthor[login].commits);
  }

  const credits = computeCredits(byAuthor, aiResults);
  printReport(credits);

  writeFileSync('dune-report.md', toMarkdown(credits));
  console.log('Saved full report to dune-report.md\n');
}

main().catch((err) => {
  console.error('\nDune hit an error:', err.message);
  process.exit(1);
});
