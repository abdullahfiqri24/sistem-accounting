import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  dark: boolean
  sidebarCollapsed: boolean
  mobileNavOpen: boolean
  cmdOpen: boolean
  toggleDark: () => void
  setDark: (v: boolean) => void
  toggleSidebar: () => void
  setMobileNavOpen: (v: boolean) => void
  setCmdOpen: (v: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      dark: false,
      sidebarCollapsed: false,
      mobileNavOpen: false,
      cmdOpen: false,
      toggleDark: () => set((s) => ({ dark: !s.dark })),
      setDark: (v) => set({ dark: v }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setMobileNavOpen: (v) => set({ mobileNavOpen: v }),
      setCmdOpen: (v) => set({ cmdOpen: v }),
    }),
    { name: 'yarsi-ui', partialize: (s) => ({ dark: s.dark, sidebarCollapsed: s.sidebarCollapsed }) }
  )
)
