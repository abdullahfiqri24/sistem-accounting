import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import { useToast } from '@/components/ui/Toast'
import { ACCOUNTS, COST_CENTERS } from '@/lib/data'
import { fmtIDR } from '@/lib/utils'

interface JLine { id: number; akun: string; desc: string; cc: string; debit: string; kredit: string }

function parseAmount(str: string): number {
  if (!str) return 0
  try {
    const cleaned = String(str).replace(/[^\d+\-*/.()]/g, '')
    if (!cleaned) return 0
    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + cleaned + ')')()
    return isFinite(result) ? result : 0
  } catch { return 0 }
}

function SummaryRow({ label, value, emphasis, color }: { label: string; value: number; emphasis?: boolean; color?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 12, color: 'var(--fg-secondary)', fontWeight: emphasis ? 600 : 400 }}>{label}</span>
      <span className="num" style={{ fontSize: emphasis ? 14 : 13, fontWeight: emphasis ? 700 : 600, color: color || 'var(--fg)' }}>
        {fmtIDR(value, { decimals: 2 })}
      </span>
    </div>
  )
}

export default function JurnalForm() {
  const navigate = useNavigate()
  const { push } = useToast()

  const [header, setHeader] = useState({ tgl: '2025-11-26', no: 'JV-2025-11-0242', desc: '', ref: '', ccDefault: 'CC-ADM' })
  const [lines, setLines] = useState<JLine[]>([
    { id: 1, akun: '', desc: '', cc: 'CC-ADM', debit: '', kredit: '' },
    { id: 2, akun: '', desc: '', cc: 'CC-ADM', debit: '', kredit: '' },
  ])
  const [autocomplete, setAutocomplete] = useState<{ line: number | null; q: string }>({ line: null, q: '' })

  const addLine = () => {
    setLines((ls) => [...ls, { id: Date.now(), akun: '', desc: '', cc: header.ccDefault, debit: '', kredit: '' }])
  }

  const removeLine = (id: number) => setLines((ls) => ls.filter((l) => l.id !== id))

  const updateLine = (id: number, field: keyof JLine, value: string) =>
    setLines((ls) => ls.map((l) => (l.id === id ? { ...l, [field]: value } : l)))

  const totalDebit = lines.reduce((s, l) => s + parseAmount(l.debit), 0)
  const totalKredit = lines.reduce((s, l) => s + parseAmount(l.kredit), 0)
  const selisih = totalDebit - totalKredit
  const balanced = selisih === 0 && totalDebit > 0

  const accountResults = useMemo(() => {
    if (autocomplete.line === null) return []
    const q = autocomplete.q.toLowerCase().trim()
    if (!q) return ACCOUNTS.slice(0, 8)
    return ACCOUNTS.filter((a) => a.kode.includes(q) || a.nama.toLowerCase().includes(q)).slice(0, 8)
  }, [autocomplete])

  const handleLineKey = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>, _line: JLine, idx: number) => {
    if (e.key === 'Tab' && !e.shiftKey && idx === lines.length - 1) {
      const target = e.target as HTMLElement
      if ((target as HTMLInputElement).dataset?.col === 'kredit') {
        e.preventDefault()
        addLine()
        setTimeout(() => {
          const inputs = document.querySelectorAll<HTMLInputElement>('[data-jform-line] [data-col="akun"]')
          inputs[inputs.length - 1]?.focus()
        }, 10)
      }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>Buat Jurnal Umum</h1>
            <span className="badge badge-draft">Draft baru</span>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--fg-tertiary)', marginTop: 3 }}>
            Tab di kolom Kredit terakhir untuk menambah baris baru · <kbd className="kbd">Ctrl</kbd>+<kbd className="kbd">S</kbd> simpan draft
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-sm" onClick={() => navigate(-1)}>Batal</button>
          <button className="btn btn-sm" onClick={() => { push('Jurnal disimpan sebagai draft', 'info'); navigate('/jurnal-umum') }}>
            <Icon name="save" size={13}/> Simpan Draft
          </button>
          <button className="btn btn-sm btn-primary" disabled={!balanced || !header.desc}
            onClick={() => { push(`Jurnal ${header.no} berhasil di-post`, 'success'); navigate('/jurnal-umum') }}>
            <Icon name="send" size={13}/> Posting
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label className="field-label">Tanggal</label>
              <input className="input input-sm" type="date" value={header.tgl} onChange={(e) => setHeader({ ...header, tgl: e.target.value })}/>
            </div>
            <div>
              <label className="field-label">No. Jurnal</label>
              <input className="input input-sm mono" value={header.no} disabled style={{ background: 'var(--bg-subtle)' }}/>
            </div>
            <div>
              <label className="field-label">Referensi</label>
              <input className="input input-sm" placeholder="Nomor invoice / dokumen…" value={header.ref} onChange={(e) => setHeader({ ...header, ref: e.target.value })}/>
            </div>
            <div>
              <label className="field-label">Cost Center Default</label>
              <select className="input input-sm select" value={header.ccDefault} onChange={(e) => setHeader({ ...header, ccDefault: e.target.value })}>
                {COST_CENTERS.map((cc) => <option key={cc.kode} value={cc.kode}>{cc.kode} — {cc.nama}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="field-label">Deskripsi Jurnal *</label>
            <input className="input" placeholder="Contoh: Penerimaan klaim BPJS batch November W4" value={header.desc} onChange={(e) => setHeader({ ...header, desc: e.target.value })}/>
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'visible' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Baris Jurnal</div>
            <button className="btn btn-xs" onClick={addLine}><Icon name="plus" size={11}/> Tambah Baris</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: 12.5, borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle)' }}>
                  {['#', 'Akun *', 'Deskripsi Baris', 'Cost Center', 'Debit', 'Kredit', ''].map((h, i) => (
                    <th key={i} style={{ padding: '8px 10px', fontSize: 10.5, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500, textAlign: i >= 4 && i <= 5 ? 'right' : 'left', borderBottom: '1px solid var(--border)', width: i === 0 ? 32 : i === 3 ? 140 : i >= 4 && i <= 5 ? 150 : i === 6 ? 36 : undefined }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lines.map((line, idx) => (
                  <tr key={line.id} data-jform-line="" style={{ position: 'relative' }}>
                    <td style={{ padding: 4, textAlign: 'center', color: 'var(--fg-quaternary)', fontSize: 11, borderBottom: '1px solid var(--border)' }} className="mono">{idx + 1}</td>
                    <td style={{ padding: 4, borderBottom: '1px solid var(--border)', position: 'relative' }}>
                      <input
                        data-col="akun"
                        className="input input-sm"
                        style={{ border: '1px solid transparent', background: 'transparent' }}
                        placeholder="Ketik kode/nama akun…"
                        value={line.akun}
                        onChange={(e) => { updateLine(line.id, 'akun', e.target.value); setAutocomplete({ line: line.id, q: e.target.value }) }}
                        onFocus={(e) => setAutocomplete({ line: line.id, q: e.target.value })}
                        onBlur={() => setTimeout(() => setAutocomplete((a) => a.line === line.id ? { line: null, q: '' } : a), 150)}
                        onKeyDown={(e) => handleLineKey(e, line, idx)}
                      />
                      {autocomplete.line === line.id && accountResults.length > 0 && (
                        <div className="card anim-fadein" style={{ position: 'absolute', top: '100%', left: 4, right: 4, zIndex: 10, maxHeight: 240, overflowY: 'auto', boxShadow: '0 8px 20px rgba(0,0,0,0.12)', marginTop: 2 }}>
                          {accountResults.map((a) => (
                            <div key={a.kode}
                              onMouseDown={(e) => { e.preventDefault(); updateLine(line.id, 'akun', `${a.kode} — ${a.nama}`); setAutocomplete({ line: null, q: '' }) }}
                              style={{ padding: '7px 10px', cursor: 'pointer', fontSize: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--border)' }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                              <div>
                                <div><span className="mono" style={{ fontWeight: 600 }}>{a.kode}</span> — {a.nama}</div>
                                <div style={{ fontSize: 10.5, color: 'var(--fg-tertiary)', marginTop: 1 }}>{a.tipe} · Saldo Normal: {a.saldoNormal === 'D' ? 'Debit' : 'Kredit'}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: 4, borderBottom: '1px solid var(--border)' }}>
                      <input data-col="desc" className="input input-sm" style={{ border: '1px solid transparent', background: 'transparent' }} placeholder="Keterangan baris…" value={line.desc} onChange={(e) => updateLine(line.id, 'desc', e.target.value)} onKeyDown={(e) => handleLineKey(e, line, idx)}/>
                    </td>
                    <td style={{ padding: 4, borderBottom: '1px solid var(--border)' }}>
                      <select data-col="cc" className="input input-sm select" style={{ border: '1px solid transparent', background: 'transparent' }} value={line.cc} onChange={(e) => updateLine(line.id, 'cc', e.target.value)} onKeyDown={(e) => handleLineKey(e, line, idx)}>
                        {COST_CENTERS.map((cc) => <option key={cc.kode} value={cc.kode}>{cc.kode}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: 4, borderBottom: '1px solid var(--border)' }}>
                      <input data-col="debit" className="input input-sm num" style={{ border: '1px solid transparent', background: 'transparent', textAlign: 'right' }} placeholder="0" value={line.debit} onChange={(e) => { updateLine(line.id, 'debit', e.target.value); if (e.target.value) updateLine(line.id, 'kredit', '') }} onKeyDown={(e) => handleLineKey(e, line, idx)}/>
                    </td>
                    <td style={{ padding: 4, borderBottom: '1px solid var(--border)' }}>
                      <input data-col="kredit" className="input input-sm num" style={{ border: '1px solid transparent', background: 'transparent', textAlign: 'right' }} placeholder="0" value={line.kredit} onChange={(e) => { updateLine(line.id, 'kredit', e.target.value); if (e.target.value) updateLine(line.id, 'debit', '') }} onKeyDown={(e) => handleLineKey(e, line, idx)}/>
                    </td>
                    <td style={{ padding: 4, borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                      <button className="btn btn-ghost btn-icon btn-sm" disabled={lines.length <= 2} onClick={() => removeLine(line.id)}>
                        <Icon name="trash" size={12}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, marginTop: 16 }}>
          <div className="card" style={{ padding: 14, background: 'var(--bg-subtle)' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <Icon name="info" size={14} style={{ color: 'var(--brand-maroon)', marginTop: 2, flexShrink: 0 }}/>
              <div style={{ fontSize: 12, color: 'var(--fg-secondary)', lineHeight: 1.5 }}>
                <div style={{ fontWeight: 600, color: 'var(--fg)', marginBottom: 2 }}>Tips input cepat</div>
                Anda bisa mengetik ekspresi seperti <code style={{ background: 'var(--bg-elevated)', padding: '1px 5px', borderRadius: 3, fontFamily: 'var(--font-mono)' }}>1500000+250000</code> di kolom Debit/Kredit. Tab di kolom Kredit terakhir untuk menambah baris baru.
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 11.5, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, marginBottom: 10 }}>Ringkasan</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <SummaryRow label="Total Debit" value={totalDebit}/>
              <SummaryRow label="Total Kredit" value={totalKredit}/>
              <div style={{ height: 1, background: 'var(--border)', margin: '2px 0' }}/>
              <SummaryRow label="Selisih" value={selisih} emphasis color={selisih === 0 ? 'var(--positive)' : 'var(--negative)'}/>
              <div style={{
                marginTop: 8, padding: '8px 10px',
                background: balanced ? 'var(--status-approved-bg)' : 'var(--status-void-bg)',
                color: balanced ? 'var(--status-approved)' : 'var(--status-void)',
                borderRadius: 5, fontSize: 12, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
              }}>
                <Icon name={balanced ? 'check' : 'alert'} size={12}/>
                {balanced ? 'Jurnal balance — siap di-post' : (totalDebit === 0 ? 'Belum ada nilai' : 'Jurnal tidak balance')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
