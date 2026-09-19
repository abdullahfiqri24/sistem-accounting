import { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'

import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import JurnalUmum from '@/pages/JurnalUmum'
import JurnalForm from '@/pages/JurnalForm'
import KasForm from '@/pages/KasForm'
import BukuBesar from '@/pages/BukuBesar'
import TrialBalance from '@/pages/TrialBalance'
import Piutang from '@/pages/Piutang'
import Neraca from '@/pages/Neraca'
import ChartOfAccounts from '@/pages/ChartOfAccounts'
import LabaRugi from '@/pages/LabaRugi'
import PlaceholderPage from '@/pages/PlaceholderPage'

function AppShell() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user!)
  const logout = useAuthStore((s) => s.logout)
  const { dark, sidebarCollapsed, mobileNavOpen, cmdOpen, toggleDark, toggleSidebar, setMobileNavOpen, setCmdOpen } = useUIStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCmdOpen(true)
      }
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        navigate('/jurnal-baru')
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [navigate, setCmdOpen])

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Header
          user={user}
          dark={dark}
          onToggleDark={toggleDark}
          onOpenCmd={() => setCmdOpen(true)}
          onLogout={logout}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />
        <main style={{ flex: 1, overflow: 'auto' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/jurnal-umum" element={<JurnalUmum/>}/>
            <Route path="/jurnal-baru" element={<JurnalForm/>}/>
            <Route path="/kas-masuk-baru" element={<KasForm/>}/>
            <Route path="/kas-keluar-baru" element={<KasForm/>}/>
            <Route path="/buku-besar" element={<BukuBesar/>}/>
            <Route path="/trial-balance" element={<TrialBalance/>}/>
            <Route path="/piutang" element={<Piutang/>}/>
            <Route path="/piutang-umum" element={<Piutang/>}/>
            <Route path="/piutang-bpjs" element={<Piutang/>}/>
            <Route path="/piutang-asuransi" element={<Piutang/>}/>
            <Route path="/neraca" element={<Neraca/>}/>
            <Route path="/coa" element={<ChartOfAccounts/>}/>
            <Route path="/laba-rugi" element={<LabaRugi/>}/>
            <Route path="/kas-masuk" element={<PlaceholderPage pageId="kas-masuk"/>}/>
            <Route path="/kas-keluar" element={<PlaceholderPage pageId="kas-keluar"/>}/>
            <Route path="/utang" element={<PlaceholderPage pageId="utang"/>}/>
            <Route path="/arus-kas" element={<PlaceholderPage pageId="arus-kas"/>}/>
            <Route path="/lap-pendapatan" element={<PlaceholderPage pageId="lap-pendapatan"/>}/>
            <Route path="/aging-ar" element={<PlaceholderPage pageId="aging-ar"/>}/>
            <Route path="/aging-ap" element={<PlaceholderPage pageId="aging-ap"/>}/>
            <Route path="/cost-center" element={<PlaceholderPage pageId="cost-center"/>}/>
            <Route path="/vendor" element={<PlaceholderPage pageId="vendor"/>}/>
            <Route path="/customer" element={<PlaceholderPage pageId="customer"/>}/>
            <Route path="/payer" element={<PlaceholderPage pageId="payer"/>}/>
            <Route path="/periode" element={<PlaceholderPage pageId="periode"/>}/>
            <Route path="/user-role" element={<PlaceholderPage pageId="user-role"/>}/>
            <Route path="/approval" element={<PlaceholderPage pageId="approval"/>}/>
            <Route path="/integrasi" element={<PlaceholderPage pageId="integrasi"/>}/>
            <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
          </Routes>
        </main>
      </div>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onToggleDark={toggleDark}/>
    </div>
  )
}

export default function App() {
  const user = useAuthStore((s) => s.user)
  const { dark } = useUIStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  if (!user) return <Login/>
  return <AppShell/>
}
