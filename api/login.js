/* Vercel Serverless Function — POST /api/login */

import { supabase } from './_lib/supabase.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  try {
    const { email, password } = req.body || {}

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' })

    const { data: member, error } = await supabase
      .from('members')
      .select('ref, given_names, surname, email')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle()

    if (error || !member)
      return res.status(401).json({ message: 'No account found with this email' })

    // ⚠️  Password check: members table has no password column yet.
    // Add a `password_hash text` column and use bcryptjs to compare before going live.
    // For now we just confirm the email exists (demo only).

    return res.status(200).json({
      message: 'Login successful',
      ref:  member.ref,
      name: `${member.given_names} ${member.surname}`,
    })
  } catch (err) {
    console.error('[login]', err.message)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
