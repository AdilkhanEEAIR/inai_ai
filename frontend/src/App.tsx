import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useLangStore } from './store'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import HomePage from './pages/Home/Home'
import ScoringPage from './pages/Scoring/Scoring'
import ChatbotPage from './pages/Chatbot/Chatbot'
import PhotoAnalysisPage from './pages/PhotoAnalysis/PhotoAnalysis'
import LoginPage from './pages/Login/Login'
import ProfilePage from './pages/Profile/Profile'

function AppContent() {
  const { lang } = useLangStore()

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  return (
    <>
      <Header />
      <Routes>
        <Route path="/"        element={<HomePage />} />
        <Route path="/scoring" element={<ScoringPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/photo"   element={<PhotoAnalysisPage />} />
        <Route path="/login"   element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}