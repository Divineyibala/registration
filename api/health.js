/* Vercel Serverless Function — GET /api/health */
import { supabase } from './_lib/supabase.js'

export default async function handler(req, res) {
  try {
    const { count } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true })

    return res.status(200).json({
      status:  'ok',
      members: count ?? 0,
      ts:      new Date().toISOString(),
    })
  } catch {
    return res.status(200).json({ status: 'ok', ts: new Date().toISOString() })
  }
}
