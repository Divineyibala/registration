/* Sends confirmation email via Nodemailer.
 * In production set SMTP_* env vars on Vercel.
 * In dev/preview falls back to Ethereal (logged to console). */

import nodemailer from 'nodemailer'

let _transporter = null

async function getTransporter() {
  if (_transporter) return _transporter

  if (process.env.SMTP_HOST) {
    _transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port:   Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  } else {
    const test = await nodemailer.createTestAccount()
    _transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email', port: 587, secure: false,
      auth: { user: test.user, pass: test.pass },
    })
    console.log('📧  Ethereal account:', test.user)
  }
  return _transporter
}

export async function sendConfirmationEmail(member) {
  try {
    const t = await getTransporter()
    const info = await t.sendMail({
      from:    '"NEXORA NIGERIA 🇳🇬" <no-reply@nexora.ng>',
      to:      member.email,
      subject: `✅ NEXORA Membership Confirmed — ${member.ref}`,
      html:    buildHtml(member),
      text:    `Welcome, ${member.given_names} ${member.surname}! Your ref: ${member.ref}`,
    })
    const preview = nodemailer.getTestMessageUrl(info)
    if (preview) console.log('📬  Email preview:', preview)
  } catch (err) {
    console.error('[email] failed:', err.message)
  }
}

function buildHtml(m) {
  const name = `${m.given_names} ${m.surname}`
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f0f5fb;font-family:Inter,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0"
  style="background:#fff;border-radius:16px;overflow:hidden;
         box-shadow:0 8px 32px rgba(15,23,42,.12);max-width:580px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#0f172a,#253350);padding:32px 36px 24px;">
    <div style="font-size:22px;font-weight:900;color:#fff;margin-bottom:4px;">NEXORA NIGERIA</div>
    <div style="font-size:10px;color:rgba(255,255,255,.5);letter-spacing:.1em;">FEDERAL CIVIC REGISTRY</div>
    <div style="margin-top:20px;font-size:26px;font-weight:800;color:#fff;">Welcome, ${name}</div>
  </td></tr>
  <tr><td style="padding:28px 36px;">
    <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 16px;">
      Your NEXORA civic membership has been <strong style="color:#0d9488;">successfully registered</strong>.
    </p>
    <table style="background:#f0fdfa;border:1.5px solid #ccfbf1;border-radius:10px;
                  padding:18px 20px;width:100%;margin-bottom:24px;" cellpadding="0" cellspacing="0">
      <tr><td style="font-size:9px;font-weight:800;color:#64748b;letter-spacing:.1em;
                     text-transform:uppercase;padding-bottom:12px;">MEMBERSHIP DETAILS</td></tr>
      ${[['MEMBER ID',m.ref],['FULL NAME',name],['EMAIL',m.email],
         ['STATE',m.state],['LGA',m.lga],['WARD',m.ward]]
        .map(([l,v])=>`<tr>
          <td style="font-size:9px;font-weight:700;color:#94a3b8;width:100px;padding:4px 0;">${l}</td>
          <td style="font-size:11px;font-weight:600;color:#1e293b;padding:4px 0;">${v||'—'}</td>
        </tr>`).join('')}
    </table>
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
      <a href="${process.env.FRONTEND_URL||'https://nexora-registration.vercel.app'}"
        style="display:inline-block;background:linear-gradient(135deg,#0f172a,#0d9488);
               color:#fff;text-decoration:none;padding:14px 36px;border-radius:8px;
               font-size:14px;font-weight:700;letter-spacing:.04em;">
        Access Member Portal →
      </a>
    </td></tr></table>
  </td></tr>
  <tr><td style="background:#0f172a;padding:18px 36px;">
    <div style="font-size:11px;color:rgba(255,255,255,.35);line-height:1.6;">
      © 2025 NEXORA NIGERIA. Federal Civic Registry Infrastructure.<br/>
      <a href="#" style="color:#f59e0b;text-decoration:none;">Unsubscribe</a> ·
      <a href="#" style="color:#f59e0b;text-decoration:none;">Privacy Policy</a>
    </div>
  </td></tr>
</table></td></tr></table></body></html>`
}
