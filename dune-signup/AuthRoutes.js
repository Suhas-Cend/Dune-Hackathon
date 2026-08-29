import { Router } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import passport from './passport.js';
import { prisma } from './db.js';
import { config } from './config.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Try again later.' },
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    hasPassword: Boolean(user.passwordHash),
    hasGoogle: Boolean(user.googleId),
    createdAt: user.createdAt,
  };
}

router.post('/signup', authLimiter, async (req, res) => {
  const { email, password, name } = req.body || {};

  if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }
  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        name: typeof name === 'string' && name.trim() ? name.trim() : null,
      },
    });

    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: 'Account created, but failed to start session.' });
      return res.status(201).json({ user: publicUser(user) });
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not create account.' });
  }
});

router.post('/login', authLimiter, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(500).json({ error: 'Login failed.' });
    if (!user) return res.status(401).json({ error: info?.message || 'Invalid email or password.' });
    req.login(user, (loginErr) => {
      if (loginErr) return res.status(500).json({ error: 'Login failed.' });
      return res.json({ user: publicUser(user) });
    });
  })(req, res, next);
});

router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed.' });
    req.session.destroy(() => {
      res.clearCookie('dune.sid');
      res.status(204).end();
    });
  });
});

router.get('/me', (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  res.json({ user: publicUser(req.user) });
});

router.get('/google', authLimiter, (req, res, next) => {
  if (!config.googleOAuthEnabled) {
    return res.status(503).json({ error: 'Google sign-in is not configured on this server.' });
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  if (!config.googleOAuthEnabled) {
    return res.status(503).json({ error: 'Google sign-in is not configured on this server.' });
  }
  passport.authenticate('google', { session: true }, (err, user, info) => {
    if (err) return res.status(500).json({ error: 'Google sign-in failed.' });
    if (!user) return res.status(401).json({ error: info?.message || 'Google sign-in failed.' });
    req.login(user, (loginErr) => {
      if (loginErr) return res.status(500).json({ error: 'Google sign-in failed.' });
      res.redirect(config.postLoginRedirectUrl);
    });
  })(req, res, next);
});

export default router;