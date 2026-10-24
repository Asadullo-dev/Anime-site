import admin from '../firebaseAdmin.js';
import { ADMIN_EMAIL } from '../config.js';

/**
 * Frontend har bir so'rovda "Authorization: Bearer <Firebase ID token>" yuborishi kerak.
 * Token Firebase Admin SDK orqali tekshiriladi, so'ng email ADMIN_EMAIL bilan solishtiriladi.
 */
export async function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'Token topilmadi. Tizimga kiring.' });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    const email = (decoded.email || '').toLowerCase().trim();

    if (!decoded.email_verified) {
      return res.status(403).json({ error: 'Email tasdiqlanmagan.' });
    }

    if (!ADMIN_EMAIL || email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Faqat admin video yuklashi mumkin.' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error('[requireAdmin] token tekshirishda xato:', err.message);
    return res.status(401).json({ error: 'Token yaroqsiz yoki muddati o\'tgan.' });
  }
}
