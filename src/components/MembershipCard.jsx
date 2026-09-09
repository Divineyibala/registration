import React, { useRef } from 'react'
import styles from './MembershipCard.module.css'

/* ── helpers ── */
function Barcode({ seed = 42 }) {
  const bars = Array.from({ length: 38 }, (_, i) => {
    const h = 6 + Math.abs(Math.sin((i + seed) * 1.87) * 12)
    return <div key={i} className={styles.bar} style={{ height: `${h}px` }} />
  })
  return <div className={styles.barcode}>{bars}</div>
}

function QRMini() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-label="QR code placeholder">
      {/* outer squares */}
      <rect x="2"  y="2"  width="16" height="16" rx="2" stroke="rgba(255,255,255,.8)" strokeWidth="2" fill="none"/>
      <rect x="34" y="2"  width="16" height="16" rx="2" stroke="rgba(255,255,255,.8)" strokeWidth="2" fill="none"/>
      <rect x="2"  y="34" width="16" height="16" rx="2" stroke="rgba(255,255,255,.8)" strokeWidth="2" fill="none"/>
      {/* inner squares */}
      <rect x="6"  y="6"  width="8" height="8" fill="rgba(255,255,255,.8)"/>
      <rect x="38" y="6"  width="8" height="8" fill="rgba(255,255,255,.8)"/>
      <rect x="6"  y="38" width="8" height="8" fill="rgba(255,255,255,.8)"/>
      {/* data dots */}
      <rect x="22" y="2"  width="4" height="4" fill="rgba(255,255,255,.7)"/>
      <rect x="28" y="2"  width="4" height="4" fill="rgba(255,255,255,.7)"/>
      <rect x="22" y="8"  width="4" height="8" fill="rgba(255,255,255,.7)"/>
      <rect x="28" y="8"  width="8" height="4" fill="rgba(255,255,255,.7)"/>
      <rect x="34" y="20" width="4" height="4" fill="rgba(255,255,255,.7)"/>
      <rect x="40" y="20" width="8" height="4" fill="rgba(255,255,255,.7)"/>
      <rect x="2"  y="22" width="8" height="4" fill="rgba(255,255,255,.7)"/>
      <rect x="12" y="22" width="4" height="4" fill="rgba(255,255,255,.7)"/>
      <rect x="2"  y="28" width="4" height="8" fill="rgba(255,255,255,.7)"/>
      <rect x="8"  y="28" width="8" height="4" fill="rgba(255,255,255,.7)"/>
      <rect x="22" y="22" width="8" height="8" fill="rgba(255,255,255,.7)"/>
      <rect x="32" y="32" width="4" height="8" fill="rgba(255,255,255,.7)"/>
      <rect x="38" y="28" width="4" height="4" fill="rgba(255,255,255,.7)"/>
      <rect x="44" y="32" width="4" height="4" fill="rgba(255,255,255,.7)"/>
      <rect x="38" y="38" width="8" height="4" fill="rgba(255,255,255,.7)"/>
      <rect x="44" y="44" width="4" height="4" fill="rgba(255,255,255,.7)"/>
    </svg>
  )
}

function ShieldCheck() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6L12 2Z"
        fill="url(#mcg)"/>
      <path d="M8.5 12l2.5 2.5 5-5" stroke="#fff" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="mcg" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0d9488"/><stop offset="1" stopColor="#b45309"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

