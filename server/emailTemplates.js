'use strict'

/**
 * Generates the HTML body for the registration confirmation email.
 * @param {object} member
 * @returns {string} HTML string
 */
function registrationEmail(member) {
  const { givenNames, surname, ref, state, lga, ward, email, createdAt } = member
  const fullName   = `${givenNames} ${surname}`
  const issuedDate = new Date(createdAt).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
  const expiryDate = new Date(
    new Date(createdAt).setFullYear(new Date(createdAt).getFullYear() + 2)
  ).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  return /* html */`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>NEXORA Membership Confirmed</title>
</head>
<body style="margin:0;padding:0;background:#f1f8f1;font-family:Inter,Arial,sans-serif;color:#1f2937;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f8f1;padding:32px 16px;">
    <tr><td align="center">

      <!-- Card -->
      <table width="600" cellpadding="0" cellspacing="0"
        style="background:#ffffff;border-radius:16px;overflow:hidden;
               box-shadow:0 8px 32px rgba(0,0,0,.12);max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0a1f0e 0%,#245c2a 100%);
                     padding:32px 36px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-right:12px;vertical-align:middle;">
                        <!-- Shield icon (inline SVG) -->
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6L12 2Z"
                            fill="#d4a017"/>
                          <path d="M8.5 12l2.5 2.5 5-5" stroke="#fff" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </td>
                      <td style="vertical-align:middle;">
                        <div style="font-size:15px;font-weight:800;color:#f0d060;
                                    letter-spacing:.08em;">NEXORA NIGERIA</div>
                        <div style="font-size:9px;color:rgba(255,255,255,.5);
                                    letter-spacing:.1em;text-transform:uppercase;margin-top:2px;">
                          Federal Civic Registry Infrastructure
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
                <td align="right" style="vertical-align:middle;">
                  <span style="display:inline-block;background:rgba(74,222,128,.15);
                               border:1px solid rgba(74,222,128,.35);border-radius:20px;
                               padding:5px 14px;font-size:11px;font-weight:700;
                               color:#86efac;letter-spacing:.07em;">
                    ✓ REGISTRATION CONFIRMED
                  </span>
                </td>
              </tr>
            </table>

            <div style="margin-top:24px;border-top:1px solid rgba(212,160,23,.25);
                        padding-top:18px;">
              <div style="font-size:13px;color:rgba(255,255,255,.6);
                          text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;">
                Welcome to the network,
              </div>
              <div style="font-size:26px;font-weight:900;color:#ffffff;letter-spacing:.02em;">
                ${fullName}
              </div>
            </div>
          </td>
        </tr>

        <!-- Success message -->
        <tr>
          <td style="padding:28px 36px 20px;">
            <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 16px;">
              Your NEXORA civic membership has been <strong style="color:#1a3d20;">
              successfully registered</strong>. Your encrypted National Digital Membership ID
              is now active and linked to your profile.
            </p>
            <p style="font-size:13px;color:#6b7280;line-height:1.65;margin:0;">
              Visit the member portal to download your digital ID card, view your membership
              benefits, and connect with your local governance chapter.
            </p>
          </td>
        </tr>

        <!-- Member details card -->
        <tr>
          <td style="padding:0 36px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:linear-gradient(135deg,#0a1f0e,#245c2a);
                     border-radius:12px;overflow:hidden;">
              <tr>
                <td style="padding:20px 22px;">

                  <!-- Card header row -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                    <tr>
                      <td style="font-size:9px;font-weight:800;color:#f0d060;
                                 letter-spacing:.1em;text-transform:uppercase;">
                        NEXORA NIGERIA — MEMBERSHIP DETAILS
                      </td>
                      <td align="right" style="font-size:9px;font-weight:700;color:#86efac;">
                        ✓ VERIFIED
                      </td>
                    </tr>
                  </table>

                  <!-- Details grid -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${[
                      ['MEMBER ID',  ref],
                      ['FULL NAME',  fullName],
                      ['EMAIL',      email],
                      ['STATE',      state],
                      ['LGA',        lga],
                      ['WARD',       ward],
                      ['ISSUED',     issuedDate],
                      ['EXPIRES',    expiryDate],
                    ].map(([label, value]) => `
                    <tr>
                      <td style="padding:5px 0;width:110px;vertical-align:top;">
                        <span style="font-size:9px;font-weight:700;color:rgba(255,255,255,.45);
                                     letter-spacing:.1em;">${label}</span>
                      </td>
                      <td style="padding:5px 0;vertical-align:top;">
                        <span style="font-size:11px;font-weight:600;
                                     color:rgba(255,255,255,.9);">${value || '--'}</span>
                      </td>
                    </tr>`).join('')}
                  </table>

                  <!-- Barcode simulation -->
                  <div style="margin-top:14px;padding-top:12px;
                              border-top:1px solid rgba(255,255,255,.1);
                              font-family:monospace;font-size:10px;
                              color:#f0d060;letter-spacing:.1em;">
                    ${ref}
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- What's next -->
        <tr>
          <td style="padding:0 36px 28px;">
            <div style="background:#f1f8f1;border:1.5px solid #c8e6c9;border-radius:10px;
                        padding:18px 20px;">
              <div style="font-size:11px;font-weight:800;color:#4b5563;
                          letter-spacing:.1em;text-transform:uppercase;margin-bottom:12px;">
                WHAT'S NEXT
              </div>
              ${[
                ['🪪', 'Your physical membership card will be dispatched within 14 working days.'],
                ['📢', "You'll receive verified civic bulletins and policy updates at this address."],
                ['🗳️', 'You can now participate in NEXORA community council assemblies.'],
                ['🤝', 'Connect with your State Chapter coordinator through the member portal.'],
              ].map(([emoji, text]) => `
              <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;">
                <span style="font-size:16px;line-height:1.3;flex-shrink:0;">${emoji}</span>
                <span style="font-size:13px;color:#374151;line-height:1.55;">${text}</span>
              </div>`).join('')}
            </div>
          </td>
        </tr>

        <!-- CTA button -->
        <tr>
          <td align="center" style="padding:0 36px 32px;">
            <a href="http://localhost:3000" target="_blank"
              style="display:inline-block;background:linear-gradient(135deg,#1a3d20,#2e7d32);
                     color:#ffffff;text-decoration:none;padding:14px 36px;
                     border-radius:8px;font-size:14px;font-weight:700;
                     letter-spacing:.04em;box-shadow:0 4px 14px rgba(36,92,42,.35);">
              Access Member Portal →
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0a1f0e;padding:20px 36px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:11px;color:rgba(255,255,255,.4);line-height:1.6;">
                  © 2025 NEXORA NIGERIA. Federal Civic Registry Infrastructure.<br/>
                  This email was sent to <strong style="color:rgba(255,255,255,.6);">${email}</strong>
                  because you registered on the NEXORA platform.<br/>
                  <a href="#" style="color:#f0d060;text-decoration:none;">Unsubscribe</a>
                  &nbsp;·&nbsp;
                  <a href="#" style="color:#f0d060;text-decoration:none;">Privacy Policy</a>
                  &nbsp;·&nbsp;
                  <a href="#" style="color:#f0d060;text-decoration:none;">Contact Support</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`
}

module.exports = { registrationEmail }
