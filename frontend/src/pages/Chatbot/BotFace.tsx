import { useEffect, useRef, useState, useCallback } from 'react'
import s from './BotFace.module.scss'

interface EyePos { x: number; y: number }

const MAX_TRAVEL = 8
const DOWN_BIAS  = 0.65

const MOODS: Array<'smile' | 'grin' | 'neutral'> = [
  'smile', 'smile', 'smile', 'smile',
  'grin',
  'smile', 'smile',
  'neutral',
  'smile', 'grin',
]

// ─── Eye ──────────────────────────────────────────────────────
function Eye({
  side, pupilPos, isBlinking, isHovered,
}: {
  side: 'left' | 'right'
  pupilPos: EyePos
  isBlinking: boolean
  isHovered: boolean
}) {
  const px   = Math.max(-MAX_TRAVEL, Math.min(MAX_TRAVEL, pupilPos.x * MAX_TRAVEL))
  const rawY = pupilPos.y * MAX_TRAVEL + DOWN_BIAS * MAX_TRAVEL
  const py   = Math.max(-MAX_TRAVEL, Math.min(MAX_TRAVEL, rawY))
  const xOff = side === 'left' ? -20 : 20

  return (
    <div className={s.eye} style={{ transform: `translateX(${xOff}px)` }}>
      <div className={`${s.eye__outer} ${isHovered ? s.eye__outer_green : ''}`}>
        <div className={`${s.eye__lid} ${isBlinking ? s.blink : ''}`} />
        <div
          className={`${s.eye__pupil} ${isHovered ? s.eye__pupil_green : ''}`}
          style={{ transform: `translate(${px}px, ${py}px)` }}
        >
          <div className={`${s.eye__iris} ${isHovered ? s.eye__iris_green : ''}`} />
          <div className={`${s.eye__dot}  ${isHovered ? s.eye__dot_green  : ''}`} />
          <div className={s.eye__shine} />
        </div>
      </div>
    </div>
  )
}

// ─── Antenna ──────────────────────────────────────────────────
function Antenna({ wiggle }: { wiggle: boolean }) {
  return (
    <div className={`${s.antenna} ${wiggle ? s.wiggle : ''}`}>
      <div className={s.antenna__stem} />
      <div className={s.antenna__ball} />
    </div>
  )
}

// ─── Ear ──────────────────────────────────────────────────────
function Ear({ side }: { side: 'left' | 'right' }) {
  return (
    <div className={`${s.ear} ${s[side]}`}>
      <div className={s.ear__inner} />
    </div>
  )
}

// ─── Waving arm ───────────────────────────────────────────────
function WavingArm() {
  return (
    <div className={s.arm}>
      <div className={s.arm__upper} />
      <div className={s.arm__lower}>
        <div className={s.arm__hand}>
          <div className={s.arm__finger} />
          <div className={s.arm__finger} />
          <div className={s.arm__finger} />
        </div>
      </div>
    </div>
  )
}

// ─── Mouth — SVG arc, guaranteed visible smile ────────────────
// SVG quadratic bezier arc:
//   M x1,y  Q cx,cy  x2,y
// Moving control point (cy) up = wider smile, down = neutral/sad
function Mouth({ mood, isHovered }: { mood: 'smile' | 'grin' | 'neutral'; isHovered: boolean }) {
  // Arc params per mood
  //   x1, x2 = start/end X   y = baseline Y   cy = control Y (lower = more smile)
  const configs = {
    neutral: { x1: 14, x2: 46, y: 20, cy: 20, color: '#00c6ff', width: 2.5 },
    smile:   { x1: 10, x2: 50, y: 16, cy: 26, color: '#00c6ff', width: 3   },
    grin:    { x1:  6, x2: 54, y: 14, cy: 30, color: '#00e5ff', width: 3.5 },
  }

  const cfg = configs[mood]
  const color = isHovered ? '#5dff9e' : cfg.color

  return (
    <svg
      className={s.mouth}
      width="60"
      height="36"
      viewBox="0 0 60 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={`M ${cfg.x1} ${cfg.y} Q 30 ${cfg.cy} ${cfg.x2} ${cfg.y}`}
        stroke={color}
        strokeWidth={cfg.width}
        strokeLinecap="round"
        fill="none"
        className={s.mouth__path}
        style={{
          filter: isHovered
            ? 'drop-shadow(0 2px 6px rgba(93,255,165,0.6))'
            : 'drop-shadow(0 2px 8px rgba(0,198,255,0.5))',
          transition: 'stroke 0.35s ease, filter 0.35s ease',
        }}
      />
    </svg>
  )
}

