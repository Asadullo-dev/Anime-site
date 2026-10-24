import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { FIREBASE_SERVICE_ACCOUNT_PATH, FIREBASE_PROJECT_ID } from './config.js';

const resolvedPath = path.resolve(FIREBASE_SERVICE_ACCOUNT_PATH);

if (fs.existsSync(resolvedPath)) {
  // 1-usul: JSON kalit fayli mavjud bo'lsa, shuni ishlatamiz.
  const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, 'utf-8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('[firebaseAdmin] serviceAccountKey.json orqali ulandi. Loyiha:', serviceAccount.project_id);
} else {
  // 2-usul: Kalit fayl yo'q (masalan tashkilot siyosati kalit yaratishni bloklagan bo'lsa).
  // Buning o'rniga "gcloud auth application-default login" orqali olingan
  // shaxsiy login ma'lumotlaridan (Application Default Credentials) foydalanamiz.
  if (!FIREBASE_PROJECT_ID) {
    console.error(
      '[firebaseAdmin] Na service account fayli, na FIREBASE_PROJECT_ID topilmadi.\n' +
      'Quyidagilardan birini bajaring:\n' +
      '  1) server/serviceAccountKey.json faylini joylashtiring, YOKI\n' +
      '  2) server/.env fayliga FIREBASE_PROJECT_ID=animeapp-5a7d4 qatorini qo\'shing\n' +
      '     va terminalda "gcloud auth application-default login" ni bajaring.'
    );
    process.exit(1);
  }
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: FIREBASE_PROJECT_ID,
  });
  console.log('[firebaseAdmin] Application Default Credentials (gcloud login) orqali ulandi. Loyiha:', FIREBASE_PROJECT_ID);
}

export default admin;