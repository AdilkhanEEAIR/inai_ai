import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@/styles/global.scss'

// Restore language/direction from persisted store on page load
const savedLang = (() => {
  try {
    const s = localStorage.getItem('lang-storage')
    return s ? JSON.parse(s)?.state?.lang : 'ru'
  } catch { return 'ru' }
})()
document.documentElement.lang = savedLang ?? 'ru'
document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)