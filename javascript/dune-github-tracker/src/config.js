// Loads every setting from .env in ONE place, so nothing else in the project
// touches `process.env` directly. If a required value is missing, we fail
// immediately with a clear message instead of a confusing error later.

import 'dotenv/config';

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}\n` +
      `Copy .env.example to .env and fill it in.`
    );
  }
  return value;
}

export const config = {
  // GitHub
  githubToken: required('GITHUB_TOKEN'),
  githubOwner: required('GITHUB_OWNER'),
  githubRepo: required('GITHUB_REPO'),

  // AI (optional — if it's missing, Dune still reports raw contribution stats,
  // it just skips the "quality" scoring and says so).
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || null,

  // Tuning
  lookbackDays: Number(process.env.LOOKBACK_DAYS) || 30,
  pollIntervalMs: Number(process.env.POLL_INTERVAL_MS) || 5 * 60 * 1000,

  // Webhook mode only
  githubWebhookSecret: process.env.GITHUB_WEBHOOK_SECRET || null,
  port: Number(process.env.PORT) || 3000,
};
