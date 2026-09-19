import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import type { User } from '@/types'

const BREADCRUMBS: Record<string, string[]> = {
  'dashboard': ['Dashboard'],
  'kas-masuk': ['Transaksi', 'Kas Masuk'],
  'kas-keluar': ['Transaksi', 'Kas Keluar'],
  'jurnal-umum': ['Transaksi', 'Jurnal Umum'],
  'jurnal-baru': ['Transaksi', 'Jurnal Umum', 'Buat Baru'],
  'kas-masuk-baru': ['Transaksi', 'Kas Masuk', 'Input Baru'],
  'kas-keluar-baru': ['Transaksi', 'Kas Keluar', 'Input Baru'],
  'piutang': ['Transaksi', 'Piutang'],
  'piutang-umum': ['Transaksi', 'Piutang', 'Pasien Umum'],
  'piutang-bpjs': ['Transaksi', 'Piutang', 'BPJS'],
  'piutang-asuransi': ['Transaksi', 'Piutang', 'Asuransi'],
  'utang': ['Transaksi', 'Utang'],
  'buku-besar': ['Buku Besar'],
  'trial-balance': ['Trial Balance'],
  'laba-rugi': ['Laporan', 'Laba Rugi'],
  'neraca': ['Laporan', 'Neraca'],
  'arus-kas': ['Laporan', 'Arus Kas'],
  'lap-pendapatan': ['Laporan', 'Pendapatan per Unit'],
  'aging-ar': ['Laporan', 'Aging Piutang'],
  'aging-ap': ['Laporan', 'Aging Utang'],
  'coa': ['Master Data', 'Chart of Accounts'],
  'cost-center': ['Master Data', 'Cost Center'],
  'vendor': ['Master Data', 'Vendor'],
  'customer': ['Master Data', 'Customer / Pasien'],
  'payer': ['Master Data', 'Payer'],
  'periode': ['Pengaturan', 'Periode Akuntansi'],
  'user-role': ['Pengaturan', 'User & Role'],
  'approval': ['Pengaturan', 'Approval Workflow'],
  'integrasi': ['Pengaturan', 'Integrasi SIMRS'],
}

interface HeaderProps {
  user: User
  dark: boolean
  onToggleDark: () => void
  onOpenCmd: () => void
  onLogout: () => void
  onOpenMobileNav: () => void
}

export function Header({ user, dark, onToggleDark, onOpenCmd, onLogout, onOpenMobileNav }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const page = location.pathname.replace('/', '') || 'dashboard'
  const crumbs = BREADCRUMBS[page] ?? ['Dashboard']

  const [notifOpen, setNotifOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  return (
    <header style={{
      height: 'var(--header-h)', borderBottom: '1px solid var(--border)',
      background: 'var(--bg-elevated)',
      display: 'flex', alignItems: 'center',
      padding: '0 16px', gap: 12,
      position: 'sticky', top: 0, zIndex: 30, flexShrink: 0,
    }}>
      {/* Mobile menu */}
      <button className="btn btn-ghost btn-icon mobile-menu-trigger" onClick={onOpenMobileNav} style={{ display: 'none', marginLeft: -6 }}>
        <Icon name="menu" size={16}/>
      </button>

      {/* Breadcrumbs */}
      <div className="header-breadcrumbs" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--fg-tertiary)', minWidth: 0 }}>
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {i > 0 && <Icon name="chevron-right" size={11} style={{ color: 'var(--fg-quaternary)', flexShrink: 0 }}/>}
            <span style={{ color: i === crumbs.length - 1 ? 'var(--fg)' : 'var(--fg-tertiary)', fontWeight: i === crumbs.length - 1 ? 600 : 400, whiteSpace: 'nowrap' }}>
              {c}
            </span>
          </span>
        ))}
      </div>

      <div style={{ flex: 1 }}/>

      {/* Period badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        height: 28, padding: '0 10px',
        border: '1px solid var(--border)', borderRadius: 6,
        fontSize: 12, background: 'var(--bg-subtle)', flexShrink: 0,
      }}>
        <Icon name="calendar" size={12} style={{ color: 'var(--fg-tertiary)' }}/>
        <span style={{ color: 'var(--fg-tertiary)' }}>Periode:</span>
        <span style={{ fontWeight: 600 }}>Nov 2025</span>
        <span className="badge badge-open" style={{ height: 16, fontSize: 9.5, padding: '0 6px', marginLeft: 2 }}>Open</span>
      </div>

      {/* Command palette trigger */}
      <button
        onClick={onOpenCmd}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          height: 28, padding: '0 8px 0 10px',
          border: '1px solid var(--border)', borderRadius: 6,
          background: 'var(--bg-subtle)', color: 'var(--fg-tertiary)',
          fontSize: 12, cursor: 'pointer', minWidth: 240, flexShrink: 0,
        }}
      >
        <Icon name="search" size={13}/>
        <span>Cari atau jalankan perintah…</span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', gap: 2 }}>
          <kbd className="kbd">⌘</kbd><kbd className="kbd">K</kbd>
        </span>
      </button>

      {/* Dark mode */}
      <button className="btn btn-ghost btn-icon" onClick={onToggleDark} title="Toggle dark mode">
        <Icon name={dark ? 'sun' : 'moon'} size={15}/>
      </button>

      {/* Notifications */}
      <div style={{ position: 'relative' }}>
        <button className="btn btn-ghost btn-icon" onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false) }}>
          <Icon name="bell" size={15}/>
          <span style={{ position: 'absolute', top: 4, right: 4, width: 7, height: 7, borderRadius: '50%', background: 'var(--brand-gold)', border: '1.5px solid var(--bg-elevated)' }}/>
        </button>
        {notifOpen && (
          <NotifDropdown
            onClose={() => setNotifOpen(false)}
            onNav={(p) => { navigate(`/${p}`); setNotifOpen(false) }}
          />
        )}
      </div>

      <div className="vdivider" style={{ height: 24 }}/>

      {/* User */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => { setUserOpen(!userOpen); setNotifOpen(false) }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', padding: '4px 6px', borderRadius: 6, cursor: 'pointer' }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--brand-maroon), var(--brand-maroon-700))',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, flexShrink: 0,
          }}>
            {user.name.split(' ').slice(0, 2).map((n) => n[0]).join('')}
          </div>
          <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{user.name.length > 22 ? user.name.slice(0, 22) + '…' : user.name}</div>
            <div style={{ fontSize: 10.5, color: 'var(--fg-tertiary)' }}>{user.role}</div>
          </div>
          <Icon name="chevron-down" size={11} style={{ color: 'var(--fg-quaternary)' }}/>
        </button>
        {userOpen && <UserDropdown user={user} onClose={() => setUserOpen(false)} onLogout={onLogout}/>}
      </div>
    </header>
  )
}

