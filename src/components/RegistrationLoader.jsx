import React, { useState, useEffect } from 'react'
import styles from './RegistrationLoader.module.css'

const PHASES = [
  { id: 1, icon: '🔐', label: 'Encrypting your data',          duration: 1200 },
  { id: 2, icon: '📡', label: 'Submitting to Civic Registry',  duration: 1400 },
  { id: 3, icon: '🪪', label: 'Generating Membership ID',      duration: 1300 },
  { id: 4, icon: '📧', label: 'Sending confirmation email',    duration: 1100 },
  { id: 5, icon: '✅', label: 'Registration complete!',        duration: 900  },
]

export default function RegistrationLoader({ name = '', onDone }) {
  const [phase, setPhase] = useState(0)   // 0-indexed phase
  const [done, setDone]   = useState(false)

  useEffect(() => {
    let timeout
    const advance = (idx) => {
      if (idx >= PHASES.length) {
        setDone(true)
        // Give the success tick animation time to play before handing off
        timeout = setTimeout(() => onDone?.(), 900)
        return
      }
      setPhase(idx)
      timeout = setTimeout(() => advance(idx + 1), PHASES[idx].duration)
    }
    advance(0)
    return () => clearTimeout(timeout)
  }, [])

  const current = PHASES[phase] || PHASES[PHASES.length - 1]
  const progressPct = Math.round(((phase + 1) / PHASES.length) * 100)

  return (
    <div className={styles.overlay} role="status" aria-live="polite"
      aria-label="Registering your membership, please wait">

      <div className={styles.card}>

        {/* Top shield icon */}
        <div className={`${styles.shieldWrap} ${done ? styles.shieldDone : ''}`}>
          {done ? (
            /* Big success tick */
            <svg className={styles.tickSvg} viewBox="0 0 80 80" fill="none"
              aria-hidden="true">
              <circle cx="40" cy="40" r="36" fill="none"
                stroke="url(#tickGrad)" strokeWidth="4"/>
              <path className={styles.tickPath}
                d="M22 40l12 12 24-24"
                stroke="url(#tickGrad)" strokeWidth="5"
                strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="tickGrad" x1="0" y1="0" x2="80" y2="80"
                  gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0d9488"/>
                  <stop offset="1" stopColor="#14b8a6"/>
                </linearGradient>
              </defs>
            </svg>
          ) : (
            /* Spinning ring */
            <svg className={styles.spinnerSvg} viewBox="0 0 80 80" fill="none"
              aria-hidden="true">
              <circle cx="40" cy="40" r="34" stroke="rgba(13,148,136,.15)"
                strokeWidth="6"/>
              <circle cx="40" cy="40" r="34"
                stroke="url(#spinGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="160"
                strokeDashoffset="40"
                className={styles.spinArc}/>
              <defs>
                <linearGradient id="spinGrad" x1="0" y1="0" x2="80" y2="80"
                  gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0d9488"/>
                  <stop offset="1" stopColor="#f59e0b"/>
                </linearGradient>
              </defs>
              {/* NEXORA shield inside spinner */}
              <path d="M40 22l-12 5v8c0 7.4 5.1 14.3 12 16 6.9-1.7 12-8.6 12-16v-8L40 22z"
                fill="url(#shieldInner)"/>
              <path d="M35 39l4 4 6-6" stroke="#fff" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="shieldInner" x1="28" y1="22" x2="52" y2="58"
                  gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0d9488"/>
                  <stop offset="1" stopColor="#0f172a"/>
                </linearGradient>
              </defs>
            </svg>
          )}
        </div>

        {/* Heading */}
        <div className={styles.heading}>
          {done
            ? <>Welcome aboard{name ? `, ${name.split(' ')[0]}` : ''}! 🎉</>
            : 'Processing Your Registration'
          }
        </div>

        {/* Sub-heading */}
        <p className={styles.sub}>
          {done
            ? 'Your NEXORA Membership ID is ready.'
            : 'Please wait — this only takes a moment.'
          }
        </p>

        {/* Progress bar */}
        <div className={styles.barWrap} aria-hidden="true">
          <div className={styles.barTrack}>
            <div
              className={styles.barFill}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className={styles.barPct}>{progressPct}%</span>
        </div>

        {/* Phase steps list */}
        <ul className={styles.phases}>
          {PHASES.map((p, i) => {
            const isComplete = i < phase || done
            const isActive   = i === phase && !done
            return (
              <li key={p.id}
                className={`${styles.phaseItem}
                  ${isComplete ? styles.phaseComplete : ''}
                  ${isActive   ? styles.phaseActive   : ''}
                `}>
                <span className={styles.phaseIconWrap} aria-hidden="true">
                  {isComplete
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        aria-hidden="true">
                        <path d="M20 6 9 17l-5-5" stroke="#0d9488"
                          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    : isActive
                      ? <span className={styles.activeDot}/>
                      : <span className={styles.pendingDot}/>
                  }
                </span>
                <span className={styles.phaseEmoji} aria-hidden="true">
                  {p.icon}
                </span>
                <span className={styles.phaseLabel}>{p.label}</span>
                {isActive && (
                  <span className={styles.phaseDots} aria-hidden="true">
                    <span/><span/><span/>
                  </span>
                )}
              </li>
            )
          })}
        </ul>

        {/* Security note */}
        <div className={styles.secNote}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          256-bit encrypted · Civic Act compliant
        </div>

      </div>
    </div>
  )
}
