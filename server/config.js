import 'dotenv/config';
import path from 'path';

export const PORT = process.env.PORT || 4000;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
export const FIREBASE_SERVICE_ACCOUNT_PATH = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json';
export const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || '';
export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || './uploads');
export const MAX_UPLOAD_BYTES = Number(process.env.MAX_UPLOAD_MB || 2048) * 1024 * 1024;
export const PUBLIC_SERVER_URL = (process.env.PUBLIC_SERVER_URL || `http://localhost:${PORT}`).replace(/\/$/, '');

if (!ADMIN_EMAIL) {
  console.warn('[config] OGOHLANTIRISH: ADMIN_EMAIL o\'rnatilmagan (.env faylini tekshiring). Video yuklash ishlamaydi.');
}