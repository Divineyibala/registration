import React from 'react'
import styles from './Footer.module.css'

const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6L12 2Z"
      fill="url(#fg)"/>
    <path d="M8.5 12l2.5 2.5 5-5" stroke="#fff" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="fg" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#d4a017"/><stop offset="1" stopColor="#b8860b"/>
      </linearGradient>
    </defs>
  </svg>
)

const QUICK = [
  { label: 'National Overview',      href: '#overview'   },
  { label: 'Institutional Charter',  href: '#charter'    },
  { label: 'Local Governance Units', href: '#governance' },
  { label: 'Direct Voter Registry',  href: '#registry'   },
]

const TRUST = [
  { label: 'Privacy Policy',              href: '#privacy'    },
  { label: 'Terms of Civic Registry',     href: '#terms'      },
  { label: 'Identity Verification Shield',href: '#shield'     },
  { label: 'Ombudsman Desk',              href: '#ombudsman'  },
]

const BOTTOM = [
  { label: 'Data Protection', href: '#data'       },
  { label: 'Civic Compliance',href: '#compliance' },
  { label: 'Public Inquiries', href: '#inquiries' },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Gold top accent line */}
      <div className={styles.accentLine} aria-hidden="true"/>

      <div className={styles.inner}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandRow}>
            <ShieldIcon/>
            <div>
              <div className={styles.brandName}>Federal Civic Portal</div>
              <div className={styles.brandTagline}>NEXORA NIGERIA</div>
            </div>
          </div>
          <p className={styles.brandDesc}>
            Official community registration and civic engagement platform empowering citizens,
            validating resident affiliations, and advancing national digital identity standards.
          </p>
          <div className={styles.badges}>
            <span className={styles.badge}>🔒 National Encrypted Data</span>
            <span className={styles.badge}>✅ Civic Act Compliant</span>
          </div>
        </div>

        {/* Quick Access */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Quick Access</h4>
          <nav aria-label="Quick access links">
            <ul className={styles.linkList}>
              {QUICK.map(l => (
                <li key={l.href}>
                  <a href={l.href} className={styles.link}>
                    <span className={styles.linkArrow} aria-hidden="true">›</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Governance & Trust */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Governance &amp; Trust</h4>
          <nav aria-label="Governance and trust links">
            <ul className={styles.linkList}>
              {TRUST.map(l => (
                <li key={l.href}>
                  <a href={l.href} className={styles.link}>
                    <span className={styles.linkArrow} aria-hidden="true">›</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Newsletter strip */}
      <div className={styles.newsletter}>
        <div className={styles.newsletterInner}>
          <div className={styles.newsletterText}>
            <strong>Stay informed.</strong> Subscribe to civic bulletins and NEXORA policy updates.
          </div>
          <form className={styles.newsletterForm} onSubmit={e => e.preventDefault()}
            aria-label="Newsletter subscription">
            <input
              type="email"
              className={styles.newsletterInput}
              placeholder="your@email.com"
              aria-label="Email address for newsletter"
            />
            <button type="submit" className={styles.newsletterBtn}>Subscribe</button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <span className={styles.copyright}>
            © 2025 NEXORA NIGERIA. Federal Civic Registry Infrastructure. All rights reserved.
          </span>
          <div className={styles.bottomLinks}>
            {BOTTOM.map(l => (
              <a key={l.href} href={l.href} className={styles.bottomLink}>{l.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
