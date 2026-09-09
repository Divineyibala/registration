# NEXORA NIGERIA — Civic Member Registration Portal

Full-stack civic registration platform with a React + Vite frontend, Vercel serverless API routes, Supabase PostgreSQL database, and Supabase Storage for member photos.

---

## Architecture

```
Browser (React / Vite)
       │
       ▼
Vercel CDN  →  /dist  (static frontend)
       │
       ▼
Vercel Functions  →  /api/register   /api/login   /api/health
       │
       ▼
Supabase
  ├── PostgreSQL  →  members table
  └── Storage     →  member-photos bucket
```

---

## Project Structure

```
nexora-registration/
├── api/                        ← Vercel serverless functions
│   ├── _lib/
│   │   ├── supabase.js         ← Supabase admin client
│   │   └── email.js            ← Nodemailer helper
│   ├── register.js             ← POST /api/register
│   ├── login.js                ← POST /api/login
│   └── health.js               ← GET  /api/health
├── src/                        ← React frontend
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── LeftColumn.jsx
│   │   ├── RegistrationForm.jsx
│   │   ├── RegistrationLoader.jsx
│   │   ├── MembershipCard.jsx
│   │   └── Footer.jsx
│   ├── data/nigeriaData.js
│   ├── index.css               ← CSS variables (single palette source)
│   └── App.jsx
├── server/                     ← Local-dev Express server (not deployed)
├── .env.example                ← Copy to .env and fill in secrets
├── vercel.json                 ← Vercel config
├── vite.config.js
└── package.json
```

---

## 1 — Supabase Setup (do this first)

### Create project
1. Go to [supabase.com](https://supabase.com) → New project
2. Note your **Project URL** and **API keys** (Settings → API)

### Create the `members` table
Run this in the Supabase **SQL Editor**:

```sql
create table members (
  id           uuid primary key default gen_random_uuid(),
  ref          text unique not null,
  given_names  text not null,
  surname      text not null,
  dob          date not null,
  gender       text not null,
  email        text unique not null,
  phone        text not null,
  state        text not null,
  lga          text not null,
  ward         text not null,
  pvc          text,
  affiliation  text,
  address      text,
  photo_url    text,
  created_at   timestamptz default now()
);

-- Enable Row Level Security and allow service role full access
alter table members enable row level security;
create policy "service role full access" on members
  using (true) with check (true);
```

### Create the `member-photos` storage bucket
1. Supabase Dashboard → **Storage** → New bucket
2. Name: `member-photos`
3. Keep **Public**: OFF (photos are accessed via signed URLs)

---

## 2 — Local Development

### Install dependencies
```bash
npm install
```

### Set up environment variables
```bash
cp .env.example .env
# Fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, etc.
```

### Run frontend (Vite dev server)
```bash
npm run dev
# → http://localhost:3000
```

### Run local API server (optional — mirrors production)
```bash
npm run server
# → http://localhost:5000
```

> Vite proxies `/api/*` to `localhost:5000` in dev so the same fetch URLs work everywhere.

---

## 3 — Deploy to Vercel

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "feat: NEXORA civic registration portal"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nexora-registration.git
git push -u origin main
```

### Step 2 — Import on Vercel
1. [vercel.com](https://vercel.com) → **Add New Project** → Import your GitHub repo
2. Framework preset: **Vite** (auto-detected)
3. Build command: `npm run build`  |  Output directory: `dist`

### Step 3 — Add Environment Variables on Vercel
In the Vercel project → **Settings → Environment Variables**, add:

| Variable | Value |
|---|---|
| `SUPABASE_URL` | `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | your service_role key |
| `SMTP_HOST` | e.g. `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_SECURE` | `false` |
| `SMTP_USER` | your Gmail address |
| `SMTP_PASS` | your 16-char Google App Password |
| `FRONTEND_URL` | `https://YOUR_PROJECT.vercel.app` |

> If `SMTP_*` vars are not set, Nodemailer falls back to an Ethereal test account and logs a preview URL to the Vercel function logs.

### Step 4 — Deploy
```bash
# Vercel auto-deploys on every push to main.
# Or trigger manually:
vercel --prod
```

---

## 4 — Email Setup (Gmail)

1. Google Account → Security → **2-Step Verification** → enable
2. Security → **App Passwords** → create one for "Mail"
3. Use the 16-character password as `SMTP_PASS`

---

## 5 — API Reference

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/register` | Register a new member (multipart/form-data) |
| `POST` | `/api/login` | Member sign-in (JSON) |
| `GET` | `/api/health` | Health check + member count |

---

## 6 — Customisation

| What | Where |
|---|---|
| Brand colors | `src/index.css` `:root` CSS variables |
| Nigerian states / LGAs | `src/data/nigeriaData.js` |
| Org name / branding | `src/components/Navbar.jsx`, `LeftColumn.jsx` |
| Email template | `api/_lib/email.js` `buildHtml()` |
| Add password auth | Add `password_hash` column to Supabase, install `bcryptjs` |
| Add JWT sessions | Install `jsonwebtoken`, issue token on login |

---

## Security Notes

- **Never commit `.env`** — it's in `.gitignore`
- **Service role key** stays server-side only (`api/_lib/supabase.js`)
- **Anon key** (`VITE_SUPABASE_ANON_KEY`) is the only Supabase key safe to expose to the browser
- Enable **Row Level Security** on all Supabase tables before going live
- Add **bcrypt** password hashing before enabling the login endpoint publicly

---

© 2025 NEXORA NIGERIA. Federal Civic Registry Infrastructure.
