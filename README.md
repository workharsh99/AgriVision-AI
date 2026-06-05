# AgriVision AI 🌱

**AgriVision AI** is a modern, responsive, and full-featured precision agricultural crop disease detection and recommendation platform built using the MERN stack. It leverages Google's **Gemini AI** to diagnose crop pathogens from uploaded images and provides actionable organic/chemical treatment guides, irrigation frequencies, and soil fertilization suggestions.

## 🚀 Key Features

* **Instant Visual Crop Pathology**: Drag-and-drop or take a live camera photo of crop leaf surfaces to identify diseases with confidence ratings.
* **Smart Recommendation Engine**: Receives tailor-made chemical sprays, organic alternatives, exact dosages, and watering depths.
* **Agri Chat Assistant**: Farmers can ask crop questions (e.g., "Why are my leaves yellow?") using Voice Input (SpeechRecognition) and receive Voice Responses (SpeechSynthesis).
* **Farm Productivity Score**: History-based health scoring calculating active farm disease levels.
* **Crop Sowing Calendar**: Plan planting, fertilizing, and harvesting dates tailored to preferred crops.
* **Vector-grade PDF Reports**: Generate, print, or email reports containing verification QR codes and pathologist certifications.
* **Multi-Language Support**: Fully localized translations for English, Hindi, and Spanish.
* **Responsive Dark Mode**: Smooth HSL tailored color palette transitions suitable for field work.
* **Outbreak Analytics Dashboards**: Interactive charts (Bar & Doughnut) for admins to track global crop disease distributions.

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
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_key_here
GEMINI_API_KEY=your_google_gemini_api_key

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
