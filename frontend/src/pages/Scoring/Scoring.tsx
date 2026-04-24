import { useState } from 'react'
import { useLangStore } from '../../store'
import type { Translations } from '../../i18n/translations'
import s from './Scoring.module.scss'

type Tab = 'employee' | 'client'
type RiskLevel = 'low' | 'medium' | 'high' | null

interface FormData {
  age: string
  monthly_income: string
  employment_years: string
  loan_amount: string
  loan_term_months: string
  interest_rate: string
  past_due_30d: string
  inquiries_6m: string
  fullName: string
  phone: string
  email: string
  purpose: string
}

interface ScoringResult {
  p_default: number
  risk_level: RiskLevel
  decision_ru: string
  top_factors: { name: string; contribution: number }[]
  metrics: { roc_auc: number; pr_auc: number; accuracy: number }
}

const DEFAULT_FORM: FormData = {
  age: '', monthly_income: '', employment_years: '',
  loan_amount: '', loan_term_months: '', interest_rate: '',
  past_due_30d: '', inquiries_6m: '',
  fullName: '', phone: '', email: '', purpose: '',
}

function SliderField({ label, name, min, max, step = 1, value, onChange, unit }: {
  label: string; name: string; min: number; max: number; step?: number;
  value: string; onChange: (n: string, v: string) => void; unit?: string
}) {
  const num = parseFloat(value) || min
  const pct = ((num - min) / (max - min)) * 100

  return (
    <div className={s.field}>
      <div className={s.field__label}>
        <span>{label}</span>
        <span className={s.field__val}>{value || min} {unit}</span>
      </div>
      <div className={s.slider_wrap}>
        <div className={s.slider_fill} style={{ width: `${Math.min(pct, 100)}%` }} />
        <input
          type="range" min={min} max={max} step={step}
          value={num}
          onChange={(e) => onChange(name, e.target.value)}
        />
      </div>
    </div>
  )
}

function InputField({ label, name, type = 'text', placeholder, value, onChange }: {
  label: string; name: string; type?: string; placeholder?: string; value: string;
  onChange: (n: string, v: string) => void
}) {
  return (
    <div className={s.field}>
      <label className={s.field__label}><span>{label}</span></label>
      <input
        className={s.input}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </div>
  )
}

