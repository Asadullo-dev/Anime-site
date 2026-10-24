import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UPLOAD_DIR, MAX_UPLOAD_BYTES, PUBLIC_SERVER_URL } from '../config.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = express.Router();

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_EXTENSIONS = new Set(['.mp4', '.webm', '.mkv', '.mov', '.m4v']);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return cb(new Error(`Ruxsat etilmagan fayl turi: ${ext}. Ruxsat etilganlar: ${[...ALLOWED_EXTENSIONS].join(', ')}`));
    }
    cb(null, true);
  },
});

// POST /api/videos/upload  -> video faylni serverga yuklaydi (faqat admin)
router.post('/upload', requireAdmin, (req, res) => {
  upload.single('video')(req, res, (err) => {
    if (err) {
      console.error('[upload] xato:', err.message);
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Video fayl topilmadi. "video" nomli field bilan yuboring.' });
    }

    const videoUrl = `${PUBLIC_SERVER_URL}/stream/${req.file.filename}`;
    return res.json({
      videoUrl,
      filename: req.file.filename,
      size: req.file.size,
    });
  });
});

// DELETE /api/videos/:filename -> diskdan videoni o'chiradi (faqat admin)
router.delete('/:filename', requireAdmin, (req, res) => {
  const filename = path.basename(req.params.filename); // path traversal himoyasi
  const filePath = path.join(UPLOAD_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Fayl topilmadi.' });
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('[delete] xato:', err.message);
      return res.status(500).json({ error: 'Faylni o\'chirishda xatolik.' });
    }
    return res.json({ success: true });
  });
});

export default router;
