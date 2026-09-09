/* Vercel Serverless Function — POST /api/register
 *
 * Uses Vercel's built-in multipart body parsing (no formidable needed).
 * Falls back gracefully when Supabase env vars are not yet configured.
 *
 * Supabase table (run once in SQL editor):
 * ─────────────────────────────────────────
 * create table members (
 *   id           uuid primary key default gen_random_uuid(),
 *   ref          text unique not null,
 *   given_names  text not null,
 *   surname      text not null,
 *   dob          date not null,
 *   gender       text not null,
 *   email        text unique not null,
 *   phone        text not null,
 *   state        text not null,
 *   lga          text not null,
 *   ward         text not null,
 *   pvc          text,
 *   affiliation  text,
 *   address      text,
 *   photo_url    text,
 *   created_at   timestamptz default now()
 * );
 * alter table members enable row level security;
 * create policy "service role access" on members using (true) with check (true);
 *
 * Storage bucket: create one called `member-photos` in Supabase Storage.
 */

import { supabase } from './_lib/supabase.js'
import { sendConfirmationEmail } from './_lib/email.js'

// Tell Vercel to keep the raw body so we can read multipart data
export const config = {
  api: { bodyParser: { sizeLimit: '6mb' } },
}

const clean = (s) =>
  typeof s === 'string' ? s.trim().replace(/[<>"'`]/g, '') : ''

const genRef = () =>
  'NX-' + new Date().getFullYear() + '-' +
  Math.random().toString(36).slice(2, 6).toUpperCase() + '-' +
  Math.random().toString(36).slice(2, 7).toUpperCase()

export default async function handler(req, res) {
  // ── CORS ──────────────────────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST')
    return res.status(405).json({ message: 'Method not allowed' })

  // ── Check Supabase is configured ──────────────────────────────────────────
  if (!supabase) {
    return res.status(503).json({
      message: 'Database not configured. Please add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your Vercel environment variables.',
    })
  }

  try {
    // Vercel auto-parses JSON and URL-encoded bodies.
    // For multipart/form-data with a photo we read req.body (fields)
    // and handle the base64 photo separately sent as a JSON field.
    const body = req.body || {}

    const givenNames  = clean(body.givenNames  || '')
    const surname     = clean(body.surname     || '')
    const dob         = (body.dob         || '').trim()
    const gender      = clean(body.gender      || '')
    const email       = clean(body.email       || '')
    const phone       = clean(body.phone       || '')
    const state       = clean(body.state       || '')
    const lga         = clean(body.lga         || '')
    const ward        = clean(body.ward        || '')
    const pvc         = clean(body.pvc         || '')
    const affiliation = clean(body.affiliation || '')
    const address     = clean(body.address     || '')
    const agree       = body.agree
    const photoBase64 = body.photoBase64 || null   // optional base64 photo string

    // ── Validation ────────────────────────────────────────────────────────
    const errs = {}
    if (!givenNames)  errs.givenNames = 'Given name(s) required'
    if (!surname)     errs.surname    = 'Surname required'
    if (!dob)         errs.dob        = 'Date of birth required'
    if (!gender)      errs.gender     = 'Gender required'
    if (!phone)       errs.phone      = 'Phone required'
    if (!state)       errs.state      = 'State required'
    if (!lga)         errs.lga        = 'LGA required'
    if (!ward)        errs.ward       = 'Ward required'

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Valid email required'
    }

    if (!['true', '1', 'on'].includes(String(agree).toLowerCase())) {
      errs.agree = 'You must agree to the terms'
    }

    if (dob) {
      const age = (Date.now() - new Date(dob)) / (1000 * 60 * 60 * 24 * 365.25)
      if (age < 18) errs.dob = 'Must be 18 or older'
    }

    if (Object.keys(errs).length)
      return res.status(422).json({ message: 'Validation failed', errors: errs })

    // ── Duplicate email ───────────────────────────────────────────────────
    const { data: existing } = await supabase
      .from('members')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    if (existing) {
      return res.status(422).json({
        message: 'Validation failed',
        errors: { email: 'An account with this email already exists' },
      })
    }

    // ── Upload photo to Supabase Storage (if provided as base64) ──────────
    let photoUrl = null
    if (photoBase64) {
      try {
        // Strip data URI prefix: "data:image/jpeg;base64,..."
        const matches = photoBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9+.]+);base64,(.+)$/)
        if (matches) {
          const mimeType = matches[1]
          const base64Data = matches[2]
          const buffer = Buffer.from(base64Data, 'base64')
          const ext  = mimeType.split('/')[1].replace('jpeg', 'jpg')
          const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

          const { error: uploadErr } = await supabase.storage
            .from('member-photos')
            .upload(name, buffer, { contentType: mimeType, upsert: false })

          if (!uploadErr) {
            const { data: urlData } = supabase.storage
              .from('member-photos')
              .getPublicUrl(name)
            photoUrl = urlData?.publicUrl || null
          } else {
            console.warn('[photo]', uploadErr.message)
          }
        }
      } catch (photoErr) {
        console.warn('[photo error]', photoErr.message)
        // Don't fail registration because of a photo error
      }
    }

    // ── Insert member ─────────────────────────────────────────────────────
    const ref = genRef()
    const { data: member, error: insertErr } = await supabase
      .from('members')
      .insert({
        ref,
        given_names:  givenNames,
        surname,
        dob,
        gender,
        email:        email.toLowerCase(),
        phone,
        state,
        lga,
        ward,
        pvc:          pvc  || null,
        affiliation:  affiliation || null,
        address:      address     || null,
        photo_url:    photoUrl,
      })
      .select()
      .single()

    if (insertErr) {
      console.error('[insert]', insertErr.message)
      return res.status(500).json({ message: 'Failed to save registration. Please try again.' })
    }

    // ── Send confirmation email ───────────────────────────────────────────
    sendConfirmationEmail(member).catch(err =>
      console.error('[email]', err.message)
    )

    return res.status(201).json({
      message:   'Registration successful',
      ref:       member.ref,
      name:      `${member.given_names} ${member.surname}`,
      createdAt: member.created_at,
      photoUrl:  member.photo_url,
    })
  } catch (err) {
    console.error('[register]', err.message)
    return res.status(500).json({ message: 'Something went wrong. Please try again.' })
  }
}
