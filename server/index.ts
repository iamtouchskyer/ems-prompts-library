
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './routes/auth';
import promptsRoutes from './routes/prompts';
import historyRoutes from './routes/history';

const app = express();

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api/prompts', promptsRoutes);
app.use('/api/history', historyRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
