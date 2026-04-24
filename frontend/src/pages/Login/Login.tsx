import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useLangStore } from '../../store'
import logo from '../../images/logo.png'
import s from './Login.module.scss'

// ─── Country phone codes ──────────────────────────────────────
const COUNTRIES = [
  { code: 'KG', flag: '🇰🇬', name: 'Кыргызстан', prefix: '+996', mask: '### ### ###' },
  { code: 'RU', flag: '🇷🇺', name: 'Россия',      prefix: '+7',   mask: '### ###-##-##' },
  { code: 'KZ', flag: '🇰🇿', name: 'Казахстан',   prefix: '+7',   mask: '### ###-##-##' },
  { code: 'UZ', flag: '🇺🇿', name: 'Узбекистан',  prefix: '+998', mask: '## ###-##-##' },
  { code: 'CN', flag: '🇨🇳', name: 'Китай',       prefix: '+86',  mask: '### #### ####' },
  { code: 'DE', flag: '🇩🇪', name: 'Германия',    prefix: '+49',  mask: '### #######' },
  { code: 'FR', flag: '🇫🇷', name: 'Франция',     prefix: '+33',  mask: '# ## ## ## ##' },
  { code: 'US', flag: '🇺🇸', name: 'США',         prefix: '+1',   mask: '### ###-####' },
  { code: 'TR', flag: '🇹🇷', name: 'Турция',      prefix: '+90',  mask: '### ### ## ##' },
  { code: 'AE', flag: '🇦🇪', name: 'ОАЭ',         prefix: '+971', mask: '## ### ####' },
]

