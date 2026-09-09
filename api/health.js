import { supabase } from './_lib/supabase.js'

export default async function handler(req, res) {
  try {
    if (!supabase)
      return res.status(200).json({ status: 'ok', db: 'not configured', ts: new Date().toISOString() })

    const { count } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true })

    return res.status(200).json({ status: 'ok', members: count ?? 0, ts: new Date().toISOString() })
  } catch {
    return res.status(200).json({ status: 'ok', ts: new Date().toISOString() })
  }
}
