import express from 'express';
import cors from 'cors';
import { PORT, CORS_ORIGIN } from './config.js';
import videosRouter from './routes/videos.js';
import streamRouter from './routes/stream.js';

const app = express();

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());


app.get('/health', (_req, res) => res.json({ ok: true }));

app.get('/', (req, res) => {
  res.send('Anime video server ishlamoqda!');
});

app.use('/api/videos', videosRouter);
app.use('/stream', streamRouter);

app.use((err, _req, res, _next) => {
  console.error('[server] kutilmagan xato:', err);
  res.status(500).json({ error: 'Serverda ichki xatolik yuz berdi.' });
});

app.listen(PORT, () => {
  console.log(`✅ Video server ishga tushdi: http://localhost:${PORT}`);
  console.log(`   Stream manzili namunasi: http://localhost:${PORT}/stream/<fayl_nomi>`);
});
