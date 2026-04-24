import { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore, useLangStore } from '../../store'
import { LANGUAGES } from '../../i18n/translations'
import s from './Header.module.scss'

export default function Header() {
  const { user, logout } = useAuthStore()
  const { lang, t, setLang } = useLangStore()
  const navigate = useNavigate()

  const [scrolled, setScrolled] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)

  const langRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const currentLang = LANGUAGES.find((l: (typeof LANGUAGES)[0]) => l.code === lang)!
  const initials = user ? user.name.slice(0, 2).toUpperCase() : ''

  return (
    <header className={`${s.header} ${scrolled ? s.scrolled : ''}`}>
      <NavLink to="/" className={s.header__logo}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: 'linear-gradient(135deg, #1857a8, #00c6ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 800, color: '#fff', flexShrink: 0,
        }}>C</div>
        <span className={s['header__logo-text']}>
          Credit<span>Score</span>
        </span>
      </NavLink>

      <nav className={s.header__nav}>
        <NavLink to="/chatbot" className={({ isActive }) => isActive ? s.active : ''}>
          {t.nav.chatbot}
        </NavLink>
        <NavLink to="/photo" className={({ isActive }) => isActive ? s.active : ''}>
          {t.nav.photoAnalysis}
        </NavLink>
        <NavLink to="/scoring" className={({ isActive }) => isActive ? s.active : ''}>
          {t.nav.scoring}
        </NavLink>
      </nav>

      <div className={s.header__right}>
        <div className={s.header__lang} ref={langRef}>
          <button
            className={`${s['header__lang-btn']} ${langOpen ? s.open : ''}`}
            onClick={() => setLangOpen((v) => !v)}
          >
            <span className={s.flag}>{currentLang.flag}</span>
            <span className={s.code}>{currentLang.label}</span>
            <svg
              className={s.chevron}
              width="10" height="6" viewBox="0 0 10 6" fill="none"
              style={{ transform: langOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
            >
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {langOpen && (
            <div className={s['header__lang-dropdown']}>
              {LANGUAGES.map((l: (typeof LANGUAGES)[0]) => (
                <div
                  key={l.code}
                  className={`${s['header__lang-dropdown-item']} ${lang === l.code ? s.selected : ''}`}
                  onClick={() => { setLang(l.code); setLangOpen(false) }}
                >
                  <span className={s.flag}>{l.flag}</span>
                  <span className={s['lang-name']}>{l.label}</span>
                  {lang === l.code && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#00c6ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {user ? (
          <div className={s['header__auth-avatar']} ref={avatarRef}>
            <div
              className={s['header__auth-avatar-img']}
              onClick={() => setAvatarOpen((v) => !v)}
            >
              {initials}
            </div>
            {avatarOpen && (
              <div className={s['header__auth-avatar-menu']}>
                <div className={s['header__auth-avatar-menu-header']}>
                  <div className="name">{user.name}</div>
                  <div className="email">{user.email}</div>
                  <div className="role-badge">{user.role}</div>
                </div>
                <div
                  className={s['header__auth-avatar-menu-item']}
                  onClick={() => { navigate('/profile'); setAvatarOpen(false) }}
                >
                  <UserIcon /> {t.nav.profile}
                </div>
                <div
                  className={`${s['header__auth-avatar-menu-item']} ${s.danger}`}
                  onClick={() => { logout(); setAvatarOpen(false) }}
                >
                  <LogoutIcon /> {t.nav.logout}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={s['header__auth-buttons']}>
            <button
              className={s['header__auth-login']}
              onClick={() => navigate('/login')}
            >
              <LockIcon />
              {t.nav.login}
            </button>
            <button
              className={s['header__auth-register']}
              onClick={() => navigate('/login')}
            >
              <UserPlusIcon />
              {t.nav.register}
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="6" width="10" height="7" rx="2" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M4.5 6V4a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M2 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M9 10l3-3-3-3M12 7H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 2H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

function UserPlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M7 5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M2 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M10 1h4M12 3V-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}