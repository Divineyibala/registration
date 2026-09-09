# NEXORA NIGERIA — Civic Member Registration Portal

A full-stack civic member registration and digital identity platform built with **React + Vite** (frontend) and **Node.js + Express** (backend).

[![Deploy Status](https://img.shields.io/badge/deploy-GitHub%20Pages-0d9488?logo=github)](https://github.com)

---

## ✨ Features

| Feature | Details |
|---|---|
| Multi-step registration form | Identity → Location → Photo & Agreement |
| Digital Membership ID Card | Auto-generated front & back card with member photo, barcode, QR |
| Print / Download | Opens a print-ready card window directly in the browser |
| Confirmation email | Nodemailer sends a branded HTML email on every registration |
| Login modal | Existing members can sign in |
| Camera capture | Take a photo directly from the browser |
| Responsive design | Works on mobile, tablet, and desktop |
| Color theme | Deep Navy Blue + Electric Teal + Amber |

---

## 🗂 Project Structure

```
nexora-registration/
├── src/                        # React frontend
│   ├── components/
│   │   ├── Navbar.jsx          # Sticky top nav + tab bar
│   │   ├── LeftColumn.jsx      # Branding, entitlements, sample ID card
│   │   ├── RegistrationForm.jsx# 3-step form + login modal
│   │   ├── MembershipCard.jsx  # Generated ID card shown after registration
│   │   └── Footer.jsx          # Footer + newsletter strip
│   ├── data/
│   │   └── nigeriaData.js      # All 37 States, LGAs, Wards, Affiliations
│   ├── App.jsx
│   ├── App.module.css
│   ├── index.css               # Global CSS variables (single source of truth)
│   └── main.jsx
├── server/
│   ├── index.js                # Express API
│   ├── emailTemplates.js       # HTML email template
│   └── package.json
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.js
└── package.json
```

---

## 🚀 Running Locally

### 1 — Install frontend dependencies
```bash
npm install
```

### 2 — Start the frontend dev server
```bash
npm run dev
# → http://localhost:3000
```

### 3 — Start the backend (separate terminal)
```bash
cd server
npm install
npm start
# → http://localhost:5000
```

> The Vite dev server automatically proxies all `/api` requests to `localhost:5000`.

---

## 📧 Email Configuration

By default the server uses a free **Ethereal** catch-all account — no real email is sent.  
After each registration the console prints a **preview URL**:

```
📬  Email preview (Ethereal): https://ethereal.email/message/...
```

To send **real emails**, set these environment variables before starting the server:

```bash
# server/.env  (never commit this file)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=you@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=https://yourdomain.com
```

---

## 🌐 Deploying to GitHub Pages

### Step 1 — Create your GitHub repository
```bash
git init
git add .
git commit -m "feat: initial NEXORA registration portal"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nexora-registration.git
git push -u origin main
```

### Step 2 — Set your repo name in `vite.config.js`
Open `vite.config.js` and update:
```js
const REPO_NAME = '/nexora-registration'   // ← must match your GitHub repo name exactly
```
For a **custom domain** or a `username.github.io` repo, set it to `'/'`.

### Step 3 — Deploy
```bash
npm run deploy
```
This runs `npm run build` then pushes the `dist/` folder to the `gh-pages` branch automatically.

### Step 4 — Enable GitHub Pages
1. Go to your repo on GitHub → **Settings** → **Pages**
2. Under **Source**, select **Branch: `gh-pages`** → **/ (root)**
3. Click **Save**

Your site will be live at:
```
https://YOUR_USERNAME.github.io/nexora-registration/
```

### Re-deploying
Every time you push changes and want to update the live site:
```bash
npm run deploy
```

---

## 🔧 Customisation

| What | Where |
|---|---|
| Change brand colors | `src/index.css` — edit CSS variables in `:root` |
| Add more Nigerian states/LGAs | `src/data/nigeriaData.js` |
| Change org name / branding | `src/components/Navbar.jsx` and `src/components/LeftColumn.jsx` |
| Switch to a real database | `server/index.js` — replace the `members[]` array |
| Add password hashing | Install `bcryptjs`, hash on register, compare on login |
| Add JWT auth | Install `jsonwebtoken`, issue token on successful login |

---

## 🔒 Security Notes

- **Never commit** `.env`, `server/.env`, or `server/uploads/` — all are in `.gitignore`
- The backend uses an **in-memory store** — data is lost on restart. Plug in MongoDB or PostgreSQL for production
- Add **bcrypt** password hashing before deploying the login endpoint publicly
- The frontend-only GitHub Pages build does **not** include the backend — deploy the `server/` folder separately (Railway, Render, Fly.io, etc.) and update the `FRONTEND_URL` + Vite proxy target

---

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, CSS Modules |
| Backend | Node.js 20+, Express 4, Multer, Nodemailer |
| Deployment | GitHub Pages (frontend), any Node host (backend) |
| Styling | Pure CSS custom properties — no CSS framework |

---

## 📄 License

© 2025 NEXORA NIGERIA. Federal Civic Registry Infrastructure.  
All rights reserved.
