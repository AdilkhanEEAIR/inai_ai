import { useState, useRef, useEffect } from 'react'
import { useLangStore } from '../../store'
import BotFace from './BotFace'
import s from './Chatbot.module.scss'

// ─── Types ────────────────────────────────────────────────────
interface Message {
  id: string
  role: 'user' | 'bot'
  text: string
  ts: number
  error?: boolean
}

// История для отправки на бекенд (последние N сообщений)
interface ApiMessage {
  role: 'user' | 'assistant'
  text: string
}

const QUICK_REPLIES = [
  'Каковы ставки по кредитам?',
  'Как улучшить кредитный скоринг?',
  'Что такое дефолт?',
  'Как рассчитать переплату?',
]

const API_URL = '/api/chat'
const MAX_HISTORY = 10 // последних сообщений отправляем в контекст

// ─── Message text renderer ────────────────────────────────────
// Парсит простой текст: нумерованные списки, тире-списки, абзацы
function MessageText({ text }: { text: string }) {
  const lines = text.split('\n')

  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()

    if (!line) {
      i++
      continue
    }

    // Нумерованный список: "1. текст"
    if (/^\d+\.\s/.test(line)) {
      const listItems: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s/, ''))
        i++
      }
      elements.push(
        <ol key={i} className={s.msgList}>
          {listItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ol>
      )
      continue
    }

    // Тире-список: "- текст" или "• текст"
    if (/^[-•]\s/.test(line)) {
      const listItems: string[] = []
      while (i < lines.length && /^[-•]\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^[-•]\s/, ''))
        i++
      }
      elements.push(
        <ul key={i} className={s.msgList}>
          {listItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )
      continue
    }

    // Обычный абзац
    elements.push(
      <p key={i} className={s.msgPara}>
        {line}
      </p>
    )
    i++
  }

  return <div className={s.msgText}>{elements}</div>
}

// ─── Main component ───────────────────────────────────────────
export default function ChatbotPage() {
  const { t } = useLangStore()

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'bot',
      text: 'Здравствуйте! Я финансовый консультант Кredиtоr. Задайте любой вопрос о кредитах, ставках или скоринге — помогу разобраться.',
      ts: Date.now(),
    },
  ])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Строим историю для API из последних сообщений
  const buildHistory = (msgs: Message[]): ApiMessage[] => {
    return msgs
      .filter((m) => !m.error)
      .slice(-MAX_HISTORY)
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        text: m.text,
      }))
  }

  const send = async (text?: string) => {
    const txt = (text ?? input).trim()
    if (!txt || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: txt,
      ts: Date.now(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      // Строим историю включая новое сообщение пользователя
      const history = buildHistory([...messages, userMsg])

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }

      const data = await res.json()

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          text: data.reply,
          ts: Date.now(),
        },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          text: 'Не удалось получить ответ. Проверьте подключение или попробуйте позже.',
          ts: Date.now(),
          error: true,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const quickReplies: string[] =
    (t.chatbot as any).quickReplies ?? QUICK_REPLIES

  return (
    <div className={`page ${s.page}`}>
      <div className={s.inner}>

        {/* ── Bot hero ── */}
        <div className={s.botHero}>
          <BotFace />
          <div className={s.botHero__text}>
            <h1 className={s.botHero__title}>{t.chatbot.title}</h1>
            <p className={s.botHero__sub}>{t.chatbot.subtitle}</p>
          </div>
        </div>

        {/* ── Chat block with animated border ── */}
        <div className={s.chatWrap}>
          <div className={s.chat}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`${s.msg} ${m.role === 'user' ? s.user : s.bot} ${m.error ? s.msgError : ''}`}
              >
                {m.role === 'bot' && (
                  <div className={s.msg__avatar}>
                    <SmallBotIcon />
                  </div>
                )}
                <div className={s.msg__bubble}>
                  <MessageText text={m.text} />
                </div>
              </div>
            ))}

            {/* Typing indicator while loading */}
            {loading && (
              <div className={`${s.msg} ${s.bot}`}>
                <div className={s.msg__avatar}><SmallBotIcon /></div>
                <div className={`${s.msg__bubble} ${s.typing}`}>
                  <span /><span /><span />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* ── Quick replies ── */}
        <div className={s.quick}>
          {quickReplies.map((q) => (
            <button
              key={q}
              className={s.quick__btn}
              onClick={() => send(q)}
              disabled={loading}
            >
              {q}
            </button>
          ))}
        </div>

        {/* ── Input row ── */}
        <div className={s.input_row}>
          <input
            className={s.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.chatbot.placeholder}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            disabled={loading}
          />
          <button
            className={s.send_btn}
            onClick={() => send()}
            disabled={!input.trim() || loading}
          >
            {loading ? <SpinnerIcon /> : <SendIcon />}
          </button>
        </div>

      </div>
    </div>
  )
}

// ─── Icons ────────────────────────────────────────────────────
function SmallBotIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="5" width="16" height="11" rx="3" fill="#1857a8" opacity=".9"/>
      <circle cx="6.5"  cy="10.5" r="1.5" fill="#00c6ff"/>
      <circle cx="11.5" cy="10.5" r="1.5" fill="#00c6ff"/>
      <rect x="7.5" y="1" width="3" height="4" rx="1.5" fill="#1857a8"/>
      <circle cx="9" cy="1.5" r="1" fill="#00c6ff"/>
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M14 2L1 7l5 2M14 2l-4 12-4-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16" fill="none"
      style={{ animation: 'spin 0.7s linear infinite' }}
    >
      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
      <path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}