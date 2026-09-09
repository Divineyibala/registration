'use strict'

const express  = require('express')
const cors     = require('cors')
const multer   = require('multer')
const path     = require('path')
const fs       = require('fs')
const nodemailer = require('nodemailer')
const { registrationEmail } = require('./emailTemplates.js')

const app  = express()
const PORT = process.env.PORT || 5000

/* ── Nodemailer transporter ──────────────────────────────────────────────────
 *
 *  PRODUCTION: replace the Ethereal test account below with real SMTP creds,
 *  e.g. Gmail OAuth2, SendGrid, Mailgun, etc.
 *
 *  DEVELOPMENT: the code automatically creates a free Ethereal preview account.
 *  After each registration the console prints a preview URL — open it in your
 *  browser to see the exact email that would be delivered.
 * ──────────────────────────────────────────────────────────────────────────── */
let transporter = null

async function getTransporter() {
  if (transporter) return transporter

  if (process.env.SMTP_HOST) {
    // Production / real SMTP
    transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port:   Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  } else {
    // Development: Ethereal catch-all (no real email sent)
    const testAccount = await nodemailer.createTestAccount()
    transporter = nodemailer.createTransport({
      host:   'smtp.ethereal.email',
      port:   587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    })
    console.log('📧  Ethereal test account ready:', testAccount.user)
  }

  return transporter
}

async function sendConfirmationEmail(member) {
  try {
    const t    = await getTransporter()
    const html = registrationEmail(member)

    const info = await t.sendMail({
      from:    '"NEXORA NIGERIA 🇳🇬" <no-reply@nexora.ng>',
      to:      member.email,
      subject: `✅ NEXORA Membership Confirmed — ${member.ref}`,
      html,
      text: `Welcome to NEXORA, ${member.givenNames} ${member.surname}!\n\n` +
            `Your membership reference is ${member.ref}.\n` +
            `State: ${member.state} | LGA: ${member.lga} | Ward: ${member.ward}\n\n` +
            `Visit http://localhost:3000 to access your member portal.\n\n` +
            `© 2025 NEXORA NIGERIA. Federal Civic Registry Infrastructure.`,
    })

    const previewUrl = nodemailer.getTestMessageUrl(info)
    if (previewUrl) {
      console.log(`📬  Email preview (Ethereal): ${previewUrl}`)
    }
    console.log(`[email] Sent to ${member.email} — MessageId: ${info.messageId}`)
  } catch (err) {
    // Never crash the registration because of an email failure
    console.error('[email] Failed to send confirmation:', err.message)
  }
}

/* ── Middleware ── */
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* ── Multer ── */
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename:    (_req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase()
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
    cb(null, name)
  },
})

const fileFilter = (_req, file, cb) => {
  const ok = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  ok.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error('Only image files accepted (JPG, PNG, GIF, WEBP)'), false)
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } })

/* ── In-memory store (swap for MongoDB/PostgreSQL in production) ── */
const members = []

/* ── Helpers ── */
const genRef = () =>
  'NX-' + new Date().getFullYear() + '-' +
  Math.random().toString(36).slice(2,6).toUpperCase() + '-' +
  Math.random().toString(36).slice(2,7).toUpperCase()

const clean = (s) => (typeof s === 'string' ? s.trim().replace(/[<>"'`]/g, '') : '')

/* ── POST /api/register ── */
app.post('/api/register', upload.single('photo'), async (req, res) => {
  try {
    const {
      givenNames, surname, dob, gender,
      email, phone,
      state, lga, ward, pvc,
      affiliation, address,
      agree,
    } = req.body

    /* Validation */
    const errs = {}
    if (!clean(givenNames))  errs.givenNames = 'Given name(s) required'
    if (!clean(surname))     errs.surname    = 'Surname required'
    if (!dob)                errs.dob        = 'Date of birth required'
    if (!gender)             errs.gender     = 'Gender required'
    if (!clean(email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Valid email required'
    } else if (members.some(m => m.email === clean(email).toLowerCase())) {
      errs.email = 'An account with this email already exists'
    }
    if (!clean(phone))       errs.phone      = 'Phone required'
    if (!state)              errs.state      = 'State required'
    if (!lga)                errs.lga        = 'LGA required'
    if (!ward)               errs.ward       = 'Ward required'
    if (![true, 'true', '1', 'on'].includes(agree))
      errs.agree = 'Agreement required'

    /* Age check */
    if (dob) {
      const age = (Date.now() - new Date(dob)) / (1000 * 60 * 60 * 24 * 365.25)
      if (age < 18) errs.dob = 'Must be 18 or older'
    }

    if (Object.keys(errs).length)
      return res.status(422).json({ message: 'Validation failed', errors: errs })

    const member = {
      ref:         genRef(),
      givenNames:  clean(givenNames),
      surname:     clean(surname),
      dob,
      gender:      clean(gender),
      email:       clean(email).toLowerCase(),
      phone:       clean(phone),
      state:       clean(state),
      lga:         clean(lga),
      ward:        clean(ward),
      pvc:         clean(pvc || ''),
      affiliation: clean(affiliation || ''),
      address:     clean(address || ''),
      photoFile:   req.file?.filename || null,
      createdAt:   new Date().toISOString(),
    }

    members.push(member)
    console.log(`[register] ✅  ${member.ref} — ${member.givenNames} ${member.surname}`)

    /* Fire-and-forget confirmation email */
    sendConfirmationEmail(member)

    return res.status(201).json({
      message:   'Registration successful',
      ref:       member.ref,
      name:      `${member.givenNames} ${member.surname}`,
      createdAt: member.createdAt,
    })
  } catch (err) {
    console.error('[register] Error:', err.message)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

/* ── POST /api/login ── */
app.post('/api/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' })

  const member = members.find(m => m.email === clean(email).toLowerCase())
  if (!member)
    return res.status(401).json({ message: 'No account found with this email' })

  /* In production: bcrypt.compare(password, member.passwordHash) */
  console.log(`[login]  ✅  ${member.ref}`)
  return res.json({
    message: 'Login successful',
    ref:     member.ref,
    name:    `${member.givenNames} ${member.surname}`,
  })
})

/* ── GET /api/health ── */
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', members: members.length, ts: new Date().toISOString() })
)

/* ── Multer / global error handler ── */
app.use((err, _req, res, _next) => {
  console.error('[error]', err.message)
  res.status(400).json({ message: err.message || 'Unexpected error' })
})

/* ── Start ── */
app.listen(PORT, () =>
  console.log(`\n🚀  NEXORA API running → http://localhost:${PORT}\n`)
)
