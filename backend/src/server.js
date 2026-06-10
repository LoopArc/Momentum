import express from 'express';
import cors from 'cors';
import { runMigrations } from './db/migrate.js';
import profileRoutes from './routes/profile.js';
import categoriesRoutes from './routes/categories.js';
import logRoutes from './routes/log.js';
import settingsRoutes from './routes/settings.js';
import { errorHandler } from './middleware/errorHandler.js';

const PORT = process.env.PORT || 3001;

// Run DB migrations before anything else
runMigrations();

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/profile', profileRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/log', logRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Momentum backend running on http://localhost:${PORT}`);
});
