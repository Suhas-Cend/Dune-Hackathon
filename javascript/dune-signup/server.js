import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import passport from './passport.js';
import { config } from './config.js';
import authRoutes from './authRoutes.js';
import apiRoutes from './apiRoutes.js';
import { webhookRouter } from './webhookServer.js';

if (!config.databaseUrl) {
  throw new Error(
    'Missing required environment variable: DATABASE_URL\n' +
    'Copy .env.example to .env and fill it in.'
  );
}
if (!config.sessionSecret) {
  throw new Error(
    'Missing required environment variable: SESSION_SECRET\n' +
    'Copy .env.example to .env and fill it in.'
  );
}

const PgSession = connectPgSimple(session);

const app = express();

app.set('trust proxy', config.trustProxy ? 1 : false);

app.use(webhookRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    store: new PgSession({
      conString: config.databaseUrl,
      createTableIfMissing: true,
    }),
    name: 'dune.sid',
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'dune-github-tracker' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

app.use((err, req, res, next) => {
  console.error('Dune server error:', err.message);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(config.port, () => {
  console.log(`Dune server listening on port ${config.port}`);
});