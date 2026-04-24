import { useEffect, useRef, useState, useCallback } from 'react'
import s from './BotFace.module.scss'

interface EyePos {
  x: number
  y: number
}

const MAX_TRAVEL = 8
const DOWN_BIAS  = 0.65

// ─── Eye ─────────────────────────────────────────────────────
function Eye({
  side,
  pupilPos,
  isBlinking,
  isHovered,
}: {
  side: 'left' | 'right'
  pupilPos: EyePos
  isBlinking: boolean
  isHovered: boolean
}) {
  const px = Math.max(-MAX_TRAVEL, Math.min(MAX_TRAVEL, pupilPos.x * MAX_TRAVEL))
  const rawY = pupilPos.y * MAX_TRAVEL + DOWN_BIAS * MAX_TRAVEL
  const py = Math.max(-MAX_TRAVEL, Math.min(MAX_TRAVEL, rawY))
  const xOffset = side === 'left' ? -20 : 20

  return (
    <div className={s.eye} style={{ transform: `translateX(${xOffset}px)` }}>
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

// ─── Antenna ─────────────────────────────────────────────────
function Antenna({ wiggle }: { wiggle: boolean }) {
  return (
    <div className={`${s.antenna} ${wiggle ? s.wiggle : ''}`}>
      <div className={s.antenna__stem} />
      <div className={s.antenna__ball} />
    </div>
  )
}

// ─── Ear ─────────────────────────────────────────────────────
function Ear({ side }: { side: 'left' | 'right' }) {
  return (
    <div className={`${s.ear} ${s[side]}`}>
      <div className={s.ear__inner} />
    </div>
  )
}

// ─── Arm — only rendered on hover (left side = bot's right arm) ──
function WavingArm() {
  return (
    <div className={s.arm}>
      {/* upper arm */}
      <div className={s.arm__upper} />
      {/* forearm + hand */}
      <div className={s.arm__lower}>
        <div className={s.arm__hand}>
          {/* fingers */}
          <div className={s.arm__finger} />
          <div className={s.arm__finger} />
          <div className={s.arm__finger} />
        </div>
      </div>
    </div>
  )
}

// ─── Mouth — all variants are just curved lines, no open mouth ──
function Mouth({ mood }: { mood: 'smile' | 'grin' | 'neutral' }) {
  return (
    <div className={`${s.mouth} ${s[`mouth_${mood}`]}`}>
      <div className={s.mouth__curve} />
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────
export default function BotFace() {
  const containerRef = useRef<HTMLDivElement>(null)

  const [pupilPos,    setPupilPos]    = useState<EyePos>({ x: 0, y: 0 })
  const [isBlinking,  setIsBlinking]  = useState(false)
  const [mood,        setMood]        = useState<'smile' | 'grin' | 'neutral'>('smile')
  const [antennaWiggle, setAntennaWiggle] = useState(false)
  const [isHovered,   setIsHovered]   = useState(false)

  const blinkTimer = useRef<ReturnType<typeof setTimeout>>()
  const moodTimer  = useRef<ReturnType<typeof setTimeout>>()

  // ── Mouse tracking ───────────────────────────────────────
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const el = containerRef.current
      if (!el) return
      const rect  = el.getBoundingClientRect()
      const cx    = rect.left + rect.width / 2
      const cy    = rect.top  + rect.height / 2
      const dx    = e.clientX - cx
      const dy    = e.clientY - cy
      const dist  = Math.sqrt(dx * dx + dy * dy) || 1
      const norm  = Math.min(dist / 350, 1)
      setPupilPos({ x: (dx / dist) * norm, y: (dy / dist) * norm })
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  // ── Blink ────────────────────────────────────────────────
  const scheduleBlink = useCallback(() => {
    const delay = 2200 + Math.random() * 3200
    blinkTimer.current = setTimeout(() => {
      setIsBlinking(true)
      setTimeout(() => {
        setIsBlinking(false)
        if (Math.random() < 0.25) {
          setTimeout(() => {
            setIsBlinking(true)
            setTimeout(() => { setIsBlinking(false); scheduleBlink() }, 120)
          }, 200)
        } else {
          scheduleBlink()
        }
      }, 140)
    }, delay)
  }, [])

  useEffect(() => {
    scheduleBlink()
    return () => clearTimeout(blinkTimer.current)
  }, [scheduleBlink])

  // ── Mood cycle ───────────────────────────────────────────
  const MOODS: Array<'smile' | 'grin' | 'neutral'> = [
    'smile', 'smile', 'smile', 'smile',
    'grin',
    'smile', 'smile',
    'neutral',
    'smile', 'grin',
  ]

  const scheduleMood = useCallback(() => {
    const delay = 3500 + Math.random() * 4000
    moodTimer.current = setTimeout(() => {
      // Don't override mood while hovered
      setIsHovered(prev => {
        if (!prev) {
          const next = MOODS[Math.floor(Math.random() * MOODS.length)]
          setMood(next)
          if (next === 'grin') {
            setAntennaWiggle(true)
            setTimeout(() => setAntennaWiggle(false), 560)
          }
        }
        return prev
      })
      scheduleMood()
    }, delay)
  }, [])

  useEffect(() => {
    scheduleMood()
    return () => clearTimeout(moodTimer.current)
  }, [scheduleMood])

  // ── Hover ────────────────────────────────────────────────
  const handleMouseEnter = () => {
    setIsHovered(true)
    setMood('grin')
    setAntennaWiggle(true)
    setTimeout(() => setAntennaWiggle(false), 520)
  }

  const handleMouseLeave = () => {
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

        {/* Bot body: head + waving arm side by side */}
        <div className={s.body}>
          {/* Waving arm sits on the LEFT of the head (bot's right side) */}
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

              <Mouth mood={mood} />
            </div>
          </div>
        </div>

        <div className={s.shadow} />
      </div>
    </div>
  )
}