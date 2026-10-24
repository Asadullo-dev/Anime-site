# 🎌 Anime App — Anime Streaming Platform

<p align="center">
  <img src="https://img.shields.io/badge/Anime-Streaming-8B5CF6?style=for-the-badge" alt="Anime Streaming"/>
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge" alt="Frontend"/>
  <img src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge" alt="Backend"/>
  <img src="https://img.shields.io/badge/Database-Firebase-FFCA28?style=for-the-badge" alt="Firebase"/>
</p>

<h3 align="center">🍿 Your anime world, all in one place!</h3>

<p align="center">
  An anime streaming platform for discovering anime, exploring episodes, and watching videos online.
</p>

<p align="center">
  <a href="https://anime-theta-blue.vercel.app/"><b>🌐 Live Demo</b></a>
</p>

---

## 📖 About the Project

**Anime App** is a web-based anime platform built to provide a convenient anime browsing and streaming experience.

The application uses a separate frontend and backend architecture. Anime information, episode lists, and user data are stored in Firebase Firestore, while video files are stored on the backend server's disk.

### ✨ Key Features

- 🎌 Browse anime and explore available episodes
- 🎬 Stream video content online
- 🔐 Google authentication with Firebase
- 🛡️ Admin access control
- 📤 Upload and manage anime episodes
- 📊 Upload progress tracking
- ⏩ Video playback with seeking support
- ☁️ Firebase Firestore integration
- 🚀 Frontend deployment on Vercel

*Feature availability depends on the current project configuration.*

## 🌐 Live Demo

<p align="center">
  <a href="https://anime-theta-blue.vercel.app/">
    <img src="https://img.shields.io/badge/OPEN-LIVE%20DEMO-8B5CF6?style=for-the-badge&logo=vercel&logoColor=white" alt="Open Live Demo"/>
  </a>
</p>

🔗 **Website:** https://anime-theta-blue.vercel.app/

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Development server and build tool |
| TypeScript | Type-safe JavaScript |
| Firebase Authentication | Google sign-in |
| Firebase Firestore | Anime, episodes, and user data |
| Node.js | Backend runtime |
| Express.js | API and video streaming |
| Vercel | Frontend hosting |

## 🏗️ Project Architecture

The application consists of two main parts:

| Component | Directory | Responsibility |
|---|---|---|
| Frontend | `/` | Website interface and user interactions |
| Backend | `/server` | Video uploads and streaming |
| Database | Firebase Firestore | Anime metadata, episodes, and user data |
| Video Storage | Backend disk | Uploaded video files |

## 📋 Requirements

Before getting started, make sure you have installed:

