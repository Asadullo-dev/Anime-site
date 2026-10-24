# Anime App — To'liq sozlash qo'llanmasi

Bu loyiha 2 ta alohida qismdan iborat:

| Qism | Papka | Vazifasi | Texnologiya |
|---|---|---|---|
| Frontend | `/` (root) | Sayt interfeysi | React + Vite + TypeScript + Firebase |
| Backend | `/server` | Video yuklash va translatsiya | Node.js + Express |

Ma'lumotlar (anime, epizod ro'yxati, foydalanuvchilar) — Firebase Firestore'da.
Video fayllarning o'zi — sizning backend serveringiz diskida.

---

## 0-qadam. Talablar

| Dastur | Versiya | Yuklab olish |
|---|---|---|
| Node.js | 20 yoki undan yuqori | https://nodejs.org |
| npm | Node bilan birga keladi | — |
| Git (ixtiyoriy) | — | https://git-scm.com |

Windows'da tekshirish uchun terminalda (PowerShell yoki CMD):
```
node -v
npm -v
```

---

## 1-qadam. Firebase loyihasini yaratish

1. https://console.firebase.google.com ga kiring (Google hisobingiz bilan).
2. **"Add project" / "Loyiha qo'shish"** tugmasini bosing.
3. Loyiha nomini kiriting, masalan: `mening-anime-appim`.
4. Google Analytics'ni **o'chirib qo'yishingiz mumkin** (kerak emas).
5. **"Create project"** tugmasini bosib, yaratilishini kuting.

---

## 2-qadam. Authentication (kirish tizimi) yoqish

1. Chap menyudan **Build > Authentication** ga o'ting.
2. **"Get started"** tugmasini bosing.
3. **Sign-in method** bo'limida **Google** ni tanlang va yoqing (Enable).
4. Support email sifatida o'zingizning emailingizni tanlang va **Save**.

---

## 3-qadam. Firestore Database yaratish

1. Chap menyudan **Build > Firestore Database** ga o'ting.
2. **"Create database"** tugmasini bosing.
3. Location (joylashuv) tanlang — masalan `eur3 (europe-west)` yoki sizga yaqin bo'lgan hudud.
4. **Production mode**'ni tanlang (xavfsizlik qoidalarini o'zimiz alohida qo'yamiz — 6-qadam).
5. **Enable** tugmasini bosing.

---

## 4-qadam. Web ilova qo'shish va Firebase config olish

1. Firebase Console'da loyiha bosh sahifasiga qayting.
2. **"</>"** (Web) belgisini bosing — yangi web app qo'shish uchun.
3. App nickname kiriting: `anime-web`.
4. **"Also set up Firebase Hosting"** belgisini **BELGILAMANG** (kerak emas, biz Vercel ishlatamiz).
5. **Register app** tugmasini bosing.
6. Ekranda chiqqan `firebaseConfig` obyektidagi qiymatlarni nusxalab oling — quyidagi qadamda kerak bo'ladi:

```
apiKey: "..."
authDomain: "..."
projectId: "..."
storageBucket: "..."
messagingSenderId: "..."
appId: "..."
```

### Loyihada `.env.local` faylini yaratish

Loyiha papkasining eng tepasida (root, `package.json` bilan bir joyda) `.env.local.example` faylini nusxalab, nomini `.env.local` ga o'zgartiring, so'ng qiymatlarni to'ldiring:

```
VITE_FIREBASE_API_KEY=firebaseConfig.apiKey qiymati
VITE_FIREBASE_AUTH_DOMAIN=firebaseConfig.authDomain qiymati
VITE_FIREBASE_PROJECT_ID=firebaseConfig.projectId qiymati
VITE_FIREBASE_STORAGE_BUCKET=firebaseConfig.storageBucket qiymati
VITE_FIREBASE_MESSAGING_SENDER_ID=firebaseConfig.messagingSenderId qiymati
VITE_FIREBASE_APP_ID=firebaseConfig.appId qiymati
VITE_ADMIN_EMAIL=sizning_gmail_manzilingiz@gmail.com
VITE_API_BASE_URL=http://localhost:4000
```

`VITE_ADMIN_EMAIL` — o'zingiz tizimga Google orqali kirganda ishlatadigan email. Shu email bilan kirgan foydalanuvchi avtomatik admin bo'ladi.

---

## 5-qadam. Admin emailni firestore.rules faylida ham belgilash

`firestore.rules` faylini oching, ichida quyidagi qatorni toping:

```
return isVerifiedUser() && request.auth.token.email == 'SIZNING_ADMIN_EMAIL@gmail.com';
```

`SIZNING_ADMIN_EMAIL@gmail.com` o'rniga xuddi 4-qadamdagi `VITE_ADMIN_EMAIL` bilan **bir xil** emailni yozing. Ikkalasi mos kelmasa, admin panel ishlamaydi.

---

## 6-qadam. Firestore xavfsizlik qoidalarini (rules) joylashtirish

Firebase CLI kerak bo'ladi:

```
npm install -g firebase-tools
firebase login
```

Loyiha root papkasida:

```
firebase init firestore
```