function NotifDropdown({ onClose, onNav }: { onClose: () => void; onNav: (p: string) => void }) {
  const items = [
    { kind: 'approval', icon: 'check', title: '4 jurnal menunggu approval', sub: 'Total Rp 491.3 Jt — paling lama 2 hari', time: 'baru saja', target: 'jurnal-umum' },
    { kind: 'due', icon: 'clock', title: '5 piutang jatuh tempo minggu ini', sub: 'Rp 548.0 Jt termasuk BPJS batch Okt W3', time: '2 jam lalu', target: 'piutang' },
    { kind: 'warn', icon: 'alert', title: 'Selisih kas kecil IGD Rp 280.000', sub: 'Perlu rekonsiliasi sebelum closing', time: 'kemarin', target: 'kas-masuk' },
    { kind: 'info', icon: 'info', title: 'Closing periode Oktober 2025 selesai', sub: 'Dilakukan oleh mgr.bambang', time: '12 Nov', target: 'periode' },
  ]
  return (
    <div className="card anim-fadein" style={{ position: 'absolute', top: 38, right: 0, width: 360, zIndex: 50, boxShadow: '0 12px 32px rgba(0,0,0,0.15)' }}>
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Notifikasi</div>
        <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, color: 'var(--brand-maroon)' }} onClick={onClose}>Tandai semua dibaca</button>
      </div>
      <div style={{ maxHeight: 320, overflowY: 'auto' }}>
        {items.map((it, i) => (
          <div key={i} onClick={() => onNav(it.target)}
            style={{ display: 'flex', gap: 10, padding: '10px 14px', borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 6, flexShrink: 0,
              background: it.kind === 'warn' ? 'var(--status-pending-bg)' : it.kind === 'approval' ? 'var(--status-posted-bg)' : 'var(--bg-subtle)',
              color: it.kind === 'warn' ? 'var(--status-pending)' : it.kind === 'approval' ? 'var(--status-posted)' : 'var(--fg-tertiary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name={it.icon} size={14}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 2 }}>{it.title}</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-tertiary)' }}>{it.sub}</div>
              <div style={{ fontSize: 10.5, color: 'var(--fg-quaternary)', marginTop: 3 }}>{it.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function UserDropdown({ user, onClose, onLogout }: { user: User; onClose: () => void; onLogout: () => void }) {
  return (
    <div className="card anim-fadein" style={{ position: 'absolute', top: 42, right: 0, width: 240, zIndex: 50, boxShadow: '0 12px 32px rgba(0,0,0,0.15)' }}>
      <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
        <div style={{ fontSize: 11.5, color: 'var(--fg-tertiary)', marginTop: 2 }}>{user.username} · {user.role}</div>
      </div>
      <div style={{ padding: 4 }}>
        {[
          { icon: 'user', label: 'Profil saya' },
          { icon: 'settings', label: 'Preferensi' },
          { icon: 'book', label: 'Dokumentasi' },
        ].map((it, i) => (
          <div key={i} className="nav-item" style={{ margin: '1px 0', height: 30 }}>
            <Icon name={it.icon} size={14} style={{ color: 'var(--fg-tertiary)' }}/>
            <span style={{ fontSize: 12.5 }}>{it.label}</span>
          </div>
        ))}
        <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }}/>
        <div className="nav-item" onClick={() => { onClose(); onLogout() }} style={{ color: 'var(--negative)', height: 30 }}>
          <Icon name="logout" size={14}/>
          <span style={{ fontSize: 12.5 }}>Keluar</span>
        </div>
      </div>
    </div>
  )
}