// ─── Phone input with country picker ─────────────────────────
function PhoneInput({
  value,
  onChange,
}: {
  value: string
  onChange: (val: string) => void
}) {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0])
  const [dropOpen, setDropOpen] = useState(false)
  const [phoneNum, setPhoneNum] = useState('')
  const dropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Только цифры
    const digits = e.target.value.replace(/\D/g, '')
    setPhoneNum(digits)
    onChange(`${selectedCountry.prefix}${digits}`)
  }

  const handleCountrySelect = (country: typeof COUNTRIES[0]) => {
    setSelectedCountry(country)
    setDropOpen(false)
    onChange(`${country.prefix}${phoneNum}`)
  }

  return (
    <div className={s.phoneWrap}>
      {/* Country selector */}
      <div className={s.countryBtn} onClick={() => setDropOpen(v => !v)}>
        <span className={s.countryFlag}>{selectedCountry.flag}</span>
        <span className={s.countryCode}>{selectedCountry.prefix}</span>
        <svg
          width="10" height="6" viewBox="0 0 10 6" fill="none"
          style={{ transform: dropOpen ? 'rotate(180deg)' : 'none', transition: '0.2s', opacity: 0.5 }}
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Dropdown */}
      {dropOpen && (
        <div className={s.countryDrop} ref={dropRef}>
          {COUNTRIES.map(c => (
            <div
              key={c.code}
              className={`${s.countryItem} ${c.code === selectedCountry.code ? s.selected : ''}`}
              onClick={() => handleCountrySelect(c)}
            >
              <span className={s.countryFlag}>{c.flag}</span>
              <span className={s.countryName}>{c.name}</span>
              <span className={s.countryPrefix}>{c.prefix}</span>
            </div>
          ))}
        </div>
      )}

      {/* Phone number input */}
      <input
        className={s.phoneInput}
        type="tel"
        inputMode="numeric"
        placeholder={selectedCountry.mask}
        value={phoneNum}
        onChange={handlePhoneChange}
      />
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────
export default function LoginPage() {
  const { t } = useLangStore()
  const { login, isLoading, register } = useAuthStore()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [error, setError] = useState('')

  const [regData, setRegData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthDate: '',
    monthlyIncome: '',
    employmentYears: '',
  })
  const [regError, setRegError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginEmail || !loginPassword) { setError(t.auth.requiredFields); return }
    try {
      await login(loginEmail, loginPassword)
      navigate('/')
    } catch {
      setError(t.auth.loginError)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegError('')
    if (!regData.fullName || !regData.email || !regData.password || !regData.confirmPassword) {
      setRegError(t.auth.requiredFields); return
    }
    if (regData.password !== regData.confirmPassword) {
      setRegError(t.auth.passwordMismatch); return
    }
    if (regData.password.length < 6) {
      setRegError(t.auth.passwordTooShort); return
    }
    if (regData.phone && regData.phone.replace(/\D/g, '').length < 7) {
      setRegError('Введите корректный номер телефона'); return
    }
    try {
      await register({
        fullName: regData.fullName,
        email: regData.email,
        password: regData.password,
        phone: regData.phone,
        birthDate: regData.birthDate,
        monthlyIncome: parseFloat(regData.monthlyIncome) || 0,
        employmentYears: parseFloat(regData.employmentYears) || 0,
      })
      navigate('/')
    } catch {
      setRegError(t.auth.registerError)
    }
  }

  const update = (field: string, value: string) =>
    setRegData(prev => ({ ...prev, [field]: value }))

  const switchTab = (tab: 'login' | 'register') => {
    setActiveTab(tab)
    setError('')
    setRegError('')
  }

  return (
    <div className={`page ${s.page}`}>
      <div className={s.card}>

        {/* Brand */}
        <div className={s.logo}>
          <img src={logo} alt="Кredиtоr" className={s.logo__img} />
          <span>Кredиtоr</span>
        </div>

        {/* Tabs */}
        <div className={s.tabs}>
          <button
            className={`${s.tab} ${activeTab === 'login' ? s.active : ''}`}
            onClick={() => switchTab('login')}
          >
            {t.auth.loginTitle}
          </button>
          <button
            className={`${s.tab} ${activeTab === 'register' ? s.active : ''}`}
            onClick={() => switchTab('register')}
          >
            {t.auth.registerTitle}
          </button>
        </div>

        {/* ── Login ── */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className={s.form}>
            <p className={s.subtitle}>{t.auth.loginSubtitle}</p>
            <div className={s.field}>
              <label>{t.auth.email}</label>
              <input type="email" placeholder="you@example.com"
                value={loginEmail} onChange={e => setLoginEmail(e.target.value)} autoComplete="email"/>
            </div>
            <div className={s.field}>
              <label>{t.auth.password}</label>
              <input type="password" placeholder="••••••••"
                value={loginPassword} onChange={e => setLoginPassword(e.target.value)} autoComplete="current-password"/>
            </div>
            {error && <div className={s.error}>{error}</div>}
            <button type="submit" className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '13px' }} disabled={isLoading}>
              {isLoading ? <><span className={s.spin}/><span>Входим...</span></> : <span>{t.auth.loginBtn}</span>}
            </button>
          </form>
        )}

        {/* ── Register ── */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className={s.form}>
            <p className={s.subtitle}>{t.auth.registerSubtitle}</p>
            <div className={s.formGrid}>
              <div className={`${s.field} ${s.fullWidth}`}>
                <label>{t.auth.fullName} *</label>
                <input type="text" placeholder="Иванов Иван Иванович"
                  value={regData.fullName} onChange={e => update('fullName', e.target.value)}/>
              </div>

              <div className={s.field}>
                <label>{t.auth.email} *</label>
                <input type="email" placeholder="you@example.com"
                  value={regData.email} onChange={e => update('email', e.target.value)}/>
              </div>

              <div className={s.field}>
                <label>{t.auth.birthDate}</label>
                <input type="date"
                  value={regData.birthDate} onChange={e => update('birthDate', e.target.value)}/>
              </div>

              {/* Phone with country picker */}
              <div className={`${s.field} ${s.fullWidth}`}>
                <label>{t.auth.phone}</label>
                <PhoneInput
                  value={regData.phone}
                  onChange={val => update('phone', val)}
                />
              </div>

              <div className={s.field}>
                <label>{t.auth.monthlyIncome}</label>
                <input type="number" placeholder="50000"
                  value={regData.monthlyIncome} onChange={e => update('monthlyIncome', e.target.value)}/>
              </div>

              <div className={s.field}>
                <label>{t.auth.employmentYears}</label>
                <input type="number" step="0.5" placeholder="3"
                  value={regData.employmentYears} onChange={e => update('employmentYears', e.target.value)}/>
              </div>

              <div className={s.field}>
                <label>{t.auth.password} *</label>
                <input type="password" placeholder="••••••••"
                  value={regData.password} onChange={e => update('password', e.target.value)}/>
              </div>

              <div className={s.field}>
                <label>{t.auth.confirmPassword} *</label>
                <input type="password" placeholder="••••••••"
                  value={regData.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}/>
              </div>
            </div>

            {regError && <div className={s.error}>{regError}</div>}

            <button type="submit" className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '13px' }} disabled={isLoading}>
              {isLoading
                ? <><span className={s.spin}/><span>{t.common?.registering ?? 'Регистрируем...'}</span></>
                : <span>{t.auth.registerBtn}</span>}
            </button>
          </form>
        )}

        <div className={s.divider}><span>{t.auth.orContinue}</span></div>
        <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}
          onClick={() => navigate('/')}>
          {t.common?.continueAsGuest ?? 'Продолжить без входа'}
        </button>
      </div>
    </div>
  )
}