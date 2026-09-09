import React, { useState, useRef, useEffect } from 'react'
import styles from './RegistrationForm.module.css'
import { STATES, LGAS, WARDS, AFFILIATIONS } from '../data/nigeriaData.js'
import MembershipCard from './MembershipCard.jsx'
import RegistrationLoader from './RegistrationLoader.jsx'

/* ── Icon helpers ── */
const Ic = ({ d, size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"><path d={d}/></svg>
)
const UserIc   = () => <Ic d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/>
const PhoneIc  = () => <Ic d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.8 19.8 0 0 1 1.08 3.4 2 2 0 0 1 3.07 1h3a2 2 0 0 1 2 1.72c.127.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 21 16l.92.92Z"/>
const MapIc    = () => <Ic d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0ZM12 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
const LinkIc   = () => <Ic d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
const CamIc    = () => <Ic d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2ZM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/>
const UpIc     = () => <Ic d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
const LockIc   = () => <Ic d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2ZM7 11V7a5 5 0 0 1 10 0v4" size={12}/>
const ChevIc   = () => <Ic d="M6 9l6 6 6-6" size={13}/>

/* ── Steps ── */
const STEPS = ['Identity', 'Location', 'Verification']

function StepBar({ current }) {
  return (
    <div className={styles.stepBar} role="list" aria-label="Registration steps">
      {STEPS.map((label, i) => {
        const num   = i + 1
        const state = num < current ? 'done' : num === current ? 'active' : 'idle'
        return (
          <React.Fragment key={label}>
            <div className={`${styles.step} ${styles[`step_${state}`]}`} role="listitem"
              aria-current={state === 'active' ? 'step' : undefined}>
              <div className={styles.stepCircle}>
                {state === 'done'
                  ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff"
                      strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                  : num}
              </div>
              <span className={styles.stepLabel}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`${styles.stepLine} ${state === 'done' ? styles.stepLineDone : ''}`} aria-hidden="true"/>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

/* ── Field helpers ── */
function FG({ label, required, hint, error, children }) {
  return (
    <div className={styles.fg}>
      <label className={styles.label}>
        {label}
        {required && <span className={styles.req} aria-hidden="true"> *</span>}
        {hint && <span className={styles.hint}> {hint}</span>}
      </label>
      {children}
      {error && <span className={styles.err} role="alert">{error}</span>}
    </div>
  )
}

const Inp = (props) => <input className={styles.inp} {...props}/>

function Sel({ children, ...p }) {
  return (
    <div className={styles.selWrap}>
      <select className={styles.sel} {...p}>{children}</select>
      <span className={styles.selArr} aria-hidden="true"><ChevIc/></span>
    </div>
  )
}

function SecTitle({ icon, title }) {
  return (
    <div className={styles.secTitle}>
      <span className={styles.secIcon}>{icon}</span>
      <h3 className={styles.secTitleText}>{title}</h3>
    </div>
  )
}

/* ── Login modal ── */
function LoginModal({ onClose }) {
  const [f, setF] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true)
    try {
      const res  = await fetch('/api/login', { method: 'POST',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) })
      const data = await res.json()
      if (!res.ok) { setErr(data.message || 'Login failed'); return }
      alert(`Welcome back, ${data.name}!`); onClose()
    } catch { setErr('Network error. Please try again.') }
    finally   { setLoading(false) }
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Member login">
      <div className={styles.modal}>
        <button className={styles.modalClose} onClick={onClose} aria-label="Close">×</button>
        <div className={styles.modalHead}>
          <div className={styles.modalIconWrap}><LockIc/></div>
          <h2 className={styles.modalTitle}>Member Login</h2>
          <p className={styles.modalSub}>Access your NEXORA membership portal</p>
        </div>
        <form onSubmit={submit} noValidate className={styles.modalForm}>
          <FG label="Email Address" required>
            <Inp type="email" placeholder="you@example.com" value={f.email}
              onChange={e => setF(p=>({...p,email:e.target.value}))} autoComplete="email" required/>
          </FG>
          <FG label="Password" required>
            <Inp type="password" placeholder="Your password" value={f.password}
              onChange={e => setF(p=>({...p,password:e.target.value}))}
              autoComplete="current-password" required/>
          </FG>
          {err && <p className={styles.errBox} role="alert">{err}</p>}
          <button type="submit" className={styles.loginSubmitBtn} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
          <p className={styles.forgotRow}><a href="#forgot">Forgot password?</a></p>
        </form>
      </div>
    </div>
  )
}

/* ── Main form ── */
const INIT = {
  givenNames:'', surname:'', dob:'', gender:'',
  email:'', phone:'',
  state:'', lga:'', ward:'', pvc:'',
  affiliation: 'None / Independent Resident', address:'',
  photo: null, photoPreview: null,
  agree: false,
}

function validateStep1(f) {
  const e = {}
  if (!f.givenNames.trim()) e.givenNames = 'Required'
  if (!f.surname.trim())    e.surname    = 'Required'
  if (!f.dob)               e.dob        = 'Required'
  if (!f.gender)            e.gender     = 'Required'
  if (!f.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Valid email required'
  if (!f.phone.trim())      e.phone      = 'Required'
  return e
}
function validateStep2(f) {
  const e = {}
  if (!f.state) e.state = 'Required'
  if (!f.lga)   e.lga   = 'Required'
  if (!f.ward)  e.ward  = 'Required'
  return e
}
function validateStep3(f) {
  const e = {}
  if (!f.agree) e.agree = 'You must agree to continue'
  return e
}

export default function RegistrationForm() {
  const [form, setForm]           = useState(INIT)
  const [errors, setErrors]       = useState({})
  const [step, setStep]           = useState(1)
  const [showLogin, setShowLogin] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [memberData, setMemberData] = useState(null)   // success state
  const [showLoader, setShowLoader] = useState(false)  // loading animation
  const [pendingMember, setPendingMember] = useState(null) // data ready but held until animation done
  const fileRef  = useRef()
  const videoRef = useRef()
  const streamRef= useRef()
  const [showCam, setShowCam] = useState(false)

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: '' }))
  }

  const lgas  = LGAS[form.state]  || LGAS['default']
  const wards = WARDS[form.lga]   || WARDS['default']

  /* photo */
  const onFile = (e) => {
    const file = e.target.files?.[0]; if (!file) return
    set('photo', file); set('photoPreview', URL.createObjectURL(file))
  }
  const openCam = async () => {
    setShowCam(true)
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) videoRef.current.srcObject = streamRef.current
    } catch { setShowCam(false) }
  }
  const closeCam = () => { streamRef.current?.getTracks().forEach(t=>t.stop()); setShowCam(false) }
  const snapPhoto = () => {
    const c = document.createElement('canvas')
    c.width = videoRef.current.videoWidth; c.height = videoRef.current.videoHeight
    c.getContext('2d').drawImage(videoRef.current, 0, 0)
    c.toBlob(b => { set('photo', b); set('photoPreview', URL.createObjectURL(b)) }, 'image/jpeg', .92)
    closeCam()
  }

  /* navigation */
  const goNext = () => {
    const e = step === 1 ? validateStep1(form) : validateStep2(form)
    if (Object.keys(e).length) { setErrors(e); return }
    setStep(s => Math.min(s + 1, 3))
  }
  const goBack = () => setStep(s => Math.max(s - 1, 1))

  /* submit */
  const handleSubmit = async (e) => {
    e.preventDefault()
    const e3 = validateStep3(form)
    if (Object.keys(e3).length) { setErrors(e3); return }
    setSubmitting(true)
    setShowLoader(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'photoPreview') return          // never send the object URL
        if (k === 'photo') {
          if (v) fd.append('photo', v, 'photo.jpg')  // blob/file only if set
          return
        }
        if (k === 'agree') {
          fd.append('agree', v ? 'true' : 'false')   // explicit string 'true'/'false'
          return
        }
        if (v !== null && v !== undefined) {
          fd.append(k, String(v))
        }
      })
      const res  = await fetch('/api/register', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) {
        setShowLoader(false)
        // Surface field-level errors from the server onto the form
        if (data.errors) {
          setErrors(data.errors)
          // Jump back to the step containing the first error
          const step1Fields = ['givenNames','surname','dob','gender','email','phone']
          const step2Fields = ['state','lga','ward']
          const errKeys = Object.keys(data.errors)
          if (errKeys.some(k => step1Fields.includes(k))) setStep(1)
          else if (errKeys.some(k => step2Fields.includes(k))) setStep(2)
          else setStep(3)
        }
        setErrors(prev => ({ ...prev, submit: data.message || 'Registration failed' }))
        return
      }
      // Stash the result — loader will reveal it once animation completes
      setPendingMember({
        ...form,
        ref:        data.ref,
        createdAt:  data.createdAt || new Date().toISOString(),
        // Use Supabase-stored photo URL if available, fall back to local preview
        photoPreview: data.photoUrl || form.photoPreview,
      })
    } catch {
      setShowLoader(false)
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  // Called by loader when its animation sequence finishes
  const handleLoaderDone = () => {
    setShowLoader(false)
    setMemberData(pendingMember)
  }

  // If API replied before animation finished, keep loader running
  // If API is still in flight when animation finishes, wait for data
  useEffect(() => {
    if (!showLoader && pendingMember && !memberData) {
      setMemberData(pendingMember)
    }
  }, [showLoader, pendingMember, memberData])

  /* ── Success: show ID card ── */
  if (memberData) {
    return (
      <div className={styles.card}>
        <div className={styles.cardPad}>
          <MembershipCard member={memberData}/>
        </div>
      </div>
    )
  }

  return (
    <>
      {showLoader && (
        <RegistrationLoader
          name={`${form.givenNames} ${form.surname}`.trim()}
          onDone={handleLoaderDone}
        />
      )}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)}/>}

      {showCam && (
        <div className={styles.camOverlay} role="dialog" aria-modal="true" aria-label="Take photo">
          <div className={styles.camBox}>
            <video ref={videoRef} autoPlay playsInline className={styles.camVideo}/>
            <div className={styles.camBtns}>
              <button type="button" className={styles.snapBtn} onClick={snapPhoto}>Capture Photo</button>
              <button type="button" className={styles.cancelCamBtn} onClick={closeCam}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.card}>
        {/* Header */}
        <div className={styles.cardHead}>
          <div className={styles.cardHeadTop}>
            <div>
              <h2 className={styles.cardTitle}>MEMBER REGISTRATION</h2>
              <p className={styles.cardSubtitle}>
                Complete the fields below to create your official NEXORA civic profile.
              </p>
            </div>
            <div className={styles.dotGrid} aria-hidden="true">
              {Array.from({length:9}).map((_,i)=>(
                <div key={i} className={styles.dot}/>
              ))}
            </div>
          </div>
          <StepBar current={step}/>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className={styles.form}>

          {/* ── Step 1 ── */}
          {step === 1 && (
            <div className={styles.stepBody}>
              <SecTitle icon={<UserIc/>} title="Personal Information"/>
              <p className={styles.ageTip}>Member must be 18 years or older.</p>
              <div className={styles.g2}>
                <FG label="Given Name(s)" required error={errors.givenNames}>
                  <Inp placeholder="e.g. Chinedu" value={form.givenNames}
                    onChange={e=>set('givenNames',e.target.value)} autoComplete="given-name"/>
                </FG>
                <FG label="Surname" required error={errors.surname}>
                  <Inp placeholder="e.g. Adeleke" value={form.surname}
                    onChange={e=>set('surname',e.target.value)} autoComplete="family-name"/>
                </FG>
              </div>
              <div className={styles.g2}>
                <FG label="Date of Birth" required error={errors.dob}>
                  <Inp type="date" value={form.dob} onChange={e=>set('dob',e.target.value)}
                    max={new Date(new Date().setFullYear(new Date().getFullYear()-18))
                      .toISOString().split('T')[0]}/>
                </FG>
                <FG label="Gender" required error={errors.gender}>
                  <Sel value={form.gender} onChange={e=>set('gender',e.target.value)}>
                    <option value="">Select Gender</option>
                    <option>Male</option><option>Female</option>
                    <option>Prefer not to say</option>
                  </Sel>
                </FG>
              </div>

              <SecTitle icon={<PhoneIc/>} title="Contact Information"/>
              <div className={styles.g2}>
                <FG label="Email Address" required error={errors.email}>
                  <Inp type="email" placeholder="you@example.com" value={form.email}
                    onChange={e=>set('email',e.target.value)} autoComplete="email"/>
                </FG>
                <FG label="Phone Number" required error={errors.phone}>
                  <Inp type="tel" placeholder="+234 803 123 4567" value={form.phone}
                    onChange={e=>set('phone',e.target.value)} autoComplete="tel"/>
                </FG>
              </div>
            </div>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <div className={styles.stepBody}>
              <SecTitle icon={<MapIc/>} title="Location & Electoral Ward"/>
              <div className={styles.g2}>
                <FG label="State of Origin" required error={errors.state}>
                  <Sel value={form.state}
                    onChange={e=>{set('state',e.target.value);set('lga','');set('ward','')}}>
                    <option value="">Select State</option>
                    {STATES.map(s=><option key={s}>{s}</option>)}
                  </Sel>
                </FG>
                <FG label="Local Government Area" required error={errors.lga}>
                  <Sel value={form.lga}
                    onChange={e=>{set('lga',e.target.value);set('ward','')}}
                    disabled={!form.state}>
                    <option value="">Select LGA</option>
                    {lgas.map(l=><option key={l}>{l}</option>)}
                  </Sel>
                </FG>
              </div>
              <div className={styles.g2}>
                <FG label="Ward" required error={errors.ward}>
                  <Sel value={form.ward} onChange={e=>set('ward',e.target.value)}
                    disabled={!form.lga}>
                    <option value="">Select Ward</option>
                    {wards.map(w=><option key={w}>{w}</option>)}
                  </Sel>
                </FG>
                <FG label="Voter Card Number (PVC)" hint="OPTIONAL">
                  <Inp placeholder="19-digit Voter ID Number" value={form.pvc}
                    onChange={e=>set('pvc',e.target.value.replace(/\D/g,'').slice(0,19))}/>
                </FG>
              </div>

              <SecTitle icon={<LinkIc/>} title="Affiliation & Address"/>
              <FG label="Civic Affiliation" hint="OPTIONAL">
                <Sel value={form.affiliation} onChange={e=>set('affiliation',e.target.value)}>
                  {AFFILIATIONS.map(a=><option key={a}>{a}</option>)}
                </Sel>
              </FG>
              <FG label="Residential Address" hint="OPTIONAL">
                <textarea className={styles.ta} rows={3}
                  placeholder="Residential address, town/city, state"
                  value={form.address} onChange={e=>set('address',e.target.value)}/>
              </FG>
            </div>
          )}

          {/* ── Step 3 ── */}
          {step === 3 && (
            <div className={styles.stepBody}>
              <SecTitle icon={<CamIc/>} title="Profile Photo"/>
              <p className={styles.photoDesc}>
                Upload a clear recent portrait. This photo will be embedded into your
                National Digital Membership ID card.
              </p>
              <div className={styles.photoArea}>
                <div className={styles.photoPreview}>
                  {form.photoPreview
                    ? <img src={form.photoPreview} alt="Preview" className={styles.photoImg}/>
                    : (
                      <div className={styles.photoPlaceholder}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <circle cx="12" cy="8" r="4" stroke="#d1d5db" strokeWidth="1.5"/>
                          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#d1d5db"
                            strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <span>No photo</span>
                      </div>
                    )
                  }
                </div>
                <div className={styles.photoActions}>
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/gif"
                    className={styles.fileInp} onChange={onFile} aria-label="Upload photo"/>
                  <button type="button" className={styles.uploadBtn}
                    onClick={()=>fileRef.current?.click()}>
                    <UpIc/> Upload Photo
                  </button>
                  <button type="button" className={styles.camBtn} onClick={openCam}>
                    <CamIc/> Take Photo
                  </button>
                  <p className={styles.photoHint}>JPG, PNG or GIF · Max 5 MB · High clarity recommended</p>
                </div>
              </div>

              <div className={styles.agreementBox}>
                <label className={styles.checkRow}>
                  <input type="checkbox" className={styles.checkboxHidden}
                    checked={form.agree} onChange={e=>set('agree',e.target.checked)}/>
                  <span className={`${styles.checkCustom} ${form.agree?styles.checkCustomOn:''}`} aria-hidden="true">
                    {form.agree && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff"
                        strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                    )}
                  </span>
                  <span className={styles.checkText}>
                    I solemnly attest that all information provided is accurate. I have read and agree to the
                    NEXORA <a href="#privacy" target="_blank" rel="noreferrer">Privacy Policy</a>,{' '}
                    <a href="#data-charter" target="_blank" rel="noreferrer">Data Protection Charter</a>, and{' '}
                    <a href="#conduct" target="_blank" rel="noreferrer">Civic Member Code of Conduct</a>.
                  </span>
                </label>
                {errors.agree && <span className={styles.err} role="alert">{errors.agree}</span>}
              </div>

              {errors.submit && (
                <div className={styles.errBox} role="alert">{errors.submit}</div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className={styles.nav}>
            {step > 1
              ? <button type="button" className={styles.backBtn} onClick={goBack}>← Back</button>
              : <div/>
            }
            {step < 3
              ? <button type="button" className={styles.nextBtn} onClick={goNext}>
                  Continue →
                </button>
              : <button type="submit" className={styles.submitBtn} disabled={submitting}>
                  {submitting
                    ? <><span className={styles.spinner}/>Submitting…</>
                    : <>Register as a Member <span aria-hidden="true">→</span></>
                  }
                </button>
            }
          </div>

          {step === 3 && (
            <div className={styles.secRow}>
              <LockIc/> 256-Bit Encrypted Data
              <span className={styles.sep}>·</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V6L12 2Z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
              Institutional Verification
            </div>
          )}
        </form>

        {/* Login CTA */}
        <div className={styles.loginCta}>
          Already a member?{' '}
          <button type="button" className={styles.loginCtaBtn}
            onClick={()=>setShowLogin(true)}>Sign in to your account</button>
        </div>
      </div>
    </>
  )
}
