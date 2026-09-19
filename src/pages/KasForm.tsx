import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import { useToast } from '@/components/ui/Toast'
import { ACCOUNTS, COST_CENTERS } from '@/lib/data'
import { fmtIDR } from '@/lib/utils'

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

export default function KasForm() {
  const navigate = useNavigate()
  const { push } = useToast()
  const location = useLocation()
  const isMasuk = !location.pathname.includes('keluar')

  const [form, setForm] = useState({
    tgl: '2025-11-26',
    no: isMasuk ? 'KM-2025-11-0184' : 'KK-2025-11-0092',
    kasBank: '1111',
    lawan: '',
    cc: 'CC-ADM',
    jumlah: '',
    desc: '',
    ref: '',
  })

  const jumlah = parseAmount(form.jumlah)
  const kasBankAccounts = ACCOUNTS.filter((a) => a.kode.startsWith('11'))
  const lawanAccounts = ACCOUNTS.filter((a) => {
    if (isMasuk) return ['1201', '1202', '1203', '4101', '4102', '4103', '4104', '4105', '4106'].includes(a.kode)
    return ['2101', '2102', '2201', '2202', '5101', '5102', '5201', '5301', '5302'].includes(a.kode)
  })

  const kasBankAcc = ACCOUNTS.find((a) => a.kode === form.kasBank)
  const lawanAcc = ACCOUNTS.find((a) => a.kode === form.lawan)
  const cc = COST_CENTERS.find((c) => c.kode === form.cc)
  const canPost = jumlah > 0 && form.desc && form.lawan

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: isMasuk ? 'var(--status-approved-bg)' : 'var(--status-void-bg)',
              color: isMasuk ? 'var(--status-approved)' : 'var(--status-void)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="plus" size={15}/>
            </div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>
              Input {isMasuk ? 'Kas Masuk' : 'Kas Keluar'}
            </h1>
            <span className="badge badge-draft">Draft</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-sm" onClick={() => navigate(-1)}>Batal</button>
          <button className="btn btn-sm" onClick={() => { push('Disimpan sebagai draft', 'info'); navigate(isMasuk ? '/kas-masuk' : '/kas-keluar') }}>
            <Icon name="save" size={13}/> Simpan Draft
          </button>
          <button className="btn btn-sm btn-primary" disabled={!canPost}
            onClick={() => { push(`${form.no} berhasil di-post`, 'success'); navigate(isMasuk ? '/kas-masuk' : '/kas-keluar') }}>
            <Icon name="send" size={13}/> Posting
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Form */}
          <div className="card" style={{ padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Detail Transaksi</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label className="field-label">Tanggal *</label>
                <input className="input" type="date" value={form.tgl} onChange={(e) => setForm({ ...form, tgl: e.target.value })}/>
              </div>
              <div>
                <label className="field-label">Nomor</label>
                <input className="input mono" value={form.no} disabled style={{ background: 'var(--bg-subtle)' }}/>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <label className="field-label">{isMasuk ? 'Diterima di Kas/Bank *' : 'Dibayar dari Kas/Bank *'}</label>
              <select className="input select" value={form.kasBank} onChange={(e) => setForm({ ...form, kasBank: e.target.value })}>
                {kasBankAccounts.map((a) => <option key={a.kode} value={a.kode}>{a.kode} — {a.nama}</option>)}
              </select>
            </div>

            <div style={{ marginTop: 14 }}>
              <label className="field-label">{isMasuk ? 'Sumber Penerimaan (Lawan Akun) *' : 'Tujuan Pembayaran (Lawan Akun) *'}</label>
              <select className="input select" value={form.lawan} onChange={(e) => setForm({ ...form, lawan: e.target.value })}>
                <option value="">— pilih akun —</option>
                {lawanAccounts.map((a) => <option key={a.kode} value={a.kode}>{a.kode} — {a.nama}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
              <div>
                <label className="field-label">Cost Center *</label>
                <select className="input select" value={form.cc} onChange={(e) => setForm({ ...form, cc: e.target.value })}>
                  {COST_CENTERS.map((c) => <option key={c.kode} value={c.kode}>{c.kode} — {c.nama}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Jumlah (Rp) *</label>
                <input className="input num" placeholder="0" value={form.jumlah} onChange={(e) => setForm({ ...form, jumlah: e.target.value })} style={{ textAlign: 'right', fontWeight: 600 }}/>
                <div style={{ fontSize: 10.5, color: 'var(--fg-tertiary)', marginTop: 4 }}>
                  Bisa ekspresi: <code style={{ fontFamily: 'var(--font-mono)' }}>1500000+250000</code>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <label className="field-label">Deskripsi *</label>
              <input className="input" placeholder="Contoh: Pembayaran rawat inap Nyonya Siti R." value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })}/>
            </div>

            <div style={{ marginTop: 14 }}>
              <label className="field-label">No. Referensi</label>
              <input className="input mono" placeholder="Nomor kuitansi / invoice / bukti…" value={form.ref} onChange={(e) => setForm({ ...form, ref: e.target.value })}/>
            </div>

            <div style={{ marginTop: 14 }}>
              <label className="field-label">Upload Bukti</label>
              <div style={{ border: '1.5px dashed var(--border-strong)', borderRadius: 6, padding: '20px 16px', textAlign: 'center', color: 'var(--fg-tertiary)', background: 'var(--bg-subtle)', cursor: 'pointer' }}>
                <Icon name="upload" size={20} style={{ color: 'var(--fg-quaternary)', marginBottom: 6 }}/>
                <div style={{ fontSize: 12.5, marginBottom: 2 }}>Tarik file ke sini atau klik untuk upload</div>
                <div style={{ fontSize: 10.5 }}>PDF, JPG, PNG · maks. 5 MB</div>
              </div>
            </div>
          </div>

          {/* Live preview + tips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Preview Jurnal</div>
                <span className="badge" style={{ fontSize: 10, background: 'var(--bg-subtle)', color: 'var(--fg-tertiary)' }}>auto-generated</span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-tertiary)', marginBottom: 12 }}>Sistem akan otomatis membuat jurnal berikut saat posting.</div>

              <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', fontSize: 11.5 }}>
                <div style={{ padding: '8px 12px', background: 'var(--bg-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                  <span className="mono" style={{ fontWeight: 600 }}>{form.no}</span>
                  <span className="num" style={{ color: 'var(--fg-tertiary)' }}>{form.tgl}</span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-elevated)' }}>
                      {['Akun', 'Debit', 'Kredit'].map((h, i) => (
                        <th key={h} style={{ padding: '6px 10px', textAlign: i === 0 ? 'left' : 'right', fontSize: 10.5, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500, borderBottom: '1px solid var(--border)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {isMasuk ? (
                      <>
                        <tr>
                          <td style={{ padding: '8px 10px', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ fontWeight: 500 }}>{kasBankAcc ? `${kasBankAcc.kode} — ${kasBankAcc.nama}` : <span style={{ color: 'var(--fg-quaternary)' }}>—</span>}</div>
                            <div style={{ fontSize: 10, color: 'var(--fg-tertiary)', marginTop: 1 }}>{cc?.kode}</div>
                          </td>
                          <td className="num" style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>
                            {jumlah > 0 ? fmtIDR(jumlah, { decimals: 0, withSymbol: false }) : <span style={{ color: 'var(--fg-quaternary)' }}>—</span>}
                          </td>
                          <td className="num" style={{ padding: '8px 10px', textAlign: 'right', color: 'var(--fg-quaternary)', borderBottom: '1px solid var(--border)' }}>—</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px 10px', paddingLeft: 24 }}>
                            <div style={{ fontWeight: 500 }}>{lawanAcc ? `${lawanAcc.kode} — ${lawanAcc.nama}` : <span style={{ color: 'var(--fg-quaternary)' }}>— pilih akun lawan —</span>}</div>
                            <div style={{ fontSize: 10, color: 'var(--fg-tertiary)', marginTop: 1 }}>{cc?.kode}</div>
                          </td>
                          <td className="num" style={{ padding: '8px 10px', textAlign: 'right', color: 'var(--fg-quaternary)' }}>—</td>
                          <td className="num" style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                            {jumlah > 0 ? fmtIDR(jumlah, { decimals: 0, withSymbol: false }) : <span style={{ color: 'var(--fg-quaternary)' }}>—</span>}
                          </td>
                        </tr>
                      </>
                    ) : (
                      <>
                        <tr>
                          <td style={{ padding: '8px 10px', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ fontWeight: 500 }}>{lawanAcc ? `${lawanAcc.kode} — ${lawanAcc.nama}` : <span style={{ color: 'var(--fg-quaternary)' }}>— pilih akun lawan —</span>}</div>
                            <div style={{ fontSize: 10, color: 'var(--fg-tertiary)', marginTop: 1 }}>{cc?.kode}</div>
                          </td>
                          <td className="num" style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>
                            {jumlah > 0 ? fmtIDR(jumlah, { decimals: 0, withSymbol: false }) : <span style={{ color: 'var(--fg-quaternary)' }}>—</span>}
                          </td>
                          <td className="num" style={{ padding: '8px 10px', textAlign: 'right', color: 'var(--fg-quaternary)', borderBottom: '1px solid var(--border)' }}>—</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px 10px', paddingLeft: 24 }}>
                            <div style={{ fontWeight: 500 }}>{kasBankAcc ? `${kasBankAcc.kode} — ${kasBankAcc.nama}` : <span style={{ color: 'var(--fg-quaternary)' }}>—</span>}</div>
                            <div style={{ fontSize: 10, color: 'var(--fg-tertiary)', marginTop: 1 }}>{cc?.kode}</div>
                          </td>
                          <td className="num" style={{ padding: '8px 10px', textAlign: 'right', color: 'var(--fg-quaternary)' }}>—</td>
                          <td className="num" style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                            {jumlah > 0 ? fmtIDR(jumlah, { decimals: 0, withSymbol: false }) : <span style={{ color: 'var(--fg-quaternary)' }}>—</span>}
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: 'var(--bg-subtle)', fontWeight: 700, borderTop: '2px solid var(--border-strong)' }}>
                      <td style={{ padding: '8px 10px', fontSize: 10.5, textTransform: 'uppercase', color: 'var(--fg-tertiary)', letterSpacing: '0.04em' }}>Total</td>
                      <td className="num" style={{ padding: '8px 10px', textAlign: 'right' }}>{jumlah > 0 ? fmtIDR(jumlah, { decimals: 0, withSymbol: false }) : '—'}</td>
                      <td className="num" style={{ padding: '8px 10px', textAlign: 'right' }}>{jumlah > 0 ? fmtIDR(jumlah, { decimals: 0, withSymbol: false }) : '—'}</td>
                    </tr>
                  </tfoot>
                </table>
                {form.desc && (
                  <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--fg-tertiary)' }}>
                    <strong style={{ color: 'var(--fg-secondary)' }}>Memo:</strong> {form.desc}
                  </div>
                )}
              </div>
            </div>

            <div className="card" style={{ padding: 14, background: 'var(--bg-subtle)' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <Icon name="info" size={14} style={{ color: 'var(--brand-maroon)', marginTop: 1, flexShrink: 0 }}/>
                <div style={{ fontSize: 11.5, color: 'var(--fg-secondary)', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--fg)' }}>Single-entry form.</strong> Form ini menyederhanakan input karena salah satu sisi pasti Kas/Bank. Untuk transaksi multi-row gunakan menu <strong>Jurnal Umum</strong>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
