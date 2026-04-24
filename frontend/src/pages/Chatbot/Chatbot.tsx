import { useState, useRef, useEffect } from 'react'
import { useLangStore } from '../../store'
import BotFace from './BotFace'
import s from './Chatbot.module.scss'

interface Message {
  id: string
  role: 'user' | 'bot'
  text: string
  ts: number
}

const BOT_REPLIES: Record<string, string[]> = {
  default: [
    'Чтобы ответить точнее, уточните ваш вопрос о кредитном продукте.',
    'Я могу помочь с вопросами о кредитах, ставках и условиях займов.',
    'Для расчёта кредитного скоринга перейдите в раздел «Кредитный скоринг».',
  ],
  ставк:  ['Процентные ставки зависят от суммы и срока займа. Минимальная ставка — от 8% годовых.'],
  кредит: ['Кредит можно оформить на сумму от 50 000 до 5 000 000 ₸ сроком от 6 до 84 месяцев.'],
  скоринг:['Скоринг — это числовая оценка кредитоспособности заёмщика. Чем ниже P(default), тем надёжнее заёмщик.'],
  дефолт: ['Дефолт — невозврат кредита. Наша модель предсказывает его вероятность с точностью 78.5% ROC-AUC.'],
  одобр:  ['Решение об одобрении принимается автоматически на основе ML-модели. Обычно это занимает меньше секунды.'],
  привет: ['Привет! 👋 Рад вас видеть. Спросите меня что-нибудь о кредитах или скоринге!'],
  hello:  ['Hello! 👋 How can I help you with your credit questions?'],
  hi:     ['Hi there! 😊 Ask me anything about credit scoring!'],
}

function getBotReply(text: string): string {
  const lower = text.toLowerCase()
  for (const [key, replies] of Object.entries(BOT_REPLIES)) {
    if (key !== 'default' && lower.includes(key)) {
      return replies[Math.floor(Math.random() * replies.length)]
    }
  }
  const def = BOT_REPLIES.default
  return def[Math.floor(Math.random() * def.length)]
}

const QUICK_REPLIES = ['Каковы ставки?', 'Как работает скоринг?', 'Условия кредита', 'Что такое дефолт?']

export default function ChatbotPage() {
  const { t } = useLangStore()
  const [messages, setMessages] = useState<Message[]>(() => [
    { id: '0', role: 'bot', text: t.chatbot.welcome, ts: Date.now() },
  ])
  const [input, setInput]   = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = (text?: string) => {
    const txt = (text ?? input).trim()
    if (!txt) return
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: txt, ts: Date.now() }
    setMessages((p) => [...p, userMsg])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: getBotReply(txt),
        ts: Date.now(),
      }
      setMessages((p) => [...p, botMsg])
    }, 800 + Math.random() * 600)
  }

  const quickReplies: string[] = (t.chatbot as any).quickReplies ?? QUICK_REPLIES

  return (
    <div className={`page ${s.page}`}>
      <div className={s.inner}>

        {/* ── Bot hero ── */}
        <div className={s.botHero}>
          <BotFace />
          <div className={s.botHero__text}>
            <h1 className={s.botHero__title}>{t.chatbot.title}</h1>
            <p className={s.botHero__sub}>{t.chatbot.subtitle}</p>
            {/* статус убран */}
          </div>
        </div>

        {/* ── Chat messages ── */}
        <div className={s.chat}>
          {messages.map((m) => (
            <div key={m.id} className={`${s.msg} ${m.role === 'user' ? s.user : s.bot}`}>
              {m.role === 'bot' && (
                <div className={s.msg__avatar}>
                  <SmallBotIcon />
                </div>
              )}
              <div className={s.msg__bubble}>{m.text}</div>
            </div>
          ))}

          {typing && (
            <div className={`${s.msg} ${s.bot}`}>
              <div className={s.msg__avatar}><SmallBotIcon /></div>
              <div className={`${s.msg__bubble} ${s.typing}`}>
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* ── Quick replies ── */}
        <div className={s.quick}>
          {quickReplies.map((q) => (
            <button key={q} className={s.quick__btn} onClick={() => send(q)}>
              {q}
            </button>
          ))}
        </div>

        {/* ── Input ── */}
        <div className={s.input_row}>
          <input
            className={s.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.chatbot.placeholder}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
          />
          <button className={s.send_btn} onClick={() => send()} disabled={!input.trim()}>
            <SendIcon />
          </button>
        </div>

      </div>
    </div>
  )
}

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
      <path d="M14 2L1 7l5 2M14 2l-4 12-4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}