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

  githubToken: required('GITHUB_TOKEN'),
  githubOwner: required('GITHUB_OWNER'),
  githubRepo: required('GITHUB_REPO'),
 

  anthropicApiKey: process.env.ANTHROPIC_API_KEY || null,
 
  lookbackDays: Number(process.env.LOOKBACK_DAYS) || 30,
  pollIntervalMs: Number(process.env.POLL_INTERVAL_MS) || 5 * 60 * 1000,

  githubWebhookSecret: process.env.GITHUB_WEBHOOK_SECRET || null,
  port: Number(process.env.PORT) || 3000,
 
  nodeEnv: process.env.NODE_ENV || 'development',
  trustProxy: process.env.TRUST_PROXY === 'true',
  databaseUrl: process.env.DATABASE_URL || null,
  sessionSecret: process.env.SESSION_SECRET || null,
  googleClientId: process.env.GOOGLE_CLIENT_ID || null,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || null,
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || null,
  googleOAuthEnabled: Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CALLBACK_URL
  ),
  postLoginRedirectUrl: process.env.POST_LOGIN_REDIRECT_URL || '/',
};
 