Savollarga javoblar:
- "Use an existing project" → 1-qadamda yaratgan loyihangizni tanlang
- "What file should be used for Firestore Rules?" → `firestore.rules` (mavjud faylni qayta yozishni so'rasa, **rad eting / No**, chunki bizda tayyor fayl bor)
- "What file should be used for Firestore indexes?" → default (Enter)

So'ng qoidalarni serverga yuklang:

```
firebase deploy --only firestore:rules
```

---

## 7-qadam. Backend uchun Firebase Admin kaliti (service account) olish

1. Firebase Console > **Project Settings** (dvigatel belgisi) > **Service accounts** bo'limi.
2. **"Generate new private key"** tugmasini bosing → tasdiqlang.
3. Yuklab olingan `.json` faylni `server/serviceAccountKey.json` nomi bilan, aynan `server` papkasi ichiga joylashtiring.

**Muhim:** bu fayl juda maxfiy — hech qachon GitHub'ga yoki boshqa ochiq joyga yuklamang (`.gitignore`da allaqachon istisno qilingan).

---

## 8-qadam. Backend sozlamalarini to'ldirish

`server` papkasi ichida `.env.example` faylini nusxalab `.env` nomi bilan saqlang, so'ng to'ldiring:

```
PORT=4000
CORS_ORIGIN=http://localhost:3000
ADMIN_EMAIL=sizning_gmail_manzilingiz@gmail.com
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
UPLOAD_DIR=./uploads
MAX_UPLOAD_MB=2048
PUBLIC_SERVER_URL=http://localhost:4000
```

`ADMIN_EMAIL` — 4 va 5-qadamdagi email bilan **bir xil** bo'lishi shart.
`MAX_UPLOAD_MB` — bitta video fayl uchun ruxsat etilgan maksimal hajm (MB). Xohlasangiz oshiring.

---

## 9-qadam. Loyihani lokal (kompyuteringizda) ishga tushirish

Ikkita alohida terminal oynasi kerak bo'ladi — biri frontend, biri backend uchun (ikkalasi ham bir vaqtda ishlashi kerak).

### Terminal 1 — Backend

```
cd server
npm install
npm start
```

Muvaffaqiyatli ishga tushsa, quyidagini ko'rasiz:
```
✅ Video server ishga tushdi: http://localhost:4000
```

### Terminal 2 — Frontend

Loyiha root papkasida:

```
npm install
npm run dev
```

Brauzerda oching: **http://localhost:3000**

---

## 10-qadam. Sinab ko'rish

1. Saytda **"Continue with Google"** orqali `VITE_ADMIN_EMAIL`da ko'rsatgan hisobingiz bilan kiring.
2. Yuqori menyuda (yoki profilingiz orqali) **Admin** sahifasiga o'ting (`/admin`).
3. **"Add Anime"** tugmasi bilan bitta anime qo'shing (yoki **"Seed Demo Data"** bilan namuna ma'lumotlarni to'ldiring).
4. Jadvaldagi anime qatorida **film belgisi** (🎬 — Epizodlarni boshqarish) tugmasini bosing.
5. Yangi epizod formasi orqali:
   - Qism raqami, nomi, tilini kiriting
   - **Video fayl** maydonida kompyuteringizdagi video faylni tanlang (mp4, webm, mkv, mov, m4v)
   - **"Epizodni saqlash"** tugmasini bosing — progress-bar yuklanish foizini ko'rsatadi
6. Yuklangandan so'ng, saytda o'sha animeni oching va epizodni bosib ko'ring — video to'g'ridan-to'g'ri sizning backend serveringizdan translatsiya bo'ladi (oldinga/orqaga surish ham ishlaydi).

---

## 11-qadam. Internetga joylashtirish (Deploy)

### 11.1 — Frontend (Vercel)

1. Loyihani GitHub'ga yuklang (agar hali yuklamagan bo'lsangiz).
2. https://vercel.com ga kiring, GitHub hisobingiz bilan ulaning.
3. **"Add New... > Project"** → repozitoriyangizni tanlang.
4. Framework avtomatik **Vite** deb aniqlanadi (`vercel.json` allaqachon tayyor).
5. **Environment Variables** bo'limiga `.env.local` faylidagi barcha `VITE_...` qiymatlarni qo'shing — lekin `VITE_API_BASE_URL`ni hali `http://localhost:4000` qoldiring, backendni deploy qilgach yangilaysiz (11.2-qadam oxirida).
6. **Deploy** tugmasini bosing.

### 11.2 — Backend (video server)

Backend katta video fayllarni diskda saqlagani uchun **doimiy disk (persistent storage)ga ega server** kerak. Vercel kabi serverless platformalar bunga mos emas. Tavsiya etiladigan variantlar:

| Variant | Qulayligi | Narxi | Izoh |
|---|---|---|---|
| VPS (Timeweb, Hetzner, DigitalOcean) | O'rtacha (Nginx/PM2 sozlash kerak) | Oyiga $4-10 dan | To'liq nazorat, disk hajmini o'zingiz belgilaysiz |
| Railway.app | Oson | Foydalanishga qarab | Persistent volume qo'shish kerak |
| Render.com | Oson | Persistent disk pullik | Free tier'da disk vaqtinchalik o'chib turadi (uzoq muddatga mos emas) |

