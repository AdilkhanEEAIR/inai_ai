import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LangCode } from '../i18n/translations'
import { translations } from '../i18n/translations'
import type { Translations } from '../i18n/translations'

// ─── Auth Store ───────────────────────────────────────────────
export interface User {
  id: string
  name: string
  fullName?: string
  email: string
  phone?: string
  birthDate?: string
  monthlyIncome?: number
  employmentYears?: number
  role: 'employee' | 'client' | 'admin'
  avatar?: string
}

interface RegisterData {
  fullName: string
  email: string
  password: string
  phone?: string
  birthDate?: string
  monthlyIncome?: number
  employmentYears?: number
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
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
        await new Promise((r) => setTimeout(r, 900))

        // Проверяем зарегистрированных пользователей
        const saved = localStorage.getItem('registered-users')
        const users: User[] = saved ? JSON.parse(saved) : []
        const existing = users.find((u: any) => u.email === email)

        const mockUser: User = existing ?? {
          id: '1',
          name: email.split('@')[0],
          fullName: email.split('@')[0],
          email,
          role: email.includes('admin') ? 'admin' : email.includes('bank') ? 'employee' : 'client',
        }

        set({ user: mockUser, token: 'mock-jwt-token', isLoading: false })
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true })
        await new Promise((r) => setTimeout(r, 900))

        const saved = localStorage.getItem('registered-users')
        const users: any[] = saved ? JSON.parse(saved) : []

        if (users.some((u) => u.email === data.email)) {
          set({ isLoading: false })
          throw new Error('User already exists')
        }

        const newUser: User = {
          id: Date.now().toString(),
          name: data.fullName.split(' ')[0],
          fullName: data.fullName,
          email: data.email,
          phone: data.phone || '',
          birthDate: data.birthDate || '',
          monthlyIncome: data.monthlyIncome || 0,
          employmentYears: data.employmentYears || 0,
          role: 'client',
        }

        users.push(newUser)
        localStorage.setItem('registered-users', JSON.stringify(users))

        set({ user: newUser, token: 'mock-jwt-token', isLoading: false })
      },

      logout: () => set({ user: null, token: null }),
      setLoading: (v) => set({ isLoading: v }),
    }),
    {
      name: 'auth-storage',
      partialize: (s) => ({ user: s.user, token: s.token }),
    }
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
        document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr'
        document.documentElement.lang = code
        set({ lang: code, t: translations[code] })
      },
    }),
    {
      name: 'lang-storage',
      partialize: (s) => ({ lang: s.lang }),
    }
  )
)