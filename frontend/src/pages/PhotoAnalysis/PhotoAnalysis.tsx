import { useState, useRef } from 'react'
import { useLangStore } from '../../store'
import s from './PhotoAnalysis.module.scss'

export default function PhotoAnalysisPage() {
  const { t } = useLangStore()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [done, setDone] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    setFile(f)
    setDone(false)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(f)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f && f.type.startsWith('image/')) handleFile(f)
  }

  const analyze = async () => {
    setAnalyzing(true)
    await new Promise((r) => setTimeout(r, 2200))
    setAnalyzing(false)
    setDone(true)
  }

  const mockFields = [
    { label: t.photo.docFields.fullName, value: 'Иванов Иван Иванович', conf: 98 },
    { label: t.photo.docFields.birthDate, value: '15.03.1991', conf: 96 },
    { label: t.photo.docFields.documentNumber, value: 'AB 1234567', conf: 99 },
    { label: t.photo.docFields.inn, value: '12345678901234', conf: 94 },
    { label: t.photo.docFields.address, value: 'г. Бишкек, ул. Центральная, 1', conf: 89 },
  ]

  const documentTypes = t.photo.documentTypes || ['Паспорт', 'Справка о доходах', 'ИНН', 'СНИЛС']

  return (
    <div className={`page ${s.page}`}>
      <div className={s.inner}>
        <div className={s.header}>
          <h1>{t.photo.title}</h1>
          <p>{t.photo.subtitle}</p>
        </div>

        <div className={s.content}>
          <div
            className={`${s.dropzone} ${dragging ? s.dragging : ''} ${preview ? s.has_file : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !preview && inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            {preview ? (
              <div className={s.preview_wrap}>
                <img src={preview} alt="preview" className={s.preview_img} />
                <button
                  className={s.remove_btn}
                  onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); setDone(false) }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className={s.drop_content}>
                <div className={s.drop_icon}><UploadIcon /></div>
                <p className={s.drop_text}>{t.photo.drag}</p>
                <span className={s.drop_hint}>PNG, JPG, WEBP · до 10MB</span>
              </div>
            )}
          </div>

          <div className={s.result_col}>
            {!done && !analyzing && (
              <div className={s.result_placeholder}>
                <DocScanIcon />
                <p>{t.photo.upload}</p>
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
                <p>{t.photo.analyzing}</p>
                <div className={s.progress_bar}>
                  <div className={s.progress_fill} />
                </div>
              </div>
            )}

            {done && (
              <div className={s.extracted}>
                <div className={s.extracted__header}>
                  <CheckIcon />
                  <span>{t.photo.extracted}</span>
                </div>
                {mockFields.map((f) => (
                  <div key={f.label} className={s.extracted__row}>
                    <span className={s.extracted__label}>{f.label}</span>
                    <span className={s.extracted__value}>{f.value}</span>
                    <div className={s.extracted__conf}>
                      <div className={s.conf_bar} style={{ width: `${f.conf}%` }} />
                      <span>{f.conf}%</span>
                    </div>
                  </div>
                ))}
                <button className="btn-primary" style={{ width: '100%', marginTop: 16, justifyContent: 'center' }}>
                  <span>{t.photo.transfer}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {preview && !done && (
          <button
            className={`btn-accent ${s.analyze_btn}`}
            onClick={analyze}
            disabled={analyzing}
          >
            {analyzing ? (
              <><span className={s.spin} /> <span>{t.common.analyzing}</span></>
            ) : (
              <><span>{t.photo.analyze}</span> <ScanIcon /></>
            )}
          </button>
        )}
      </div>
    </div>
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