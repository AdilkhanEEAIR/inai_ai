import { useState, useRef } from 'react'
import { useLangStore } from '../../store'
import s from './PhotoAnalysis.module.scss'

export default function PhotoAnalysisPage() {
  const { t } = useLangStore()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    setFile(f)
    setResult(null)
    setError(null)
    
    // Для изображений показываем превью
    if (f.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result as string)
      reader.readAsDataURL(f)
    } else {
      setPreview(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f && (f.type.startsWith('image/') || f.type === 'application/pdf')) {
      handleFile(f)
    }
  }

  const analyze = async () => {
    if (!file) return
    
    setAnalyzing(true)
    setError(null)
    
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const res = await fetch('/api/analyze-document', {
        method: 'POST',
        body: formData,
      })
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      
      const data = await res.json()
      setResult(data)
    } catch (err) {
      console.error('Upload error:', err)
      setError('Ошибка при анализе документа. Попробуйте другой файл.')
      
      // Мок-данные для демо при недоступном бэкенде
      setResult({
        client_data: {
          age: 32,
          net_income: 85000,
          requested_amount: 500000,
          term_months: 24,
          experience_years: 5.5,
          job_position: 'Менеджер',
          inn: '12345678901234'
        },
        bki_data: {
          past_due_30d: 0,
          inquiries_6m: 1,
          active_debts_payment: 0
        },
        decision: {
          status: 'ОДОБРЕНО',
          dti_tier: '🟡 50% (Стандарт)',
          ml_score: 87.5,
          approved_amount: 500000,
          monthly_payment: 24500,
          applied_rate: 0.22,
          reason: 'Все проверки пройдены. Кредит одобрен.'
        }
      })
    } finally {
      setAnalyzing(false)
    }
  }

  const formatMoney = (amount: number) => {
    if (!amount) return '—'
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)} млн сом`
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)} тыс сом`
    return `${amount} сом`
  }

  const documentTypes = ['Паспорт', 'Справка о доходах', 'Заявление на кредит', 'PDF документ']

  return (
    <div className={`page ${s.page}`}>
      <div className={s.inner}>
        <div className={s.header}>
          <h1>{t.photo.title}</h1>
          <p>Загрузите фото или PDF документа для автоматического распознавания и кредитного скоринга</p>
        </div>

        <div className={s.content}>
          {/* Upload zone */}
          <div
            className={`${s.dropzone} ${dragging ? s.dragging : ''} ${preview ? s.has_file : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !file && inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*,application/pdf"
              style={{ display: 'none' }}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            {preview ? (
              <div className={s.preview_wrap}>
                <img src={preview} alt="preview" className={s.preview_img} />
                <button
                  className={s.remove_btn}
                  onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); setResult(null) }}
                >
                  ✕
                </button>
              </div>
            ) : file?.type === 'application/pdf' ? (
              <div className={s.pdf_preview}>
                <PDFIcon />
                <span>{file.name}</span>
                <button
                  className={s.remove_btn}
                  onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); setResult(null) }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className={s.drop_content}>
                <div className={s.drop_icon}><UploadIcon /></div>
                <p className={s.drop_text}>Перетащите файл или нажмите для выбора</p>
                <span className={s.drop_hint}>PNG, JPG, WEBP, PDF · до 10MB</span>
              </div>
            )}
          </div>

          {/* Result */}
          <div className={s.result_col}>
            {!result && !analyzing && !error && (
              <div className={s.result_placeholder}>
                <DocScanIcon />
                <p>Загрузите документ для анализа</p>
                <div className={s.supported}>
                  {documentTypes.map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
              </div>
            )}

            {analyzing && (
              <div className={s.analyzing}>
                <div className={s.scan_anim}>
                  <div className={s.scan_line} />
                  <DocScanIcon />
                </div>
                <p>Анализирую документ и выполняю скоринг...</p>
                <div className={s.progress_bar}>
                  <div className={s.progress_fill} />
                </div>
              </div>
            )}

            {error && (
              <div className={s.error_block}>
                <ErrorIcon />
                <p>{error}</p>
              </div>
            )}

            {result && (
              <div className={s.scoring_result}>
                <div className={s.scoring_result__header}>
                  <CheckIcon />
                  <span>Результат скоринга</span>
                  <span className={`${s.status_badge} ${result.decision?.status === 'ОДОБРЕНО' ? s.approved : s.rejected}`}>
                    {result.decision?.status || result.decision_ru || 'РЕЗУЛЬТАТ'}
                  </span>
                </div>

                <div className={s.scoring_result__section}>
                  <h4>📊 Данные из документа</h4>
                  <div className={s.data_row}>
                    <span>Возраст:</span>
                    <strong>{result.client_data?.age || result.age || '—'} лет</strong>
                  </div>
                  <div className={s.data_row}>
                    <span>Доход:</span>
                    <strong>{formatMoney(result.client_data?.net_income || result.monthly_income)}/мес</strong>
                  </div>
                  <div className={s.data_row}>
                    <span>Стаж:</span>
                    <strong>{result.client_data?.experience_years || result.employment_years || '—'} лет</strong>
                  </div>
                  <div className={s.data_row}>
                    <span>Должность:</span>
                    <strong>{result.client_data?.job_position || result.position || '—'}</strong>
                  </div>
                  <div className={s.data_row}>
                    <span>Запрашиваемая сумма:</span>
                    <strong>{formatMoney(result.client_data?.requested_amount || result.loan_amount)}</strong>
                  </div>
                  <div className={s.data_row}>
                    <span>Срок кредита:</span>
                    <strong>{result.client_data?.term_months || result.loan_term_months || '—'} мес</strong>
                  </div>
                </div>

                <div className={s.scoring_result__section}>
                  <h4>💳 Условия кредита</h4>
                  <div className={s.data_row}>
                    <span>Одобренная сумма:</span>
                    <strong className={s.approved_amount}>
                      {formatMoney(result.decision?.approved_amount || result.maxLoanAmount || result.approved_amount)}
                    </strong>
                  </div>
                  <div className={s.data_row}>
                    <span>Ежемесячный платёж:</span>
                    <strong>{formatMoney(result.decision?.monthly_payment || result.monthly_payment)}</strong>
                  </div>
                  <div className={s.data_row}>
                    <span>Ставка:</span>
                    <strong>{(result.decision?.applied_rate || result.recommendedRate / 100 || 0.22) * 100}% годовых</strong>
                  </div>
                  <div className={s.data_row}>
                    <span>ML надёжность:</span>
                    <strong>{result.decision?.ml_score || result.ml_score || '—'}%</strong>
                  </div>
                  <div className={s.data_row}>
                    <span>Лимит DTI:</span>
                    <strong>{result.decision?.dti_tier || result.dti_tier || '—'}</strong>
                  </div>
                </div>

                <div className={s.scoring_result__reason}>
                  {result.decision?.reason || result.reason || 'Анализ выполнен успешно.'}
                </div>

                <button 
                  className="btn-primary" 
                  style={{ width: '100%', marginTop: 16, justifyContent: 'center' }}
                  onClick={() => {
                    // Заполнить форму скоринга данными из документа
                    if (result.client_data) {
                      // Здесь можно сохранить данные в localStorage или sessionStorage
                      sessionStorage.setItem('scoring_form_data', JSON.stringify({
                        inn: result.client_data.inn,
                        workPlace: result.client_data.workPlace,
                        position: result.client_data.job_position,
                        workExperience: result.client_data.experience_years,
                        netIncome: result.client_data.net_income,
                        loanAmount: result.client_data.requested_amount,
                        loanTermMonths: result.client_data.term_months,
                      }))
                      window.location.href = '/scoring'
                    }
                  }}
                >
                  Перенести данные в форму скоринга
                </button>
              </div>
            )}
          </div>
        </div>

        {file && !result && !analyzing && (
          <button className={`btn-accent ${s.analyze_btn}`} onClick={analyze} disabled={analyzing}>
            {analyzing ? (
              <><span className={s.spin} /> <span>Анализирую...</span></>
            ) : (
              <><span>Анализировать документ</span> <ScanIcon /></>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

function PDFIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      <path d="M4 4a2 2 0 0 1 2-2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4z" fill="#e74c3c" stroke="#c0392b" strokeWidth="1.2"/>
      <path d="M14 2v6h6" fill="#c0392b" opacity="0.5"/>
      <text x="7" y="17" fontSize="8" fill="white" fontWeight="bold">PDF</text>
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#f09595" strokeWidth="1.5"/>
      <path d="M12 8v5M12 16v1" stroke="#f09595" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

function UploadIcon() {
  return <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 18V8M10 12l4-4 4 4" stroke="#378add" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 20a3 3 0 0 1 0-6h.5A6.5 6.5 0 0 1 19 11.5a4.5 4.5 0 0 1 4 4.5 4 4 0 0 1-4 4" stroke="#378add" strokeWidth="1.5" strokeLinecap="round"/></svg>
}

function DocScanIcon() {
  return <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect x="5" y="5" width="30" height="30" rx="4" stroke="#185fa5" strokeWidth="1.5"/><rect x="10" y="10" width="6" height="6" rx="1" stroke="#185fa5" strokeWidth="1.2"/><rect x="24" y="10" width="6" height="6" rx="1" stroke="#185fa5" strokeWidth="1.2"/><rect x="10" y="24" width="6" height="6" rx="1" stroke="#185fa5" strokeWidth="1.2"/><rect x="24" y="24" width="6" height="6" rx="1" stroke="#185fa5" strokeWidth="1.2"/><path d="M14 20h12" stroke="#00c6ff" strokeWidth="1.5" strokeLinecap="round"/></svg>
}

function ScanIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="11" y="1" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="1" y="11" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="11" y="11" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.3"/><path d="M7 4h2M4 8h8M7 12h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
}

function CheckIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#1D9E75" opacity=".2"/><path d="M5 8l2.5 2.5L11 5.5" stroke="#5DCAA5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
}