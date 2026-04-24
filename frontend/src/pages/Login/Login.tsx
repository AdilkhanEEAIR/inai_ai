import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useLangStore } from '../../store'
import s from './Login.module.scss'

export default function LoginPage() {
  const { t } = useLangStore()
  const { login, isLoading, register } = useAuthStore()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [error, setError] = useState('')
  
  // Register form state
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
      setError('Заполните все поля')
      return
    }
    try {
      await login(loginEmail, loginPassword)
      navigate('/')
    } catch {
      setError('Неверный email или пароль')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegError('')
    
    if (!regData.fullName || !regData.email || !regData.password || !regData.confirmPassword) {
      setRegError('Заполните обязательные поля')
      return
    }
    if (regData.password !== regData.confirmPassword) {
      setRegError('Пароли не совпадают')
      return
    }
    if (regData.password.length < 6) {
      setRegError('Пароль должен содержать минимум 6 символов')
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
      setRegError('Ошибка регистрации. Попробуйте другой email.')
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

        {/* Tabs */}
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

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className={s.form}>
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
              {isLoading ? <><span className={s.spin} /><span>Входим...</span></> : <span>{t.auth.loginBtn}</span>}
            </button>
          </form>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className={s.form}>
            <div className={s.formGrid}>
              <div className={s.field}>
                <label>ФИО *</label>
                <input
                  type="text"
                  placeholder="Иванов Иван Иванович"
                  value={regData.fullName}
                  onChange={(e) => updateRegField('fullName', e.target.value)}
                />
              </div>
              <div className={s.field}>
                <label>Email *</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={regData.email}
                  onChange={(e) => updateRegField('email', e.target.value)}
                />
              </div>
              <div className={s.field}>
                <label>Телефон</label>
                <input
                  type="tel"
                  placeholder="+996 700 000 000"
                  value={regData.phone}
                  onChange={(e) => updateRegField('phone', e.target.value)}
                />
              </div>
              <div className={s.field}>
                <label>Дата рождения</label>
                <input
                  type="date"
                  value={regData.birthDate}
                  onChange={(e) => updateRegField('birthDate', e.target.value)}
                />
              </div>
              <div className={s.field}>
                <label>Ежемесячный доход (₸)</label>
                <input
                  type="number"
                  placeholder="150000"
                  value={regData.monthlyIncome}
                  onChange={(e) => updateRegField('monthlyIncome', e.target.value)}
                />
              </div>
              <div className={s.field}>
                <label>Стаж работы (лет)</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="3"
                  value={regData.employmentYears}
                  onChange={(e) => updateRegField('employmentYears', e.target.value)}
                />
              </div>
              <div className={s.field}>
                <label>Пароль *</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={regData.password}
                  onChange={(e) => updateRegField('password', e.target.value)}
                />
              </div>
              <div className={s.field}>
                <label>Подтверждение пароля *</label>
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
              {isLoading ? <><span className={s.spin} /><span>Регистрируем...</span></> : <span>{t.auth.registerBtn}</span>}
            </button>
          </form>
        )}

        <div className={s.divider}><span>{t.auth.orContinue}</span></div>

        <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/')}>
          Продолжить без входа
        </button>
      </div>
    </div>
  )
}