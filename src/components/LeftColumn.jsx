import React, { useState } from 'react'
import styles from './LeftColumn.module.css'

const ShieldCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6L12 2Z"
      fill="url(#scg)"/>
    <path d="M8.5 12l2.5 2.5 5-5" stroke="#fff" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="scg" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0d9488"/><stop offset="1" stopColor="#0f172a"/>
      </linearGradient>
    </defs>
  </svg>
)

const ENTITLEMENTS = [
  { emoji: '📢', text: 'Receive NEXORA verified bulletins, priority policy updates, and civic alerts' },
  { emoji: '🤝', text: 'Connect directly with your State Chapter and Local Governance Coordinators' },
  { emoji: '🎁', text: 'Access youth empowerment resources, grants, and grassroots programs' },
  { emoji: '🗳️', text: 'Cast sovereign votes in NEXORA community council assemblies nationwide' },
  { emoji: '🪪', text: 'Encrypted National Digital NEXORA Membership ID with live verification barcode' },
]

function SampleCard() {
  const [side, setSide] = useState('front')
  return (
    <div className={styles.cardSection}>
      <div className={styles.cardSectionHeader}>
        <span className={styles.cardSectionLabel}>SAMPLE MEMBERSHIP ID CARD</span>
        <div className={styles.flipToggle}>
          {['front','back'].map(s => (
            <button key={s} className={`${styles.flipBtn} ${side===s?styles.flipBtnActive:''}`}
              onClick={() => setSide(s)}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>
          ))}
        </div>
      </div>

      {side === 'front' ? (
        <div className={styles.idCardFront}>
          <div className={styles.idCardBg}/>
          <div className={styles.idCardHeader}>
            <div className={styles.idCardLogoRow}>
              <ShieldCheck/>
              <div>
                <div className={styles.idCardOrgName}>NEXORA NIGERIA</div>
                <div className={styles.idCardOrgSub}>FEDERAL CIVIC REGISTRY</div>
              </div>
            </div>
            <span className={styles.idCardVerified}>✓ VERIFIED</span>
          </div>
          <div className={styles.idCardBody}>
            <div className={styles.idCardPhotoBox}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="8" r="4" stroke="rgba(255,255,255,.5)" strokeWidth="1.5"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="rgba(255,255,255,.5)"
                  strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className={styles.idPhotoLabel}>PHOTO</span>
            </div>
            <div className={styles.idCardDetails}>
              <div className={styles.idCardName}>MEMBER FULL NAME</div>
              <div className={styles.idCardRow}><span>DOB</span><span>--/--/----</span></div>
              <div className={styles.idCardRow}><span>STATE</span><span>Lagos State</span></div>
              <div className={styles.idCardRow}><span>LGA</span><span>Alimosho</span></div>
              <div className={styles.idCardRow}><span>WARD</span><span>Ward 04</span></div>
            </div>
          </div>
          <div className={styles.idCardFooter}>
            <div className={styles.idBarcode}>
              {Array.from({length:32}).map((_,i)=>(
                <div key={i} className={styles.idBar}
                  style={{height:`${6+Math.abs(Math.sin(i*1.9)*8)}px`}}/>
              ))}
            </div>
            <span className={styles.idCardNum}>NX-2025-##-#####</span>
          </div>
        </div>
      ) : (
        <div className={styles.idCardBack}>
          <div className={styles.idCardBg}/>
          <div className={styles.idBackStripe}/>
          <div className={styles.idBackBody}>
            <div className={styles.idBackRow}><span>LGA</span><span>Alimosho</span></div>
            <div className={styles.idBackRow}><span>CHAPTER</span><span>Lagos State</span></div>
            <div className={styles.idBackRow}><span>ISSUED</span><span>2025</span></div>
            <div className={styles.idBackRow}><span>EXPIRY</span><span>12/2026</span></div>
            <div className={styles.idBackQrRow}>
              <div className={styles.qrBox}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="2" y="2" width="9" height="9" rx="1" stroke="rgba(255,255,255,.7)" strokeWidth="1.2"/>
                  <rect x="13" y="2" width="9" height="9" rx="1" stroke="rgba(255,255,255,.7)" strokeWidth="1.2"/>
                  <rect x="2" y="13" width="9" height="9" rx="1" stroke="rgba(255,255,255,.7)" strokeWidth="1.2"/>
                  <rect x="4" y="4" width="5" height="5" fill="rgba(255,255,255,.7)"/>
                  <rect x="15" y="4" width="5" height="5" fill="rgba(255,255,255,.7)"/>
                  <rect x="4" y="15" width="5" height="5" fill="rgba(255,255,255,.7)"/>
                  <rect x="14" y="14" width="2" height="2" fill="rgba(255,255,255,.7)"/>
                  <rect x="18" y="14" width="2" height="4" fill="rgba(255,255,255,.7)"/>
                  <rect x="14" y="18" width="4" height="2" fill="rgba(255,255,255,.7)"/>
                </svg>
              </div>
              <p className={styles.qrText}>Scan to verify<br/>member identity</p>
            </div>
          </div>
        </div>
      )}
      <p className={styles.cardNote}>Card auto-updates as you fill in the form →</p>
    </div>
  )
}

export default function LeftColumn() {
  return (
    <aside className={styles.left}>
      <div className={styles.portalPill}>
        <ShieldCheck/> CITIZEN CIVIC PORTAL
      </div>

      <h1 className={styles.heading}>
        REGISTER AS A<br/>
        <span className={styles.headingAccent}>NEXORA<br/>MEMBER</span>
      </h1>

      <p className={styles.intro}>
        Join NEXORA as a registered member and become part of an empowered network of
        Nigerians committed to building resilient local communities and accelerating civic innovation.
      </p>

      <div className={styles.entitlementsCard}>
        <div className={styles.entitlementsLabel}>MEMBERSHIP ENTITLEMENTS</div>
        <ul className={styles.entitlementsList}>
          {ENTITLEMENTS.map((e,i) => (
            <li key={i} className={styles.entitlementsItem}>
              <span className={styles.entEmoji} aria-hidden="true">{e.emoji}</span>
              <span>{e.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.freeBanner}>
        <div className={styles.freeBannerIcon}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="rgba(212,160,23,.15)" stroke="var(--gold-500)" strokeWidth="1.5"/>
            <path d="M12 7v5l3 3" stroke="var(--gold-500)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <div className={styles.freeBannerTitle}>MEMBERSHIP IS 100% FREE</div>
          <p className={styles.freeBannerSub}>
            No fees, no assessment, no processing tariff. Your civic commitment is your only requirement.
          </p>
        </div>
      </div>

      <SampleCard />

      <div className={styles.trustRow}>
        <span className={styles.trustBadge}>🔒 256-bit Encrypted</span>
        <span className={styles.trustBadge}>✅ Civic Act Compliant</span>
        <span className={styles.trustBadge}>🇳🇬 NPC Registered</span>
      </div>
    </aside>
  )
}