/* ── Main component ── */
export default function MembershipCard({ member }) {
  const printRef = useRef()

  const {
    givenNames = '', surname = '', dob = '', gender = '',
    email = '', phone = '',
    state = '', lga = '', ward = '',
    affiliation = '',
    photoPreview = null,
    ref: memberRef = '',
    createdAt = '',
  } = member

  const fullName    = `${givenNames} ${surname}`.trim().toUpperCase()
  const displayDOB  = dob  ? new Date(dob).toLocaleDateString('en-GB') : '--'
  const issuedDate  = createdAt ? new Date(createdAt).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')
  const expiryYear  = createdAt
    ? new Date(new Date(createdAt).setFullYear(new Date(createdAt).getFullYear() + 2))
        .toLocaleDateString('en-GB', { month:'2-digit', year:'numeric' })
    : '12/2027'

  const handlePrint = () => {
    const content = printRef.current
    const win = window.open('', '_blank', 'width=900,height=600')
    win.document.write(`
      <html><head><title>NEXORA Membership ID — ${fullName}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f1f8f1; display: flex; align-items: center;
               justify-content: center; min-height: 100vh; font-family: Inter, sans-serif; }
        .wrap { display: flex; gap: 24px; padding: 40px; flex-wrap: wrap; justify-content: center; }
      </style></head>
      <body><div class="wrap">${content.innerHTML}</div>
      <script>window.onload=()=>{window.print();window.close()}<\/script>
      </body></html>`)
    win.document.close()
  }

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.successIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="11" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.5"/>
              <path d="M7 12l4 4 6-6" stroke="#16a34a" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h2 className={styles.successTitle}>Registration Successful!</h2>
            <p className={styles.successSub}>
              Your NEXORA Membership ID has been generated. A confirmation email has been sent to{' '}
              <strong>{email}</strong>.
            </p>
          </div>
        </div>
        <button className={styles.printBtn} onClick={handlePrint}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <polyline points="6 9 6 2 18 2 18 9"/>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
          Print / Save
        </button>
      </div>

      {/* Ref number */}
      <div className={styles.refRow}>
        <span className={styles.refLabel}>Member Reference</span>
        <span className={styles.refNum}>{memberRef}</span>
      </div>

      {/* Cards */}
      <div ref={printRef} className={styles.cardsRow}>

        {/* ── FRONT ── */}
        <div className={styles.cardFront}>
          {/* card bg blobs */}
          <div className={styles.blob1} aria-hidden="true"/>
          <div className={styles.blob2} aria-hidden="true"/>

          {/* top strip */}
          <div className={styles.cardTopStrip}>
            <div className={styles.cardOrgRow}>
              <ShieldCheck/>
              <div>
                <div className={styles.cardOrgName}>NEXORA NIGERIA</div>
                <div className={styles.cardOrgSub}>FEDERAL CIVIC REGISTRY INFRASTRUCTURE</div>
              </div>
            </div>
            <div className={styles.cardVerifiedBadge}>✓ VERIFIED MEMBER</div>
          </div>

          {/* photo + details */}
          <div className={styles.cardBodyRow}>
            <div className={styles.cardPhotoWrap}>
              {photoPreview
                ? <img src={photoPreview} alt={`${fullName} photo`} className={styles.cardPhoto}/>
                : (
                  <div className={styles.cardPhotoPlaceholder}>
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="8" r="4" stroke="rgba(255,255,255,.5)" strokeWidth="1.5"/>
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                        stroke="rgba(255,255,255,.5)" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span>NO PHOTO</span>
                  </div>
                )
              }
              <div className={styles.cardPhotoLabel}>MEMBER PHOTO</div>
            </div>

            <div className={styles.cardInfoBlock}>
              <div className={styles.cardFullName}>{fullName || 'MEMBER FULL NAME'}</div>
              <div className={styles.cardInfoGrid}>
                <div className={styles.cardInfoItem}>
                  <span className={styles.iLabel}>DOB</span>
                  <span className={styles.iVal}>{displayDOB}</span>
                </div>
                <div className={styles.cardInfoItem}>
                  <span className={styles.iLabel}>GENDER</span>
                  <span className={styles.iVal}>{gender || '--'}</span>
                </div>
                <div className={styles.cardInfoItem}>
                  <span className={styles.iLabel}>STATE</span>
                  <span className={styles.iVal}>{state || '--'}</span>
                </div>
                <div className={styles.cardInfoItem}>
                  <span className={styles.iLabel}>LGA</span>
                  <span className={styles.iVal}>{lga || '--'}</span>
                </div>
                <div className={styles.cardInfoItem}>
                  <span className={styles.iLabel}>WARD</span>
                  <span className={styles.iVal}>{ward || '--'}</span>
                </div>
                {affiliation && affiliation !== 'None / Independent Resident' && (
                  <div className={styles.cardInfoItem} style={{ gridColumn: '1 / -1' }}>
                    <span className={styles.iLabel}>AFFILIATION</span>
                    <span className={styles.iVal}>{affiliation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* footer barcode */}
          <div className={styles.cardFrontFooter}>
            <Barcode seed={memberRef.length || 7} />
            <span className={styles.cardRefNum}>{memberRef || 'NX-2025-XXXX-XXXXX'}</span>
          </div>
        </div>

        {/* ── BACK ── */}
        <div className={styles.cardBack}>
          <div className={styles.blob1} aria-hidden="true"/>
          <div className={styles.blob2} aria-hidden="true"/>

          <div className={styles.cardBackStripe}/>

          <div className={styles.cardBackBody}>
            <div className={styles.cardBackHeader}>
              <div className={styles.cardOrgName} style={{fontSize:'9px', letterSpacing:'.1em'}}>
                NEXORA NIGERIA — MEMBERSHIP CARD (BACK)
              </div>
            </div>

            <div className={styles.backGrid}>
              <div className={styles.backItem}>
                <span className={styles.bLabel}>MEMBER ID</span>
                <span className={styles.bVal}>{memberRef}</span>
              </div>
              <div className={styles.backItem}>
                <span className={styles.bLabel}>FULL NAME</span>
                <span className={styles.bVal}>{fullName || '--'}</span>
              </div>
              <div className={styles.backItem}>
                <span className={styles.bLabel}>EMAIL</span>
                <span className={styles.bVal}>{email || '--'}</span>
              </div>
              <div className={styles.backItem}>
                <span className={styles.bLabel}>PHONE</span>
                <span className={styles.bVal}>{phone || '--'}</span>
              </div>
              <div className={styles.backItem}>
                <span className={styles.bLabel}>STATE / LGA</span>
                <span className={styles.bVal}>{state} {lga ? `/ ${lga}` : ''}</span>
              </div>
              <div className={styles.backItem}>
                <span className={styles.bLabel}>ISSUED</span>
                <span className={styles.bVal}>{issuedDate}</span>
              </div>
              <div className={styles.backItem}>
                <span className={styles.bLabel}>EXPIRES</span>
                <span className={styles.bVal}>{expiryYear}</span>
              </div>
            </div>

            <div className={styles.backQrRow}>
              <div className={styles.qrWrap}><QRMini/></div>
              <div className={styles.qrNote}>
                <p className={styles.qrTitle}>Scan to Verify</p>
                <p>This card is the property of the Federal Civic Registry Infrastructure.
                   If found, return to the nearest civic office.</p>
              </div>
            </div>

            <div className={styles.backDisclaimer}>
              This card confirms civic membership only and does not confer legal identity.
              Tampering invalidates membership. Report lost cards to ombudsman@nexora.ng
            </div>
          </div>
        </div>
      </div>

      {/* instructions */}
      <p className={styles.hint}>
        Click <strong>Print / Save</strong> to download or print your ID cards.
        Your physical card will be dispatched to your registered address within 14 working days.
      </p>
    </div>
  )
}
