import express from 'express';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import db from '../db';

const router = express.Router();

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: "http://localhost:3001/auth/github/callback"
  },
  function(accessToken: string, refreshToken: string, profile: any, done: any) {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO users (github_id, username, avatar_url)
      VALUES (?, ?, ?)
    `);
    
    const result = stmt.run(
      profile.id,
      profile.username,
      profile._json.avatar_url
    );
    
    return done(null, profile);
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

router.get('/github',
  passport.authenticate('github', { scope: [ 'user:email' ] })
);

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);

router.get('/check', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: req.user
    });
  } else {
    res.json({
      authenticated: false,
      user: null
    });
  }
});

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

export default router;
