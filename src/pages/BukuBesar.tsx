import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import { BUKU_BESAR_BPJS, ACCOUNTS, COST_CENTERS } from '@/lib/data'
import { fmtIDR, fmtDate } from '@/lib/utils'

export default function BukuBesar() {
  const navigate = useNavigate()
  const [akun, setAkun] = useState('1202')
  const data = BUKU_BESAR_BPJS

  let saldo = data.saldoAwal
  const rowsWithBalance = data.rows.map((r) => {
    saldo = saldo + r.debit - r.kredit
    return { ...r, saldo }
  })
  const totalDebit = data.rows.reduce((s, r) => s + r.debit, 0)
  const totalKredit = data.rows.reduce((s, r) => s + r.kredit, 0)
  const saldoAkhir = data.saldoAwal + totalDebit - totalKredit

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Buku Besar</h1>
            <p style={{ margin: '3px 0 0', fontSize: 12.5, color: 'var(--fg-tertiary)' }}>{data.akun} · Periode November 2025</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-sm"><Icon name="filter" size={13}/> Filter</button>
            <button className="btn btn-sm"><Icon name="download" size={13}/> Excel</button>
            <button className="btn btn-sm"><Icon name="download" size={13}/> PDF</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 280px', minWidth: 0 }}>
            <label className="field-label">Akun *</label>
            <select className="input input-sm select" value={akun} onChange={(e) => setAkun(e.target.value)}>
              {ACCOUNTS.map((a) => <option key={a.kode} value={a.kode}>{a.kode} — {a.nama}</option>)}
            </select>
          </div>
          <div style={{ flex: '0 0 160px' }}>
            <label className="field-label">Dari Tanggal</label>
            <input className="input input-sm" type="date" defaultValue="2025-11-01"/>
          </div>
          <div style={{ flex: '0 0 160px' }}>
            <label className="field-label">Sampai Tanggal</label>
            <input className="input input-sm" type="date" defaultValue="2025-11-30"/>
          </div>
          <div style={{ flex: '1 1 180px' }}>
            <label className="field-label">Cost Center</label>
            <select className="input input-sm select">
              <option>Semua Cost Center</option>
              {COST_CENTERS.map((cc) => <option key={cc.kode}>{cc.kode} — {cc.nama}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
        {[
          { label: 'Saldo Awal', value: data.saldoAwal, strong: false },
          { label: 'Total Mutasi Debit', value: totalDebit, strong: false },
          { label: 'Total Mutasi Kredit', value: totalKredit, strong: false },
          { label: 'Saldo Akhir', value: saldoAkhir, strong: true },
        ].map((s, i) => (
          <div key={i} style={{ padding: '12px 20px', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ fontSize: 10.5, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>{s.label}</div>
            <div className="num" style={{ fontSize: s.strong ? 19 : 16, fontWeight: s.strong ? 700 : 600, marginTop: 4, color: s.strong ? 'var(--brand-maroon)' : 'var(--fg)', letterSpacing: '-0.01em' }}>
              {fmtIDR(s.value, { decimals: 0 })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ paddingLeft: 24 }}>Tanggal</th>
              <th>No. Jurnal</th>
              <th style={{ minWidth: 280 }}>Deskripsi</th>
              <th className="col-num">Debit</th>
              <th className="col-num">Kredit</th>
              <th className="col-num">Saldo</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: 'var(--bg-subtle)', fontWeight: 600 }}>
              <td style={{ paddingLeft: 24 }} colSpan={3} className="num">Saldo Awal — 01 Nov 2025</td>
              <td className="num col-num" style={{ color: 'var(--fg-quaternary)' }}>—</td>
              <td className="num col-num" style={{ color: 'var(--fg-quaternary)' }}>—</td>
              <td className="num col-num">{fmtIDR(data.saldoAwal, { decimals: 0, withSymbol: false })}</td>
            </tr>
            {rowsWithBalance.map((r, i) => (
              <tr key={i} style={{ cursor: 'pointer' }} onClick={() => navigate('/jurnal-umum')}>
                <td style={{ paddingLeft: 24 }} className="num">{fmtDate(r.tgl)}</td>
                <td className="mono" style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--brand-maroon)' }}>{r.jurnal}</td>
                <td>{r.desc}</td>
                <td className="num col-num" style={{ color: r.debit > 0 ? 'var(--fg)' : 'var(--fg-quaternary)', fontWeight: r.debit > 0 ? 600 : 400 }}>
                  {r.debit > 0 ? fmtIDR(r.debit, { decimals: 0, withSymbol: false }) : '—'}
                </td>
                <td className="num col-num" style={{ color: r.kredit > 0 ? 'var(--fg)' : 'var(--fg-quaternary)', fontWeight: r.kredit > 0 ? 600 : 400 }}>
                  {r.kredit > 0 ? fmtIDR(r.kredit, { decimals: 0, withSymbol: false }) : '—'}
                </td>
                <td className="num col-num" style={{ fontWeight: 600 }}>{fmtIDR(r.saldo, { decimals: 0, withSymbol: false })}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: 'var(--bg-subtle)', fontWeight: 700, borderTop: '2px solid var(--border-strong)' }}>
              <td style={{ paddingLeft: 24, padding: '12px 10px 12px 24px' }} colSpan={3} className="num">Total & Saldo Akhir</td>
              <td className="num col-num" style={{ padding: '12px 10px' }}>{fmtIDR(totalDebit, { decimals: 0, withSymbol: false })}</td>
              <td className="num col-num" style={{ padding: '12px 10px' }}>{fmtIDR(totalKredit, { decimals: 0, withSymbol: false })}</td>
              <td className="num col-num" style={{ padding: '12px 10px', color: 'var(--brand-maroon)', fontSize: 14 }}>{fmtIDR(saldoAkhir, { decimals: 0, withSymbol: false })}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
