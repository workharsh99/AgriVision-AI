# Deployment Guide - AgriVision AI Platform

This document describes how to deploy the production-ready **AgriVision AI** application.

---

## 1. Database Setup: MongoDB Atlas

1. **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free shared cluster.
2. **Database Access User**:
   * Under **Security** -> **Database Access**, create a user with "Read and Write to any Database" privileges.
   * Save the password securely.
3. **Network Access (IP Whitelist)**:
   * Under **Security** -> **Network Access**, click **Add IP Address**.
   * Choose **Allow Access from Anywhere** (`0.0.0.0/0`) since Render's dynamically hosted services change outward-facing IP addresses.
4. **Retrieve Connection String**:
   * Navigate to **Database** -> Click **Connect** on your cluster -> Select **Drivers** (Node.js).
   * Copy the connection string. Replace `<password>` with your user's password. It should look like:
     `mongodb+srv://dbuser:<password>@cluster0.abcde.mongodb.net/agrivision?retryWrites=true&w=majority`

---

## 2. Backend Deployment: Render

Render is ideal for Node.js Express servers.

1. **Push Code to GitHub**: Create a repository on GitHub and commit your workspace contents.
2. **Log In to Render**: Connect Render to your GitHub account.
3. **Create a Web Service**:
   * In Render, click **New +** -> **Web Service**.
   * Select your GitHub repository.
4. **Configure Build Settings**:
   * **Name**: `agrivision-api`
   * **Root Directory**: `server` (Important: this isolates the backend)
   * **Environment**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
5. **Configure Environment Variables**:
   * Click **Advanced** -> **Add Environment Variable**:
     * `NODE_ENV` = `production`
     * `MONGO_URI` = *Your MongoDB Atlas Connection String*
     * `JWT_SECRET` = *A long random security string*
     * `GEMINI_API_KEY` = *Your Google AI Generative API Key*
6. **Deploy**: Render will build and launch the server. Copy the generated Web Service URL (e.g., `https://agrivision-api.onrender.com`).

---

## 3. Frontend Deployment: Vercel

Vercel is optimized for React/Vite builds.

1. **Log In to Vercel**: Connect your Vercel account to GitHub.
2. **Create New Project**:
   * Click **Add New** -> **Project**.
   * Import your GitHub repository.
3. **Configure Framework & Paths**:
   * **Framework Preset**: `Vite` (Vercel auto-detects this)
   * **Root Directory**: Click Edit and select the `client` folder.
4. **Configure Environment Variables**:
   * Add the following environment variable to link your client to the deployed backend:
     * `VITE_API_URL` = `https://your-backend-service-url.onrender.com/api`
       *(Example: `https://agrivision-api.onrender.com/api`)*
5. **Deploy**: Click **Deploy**. Vercel will install packages, compile Tailwind CSS, run Vite build output, and host the app statically.
6. **Configure CORS (If Needed)**:
   * By default, our backend Express server supports standard `cors()` allowing all origins. If you restrict it, ensure the Vercel app URL (e.g., `https://agrivision-ai.vercel.app`) is explicitly permitted in the backend server's `CORS` options.

---

## 4. Docker Deployment (Alternative Setup)

If you prefer containerized deployment, the repository contains configured `Dockerfile`s for both services and a root-level `docker-compose.yml`.

### Local Development / Testing
1. Create a root `.env` or set environment variables in your terminal:
   * `GEMINI_API_KEY` (Your Google AI API Key)
   * `JWT_SECRET` (Optional: Custom JWT key, otherwise falls back to default)
   * `VITE_API_URL` (Optional: Defaults to `http://localhost:5000/api`)
2. Run the multi-container stack from the root directory:
   ```bash
   docker compose up --build
   ```
3. Access the application:
   * Frontend: [http://localhost:5173](http://localhost:5173)
   * Backend API: [http://localhost:5000/api](http://localhost:5000/api)
   * MongoDB Local: `mongodb://localhost:27017`

### Production Container Deployment
* **Backend (`server/Dockerfile`)**: Build and run this image on any container orchestration platform (e.g., AWS ECS, GCP Cloud Run, Heroku, or Render Docker Web Services).
* **Frontend (`client/Dockerfile`)**: Uses Nginx to serve optimized static Vite assets with Single Page Application (SPA) routing support. Pass `VITE_API_URL` during build-time arguments (`--build-arg VITE_API_URL=https://your-api.com/api`).

---

## 5. Verification Check

Once both services are deployed:
1. Open the frontend application URL.
2. Register a new user and confirm that the registration succeeds (verifying frontend communication, backend CORS, and MongoDB write connectivity).
3. Perform a leaf scan and verify the Gemini AI response.
4. Download a PDF report to verify that jsPDF runs in the cloud client.
5. Check backend logs to verify SMTP email reports or simulated SMS alerts.

