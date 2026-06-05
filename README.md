# 🌱 AgriVision AI - Premium Crop Disease Detection & Smart Agriculture Platform

![Stack](https://img.shields.io/badge/Stack-MERN-green?style=flat-square)
![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20Tailwind-blue?style=flat-square)
![Backend](https://img.shields.io/badge/Backend-Node%20%7C%20Express-brightgreen?style=flat-square)
![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-yellowgreen?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-purple?style=flat-square)

A high-performance, responsive smart agricultural assistant and crop disease diagnostics dashboard built on the MERN stack. Powered by Google's **Gemini AI**, it analyzes uploaded crop foliage images to detect pathogens, returns confidence ratings, generates comprehensive PDF reports with pathologist verification QR codes, and delivers personalized watering, fertilization, and treatment recommendations.

---

## ✨ Features

### 🎨 Premium UI/UX Design System
* **Dark Mode & HSL Color Palette**: A gorgeous, field-optimized dark/light aesthetic using custom glassmorphic panels, smooth transitions, and high-contrast charts suitable for field work.
* **Micro-Animations & Responsive Layouts**: Built from the ground up to be fully mobile-responsive with fluid grid structures, hover scale effects, and animated state transitions.
* **Multi-Language Support**: Fully localized translations for English, Hindi, and Spanish to accommodate diverse farming demographics.

### 🤖 Generative AI Diagnostics & Assistant
* **Instant Pathogen Scanning**: Upload or capture plant leaf images to identify crop diseases instantly.
* **Voice-Enabled AI Chatbot**: Hands-free farming assistant supporting Voice Input (SpeechRecognition) and Voice Output (SpeechSynthesis) to answer questions in real-time.
* **Smart Recommendation Engine**: Tailor-made fertilization guides, chemical and organic pest controls, exact watering frequencies, and weather precautions.

### 📈 Outbreak Analytics & Reports
* **Interactive Dashboard**: Custom charts (Bar and Doughnut) using Chart.js to track scan histories and regional crop disease distributions.
* **Vector-grade PDF Reports**: Compile and download pathogen diagnostic certificates featuring verification QR codes and pathologist signatures.
* **Notification Dispatcher**: Automated SMTP email reports and simulated SMS alerts for crop hazard warnings.

---

## 📂 Repository Folder Structure

```text
AgriVisionAI/
├── client/                     # React (Vite) Frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Layout, Navbar, Footer, ProtectedRoute
│   │   ├── context/            # AuthContext, ThemeContext, LanguageContext
│   │   ├── pages/              # Home, About, Dashboard, UploadCrop, AIChat, Reports, Admin
│   │   ├── services/           # api.js Axios client
│   │   ├── utils/              # pdfGenerator.js helper using jsPDF
│   │   ├── App.jsx             # React routing grid
│   │   └── main.jsx            # DOM entry
│   ├── tailwind.config.js      # Custom theme colors config
│   └── package.json            # Client dependencies
│
└── server/                     # Node.js Express Backend
    ├── config/                 # db.js Mongoose connection configuration
    ├── controllers/            # auth, analysis, chat, admin controllers
    ├── middleware/             # authMiddleware (JWT & Admin checks)
    ├── models/                 # User, CropAnalysis, Report schemas
    ├── routes/                 # Express routing binders
    ├── services/               # geminiService, emailService, smsService
    ├── scripts/                # testConnection.js verification script
    ├── server.js               # Entry point
    └── package.json            # Node dependencies
```

---

## 🛠️ Tech Stack & Dependencies

### Frontend
* **Core**: React.js (Vite) + Tailwind CSS (v3 with Dark Mode)
* **Icons & Animation**: Lucide React + Framer Motion
* **Analytics**: Chart.js + React-Chartjs-2
* **Document Compile**: jsPDF
* **File Uploads**: React Dropzone
* **HTTP Client**: Axios

### Backend & Database
* **Server**: Node.js + Express.js
* **Database**: MongoDB Atlas + Mongoose
* **Files**: Multer (In-memory storage)
* **Auth**: JWT Authentication + BcryptJS password hashing
* **AI Model**: `@google/generative-ai` (Gemini 1.5 Flash)
* **Notification**: Nodemailer (Email reports) + console simulation (SMS alerts)

---

## ⚙️ Environment Configuration

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
# Connection URI for MongoDB. If you encounter querySrv DNS resolution errors (e.g. ECONNREFUSED) on Windows/Docker/VPNs,
# use the standard replica set URI format (mongodb://user:pass@host1:27017,host2:27017.../?ssl=true&authSource=admin...)
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/agrivision?retryWrites=true&w=majority
JWT_SECRET=your_jwt_signing_key_here
GEMINI_API_KEY=your_google_gemini_api_key_here
CLIENT_URL=http://localhost:5173

# Optional: SMTP Credentials for real email dispatching
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

---

## 📦 Local Quickstart

### 1. Start Backend Server
```bash
cd server
npm install
npm run start
# For Hot-reloads: npm run dev
```

### 2. Verify Credentials
To test your MongoDB Atlas and Gemini AI API Key health:
```bash
node scripts/testConnection.js
```

### 3. Start Frontend Client
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🐳 Docker Deployment

The application is containerized with multi-stage production Dockerfiles and orchestratable via `docker-compose`.

```bash
# Spin up MongoDB, Backend, and Frontend containers simultaneously
docker compose up --build
```
* **Frontend**: Accessible at [http://localhost:5173](http://localhost:5173) (Served via Nginx)
* **Backend**: Accessible at [http://localhost:5000](http://localhost:5000) (Served via Node/Express)

---

## 📝 Backend API Endpoints

### Authentication
* `POST /api/auth/register` - Create user and receive token
* `POST /api/auth/login` - Verify password and receive token
* `GET /api/auth/profile` - Fetch current user (Private)

### Crop Analysis & Reports
* `POST /api/analysis/upload` - Upload image file via Multer and diagnose with Gemini (Private)
* `GET /api/analysis/history` - Retrieve history list (Private, supports crop/date filters)
* `GET /api/analysis/:id` - Fetch single analysis detail (Private)
* `POST /api/analysis/:id/email` - Re-trigger PDF Email delivery (Private)
* `POST /api/analysis/:id/sms` - Dispatch SMS alert (Private)

### Voice AI Assistant
* `POST /api/chat` - Feed query history and query message to Gemini (Private)

### Weather Engine
* `GET /api/weather` - Fetch simulated agricultural weather for farmer's location (Private)

### System Administration (Admin Role Only)
* `GET /api/admin/analytics` - Crop scan distributions and health aggregates
* `GET /api/admin/users` - Fetch full user list
* `DELETE /api/admin/users/:id` - Remove user and all historic data
* `GET /api/admin/reports` - Fetch global crop scan reports list
* `DELETE /api/admin/reports/:id` - Remove any report from registry