- [Node.js 20+](https://nodejs.org/)
- npm
- [Git](https://git-scm.com/) — optional
- A [Firebase account](https://console.firebase.google.com/)

Check your installed versions:

```bash
node -v
npm -v
```

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd YOUR_PROJECT_FOLDER
```

Replace the placeholders with your actual GitHub repository URL and project directory.

### 2. Create a Firebase project

1. Open [Firebase Console](https://console.firebase.google.com/).
2. Create a new Firebase project.
3. Enable **Authentication**.
4. Enable the **Google** sign-in provider.
5. Create a **Cloud Firestore** database.
6. Register a Web App and copy its Firebase configuration.

### 3. Configure frontend environment variables

Copy `.env.local.example` to `.env.local` in the project root.

Add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_ADMIN_EMAIL=your_admin_email@gmail.com
VITE_API_BASE_URL=http://localhost:4000
```

Replace the example values with your actual configuration.

**Important:** Use the same administrator email throughout the frontend, Firestore security rules, and backend environment configuration.

### 4. Configure Firestore security rules

Open `firestore.rules` and replace the example administrator email with your own email address.

Install the Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
```

Initialize Firestore if it has not already been configured:

```bash
firebase init firestore
```

Select your existing Firebase project and preserve the project's prepared rules file.

Deploy the rules:

```bash
firebase deploy --only firestore:rules
```

### 5. Configure the backend

Create `server/.env` using `server/.env.example` as a template.

```env
PORT=4000
CORS_ORIGIN=http://localhost:3000
ADMIN_EMAIL=your_admin_email@gmail.com
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
UPLOAD_DIR=./uploads
MAX_UPLOAD_MB=2048
PUBLIC_SERVER_URL=http://localhost:4000
```

Adjust the values to match your environment and the actual backend configuration.

### 6. Configure Firebase Admin credentials

1. Open Firebase Console.
2. Navigate to **Project Settings → Service Accounts**.
3. Generate a private key.
4. Save the downloaded JSON file as:

```text
server/serviceAccountKey.json
```

🔒 **Security warning:** Never commit your service account private key or environment files to a public repository.

### 7. Install dependencies

Install frontend dependencies from the project root:

```bash
npm install
```

Install backend dependencies:

```bash
cd server
npm install
```

### 8. Run the application

Open two terminal windows.

**Terminal 1 — Backend**

```bash
cd server
npm start
```

**Terminal 2 — Frontend**

From the project root:

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal. If your configuration uses port `3000`, visit `http://localhost:3000`.

## 👨‍💻 Admin Panel

The admin panel is designed for managing anime content and episodes.

Typical workflow:

1. Sign in with the configured Google account.
2. Open the `/admin` page.
3. Add an anime or load demo data if supported.
4. Open episode management.
5. Enter the episode number, title, and language.
6. Select a video file and upload it.
7. Verify that the episode streams correctly.

## 🚀 Deployment

### Frontend — Vercel

1. Push your project to GitHub.
2. Import the repository into [Vercel](https://vercel.com/).
3. Configure the required `VITE_*` environment variables.
4. Set `VITE_API_BASE_URL` to your deployed backend URL.
5. Deploy the frontend.

### Backend — Persistent Server

The backend stores video files on disk. Use a hosting service with persistent storage, such as a suitably configured VPS or a platform with persistent volumes.

After deploying the backend:

- Configure `CORS_ORIGIN` to allow your frontend domain.
- Set `PUBLIC_SERVER_URL` to the backend's public HTTPS URL.
- Update `VITE_API_BASE_URL` in Vercel.
- Redeploy the frontend.
- Verify video upload and streaming functionality.

**Note:** Deploying the frontend to Vercel does not automatically deploy the separate video backend.

## 🔐 Security

- Keep Firebase service account credentials private.
- Never commit `.env`, `.env.local`, or private key JSON files.
- Configure Firestore security rules before using the application publicly.
- Enforce administrator permissions on the backend, not only in the frontend.
- Restrict video upload types and file sizes.
- Use HTTPS for production video streaming.

## 🗂️ Project Structure

```text
anime-app/
├── src/
│   ├── firebase.ts
│   ├── api.ts
│   └── pages/
│       ├── Admin.tsx
│       └── VideoPlayer.tsx
├── server/
│   ├── index.js
│   ├── routes/
│   │   ├── videos.js
│   │   └── stream.js
│   ├── uploads/
│   ├── .env.example
│   └── serviceAccountKey.json
├── firestore.rules
├── .env.local.example
├── package.json
└── README.md
```

*This is an example structure based on the described architecture. Adjust filenames and directories to match your repository.*

## 🐛 Troubleshooting

| Issue | Possible solution |
|---|---|
| Firebase configuration error | Check `.env.local` and restart the frontend |
| Admin panel access denied | Verify the administrator email and security rules |
| Backend connection failed | Check the backend process and `VITE_API_BASE_URL` |
| Video upload fails | Check file size, permissions, and upload directory |
| Video does not play | Verify the format and browser codec support |
| Firestore deployment fails | Sign in with Firebase CLI and select the correct project |

## 🔮 Future Improvements

- 🔎 Anime search and advanced filtering
- ❤️ Favorites and watchlists
- 📱 Improved mobile experience
- 🌙 Dark mode
- 📺 Continue watching
- ⭐ Ratings and reviews
- 📚 Anime categories and recommendations

## 👨‍💻 Developer

**Created by Asadullo-dev** 🇺🇿

<p align="center">
  <a href="https://anime-theta-blue.vercel.app/">
    <img src="https://img.shields.io/badge/Explore-Anime%20App-8B5CF6?style=for-the-badge" alt="Explore Anime App"/>
  </a>
</p>

<p align="center">
  ⭐ If you like this project, consider starring the repository!
</p>

---

<p align="center">
  Made with ❤️ and ☕
</p>
