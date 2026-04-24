import { useEffect, useRef, useState, useCallback } from 'react'
import s from './BotFace.module.scss'

interface EyePos {
  x: number
  y: number
}

// How far the pupil travels inside the eye socket (px)
const MAX_TRAVEL = 8

// Default downward bias: 0 = center, 1 = full bottom
// 0.65 means the pupil rests ~65% toward the bottom at rest
const DOWN_BIAS = 0.65

function Eye({
  side,
  pupilPos,
  isBlinking,
}: {
  side: 'left' | 'right'
  pupilPos: EyePos
  isBlinking: boolean
}) {
  // Apply bias: x stays relative, y gets pushed down
  const px = Math.max(-MAX_TRAVEL, Math.min(MAX_TRAVEL, pupilPos.x * MAX_TRAVEL))
  // Add DOWN_BIAS so resting position is lower; clamp to max
  const rawY = pupilPos.y * MAX_TRAVEL + DOWN_BIAS * MAX_TRAVEL
  const py = Math.max(-MAX_TRAVEL, Math.min(MAX_TRAVEL, rawY))

  // Left eye sits a bit to the left, right eye to the right
  const xOffset = side === 'left' ? -20 : 20

  return (
    <div className={s.eye} style={{ transform: `translateX(${xOffset}px)` }}>
      <div className={s.eye__outer}>
        {/* Eyelid slides down on blink */}
        <div className={`${s.eye__lid} ${isBlinking ? s.blink : ''}`} />

        <div
          className={s.eye__pupil}
          style={{ transform: `translate(${px}px, ${py}px)` }}
        >
          <div className={s.eye__iris} />
          <div className={s.eye__dot} />
          <div className={s.eye__shine} />
        </div>
      </div>
    </div>
  )
}

function Antenna({ wiggle }: { wiggle: boolean }) {
  return (
    <div className={`${s.antenna} ${wiggle ? s.wiggle : ''}`}>
      <div className={s.antenna__stem} />
      <div className={s.antenna__ball} />
    </div>
  )
}

function Ear({ side }: { side: 'left' | 'right' }) {
  return (
    <div className={`${s.ear} ${s[side]}`}>
      <div className={s.ear__inner} />
    </div>
  )
}

// mood: 'smile' = normal smile, 'grin' = big happy smile, 'neutral' = flat line
function Mouth({ mood }: { mood: 'smile' | 'grin' | 'neutral' }) {
  return (
    <div className={`${s.mouth} ${s[`mouth_${mood}`]}`}>
      <div className={s.mouth__curve} />
    </div>
  )
}

export default function BotFace() {
  const containerRef = useRef<HTMLDivElement>(null)

  const [pupilPos, setPupilPos] = useState<EyePos>({ x: 0, y: 0 })
  const [isBlinking, setIsBlinking] = useState(false)
  const [mood, setMood] = useState<'smile' | 'grin' | 'neutral'>('smile')
  const [antennaWiggle, setAntennaWiggle] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const blinkTimer = useRef<ReturnType<typeof setTimeout>>()
  const moodTimer = useRef<ReturnType<typeof setTimeout>>()

  // ── Track mouse globally → move pupils ────────────────────
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const el = containerRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      // Center of the bot's head
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2

      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy) || 1

      // Tracking radius: beyond this distance the pupil is at max
      const maxDist = 350
      const norm = Math.min(dist / maxDist, 1)

      setPupilPos({
        x: (dx / dist) * norm,
        y: (dy / dist) * norm,
      })
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  // ── Random blink ──────────────────────────────────────────
  const scheduleBlink = useCallback(() => {
    const delay = 2200 + Math.random() * 3200
    blinkTimer.current = setTimeout(() => {
      setIsBlinking(true)
      setTimeout(() => {
        setIsBlinking(false)
        // Sometimes do a double-blink
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
    }, delay)
  }, [])

  useEffect(() => {
    scheduleBlink()
    return () => clearTimeout(blinkTimer.current)
  }, [scheduleBlink])

  // ── Mood cycle: only smile / grin / neutral ───────────────
  // Weighted: smile appears most, grin occasionally, neutral rarely
  const MOODS: Array<'smile' | 'grin' | 'neutral'> = [
    'smile', 'smile', 'smile', 'smile',
    'grin',
    'smile', 'smile',
    'neutral',
    'smile',
    'grin',
  ]

  const scheduleMood = useCallback(() => {
    const delay = 3500 + Math.random() * 4000
    moodTimer.current = setTimeout(() => {
      const next = MOODS[Math.floor(Math.random() * MOODS.length)]
      setMood(next)

      // Wiggle antenna on grin
      if (next === 'grin') {
        setAntennaWiggle(true)
        setTimeout(() => setAntennaWiggle(false), 560)
      }

      scheduleMood()
    }, delay)
  }, [])

  useEffect(() => {
    scheduleMood()
    return () => clearTimeout(moodTimer.current)
  }, [scheduleMood])

  // ── Hover handlers ────────────────────────────────────────
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
      {/* Ambient glow */}
      <div className={s.glow} />

      <div className={s.floater}>
        <Antenna wiggle={antennaWiggle} />

        <div className={s.head}>
          <Ear side="left" />
          <Ear side="right" />

          <div className={s.face}>
            <div className={s.face__glare} />

            <div className={s.eyes}>
              <Eye side="left"  pupilPos={pupilPos} isBlinking={isBlinking} />
              <Eye side="right" pupilPos={pupilPos} isBlinking={isBlinking} />
            </div>

            <Mouth mood={mood} />
          </div>
        </div>

        <div className={s.shadow} />
      </div>
    </div>
  )
}