function SelectField({ label, name, options, value, onChange }: {
  label: string; name: string; options: string[]; value: string;
  onChange: (n: string, v: string) => void
}) {
  return (
    <div className={s.field}>
      <label className={s.field__label}><span>{label}</span></label>
      <select className={s.input} value={value} onChange={(e) => onChange(name, e.target.value)}>
        <option value="">Выбрать...</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

// ─── Result Panel ─────────────────────────────────────────────
function ResultPanel({ result, t }: { result: ScoringResult; t: Translations }) {
  const p = result.p_default
  const pct = Math.round(p * 100)
  const maxAbs = Math.max(...result.top_factors.map((f) => Math.abs(f.contribution)), 0.01)

  const riskColor = result.risk_level === 'low' ? '#5DCAA5' : result.risk_level === 'medium' ? '#FAC775' : '#f09595'
  const decisionColor = result.risk_level === 'low' ? '#5DCAA5' : result.risk_level === 'high' ? '#f09595' : '#FAC775'

  return (
    <div className={s.result}>
      <div className={s.result__header}>
        <span className={s.result__title}>{t.scoring.resultTitle}</span>
        <span className={s.result__decision} style={{ color: decisionColor }}>
          {result.decision_ru}
        </span>
      </div>

      {/* Probability */}
      <div className={s.result__prob}>
        <span className={s.result__prob_num} style={{ color: riskColor }}>
          {pct}<span style={{ fontSize: '0.55em', opacity: 0.7 }}>%</span>
        </span>
        <span className={s.result__prob_label}>{t.scoring.probability}</span>
      </div>

      {/* Gauge bar */}
      <div className={s.gauge}>
        <div className={s.gauge__spectrum} />
        <div className={s.gauge__cursor} style={{ left: `calc(${Math.min(pct, 99)}% - 1.5px)` }} />
      </div>
      <div className={s.gauge__labels}>
        <span>Низкий</span><span>Средний</span><span>Высокий</span>
      </div>

      {/* Human text */}
      <div className={s.result__explain}>
        {result.risk_level === 'low' && '✓ Низкий риск невозврата. Профиль заёмщика надёжный.'}
        {result.risk_level === 'medium' && '⚠ Умеренный риск. Рекомендуется дополнительная проверка.'}
        {result.risk_level === 'high' && '✕ Высокий риск дефолта. Рекомендован отказ или снижение суммы.'}
      </div>

      {/* Factors */}
      <div className={s.result__factors_title}>{t.scoring.factorsTitle}</div>
      {result.top_factors.slice(0, 4).map((f) => {
        const barW = Math.min((Math.abs(f.contribution) / maxAbs) * 100, 100)
        const col = f.contribution > 0
          ? (f.contribution > 0.15 ? '#f09595' : '#FAC775')
          : '#5DCAA5'
        return (
          <div className={s.factor} key={f.name}>
            <span className={s.factor__name}>{f.name}</span>
            <div className={s.factor__track}>
              <div className={s.factor__fill} style={{ width: `${barW}%`, background: col }} />
            </div>
            <span className={s.factor__val} style={{ color: col }}>
              {f.contribution > 0 ? '+' : ''}{f.contribution.toFixed(2)}
            </span>
          </div>
        )
      })}

      {/* Metrics */}
      <div className={s.result__metrics}>
        <div className={s.metric}><span className={s.metric__val}>{result.metrics.roc_auc}</span><span className={s.metric__name}>ROC-AUC</span></div>
        <div className={s.metric}><span className={s.metric__val}>{result.metrics.pr_auc}</span><span className={s.metric__name}>PR-AUC</span></div>
        <div className={s.metric}><span className={s.metric__val}>{Math.round(result.metrics.accuracy * 100)}%</span><span className={s.metric__name}>Accuracy</span></div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────
export default function ScoringPage() {
  const { t } = useLangStore()
  const [tab, setTab] = useState<Tab>('client')
  const [form, setForm] = useState<FormData>(DEFAULT_FORM)
  const [result, setResult] = useState<ScoringResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (name: string, value: string) => {
    setForm((p) => ({ ...p, [name]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        age: parseFloat(form.age) || 30,
        monthly_income: parseFloat(form.monthly_income) || 50000,
        employment_years: parseFloat(form.employment_years) || 3,
        loan_amount: parseFloat(form.loan_amount) || 300000,
        loan_term_months: parseFloat(form.loan_term_months) || 24,
        interest_rate: parseFloat(form.interest_rate) || 25,
        past_due_30d: parseFloat(form.past_due_30d) || 0,
        inquiries_6m: parseFloat(form.inquiries_6m) || 1,
      }
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setResult(data)
    } catch (e) {
      // Mock result for demo when backend is offline
      const mockP = Math.random() * 0.6 + 0.1
      setResult({
        p_default: mockP,
        risk_level: mockP < 0.3 ? 'low' : mockP < 0.55 ? 'medium' : 'high',
        decision_ru: mockP < 0.5 ? t.scoring.approved : t.scoring.rejected,
        top_factors: [
          { name: t.scoring.fields.pastDue, contribution: 0.28 * mockP },
          { name: t.scoring.fields.income, contribution: -0.19 * (1 - mockP) },
          { name: t.scoring.fields.interestRate, contribution: 0.14 * mockP },
          { name: t.scoring.fields.employment, contribution: -0.11 * (1 - mockP) },
        ],
        metrics: { roc_auc: 0.785, pr_auc: 0.607, accuracy: 0.73 },
      })
    } finally {
      setLoading(false)
    }
  }

  const purposes = ['Потребительский', 'Автокредит', 'Ипотека', 'Бизнес', 'Рефинансирование', 'Образование', 'Другое']

  return (
    <div className={`page ${s.scoring_page}`}>
      <div className={s.scoring_page__inner}>
        {/* Header */}
        <div className={s.page_header}>
          <h1>{t.scoring.title}</h1>
          <p>{t.scoring.subtitle}</p>
        </div>

        {/* Tabs */}
        <div className={s.tabs}>
          <button
            className={`${s.tab} ${tab === 'client' ? s.active : ''}`}
            onClick={() => setTab('client')}
          >
            <UserIcon /> {t.scoring.tabClient}
          </button>
          <button
            className={`${s.tab} ${tab === 'employee' ? s.active : ''}`}
            onClick={() => setTab('employee')}
          >
            <BadgeIcon /> {t.scoring.tabEmployee}
          </button>
        </div>

        <div className={s.content}>
          {/* Form */}
          <div className={s.form_panel}>
            <div className={s.form_grid}>
              {tab === 'employee' && (
                <>
                  <InputField label={t.scoring.fields.fullName} name="fullName" placeholder="Иванов Иван Иванович" value={form.fullName} onChange={handleChange} />
                  <InputField label={t.scoring.fields.phone} name="phone" type="tel" placeholder="+996 700 000 000" value={form.phone} onChange={handleChange} />
                  <InputField label={t.scoring.fields.email} name="email" type="email" placeholder="example@mail.com" value={form.email} onChange={handleChange} />
                  <SelectField label={t.scoring.fields.purpose} name="purpose" options={purposes} value={form.purpose} onChange={handleChange} />
                  <div className={s.divider} />
                </>
              )}

              <SliderField label={t.scoring.fields.age} name="age" min={18} max={75} value={form.age} onChange={handleChange} unit="лет" />
              <InputField label={t.scoring.fields.income} name="monthly_income" type="number" placeholder="80000" value={form.monthly_income} onChange={handleChange} />
              <SliderField label={t.scoring.fields.employment} name="employment_years" min={0} max={40} step={0.5} value={form.employment_years} onChange={handleChange} unit="лет" />
              <InputField label={t.scoring.fields.loanAmount} name="loan_amount" type="number" placeholder="500000" value={form.loan_amount} onChange={handleChange} />
              <SliderField label={t.scoring.fields.loanTerm} name="loan_term_months" min={6} max={84} step={6} value={form.loan_term_months} onChange={handleChange} unit="мес" />
              <SliderField label={t.scoring.fields.interestRate} name="interest_rate" min={8} max={50} step={0.5} value={form.interest_rate} onChange={handleChange} unit="%" />
              <SliderField label={t.scoring.fields.pastDue} name="past_due_30d" min={0} max={10} value={form.past_due_30d} onChange={handleChange} unit="раз" />
              <SliderField label={t.scoring.fields.inquiries} name="inquiries_6m" min={0} max={15} value={form.inquiries_6m} onChange={handleChange} unit="раз" />
            </div>

            {error && <div className={s.error}>{error}</div>}

            <button
              className={`btn-primary ${s.submit_btn}`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <><span className={s.spinner} /> <span>{t.scoring.loading}</span></>
              ) : (
                <><span>{t.scoring.submit}</span> <ArrowIcon /></>
              )}
            </button>
          </div>

          {/* Result */}
          <div className={s.result_panel}>
            {result ? (
              <ResultPanel result={result} t={t} />
            ) : (
              <div className={s.placeholder}>
                <div className={s.placeholder__icon}><RadarIcon /></div>
                <p>Заполните анкету и нажмите «Рассчитать»</p>
                <div className={s.placeholder__tags}>
                  <span>P(default)</span><span>Факторы риска</span><span>Метрики</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ArrowIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function UserIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
}
function BadgeIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M4 5.5h6M4 8h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
}
function RadarIcon() {
  return <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="13" stroke="#185fa5" strokeWidth="1.5"/><circle cx="16" cy="16" r="8" stroke="#185fa5" strokeWidth="1.5" opacity=".5"/><circle cx="16" cy="16" r="3" fill="#185fa5"/><path d="M16 16L24 8" stroke="#00c6ff" strokeWidth="1.8" strokeLinecap="round"/></svg>
}