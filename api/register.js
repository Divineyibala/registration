/* Vercel Serverless Function — POST /api/register
 *
 * Receives multipart/form-data (photo optional).
 * Saves member row to Supabase `members` table.
 * Uploads photo to Supabase Storage bucket `member-photos` (if provided).
 * Sends confirmation email.
 *
 * Required Supabase setup (run once in Supabase SQL editor):
 * ─────────────────────────────────────────────────────────
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
 *
 * Storage: create a bucket called `member-photos` (public: false).
 */

import formidable from 'formidable'
import { readFileSync } from 'fs'
import { supabase } from './_lib/supabase.js'
import { sendConfirmationEmail } from './_lib/email.js'

export const config = { api: { bodyParser: false } }

const clean = (s) => (typeof s === 'string' ? s.trim().replace(/[<>"'`]/g, '') : '')

const genRef = () =>
  'NX-' + new Date().getFullYear() + '-' +
  Math.random().toString(36).slice(2, 6).toUpperCase() + '-' +
  Math.random().toString(36).slice(2, 7).toUpperCase()

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024,
      keepExtensions: true,
      filter: ({ mimetype }) =>
        ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(mimetype),
    })
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })
}

export default async function handler(req, res) {
  // CORS headers (Vercel handles most, but explicit for preflight)
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  try {
    const { fields, files } = await parseForm(req)

    // formidable returns arrays for every field
    const f = (key) => clean(Array.isArray(fields[key]) ? fields[key][0] : fields[key] || '')
    const raw = (key) => Array.isArray(fields[key]) ? fields[key][0] : fields[key]

    const givenNames = f('givenNames')
    const surname    = f('surname')
    const dob        = raw('dob') || ''
    const gender     = f('gender')
    const email      = f('email')
    const phone      = f('phone')
    const state      = f('state')
    const lga        = f('lga')
    const ward       = f('ward')
    const pvc        = f('pvc')
    const affiliation= f('affiliation')
    const address    = f('address')
    const agree      = raw('agree')

    /* ── Validation ── */
    const errs = {}
    if (!givenNames) errs.givenNames = 'Given name(s) required'
    if (!surname)    errs.surname    = 'Surname required'
    if (!dob)        errs.dob        = 'Date of birth required'
    if (!gender)     errs.gender     = 'Gender required'
    if (!phone)      errs.phone      = 'Phone required'
    if (!state)      errs.state      = 'State required'
    if (!lga)        errs.lga        = 'LGA required'
    if (!ward)       errs.ward       = 'Ward required'

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Valid email required'
    }

    if (!['true', '1', 'on'].includes(String(agree).toLowerCase())) {
      errs.agree = 'Agreement required'
    }

    if (dob) {
      const age = (Date.now() - new Date(dob)) / (1000 * 60 * 60 * 24 * 365.25)
      if (age < 18) errs.dob = 'Must be 18 or older'
    }

    if (Object.keys(errs).length) {
      return res.status(422).json({ message: 'Validation failed', errors: errs })
    }

    /* ── Duplicate email check (Supabase) ── */
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

    /* ── Upload photo to Supabase Storage ── */
    let photoUrl = null
    const photoFile = files.photo?.[0] || files.photo
    if (photoFile?.filepath) {
      const buf  = readFileSync(photoFile.filepath)
      const ext  = (photoFile.originalFilename || 'photo.jpg').split('.').pop().toLowerCase()
      const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from('member-photos')
        .upload(name, buf, { contentType: photoFile.mimetype || 'image/jpeg', upsert: false })

      if (!uploadErr) {
        const { data: urlData } = supabase.storage
          .from('member-photos')
          .getPublicUrl(name)
        photoUrl = urlData?.publicUrl || null
      } else {
        console.warn('[photo upload]', uploadErr.message)
      }
    }

    /* ── Insert member into Supabase DB ── */
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
        pvc:          pvc || null,
        affiliation:  affiliation || null,
        address:      address || null,
        photo_url:    photoUrl,
      })
      .select()
      .single()

    if (insertErr) {
      console.error('[insert]', insertErr.message)
      return res.status(500).json({ message: 'Failed to save registration' })
    }

    /* ── Send confirmation email (fire-and-forget) ── */
    sendConfirmationEmail(member)

    return res.status(201).json({
      message:   'Registration successful',
      ref:       member.ref,
      name:      `${member.given_names} ${member.surname}`,
      createdAt: member.created_at,
      photoUrl:  member.photo_url,
    })
  } catch (err) {
    console.error('[register]', err.message)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
