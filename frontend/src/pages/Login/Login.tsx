import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useLangStore } from '../../store'
import s from './Login.module.scss'

export default function LoginPage() {
  const { t } = useLangStore()
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Заполните все поля'); return }
    try {
      await login(email, password)
      navigate('/')
    } catch {
      setError('Неверный email или пароль')
    }
  }

  return (
    <div className={`page ${s.page}`}>
      <div className={s.card}>
        <div className={s.logo}>
          <div className={s.logo__icon}>C</div>
          <span>CreditScore <strong>AI</strong></span>
        </div>
        <h1>{t.auth.loginTitle}</h1>
        <p className={s.subtitle}>Войдите для доступа к полному функционалу</p>

        <form onSubmit={handleSubmit} className={s.form}>
          <div className={s.field}>
            <label>{t.auth.email}</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className={s.field}>
            <label>{t.auth.password}</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <div className={s.error}>{error}</div>}

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px' }} disabled={isLoading}>
            {isLoading ? <><span className={s.spin} /><span>Входим...</span></> : <span>{t.auth.loginBtn}</span>}
          </button>
        </form>

        <div className={s.divider}><span>{t.auth.orContinue}</span></div>

        <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/')}>
          Продолжить без входа
        </button>

        <p className={s.register}>
          {t.auth.noAccount} <a href="#">{t.auth.register}</a>
        </p>
      </div>
    </div>
  )
}