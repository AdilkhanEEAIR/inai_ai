import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLangStore } from '../../store'
import s from './Home.module.scss'

import heroVideo from '../../videos/video1.mp4'
import ctaVideo from '../../videos/video2.mp4'

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf: number
    let w = 0, h = 0
    const mouse = { x: -9999, y: -9999 }

    const resize = () => {
      w = canvas.width = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    })

    const N = 90
    type P = { x: number; y: number; vx: number; vy: number; r: number; alpha: number; pulse: number }
    const particles: P[] = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      pulse: Math.random() * Math.PI * 2,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 130) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(34,114,216,${(1 - dist / 130) * 0.22})`
            ctx.lineWidth = 0.6
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      particles.forEach((p) => {
        p.pulse += 0.02
        const mdx = p.x - mouse.x
        const mdy = p.y - mouse.y
        const md = Math.sqrt(mdx * mdx + mdy * mdy)
        if (md < 120) {
          p.vx += (mdx / md) * 0.08
          p.vy += (mdy / md) * 0.08
        }
        p.vx *= 0.995
        p.vy *= 0.995
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0
        const a = p.alpha + Math.sin(p.pulse) * 0.08
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(84,153,232,${a})`
        ctx.fill()
      })

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className={s.hero__canvas} />
}

function CountUp({ to }: { to: string }) {
  return <span>{to}</span>
}

export default function HomePage() {
  const { t } = useLangStore()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const features = [
    {
      icon: <ChatIcon />,
      title: t.nav.chatbot,
      desc: t.home.feat2desc,
      path: '/chatbot',
      gradient: 'linear-gradient(135deg, #00c6ff, #2272d8)',
    },
    {
      icon: <PhotoIcon />,
      title: t.nav.photoAnalysis,
      desc: t.home.feat3desc,
      path: '/photo',
      gradient: 'linear-gradient(135deg, #5499e8, #1857a8)',
    },
    {
      icon: <ScoringIcon />,
      title: t.nav.scoring,
      desc: t.home.feat1desc,
      path: '/scoring',
      gradient: 'linear-gradient(135deg, #2272d8, #134080)',
    },
  ]

  return (
    <div className={s.home}>
      <section className={s.hero}>
        <video className={s.hero__video} autoPlay loop muted playsInline>
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className={s.hero__overlay} />

        <ParticleCanvas />
        <div className={s.hero__orb1} />
        <div className={s.hero__orb2} />

        <div className={`${s.hero__content} ${visible ? s.visible : ''}`}>
          {/* badge убран */}

          <h1 className={s.hero__headline}>
            <span className={s.hero__headline_line1}>{t.home.headline1}</span>
            <br />
            <span className={s.hero__headline_gradient}>{t.home.headline2}</span>
          </h1>

          <p className={s.hero__subline}>{t.home.subline}</p>

          <div className={s.hero__stats}>
            <div className={s.hero__stat}>
              <span className={s.hero__stat_val}><CountUp to={t.home.stat1val} /></span>
              <span className={s.hero__stat_label}>{t.home.stat1label}</span>
            </div>
            <div className={s.hero__stat_divider} />
            <div className={s.hero__stat}>
              <span className={s.hero__stat_val}><CountUp to={t.home.stat2val} /></span>
              <span className={s.hero__stat_label}>{t.home.stat2label}</span>
            </div>
            <div className={s.hero__stat_divider} />
            <div className={s.hero__stat}>
              <span className={s.hero__stat_val}><CountUp to={t.home.stat3val} /></span>
              <span className={s.hero__stat_label}>{t.home.stat3label}</span>
            </div>
          </div>
        </div>

        <div className={s.hero__scroll}>
          <div className={s.hero__scroll_mouse}>
            <div className={s.hero__scroll_dot} />
          </div>
        </div>
      </section>

      <section className={s.mainBlock}>
        <video className={s.mainBlock__video} autoPlay loop muted playsInline>
          <source src={ctaVideo} type="video/mp4" />
        </video>
        <div className={s.mainBlock__overlay} />

        <div className={s.mainBlock__inner}>
          <div className={s.mainBlock__header}>
            <h2>{t.home.featuresTitle}</h2>
            <div className={s.mainBlock__line} />
          </div>

          <div className={s.cardsGrid}>
            {features.map((f, i) => (
              <div
                key={i}
                className={s.card}
                style={{ animationDelay: `${i * 120}ms` }}
                onClick={() => navigate(f.path)}
              >
                <div className={s.card__icon} style={{ background: f.gradient }}>
                  {f.icon}
                </div>
                <h3 className={s.card__title}>{f.title}</h3>
                <p className={s.card__desc}>{f.desc}</p>
                <div className={s.card__arrow}><ArrowIcon /></div>
              </div>
            ))}
          </div>

          <div className={s.ctaBanner}>
            <div className={s.ctaBanner__glow} />
            <h3>{t.common.startNow}</h3>
            <p>{t.common.freeDemo}</p>
            <button className="btn-accent" onClick={() => navigate('/scoring')}>
              <span>{t.home.ctaPrimary}</span>
              <ArrowIcon />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function ChatIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7l-4 4V6a2 2 0 0 1 2-2z" fill="currentColor" opacity=".9"/>
      <circle cx="8.5" cy="11" r="1.2" fill="#000"/>
      <circle cx="12" cy="11" r="1.2" fill="#000"/>
      <circle cx="15.5" cy="11" r="1.2" fill="#000"/>
    </svg>
  )
}
function PhotoIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="3" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="8.5" cy="9.5" r="2.5" fill="currentColor" opacity=".8"/>
      <path d="M22 15l-4-3-5 4-3-2-6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
function ScoringIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 12l2 2 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 17h-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}