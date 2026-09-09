# NEXORA NIGERIA — Civic Registration Portal

A full-stack civic member registration and login interface built with **React + Vite** (frontend) and **Node.js + Express** (backend).

---

## Project Structure

```
registration/
├── src/                        # React frontend
│   ├── components/
│   │   ├── Navbar.jsx          # Top navigation + tab bar
│   │   ├── LeftColumn.jsx      # Branding, entitlements, ID card preview
│   │   ├── RegistrationForm.jsx# Multi-step form + login modal
│   │   └── Footer.jsx          # Footer with links
│   ├── data/
│   │   └── nigeriaData.js      # States, LGAs, Wards, Affiliations
│   ├── App.jsx                 # Root layout
│   └── main.jsx                # React entry point
├── server/
│   └── index.js                # Express API (register + login endpoints)
├── index.html
├── vite.config.js
└── package.json
```

---

## Getting Started

### 1. Install frontend dependencies (already done)
```bash
npm install
```

### 2. Run the frontend dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 3. Install & run the backend (separate terminal)
```bash
cd server
npm install
npm start
```
API runs on [http://localhost:5000](http://localhost:5000)

### 4. Build for production
```bash
npm run build
```

---

## API Endpoints

| Method | Path           | Description                         |
|--------|----------------|-------------------------------------|
| POST   | /api/register  | Submit registration (multipart)     |
| POST   | /api/login     | Member login (email + password)     |
| GET    | /api/health    | Server health check                 |

---

## Notes

- The backend uses an **in-memory store** — swap for MongoDB/PostgreSQL in production.
- Passwords are not yet hashed — add **bcrypt** + **JWT** before deploying.
- Photo uploads are saved to `server/uploads/`.
- The Vite dev server proxies `/api` requests to `localhost:5000`.