**Video fayllar ko'p bo'lsa (ko'p GB), VPS eng arzon va ishonchli variant.**

#### VPS'da ishga tushirish (Ubuntu misolida)

```
# Serverга SSH orqali kiring, so'ng:
sudo apt update && sudo apt install -y nodejs npm
sudo npm install -g pm2

# Loyihani serverga yuklang (git clone yoki scp orqali), so'ng:
cd server
npm install --production

# .env va serviceAccountKey.json fayllarini serverga alohida, xavfsiz yo'l bilan joylashtiring
# (masalan scp orqali) — GitHub'ga hech qachon qo'ymang.

# CORS_ORIGIN'ni Vercel domeningizga yangilang, masalan:
# CORS_ORIGIN=https://sizning-loyihangiz.vercel.app
# PUBLIC_SERVER_URL'ni serveringiz domeniga yangilang, masalan:
# PUBLIC_SERVER_URL=https://video.sizning-domeningiz.com

pm2 start index.js --name anime-video-server
pm2 save
pm2 startup
```

Domen ulash va HTTPS (SSL) uchun Nginx + Certbot ishlatish tavsiya etiladi (video URL'lar `https://` bilan boshlanishi tarayzerlarda "aralash kontent" xatosini oldini oladi, chunki frontend allaqachon HTTPS'da bo'ladi).

#### Backend deploy qilingandan keyin

1. Vercel loyihangizdagi `VITE_API_BASE_URL` environment variable'ni yangi backend manzilingizga o'zgartiring (masalan `https://video.sizning-domeningiz.com`).
2. Vercel'da **Redeploy** qiling.

---

## 12-qadam. Xavfsizlik bo'yicha eslatmalar

| Fayl | Nima uchun maxfiy | Qayerga bormasligi kerak |
|---|---|---|
| `server/serviceAccountKey.json` | Firebase loyihangizga to'liq admin huquqi beradi | GitHub, ochiq papka, chat |
| `.env.local` / `server/.env` | API kalitlar, admin email | Ochiq repozitoriy |
| `firestore.rules` dagi admin email | Kim admin ekanini belgilaydi | — (bu fayl ochiq bo'lishi normal, lekin emailni to'g'ri qo'yish muhim) |

Ikkala `.gitignore` fayli bu fayllarni avtomatik chetlab o'tadi — lekin qo'lda tekshirib qo'yish foydali.

---

## Muammolarni bartaraf etish

| Muammo | Sabab | Yechim |
|---|---|---|
| Saytga kirganda "Konfiguratsiya topilmadi" xatosi (browser konsolida) | `.env.local` to'ldirilmagan yoki noto'g'ri joyda | Faylning root papkada, `.env.local` nomi bilan ekanini tekshiring, serverni qayta ishga tushiring (`npm run dev`) |
| Google orqali kirganda ham Admin sahifasi ochilmayapti | `VITE_ADMIN_EMAIL` va `firestore.rules` dagi email mos emas | Ikkalasini solishtirib, aynan bir xil qiling (katta-kichik harflar ham) |
| Video yuklashda "Faqat admin video yuklashi mumkin" | `server/.env` dagi `ADMIN_EMAIL` boshqa email | 4, 5, 8-qadamlardagi uchala emailni solishtiring |
| Video yuklashda "Serverga ulanib bo'lmadi" | Backend ishga tushmagan yoki `VITE_API_BASE_URL` noto'g'ri | `server` papkasida `npm start` ishga tushganini tekshiring |
| `firebase deploy` xato beradi | Firebase CLI'ga kirilmagan yoki noto'g'ri loyiha tanlangan | `firebase login` va `firebase use --add` bilan loyihani qayta tanlang |
| Video yuklanadi lekin ijro etilmaydi | Fayl formati brauzer qo'llab-quvvatlamaydi | `.mp4` (H.264 kodek) formatidan foydalaning — eng keng qo'llab-quvvatlanadi |

---

## Loyiha tuzilishi (qisqacha)

```
/                       ← Frontend (Vite + React)
  src/
    firebase.ts         ← Firebase ulanishi (.env.local dan o'qiydi)
    api.ts              ← Backendga video yuklash uchun yordamchi
    pages/
      Admin.tsx          ← Anime va epizod boshqaruvi (video yuklash shu yerda)
      VideoPlayer.tsx     ← Video ko'rsatish
  .env.local            ← SIZ TO'LDIRASIZ (4-qadam)
  firestore.rules       ← SIZ TAHRIRLAYSIZ (5-qadam)

/server                 ← Backend (Node.js + Express)
  index.js              ← Serverni ishga tushiruvchi asosiy fayl
  routes/videos.js      ← Video yuklash/o'chirish (faqat admin)
  routes/stream.js      ← Video translatsiya (seek bilan)
  serviceAccountKey.json ← SIZ QO'SHASIZ (7-qadam, Firebase'dan yuklab olinadi)
  .env                  ← SIZ TO'LDIRASIZ (8-qadam)
```
