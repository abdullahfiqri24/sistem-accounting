import { Icon } from '@/components/ui/Icon'
import { useNavigate } from 'react-router-dom'
import { TRIAL_BALANCE } from '@/lib/data'
import { fmtIDR } from '@/lib/utils'

export default function TrialBalance() {
  const navigate = useNavigate()

  const totals = TRIAL_BALANCE.reduce(
    (acc, r) => ({
      awalD: acc.awalD + r.awalD,
      awalK: acc.awalK + r.awalK,
      mutD: acc.mutD + r.mutD,
      mutK: acc.mutK + r.mutK,
      akhirD: acc.akhirD + r.akhirD,
      akhirK: acc.akhirK + r.akhirK,
    }),
    { awalD: 0, awalK: 0, mutD: 0, mutK: 0, akhirD: 0, akhirK: 0 }
  )

  const isBalanced = totals.akhirD === totals.akhirK

  const numCell = (v: number) =>
    v ? fmtIDR(v, { decimals: 0, withSymbol: false }) : <span style={{ color: 'var(--fg-quaternary)' }}>—</span>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Trial Balance (Neraca Saldo)</h1>
            <p style={{ margin: '3px 0 0', fontSize: 12.5, color: 'var(--fg-tertiary)' }}>
              Cutoff: 30 November 2025 · {TRIAL_BALANCE.length} akun aktif
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-sm"><Icon name="download" size={13}/> Excel</button>
            <button className="btn btn-sm"><Icon name="download" size={13}/> PDF</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '0 0 180px' }}>
            <label className="field-label">Cutoff Tanggal</label>
            <input className="input input-sm" type="date" defaultValue="2025-11-30"/>
          </div>
          <div style={{ flex: '0 0 180px' }}>
            <label className="field-label">Level Akun</label>
            <select className="input input-sm select">
              <option>Detail (akun terkecil)</option>
              <option>Summary (header 2 digit)</option>
            </select>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label className="field-label">Cost Center</label>
            <select className="input input-sm select"><option>Semua Cost Center</option></select>
          </div>
          <div style={{ flex: '1 1 220px' }}>
            <label className="field-label">Tipe Akun</label>
            <select className="input input-sm select">
              <option>Semua tipe</option>
              <option>Aset</option><option>Kewajiban</option><option>Ekuitas</option><option>Pendapatan</option><option>Beban</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ paddingLeft: 24 }} rowSpan={2}>Kode</th>
              <th rowSpan={2}>Nama Akun</th>
              <th rowSpan={2}>Tipe</th>
              <th colSpan={2} className="col-num" style={{ borderLeft: '1px solid var(--border)', textAlign: 'center' }}>Saldo Awal</th>
              <th colSpan={2} className="col-num" style={{ borderLeft: '1px solid var(--border)', textAlign: 'center' }}>Mutasi</th>
              <th colSpan={2} className="col-num" style={{ borderLeft: '1px solid var(--border)', textAlign: 'center' }}>Saldo Akhir</th>
            </tr>
            <tr>
              <th className="col-num" style={{ borderLeft: '1px solid var(--border)', paddingTop: 0 }}>Debit</th>
              <th className="col-num" style={{ paddingTop: 0 }}>Kredit</th>
              <th className="col-num" style={{ borderLeft: '1px solid var(--border)', paddingTop: 0 }}>Debit</th>
              <th className="col-num" style={{ paddingTop: 0 }}>Kredit</th>
              <th className="col-num" style={{ borderLeft: '1px solid var(--border)', paddingTop: 0 }}>Debit</th>
              <th className="col-num" style={{ paddingTop: 0 }}>Kredit</th>
            </tr>
          </thead>
          <tbody>
            {TRIAL_BALANCE.map((r) => (
              <tr key={r.kode} style={{ cursor: 'pointer' }} onClick={() => navigate('/buku-besar')}>
                <td style={{ paddingLeft: 24 }} className="mono">{r.kode}</td>
                <td>{r.nama}</td>
                <td><span style={{ fontSize: 11, color: 'var(--fg-tertiary)' }}>{r.tipe}</span></td>
                <td className="num col-num" style={{ borderLeft: '1px solid var(--border)' }}>{numCell(r.awalD)}</td>
                <td className="num col-num">{numCell(r.awalK)}</td>
                <td className="num col-num" style={{ borderLeft: '1px solid var(--border)' }}>{numCell(r.mutD)}</td>
                <td className="num col-num">{numCell(r.mutK)}</td>
                <td className="num col-num" style={{ borderLeft: '1px solid var(--border)', fontWeight: r.akhirD ? 600 : 400 }}>{numCell(r.akhirD)}</td>
                <td className="num col-num" style={{ fontWeight: r.akhirK ? 600 : 400 }}>{numCell(r.akhirK)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{
              background: isBalanced ? 'var(--status-approved-bg)' : 'var(--status-void-bg)',
              fontWeight: 700, borderTop: '2px solid var(--border-strong)',
            }}>
              <td style={{ paddingLeft: 24, padding: '12px 10px 12px 24px' }} colSpan={3}>
                TOTAL
                {isBalanced
                  ? <span className="badge badge-approved" style={{ marginLeft: 10 }}>Balance ✓</span>
                  : <span className="badge badge-void" style={{ marginLeft: 10 }}>Tidak Balance</span>}
              </td>
              <td className="num col-num" style={{ padding: '12px 10px', borderLeft: '1px solid var(--border)' }}>{fmtIDR(totals.awalD, { decimals: 0, withSymbol: false })}</td>
              <td className="num col-num" style={{ padding: '12px 10px' }}>{fmtIDR(totals.awalK, { decimals: 0, withSymbol: false })}</td>
              <td className="num col-num" style={{ padding: '12px 10px', borderLeft: '1px solid var(--border)' }}>{fmtIDR(totals.mutD, { decimals: 0, withSymbol: false })}</td>
              <td className="num col-num" style={{ padding: '12px 10px' }}>{fmtIDR(totals.mutK, { decimals: 0, withSymbol: false })}</td>
              <td className="num col-num" style={{ padding: '12px 10px', borderLeft: '1px solid var(--border)' }}>{fmtIDR(totals.akhirD, { decimals: 0, withSymbol: false })}</td>
              <td className="num col-num" style={{ padding: '12px 10px' }}>{fmtIDR(totals.akhirK, { decimals: 0, withSymbol: false })}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
