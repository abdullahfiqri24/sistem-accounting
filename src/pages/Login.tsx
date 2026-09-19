import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { useAuthStore } from '@/stores/authStore'
import type { User } from '@/types'

const ROLES: Record<string, User> = {
  akuntan:  { name: 'Dewi Anggraini', role: 'Akuntan', username: 'akt.dewi' },
  kasir:    { name: 'Ratna Suryani', role: 'Kasir', username: 'kasir.ratna' },
  manajer:  { name: 'Ir. Bambang Setiawan, M.M.', role: 'Manajer Keuangan', username: 'mgr.bambang' },
  direksi:  { name: 'dr. H. Achmad Faried, Sp.B', role: 'Direktur Keuangan', username: 'dir.faried' },
}

export default function Login() {
  const login = useAuthStore((s) => s.login)
  const [username, setUsername] = useState('akt.dewi')
  const [password, setPassword] = useState('••••••••')
  const [showPw, setShowPw] = useState(false)
  const [role, setRole] = useState('akuntan')
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault()
    setLoading(true)
    setTimeout(() => {
      login(ROLES[role])
      setLoading(false)
    }, 600)
  }

  return (
    <div className="login-bg" style={{
      position: 'fixed', inset: 0, display: 'grid', gridTemplateColumns: '1.1fr 1fr',
      color: '#fff', overflow: 'hidden',
    }}>
      {/* Left brand panel */}
      <div className="login-brand-panel" style={{ padding: '48px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: 'linear-gradient(135deg, #5b0202, #2b0a0a)',
            border: '1px solid rgba(218,165,32,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(91,2,2,0.4)',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24"><path d="M9.5 4h5v4H18v5h-3.5V18h-5v-5H6v-5h3.5z" fill="#daa520"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#daa520', letterSpacing: '0.18em', fontWeight: 600, textTransform: 'uppercase' }}>Rumah Sakit YARSI</div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em' }}>Sistem Akuntansi Keuangan</div>
          </div>
        </div>

        <div style={{ maxWidth: 440 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px',
            background: 'rgba(218,165,32,0.12)', border: '1px solid rgba(218,165,32,0.3)',
            borderRadius: 999, color: '#daa520', fontSize: 11.5, fontWeight: 600, marginBottom: 18,
          }}>
            <span className="dot" style={{ background: '#daa520' }}></span>
            Periode Akuntansi Aktif &nbsp;·&nbsp; November 2025
          </div>
          <h1 style={{ fontSize: 36, lineHeight: 1.15, margin: '0 0 14px', fontWeight: 700, letterSpacing: '-0.025em' }}>
            Pencatatan keuangan rumah sakit yang{' '}
            <span style={{ color: '#daa520' }}>cepat, rapi, auditable</span>.
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
            Jurnal umum, piutang BPJS, buku besar, laporan PSAK, dan integrasi SIMRS — dalam satu sistem yang dirancang untuk akuntan profesional.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { k: '98.4%', v: 'Klaim BPJS approved Oktober' },
            { k: '1.247', v: 'Jurnal posting bulan ini' },
            { k: '12 hari', v: 'Rata-rata closing periode' },
          ].map((s, i) => (
            <div key={i} style={{ borderLeft: '1px solid rgba(218,165,32,0.25)', paddingLeft: 12 }}>
              <div className="num" style={{ fontSize: 22, fontWeight: 700, color: '#daa520', letterSpacing: '-0.02em' }}>{s.k}</div>
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{s.v}</div>
            </div>
          ))}
        </div>

        <svg style={{ position: 'absolute', right: -40, top: 80, opacity: 0.06, pointerEvents: 'none' }} width="360" height="360" viewBox="0 0 100 100">
          <path d="M40 10h20v30h30v20H60v30H40V60H10V40h30z" fill="#daa520"/>
        </svg>
      </div>

      {/* Right form panel */}
      <div className="login-form-panel" style={{
        background: 'var(--bg-elevated)', color: 'var(--fg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 40, position: 'relative',
        boxShadow: '-30px 0 60px rgba(0,0,0,0.25)',
      }}>
        <form onSubmit={submit} style={{ width: '100%', maxWidth: 380 }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 6 }}>
              Masuk ke sistem
            </div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Selamat datang kembali</h2>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--fg-tertiary)' }}>
              Gunakan akun internal RS YARSI Anda.
            </p>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label className="field-label">Username / NIP</label>
            <div style={{ position: 'relative' }}>
              <Icon name="user" size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-quaternary)' }}/>
              <input
                className="input input-lg"
                style={{ paddingLeft: 32 }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label className="field-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Password</span>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--brand-maroon)', textDecoration: 'none', fontSize: 11, textTransform: 'none', letterSpacing: 0 }}>
                Lupa password?
              </a>
            </label>
            <div style={{ position: 'relative' }}>
              <Icon name="lock" size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-quaternary)' }}/>
              <input
                type={showPw ? 'text' : 'password'}
                className="input input-lg"
                style={{ paddingLeft: 32, paddingRight: 36 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="btn btn-ghost btn-icon" style={{ position: 'absolute', right: 4, top: 4, height: 30, width: 30 }}>
                <Icon name={showPw ? 'eye-off' : 'eye'} size={14}/>
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label className="field-label">Masuk sebagai (demo)</label>
            <select className="input input-lg select" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="akuntan">Akuntan — Dewi Anggraini</option>
              <option value="kasir">Kasir — Ratna Suryani</option>
              <option value="manajer">Manajer Keuangan — Bambang S.</option>
              <option value="direksi">Direktur Keuangan — dr. Achmad F.</option>
            </select>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--fg-secondary)', marginBottom: 20, cursor: 'pointer' }}>
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ accentColor: 'var(--brand-maroon)' }}/>
            Ingat saya di perangkat ini (8 jam)
          </label>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', height: 40, fontSize: 14, justifyContent: 'center', fontWeight: 600 }}>
            {loading ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff', borderRadius: '50%',
                  animation: 'spin 600ms linear infinite', display: 'inline-block',
                }}/>
                Memverifikasi…
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                Masuk <Icon name="arrow-right" size={14}/>
              </span>
            )}
          </button>

          <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--fg-tertiary)' }}>
            <span>Versi 2.4.1 · Build 20251126</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span className="dot" style={{ background: 'var(--positive)' }}></span>
              Server: aktif
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}
