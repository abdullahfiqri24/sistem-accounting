import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'

interface Command {
  kind: 'nav' | 'action' | 'doc' | 'akun'
  id: string
  label: string
  icon: string
  group: string
  shortcut?: string
}

const COMMANDS: Command[] = [
  { kind: 'nav', id: 'dashboard', label: 'Buka Dashboard', icon: 'home', group: 'Navigasi' },
  { kind: 'nav', id: 'jurnal-umum', label: 'Buka Jurnal Umum', icon: 'inbox', group: 'Navigasi' },
  { kind: 'nav', id: 'buku-besar', label: 'Buka Buku Besar', icon: 'book', group: 'Navigasi' },
  { kind: 'nav', id: 'trial-balance', label: 'Buka Trial Balance', icon: 'scale', group: 'Navigasi' },
  { kind: 'nav', id: 'laba-rugi', label: 'Buka Laporan Laba Rugi', icon: 'chart', group: 'Navigasi' },
  { kind: 'nav', id: 'piutang-bpjs', label: 'Buka Piutang BPJS', icon: 'users', group: 'Navigasi' },
  { kind: 'nav', id: 'coa', label: 'Buka Chart of Accounts', icon: 'database', group: 'Navigasi' },
  { kind: 'action', id: 'new-journal', label: 'Buat Jurnal Baru', icon: 'plus', shortcut: 'N', group: 'Aksi Cepat' },
  { kind: 'action', id: 'new-kas-masuk', label: 'Input Kas Masuk', icon: 'plus', group: 'Aksi Cepat' },
  { kind: 'action', id: 'new-kas-keluar', label: 'Input Kas Keluar', icon: 'plus', group: 'Aksi Cepat' },
  { kind: 'action', id: 'post-batch', label: 'Posting Batch Jurnal Draft', icon: 'send', group: 'Aksi Cepat' },
  { kind: 'action', id: 'toggle-dark', label: 'Toggle Dark Mode', icon: 'moon', shortcut: '⇧⌘D', group: 'Pengaturan' },
  { kind: 'doc', id: 'JV-2025-11-0240', label: 'JV-2025-11-0240 — Klaim BPJS batch Nov W4', icon: 'inbox', group: 'Dokumen' },
  { kind: 'doc', id: 'JV-2025-11-0239', label: 'JV-2025-11-0239 — Pembelian obat Kimia Farma', icon: 'inbox', group: 'Dokumen' },
  { kind: 'akun', id: '1202', label: '1202 — Piutang BPJS Kesehatan', icon: 'database', group: 'Akun' },
  { kind: 'akun', id: '4101', label: '4101 — Pendapatan Rawat Inap', icon: 'database', group: 'Akun' },
  { kind: 'akun', id: '5101', label: '5101 — Beban Gaji & Tunjangan', icon: 'database', group: 'Akun' },
]

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  onToggleDark: () => void
}

export function CommandPalette({ open, onClose, onToggleDark }: CommandPaletteProps) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQ('')
      setIdx(0)
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (!open) return
      }
      if (e.key === 'Escape' && open) onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  const filtered = useMemo(() => {
    const term = q.toLowerCase().trim()
    if (!term) return COMMANDS
    return COMMANDS.filter((c) => c.label.toLowerCase().includes(term))
  }, [q])

  const grouped = useMemo(() => {
    const g: Record<string, Command[]> = {}
    filtered.forEach((c) => { (g[c.group] = g[c.group] || []).push(c) })
    return g
  }, [filtered])

  const pick = (cmd: Command) => {
    if (cmd.kind === 'nav') navigate(`/${cmd.id}`)
    else if (cmd.kind === 'doc') navigate('/jurnal-umum')
    else if (cmd.kind === 'akun') navigate('/buku-besar')
    else if (cmd.kind === 'action') {
      if (cmd.id === 'new-journal') navigate('/jurnal-baru')
      else if (cmd.id === 'new-kas-masuk') navigate('/kas-masuk-baru')
      else if (cmd.id === 'new-kas-keluar') navigate('/kas-keluar-baru')
      else if (cmd.id === 'toggle-dark') onToggleDark()
    }
    onClose()
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(i + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)) }
    if (e.key === 'Enter') { e.preventDefault(); pick(filtered[idx]) }
    if (e.key === 'Escape') onClose()
  }

  if (!open) return null

  let runningIdx = -1

  return (
    <div
      onClick={onClose}
      className="anim-fadein"
      style={{
        position: 'fixed', inset: 0, background: 'rgba(10,12,16,0.4)',
        backdropFilter: 'blur(2px)', zIndex: 100,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '8vh',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 580, maxWidth: '90vw',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-strong)',
          borderRadius: 10,
          boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="search" size={14} style={{ color: 'var(--fg-tertiary)' }}/>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => { setQ(e.target.value); setIdx(0) }}
            onKeyDown={handleKey}
            placeholder="Cari menu, jurnal, akun, atau aksi…"
            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 14, color: 'var(--fg)' }}
          />
          <kbd className="kbd">esc</kbd>
        </div>

        <div style={{ maxHeight: 380, overflowY: 'auto', padding: '6px 0' }}>
          {filtered.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--fg-tertiary)', fontSize: 13 }}>
              Tidak ada hasil untuk "<strong>{q}</strong>"
            </div>
          )}
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <div style={{ padding: '6px 14px 4px', fontSize: 10.5, color: 'var(--fg-quaternary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                {group}
              </div>
              {items.map((cmd) => {
                runningIdx++
                const localIdx = runningIdx
                const active = localIdx === idx
                return (
                  <div
                    key={cmd.kind + cmd.id}
                    onMouseEnter={() => setIdx(localIdx)}
                    onClick={() => pick(cmd)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '7px 14px',
                      background: active ? 'var(--bg-hover)' : 'transparent',
                      color: active ? 'var(--fg)' : 'var(--fg-secondary)',
                      cursor: 'pointer', fontSize: 13,
                      borderLeft: active ? '2px solid var(--brand-maroon)' : '2px solid transparent',
                    }}
                  >
                    <Icon name={cmd.icon} size={14} style={{ color: 'var(--fg-tertiary)' }}/>
                    <span style={{ flex: 1 }}>{cmd.label}</span>
                    {cmd.shortcut && <kbd className="kbd">{cmd.shortcut}</kbd>}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <div style={{
          padding: '8px 14px', borderTop: '1px solid var(--border)',
          background: 'var(--bg-subtle)', fontSize: 11, color: 'var(--fg-tertiary)',
          display: 'flex', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <span><kbd className="kbd">↑↓</kbd> navigasi</span>
            <span><kbd className="kbd">↵</kbd> pilih</span>
            <span><kbd className="kbd">esc</kbd> tutup</span>
          </div>
          <span>{filtered.length} hasil</span>
        </div>
      </div>
    </div>
  )
}
