import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { authRouter } from './routes/auth';
import { readingsRouter } from './routes/readings';
import { dailyRouter } from './routes/daily';
import { profileRouter } from './routes/profile';
import { interpretRouter } from './routes/interpret';
import { statsRouter } from './routes/stats';
import { setupBot } from './bot';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/readings', readingsRouter);
app.use('/api/daily', dailyRouter);
app.use('/api/profile', profileRouter);
app.use('/api/interpret', interpretRouter);

app.use('/api/stats', statsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

setupBot(app);

const clientPath = path.join(__dirname, '..', 'public');
app.use(express.static(clientPath));
app.use((_req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
