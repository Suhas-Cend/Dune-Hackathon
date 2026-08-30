import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcryptjs';
import { prisma } from './db.js';
import { config } from './config.js';

passport.use(
  new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
      if (!user || !user.passwordHash) {
        return done(null, false, { message: 'Invalid email or password.' });
      }
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return done(null, false, { message: 'Invalid email or password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

if (config.googleOAuthEnabled) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.googleClientId,
        clientSecret: config.googleClientSecret,
        callbackURL: config.googleCallbackUrl,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase().trim() || null;
          const emailVerified = profile.emails?.[0]?.verified === true;

          let user = await prisma.user.findUnique({ where: { googleId: profile.id } });

          if (!user && email && emailVerified) {
            const existingByEmail = await prisma.user.findUnique({ where: { email } });
            if (existingByEmail) {
              user = await prisma.user.update({
                where: { id: existingByEmail.id },
                data: { googleId: profile.id },
              });
            }
          }

          if (!user) {
            if (!email) {
              return done(null, false, { message: 'Google account has no accessible email.' });
            }
            try {
              user = await prisma.user.create({
                data: {
                  googleId: profile.id,
                  email,
                  name: profile.displayName || null,
                },
              });
            } catch (createErr) {
              if (createErr.code === 'P2002') {
                return done(null, false, {
                  message: 'An account with this email already exists. Log in with your password instead.',
                });
              }
              throw createErr;
            }
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user || false);
  } catch (err) {
    done(err);
  }
});

export default passport;