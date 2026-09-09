import React, { useState } from 'react'
import styles from './Navbar.module.css'

const ShieldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6L12 2Z"
      fill="url(#ng)" stroke="none"/>
    <path d="M8.5 12l2.5 2.5 5-5" stroke="#fff" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="ng" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0d9488"/>
        <stop offset="100%" stopColor="#0f172a"/>
      </linearGradient>
    </defs>
  </svg>
)

const UserIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
)

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        {/* Brand */}
        <a href="#home" className={styles.brand} aria-label="NEXORA NIGERIA home">
          <ShieldIcon />
          <div className={styles.brandText}>
            <span className={styles.brandName}>NEXORA NIGERIA</span>
            <span className={styles.brandTagline}>CONNECTING PEOPLE · BUILDING TOMORROW</span>
          </div>
        </a>

        {/* Nav */}
        <nav className={`${styles.nav} ${open ? styles.navOpen : ''}`} aria-label="Main navigation">
          {['Home','About','Programs','Contact'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className={styles.navLink}
              onClick={() => setOpen(false)}>{item}</a>
          ))}
        </nav>

        {/* Right actions */}
        <div className={styles.actions}>
          <a href="#register" className={styles.registerBtn}>Register Now</a>
          <button className={styles.userBtn} aria-label="Account"><UserIcon /></button>
          <button className={styles.menuBtn} onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu" aria-expanded={open}><MenuIcon /></button>
        </div>
      </div>

      {/* Tab bar */}
      <div className={styles.tabBar}>
        <div className={styles.tabInner}>
          <button className={`${styles.tab} ${styles.tabActive}`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
            PERSONAL MEMBERSHIP
            <span className={styles.liveDot} aria-hidden="true"/>
          </button>
          <button className={styles.tab}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <rect x="3" y="7" width="18" height="13" rx="2"/>
              <path d="M16 7V5a4 4 0 0 0-8 0v2"/>
            </svg>
            ORGANIZATION MEMBERSHIP
            <span className={styles.soonBadge}>SOON</span>
          </button>
          <div className={styles.cycleBadge}>
            <span className={styles.cycleGreen}/>
            Open Registration Cycle · Cohort 2025-Q2
          </div>
        </div>
      </div>
    </header>
  )
}
