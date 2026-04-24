import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LangCode } from '../i18n/translations'
import { translations } from '../i18n/translations'
import type { Translations } from '../i18n/translations'

// ─── Auth Store ───────────────────────────────────────────────
interface User {
  id: string
  name: string
  email: string
  role: 'employee' | 'client' | 'admin'
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setLoading: (v: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email: string, _password: string) => {
        set({ isLoading: true })
        // Simulate API call — replace with real endpoint
        await new Promise((r) => setTimeout(r, 900))
        const mockUser: User = {
          id: '1',
          name: email.split('@')[0],
          email,
          role: email.includes('admin') ? 'admin' : email.includes('bank') ? 'employee' : 'client',
        }
        set({ user: mockUser, token: 'mock-jwt-token', isLoading: false })
      },

      logout: () => set({ user: null, token: null }),

      setLoading: (v) => set({ isLoading: v }),
    }),
    { name: 'auth-storage', partialize: (s) => ({ user: s.user, token: s.token }) }
  )
)

// ─── Language Store ───────────────────────────────────────────
interface LangState {
  lang: LangCode
  t: Translations
  setLang: (code: LangCode) => void
}

export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      lang: 'ru',
      t: translations['ru'],
      setLang: (code: LangCode) => {
        const isRtl = code === 'ar'
        document.documentElement.dir = isRtl ? 'rtl' : 'ltr'
        document.documentElement.lang = code
        set({ lang: code, t: translations[code] })
      },
    }),
    { name: 'lang-storage', partialize: (s) => ({ lang: s.lang }) }
  )
)