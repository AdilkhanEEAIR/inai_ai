import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useLangStore } from '../../store'
import s from './Login.module.scss'

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
    if (!loginEmail || !loginPassword) {
      setError(t.auth.requiredFields)
      return
    }
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
      setRegError(t.auth.requiredFields)
      return
    }
    if (regData.password !== regData.confirmPassword) {
      setRegError(t.auth.passwordMismatch)
      return
    }
    if (regData.password.length < 6) {
      setRegError(t.auth.passwordTooShort)
      return
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

  const updateRegField = (field: string, value: string) => {
    setRegData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className={`page ${s.page}`}>
      <div className={s.card}>
        <div className={s.logo}>
          <div className={s.logo__icon}>C</div>
          <span>CreditScore <strong>AI</strong></span>
        </div>

        <div className={s.tabs}>
          <button
            className={`${s.tab} ${activeTab === 'login' ? s.active : ''}`}
            onClick={() => { setActiveTab('login'); setError(''); setRegError('') }}
          >
            {t.auth.loginTitle}
          </button>
          <button
            className={`${s.tab} ${activeTab === 'register' ? s.active : ''}`}
            onClick={() => { setActiveTab('register'); setError(''); setRegError('') }}
          >
            {t.auth.registerTitle}
          </button>
        </div>

        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className={s.form}>
            <p className={s.subtitle}>{t.auth.loginSubtitle}</p>
            <div className={s.field}>
              <label>{t.auth.email}</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className={s.field}>
              <label>{t.auth.password}</label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && <div className={s.error}>{error}</div>}

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px' }} disabled={isLoading}>
              {isLoading ? <><span className={s.spin} /><span>{t.common.enter}</span></> : <span>{t.auth.loginBtn}</span>}
            </button>
          </form>
        )}

        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className={s.form}>
            <p className={s.subtitle}>{t.auth.registerSubtitle}</p>
            <div className={s.formGrid}>
              <div className={s.field}>
                <label>{t.auth.fullName} *</label>
                <input
                  type="text"
                  placeholder="Иванов Иван Иванович"
                  value={regData.fullName}
                  onChange={(e) => updateRegField('fullName', e.target.value)}
                />
              </div>
              <div className={s.field}>
                <label>{t.auth.email} *</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={regData.email}
                  onChange={(e) => updateRegField('email', e.target.value)}
                />
              </div>
              <div className={s.field}>
                <label>{t.auth.phone}</label>
                <input
                  type="tel"
                  placeholder="+996 700 000 000"
                  value={regData.phone}
                  onChange={(e) => updateRegField('phone', e.target.value)}
                />
              </div>
              <div className={s.field}>
                <label>{t.auth.birthDate}</label>
                <input
                  type="date"
                  value={regData.birthDate}
                  onChange={(e) => updateRegField('birthDate', e.target.value)}
                />
              </div>
              <div className={s.field}>
                <label>{t.auth.monthlyIncome}</label>
                <input
                  type="number"
                  placeholder="150000"
                  value={regData.monthlyIncome}
                  onChange={(e) => updateRegField('monthlyIncome', e.target.value)}
                />
              </div>
              <div className={s.field}>
                <label>{t.auth.employmentYears}</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="3"
                  value={regData.employmentYears}
                  onChange={(e) => updateRegField('employmentYears', e.target.value)}
                />
              </div>
              <div className={s.field}>
                <label>{t.auth.password} *</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={regData.password}
                  onChange={(e) => updateRegField('password', e.target.value)}
                />
              </div>
              <div className={s.field}>
                <label>{t.auth.confirmPassword} *</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={regData.confirmPassword}
                  onChange={(e) => updateRegField('confirmPassword', e.target.value)}
                />
              </div>
            </div>

            {regError && <div className={s.error}>{regError}</div>}

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px' }} disabled={isLoading}>
              {isLoading ? <><span className={s.spin} /><span>{t.common.registering}</span></> : <span>{t.auth.registerBtn}</span>}
            </button>
          </form>
        )}

        <div className={s.divider}><span>{t.auth.orContinue}</span></div>

        <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/')}>
          {t.common.continueAsGuest}
        </button>
      </div>
    </div>
  )
}