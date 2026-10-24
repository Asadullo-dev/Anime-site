import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, updateDoc, deleteDoc, getDocs, query, where, orderBy, onSnapshot, serverTimestamp, limit } from 'firebase/firestore';

// Firebase config endi .env.local faylidan o'qiladi.
// Qadriyatlarni o'zingizning Firebase loyihangizdan olib, .env.local ga yozing.
// Qo'llanma: SETUP_UZ.md faylida.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  // eslint-disable-next-line no-console
  console.error(
    '[firebase] Konfiguratsiya topilmadi. Loyiha papkasida .env.local faylini yarating va ' +
    'VITE_FIREBASE_* qiymatlarini to\'ldiring (SETUP_UZ.md ga qarang).'
  );
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Admin email ham endi .env.local orqali beriladi (VITE_ADMIN_EMAIL).
// Bu Firestore xavfsizlik qoidalaridagi email bilan bir xil bo'lishi SHART
// (firestore.rules faylidagi isAdmin() funksiyasi).
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || '';

// Backend server manzili (video yuklash / oqim uchun)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export { signOut };
export {
  doc, setDoc, getDoc, collection, addDoc, updateDoc, deleteDoc,
  getDocs, query, where, orderBy, onSnapshot, serverTimestamp, limit
};
