import { useState } from 'react'
import { useLangStore } from '../../store'
import type { Translations } from '../../i18n/translations'
import s from './Scoring.module.scss'

type RiskLevel = 'low' | 'medium' | 'high' | null

interface FormData {
  firstName: string
  lastName: string
  patronymic: string
  birthDate: string
  inn: string
  workPlace: string
  position: string
  workExperience: string
  netIncome: string
  downPayment: string
  loanAmount: string
  loanDate: string
}

interface ScoringResult {
  // Поля для отображения на фронте
  p_default: number
  risk_level: RiskLevel
  decision_ru: string
  maxLoanAmount: number
  recommendedRate: number
  top_factors: { name: string; contribution: number }[]
  metrics: { roc_auc: number; pr_auc: number; accuracy: number }
  // Дополнительные данные от credit_engine
  status?: string
  dti_tier?: string
  ml_score?: number
  monthly_payment?: number
  approved_amount?: number
  reason?: string
}

const DEFAULT_FORM: FormData = {
  firstName: '',
  lastName: '',
  patronymic: '',
  birthDate: '',
  inn: '',
  workPlace: '',
  position: '',
  workExperience: '',
  netIncome: '',
  downPayment: '',
  loanAmount: '',
  loanDate: '',
}

function InputField({ label, name, type = 'text', placeholder, value, onChange, required = false }: {
  label: string; name: string; type?: string; placeholder?: string; value: string;
  onChange: (n: string, v: string) => void; required?: boolean
}) {
  return (
    <div className={s.field}>
      <label className={s.field__label}>
        <span>{label}{required && <span className={s.required}>*</span>}</span>
      </label>
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

function SliderField({ label, name, min, max, step = 1000, value, onChange, unit, required = false }: {
  label: string; name: string; min: number; max: number; step?: number;
  value: string; onChange: (n: string, v: string) => void; unit?: string; required?: boolean
}) {
  const num = parseFloat(value) || min
  const pct = ((num - min) / (max - min)) * 100

  const formatValue = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)} млн`
    if (val >= 1000) return `${(val / 1000).toFixed(0)} тыс`
    return val.toString()
  }

  return (
    <div className={s.field}>
      <div className={s.field__label}>
        <span>{label}{required && <span className={s.required}>*</span>}</span>
        <span className={s.field__val}>{formatValue(num)} {unit}</span>
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

// ─── Result Panel ─────────────────────────────────────────────
function ResultPanel({ result, t }: { result: ScoringResult; t: Translations }) {
  const p = result.p_default
  const pct = Math.round(p * 100)
  const maxAbs = Math.max(...result.top_factors.map((f) => Math.abs(f.contribution)), 0.01)

  const riskColor    = result.risk_level === 'low' ? '#5DCAA5' : result.risk_level === 'medium' ? '#FAC775' : '#f09595'
  const decisionColor = result.risk_level === 'low' ? '#5DCAA5' : result.risk_level === 'high' ? '#f09595' : '#FAC775'
  const riskDesc     = result.risk_level === 'low'
    ? t.scoring.lowRiskDesc
    : result.risk_level === 'medium'
      ? t.scoring.mediumRiskDesc
      : t.scoring.highRiskDesc

  const formatMoney = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)} млн сом`
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)} тыс сом`
    return `${amount} сом`
  }

  return (
    <div className={s.result}>
      <div className={s.result__header}>
        <span className={s.result__title}>{t.scoring.resultTitle}</span>
        <span className={s.result__decision} style={{ color: decisionColor }}>
          {result.decision_ru}
        </span>
      </div>

      {/* ML скор — вероятность дефолта */}
      <div className={s.result__prob}>
        <span className={s.result__prob_num} style={{ color: riskColor }}>
          {pct}<span style={{ fontSize: '0.55em', opacity: 0.7 }}>%</span>
        </span>
        <span className={s.result__prob_label}>{t.scoring.probability}</span>
      </div>

      {/* Gauge */}
      <div className={s.gauge}>
        <div className={s.gauge__spectrum} />
        <div className={s.gauge__cursor} style={{ left: `calc(${Math.min(pct, 99)}% - 1.5px)` }} />
      </div>
      <div className={s.gauge__labels}>
        <span>{t.scoring.lowRisk}</span>
        <span>{t.scoring.mediumRisk}</span>
        <span>{t.scoring.highRisk}</span>
      </div>

      {/* Финансовые условия */}
      <div className={s.result__info}>
        <div className={s.infoRow}>
          <span className={s.infoLabel}>{t.scoring.maxLoanAmount}:</span>
          <span className={s.infoValue}>{formatMoney(result.maxLoanAmount)}</span>
        </div>
        <div className={s.infoRow}>
          <span className={s.infoLabel}>{t.scoring.recommendedRate}:</span>
          <span className={s.infoValue}>{result.recommendedRate}% {t.scoring.perYear}</span>
        </div>

        {/* Ежемесячный платёж — приходит от credit_engine */}
        {result.monthly_payment != null && result.monthly_payment > 0 && (
          <div className={s.infoRow}>
            <span className={s.infoLabel}>Ежемесячный платёж:</span>
            <span className={s.infoValue} style={{ color: '#5DCAA5' }}>
              {formatMoney(result.monthly_payment)}
            </span>
          </div>
        )}

        {/* DTI tier */}
        {result.dti_tier && (
          <div className={s.infoRow}>
            <span className={s.infoLabel}>Долговой лимит (DTI):</span>
            <span className={s.infoValue} style={{ fontSize: 12, opacity: 0.85 }}>
              {result.dti_tier}
            </span>
          </div>
        )}

        {/* ML score */}
        {result.ml_score != null && (
          <div className={s.infoRow}>
            <span className={s.infoLabel}>ML надёжность:</span>
            <span className={s.infoValue} style={{ color: riskColor }}>
              {result.ml_score.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Пояснение */}
      <div className={s.result__explain}>
        {result.reason ? result.reason : riskDesc}
      </div>

      {/* Ключевые факторы */}
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

      {/* Метрики модели */}
      <div className={s.result__metrics}>
        <div className={s.metric}>
          <span className={s.metric__val}>{result.metrics.roc_auc}</span>
          <span className={s.metric__name}>ROC-AUC</span>
        </div>
        <div className={s.metric}>
          <span className={s.metric__val}>{result.metrics.pr_auc}</span>
          <span className={s.metric__name}>PR-AUC</span>
        </div>
        <div className={s.metric}>
          <span className={s.metric__val}>{Math.round(result.metrics.accuracy * 100)}%</span>
          <span className={s.metric__name}>{t.scoring.metrics}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────
export default function ScoringPage() {
  const { t } = useLangStore()
  const [form, setForm]     = useState<FormData>(DEFAULT_FORM)
  const [result, setResult] = useState<ScoringResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState<string | null>(null)

  const handleChange = (name: string, value: string) => {
    setForm((p) => ({ ...p, [name]: value }))
  }

  const validateForm = (): boolean => {
    const required = ['firstName', 'lastName', 'birthDate', 'inn', 'workPlace', 'position', 'workExperience', 'netIncome', 'loanAmount']
    for (const field of required) {
      if (!form[field as keyof FormData]) {
        setError(t.scoring.fillRequiredFields)
        return false
      }
    }
    if (form.inn.length < 10 || form.inn.length > 14) {
      setError(t.scoring.innInvalid)
      return false
    }
    const age = new Date().getFullYear() - new Date(form.birthDate).getFullYear()
    if (age < 18 || age > 75) {
      setError(t.scoring.ageInvalid)
      return false
    }
    const netIncome  = parseFloat(form.netIncome) || 0
    const loanAmount = parseFloat(form.loanAmount) || 0
    if (loanAmount > netIncome * 36) {
      setError(t.scoring.loanTooHigh)
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    setError(null)

    const age            = new Date().getFullYear() - new Date(form.birthDate).getFullYear()
    const netIncome      = parseFloat(form.netIncome) || 0
    const loanAmount     = parseFloat(form.loanAmount) || 0
    const downPayment    = parseFloat(form.downPayment) || 0
    const workExperience = parseFloat(form.workExperience) || 0

    try {
      // Отправляем на бекенд — scoring_router.py → credit_engine.evaluate()
      const payload = {
        age,
        monthly_income:    netIncome,
        employment_years:  workExperience,
        loan_amount:       loanAmount,
        down_payment:      downPayment,
        loan_term_months:  24,
        interest_rate:     25,
        past_due_30d:      0,
        inquiries_6m:      1,
        // Передаём ИНН и должность для BKI и LLM анализа
        inn:      form.inn,
        position: form.position,
      }

      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data: ScoringResult = await res.json()
      setResult(data)

    } catch (e) {
      // Мок только если бекенд недоступен — сохраняем всю логику фронта
      console.warn('Backend unavailable, using mock:', e)
      const mockP     = Math.random() * 0.6 + 0.1
      const maxLoan   = Math.round(netIncome * 24 * (1 - mockP))
      const rate      = 8 + mockP * 25
      const monthlyPay = Math.round((loanAmount / 24) * (1 + mockP * 0.3))

      setResult({
        p_default:    mockP,
        risk_level:   mockP < 0.3 ? 'low' : mockP < 0.55 ? 'medium' : 'high',
        decision_ru:  mockP < 0.5 ? t.scoring.approved : t.scoring.rejected,
        maxLoanAmount: maxLoan,
        recommendedRate: Math.round(rate * 10) / 10,
        top_factors: [
          { name: t.scoring.factorWorkExperience, contribution:  0.28 * mockP },
          { name: t.scoring.factorNetIncome,       contribution: -0.19 * (1 - mockP) },
          { name: t.scoring.factorLoanAmount,      contribution:  0.14 * mockP },
          { name: t.scoring.factorDownPayment,     contribution: -0.11 * (1 - mockP) },
        ],
        metrics: { roc_auc: 0.882, pr_auc: 0.794, accuracy: 0.847 },
        // Мок доп-полей
        status:          mockP < 0.5 ? 'ОДОБРЕНО' : 'ОТКАЗ',
        dti_tier:        '🟡 50% (Стандарт)',
        ml_score:        Math.round((1 - mockP) * 100),
        monthly_payment: monthlyPay,
        approved_amount: mockP < 0.5 ? loanAmount : 0,
        reason:          mockP < 0.5
          ? 'Все проверки пройдены (демо-режим).'
          : 'Высокий риск дефолта (демо-режим).',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`page ${s.scoring_page}`}>
      <div className={s.scoring_page__inner}>
        <div className={s.page_header}>
          <h1>{t.scoring.title}</h1>
          <p>{t.scoring.subtitle}</p>
        </div>

        <div className={s.content}>
          <div className={s.form_panel}>
            <div className={s.form_grid}>
              <div className={s.sectionTitle}>{t.scoring.personalData}</div>

              <InputField label={t.scoring.firstName}   name="firstName"   placeholder={t.scoring.firstNamePlaceholder}   value={form.firstName}   onChange={handleChange} required />
              <InputField label={t.scoring.lastName}    name="lastName"    placeholder={t.scoring.lastNamePlaceholder}    value={form.lastName}    onChange={handleChange} required />
              <InputField label={t.scoring.patronymic}  name="patronymic"  placeholder={t.scoring.patronymicPlaceholder}  value={form.patronymic}  onChange={handleChange} />
              <InputField label={t.scoring.birthDate}   name="birthDate"   type="date"                                    value={form.birthDate}   onChange={handleChange} required />
              <InputField label={t.scoring.inn}         name="inn"         placeholder={t.scoring.innPlaceholder}         value={form.inn}         onChange={handleChange} required />

              <div className={s.sectionTitle}>{t.scoring.workInfo}</div>

              <InputField label={t.scoring.workPlace}   name="workPlace"   placeholder={t.scoring.workPlacePlaceholder}   value={form.workPlace}   onChange={handleChange} required />
              <InputField label={t.scoring.position}    name="position"    placeholder={t.scoring.positionPlaceholder}    value={form.position}    onChange={handleChange} required />
              <SliderField label={t.scoring.workExperience} name="workExperience" min={0} max={40} step={0.5} value={form.workExperience} onChange={handleChange} unit={t.scoring.years} required />
              <SliderField label={t.scoring.netIncome}  name="netIncome"   min={50000} max={2000000} step={10000} value={form.netIncome}  onChange={handleChange} unit="сом" required />

              <div className={s.sectionTitle}>{t.scoring.loanInfo}</div>

              <SliderField label={t.scoring.downPayment}  name="downPayment"  min={0}     max={10000000} step={50000}  value={form.downPayment}  onChange={handleChange} unit="сом" />
              <SliderField label={t.scoring.loanAmount}   name="loanAmount"   min={50000} max={50000000} step={50000}  value={form.loanAmount}   onChange={handleChange} unit="сом" required />
              <InputField  label={t.scoring.loanDate}     name="loanDate"     type="date"                               value={form.loanDate}     onChange={handleChange} />
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

          <div className={s.result_panel}>
            {result ? (
              <ResultPanel result={result} t={t} />
            ) : (
              <div className={s.placeholder}>
                <div className={s.placeholder__icon}><RadarIcon /></div>
                <p>{t.scoring.fillForm}</p>
                <div className={s.placeholder__tags}>
                  <span>{t.scoring.pDefault}</span>
                  <span>{t.scoring.riskFactors}</span>
                  <span>{t.scoring.metrics}</span>
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
function RadarIcon() {
  return <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="13" stroke="#185fa5" strokeWidth="1.5"/><circle cx="16" cy="16" r="8" stroke="#185fa5" strokeWidth="1.5" opacity=".5"/><circle cx="16" cy="16" r="3" fill="#185fa5"/><path d="M16 16L24 8" stroke="#00c6ff" strokeWidth="1.8" strokeLinecap="round"/></svg>
}