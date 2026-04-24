import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useLangStore } from '../../store'
import logo from '../../images/logo.png'
import s from './Profile.module.scss'

export default function ProfilePage() {
  const { user, logout } = useAuthStore()
  const { t } = useLangStore()
  const navigate = useNavigate()
  const [confirmLogout, setConfirmLogout] = useState(false)

  // Если не залогинен — редирект
  if (!user) {
    navigate('/login')
    return null
  }

  const initials = user.name.slice(0, 2).toUpperCase()

  const handleLogout = () => {
    if (confirmLogout) {
      logout()
      navigate('/')
    } else {
      setConfirmLogout(true)
      setTimeout(() => setConfirmLogout(false), 3000)
    }
  }

  // Данные для отображения
  const infoRows = [
    { icon: <PersonIcon />, label: 'ФИО',                value: user.fullName || user.name || '—' },
    { icon: <MailIcon />,   label: 'Email',               value: user.email || '—' },
    { icon: <PhoneIcon />,  label: 'Телефон',             value: user.phone || '—' },
    { icon: <CakeIcon />,   label: 'Дата рождения',       value: user.birthDate ? formatDate(user.birthDate) : '—' },
    { icon: <MoneyIcon />,  label: 'Ежемесячный доход',   value: user.monthlyIncome ? `${user.monthlyIncome.toLocaleString('ru')} сом` : '—' },
    { icon: <WorkIcon />,   label: 'Стаж работы',         value: user.employmentYears ? `${user.employmentYears} лет` : '—' },
    { icon: <ShieldIcon />, label: 'Роль',                value: getRoleLabel(user.role) },
  ]

  return (
    <div className={`page ${s.page}`}>
      <div className={s.inner}>

        {/* Header */}
        <div className={s.header}>
          <button className={s.backBtn} onClick={() => navigate(-1)}>
            <BackIcon /> Назад
          </button>
        </div>

        {/* Avatar card */}
        <div className={s.avatarCard}>
          <div className={s.avatar}>
            {initials}
            <div className={s.avatar__ring} />
          </div>
          <div className={s.avatarCard__info}>
            <h1>{user.fullName || user.name}</h1>
            <span className={s.roleBadge}>{getRoleLabel(user.role)}</span>
          </div>
          <img src={logo} alt="logo" className={s.avatarCard__logo} />
        </div>

        {/* Info grid */}
        <div className={s.infoCard}>
          <div className={s.infoCard__title}>
            <InfoIcon /> Личные данные
          </div>
          <div className={s.infoGrid}>
            {infoRows.map((row, i) => (
              <div key={i} className={s.infoRow}>
                <div className={s.infoRow__icon}>{row.icon}</div>
                <div className={s.infoRow__content}>
                  <span className={s.infoRow__label}>{row.label}</span>
                  <span className={s.infoRow__value}>{row.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className={s.actions}>
          <button
            className={s.actionBtn}
            onClick={() => navigate('/scoring')}
          >
            <ScoringIcon />
            <span>Перейти к скорингу</span>
            <ArrowIcon />
          </button>

          <button
            className={`${s.actionBtn} ${s.danger} ${confirmLogout ? s.confirm : ''}`}
            onClick={handleLogout}
          >
            <LogoutIcon />
            <span>{confirmLogout ? 'Нажмите ещё раз для выхода' : t.nav.logout}</span>
          </button>
        </div>

      </div>
    </div>
  )
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString('ru-RU', {
      day: '2-digit', month: 'long', year: 'numeric'
    })
  } catch { return d }
}

function getRoleLabel(role: string) {
  const map: Record<string, string> = {
    client:   'Клиент',
    employee: 'Сотрудник банка',
    admin:    'Администратор',
  }
  return map[role] ?? role
}

// ─── Icons ────────────────────────────────────────────────────
function PersonIcon()  { return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M2.5 13c0-3.04 2.46-5.5 5.5-5.5s5.5 2.46 5.5 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> }
function MailIcon()    { return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> }
function PhoneIcon()   { return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 2h3l1.5 3.5-1.5 1a8 8 0 0 0 3.5 3.5l1-1.5L14 10v3a1 1 0 0 1-1 1A11 11 0 0 1 2 3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function CakeIcon()    { return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="7" width="14" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M4 7V5m4 2V4m4 3V5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M4 5c0-1 .5-2 0-3m4 3c0-1 .5-2 0-3m4 3c0-1 .5-2 0-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> }
function MoneyIcon()   { return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/><path d="M4 8h.01M12 8h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> }
function WorkIcon()    { return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="5" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M5 5V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M1 9h14" stroke="currentColor" strokeWidth="1.4"/></svg> }
function ShieldIcon()  { return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1.5l5.5 2v4c0 3.5-2.5 6-5.5 7C5 13.5 2.5 11 2.5 7.5v-4L8 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg> }
function InfoIcon()    { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/><path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg> }
function BackIcon()    { return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function ScoringIcon() { return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M4 10l2.5-2.5L9 10l3-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function LogoutIcon()  { return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> }
function ArrowIcon()   { return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg> }