// ─── Main ─────────────────────────────────────────────────────
export default function BotFace() {
  const containerRef = useRef<HTMLDivElement>(null)

  const [pupilPos,      setPupilPos]      = useState<EyePos>({ x: 0, y: 0 })
  const [isBlinking,    setIsBlinking]    = useState(false)
  const [mood,          setMood]          = useState<'smile' | 'grin' | 'neutral'>('smile')
  const [antennaWiggle, setAntennaWiggle] = useState(false)
  const [isHovered,     setIsHovered]     = useState(false)

  const isHoveredRef  = useRef(false)
  const blinkTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const moodTimerRef  = useRef<ReturnType<typeof setTimeout>>()

  // ── Mouse tracking ─────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx   = rect.left + rect.width  / 2
      const cy   = rect.top  + rect.height / 2
      const dx   = e.clientX - cx
      const dy   = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const norm = Math.min(dist / 350, 1)
      setPupilPos({ x: (dx / dist) * norm, y: (dy / dist) * norm })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // ── Blink ──────────────────────────────────────────────────
  const scheduleBlink = useCallback(() => {
    blinkTimerRef.current = setTimeout(() => {
      setIsBlinking(true)
      setTimeout(() => {
        setIsBlinking(false)
        if (Math.random() < 0.25) {
          setTimeout(() => {
            setIsBlinking(true)
            setTimeout(() => {
              setIsBlinking(false)
              scheduleBlink()
            }, 120)
          }, 200)
        } else {
          scheduleBlink()
        }
      }, 140)
    }, 2200 + Math.random() * 3200)
  }, [])

  useEffect(() => {
    scheduleBlink()
    return () => clearTimeout(blinkTimerRef.current)
  }, [scheduleBlink])

  // ── Mood timer ─────────────────────────────────────────────
  const scheduleMood = useCallback(() => {
    moodTimerRef.current = setTimeout(() => {
      if (!isHoveredRef.current) {
        const next = MOODS[Math.floor(Math.random() * MOODS.length)]
        setMood(next)
        if (next === 'grin') {
          setAntennaWiggle(true)
          setTimeout(() => setAntennaWiggle(false), 560)
        }
      }
      scheduleMood()
    }, 3500 + Math.random() * 4000)
  }, [])

  useEffect(() => {
    scheduleMood()
    return () => clearTimeout(moodTimerRef.current)
  }, [scheduleMood])

  // ── Hover ──────────────────────────────────────────────────
  const handleMouseEnter = () => {
    isHoveredRef.current = true
    setIsHovered(true)
    setMood('grin')
    setAntennaWiggle(true)
    setTimeout(() => setAntennaWiggle(false), 520)
  }

  const handleMouseLeave = () => {
    isHoveredRef.current = false
    setIsHovered(false)
    setMood('smile')
  }

  return (
    <div
      ref={containerRef}
      className={`${s.botFace} ${isHovered ? s.hovered : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={s.glow} />

      <div className={s.floater}>
        <Antenna wiggle={antennaWiggle} />

        <div className={s.body}>
          <div className={`${s.armSlot} ${isHovered ? s.armSlot_visible : ''}`}>
            <WavingArm />
          </div>

          <div className={s.head}>
            <Ear side="left" />
            <Ear side="right" />

            <div className={s.face}>
              <div className={s.face__glare} />
              <div className={s.eyes}>
                <Eye side="left"  pupilPos={pupilPos} isBlinking={isBlinking} isHovered={isHovered} />
                <Eye side="right" pupilPos={pupilPos} isBlinking={isBlinking} isHovered={isHovered} />
              </div>
              <Mouth mood={mood} isHovered={isHovered} />
            </div>
          </div>
        </div>

        <div className={s.shadow} />
      </div>
    </div>
  )
}