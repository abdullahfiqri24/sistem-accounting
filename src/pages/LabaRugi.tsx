import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import { useToast } from '@/components/ui/Toast'
import { LABA_RUGI } from '@/lib/data'
import { fmtIDR } from '@/lib/utils'
import LabaRugiTimeSeries from './LabaRugiTimeSeries'

function PctChange({ delta, inverted, onDark }: { delta: number | null; inverted?: boolean; onDark?: boolean }) {
  if (delta === null || delta === undefined) return <span style={{ color: 'var(--fg-quaternary)' }}>—</span>
  const good = inverted ? delta < 0 : delta >= 0
  const color = onDark
    ? (good ? '#9ee9c5' : '#ffb6b3')
    : (good ? 'var(--positive)' : 'var(--negative)')
  return (
    <span className="num" style={{ color, fontWeight: 600 }}>
      {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%
    </span>
  )
}

function pctChange(cur: number, prev: number): number | null {
  if (!prev || prev === 0) return null
  return ((cur - prev) / Math.abs(prev)) * 100
}

const PERIOD_LABEL: Record<string, string> = {
  '2025-11': 'Nov 2025', '2025-10': 'Okt 2025', '2025-09': 'Sep 2025', '2024-11': 'Nov 2024',
}

export default function LabaRugi() {
  const navigate = useNavigate()
  const { push } = useToast()
  const [view, setView] = useState<'bulanan' | 'timeseries'>('bulanan')
  const [comparative, setComparative] = useState(true)
  const [period, setPeriod] = useState('2025-11')
  const [comparePeriod, setComparePeriod] = useState('2025-10')

  const grandTotal = LABA_RUGI.find((r) => r.kind === 'final')
  const totalPendapatan = 5440000000

  const summaryCards = [
    { label: 'Total Pendapatan', current: 5440000000, prev: 4990000000 },
    { label: 'Laba Kotor', current: 3440000000, prev: 3150000000 },
    { label: 'Laba Operasional', current: 1424000000, prev: 1234000000 },
    { label: 'Laba Bersih', current: 1438200000, prev: 1246900000 },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Laporan Laba Rugi</h1>
            <p style={{ margin: '3px 0 0', fontSize: 12.5, color: 'var(--fg-tertiary)' }}>
              RS YARSI · {view === 'bulanan' ? `Periode ${PERIOD_LABEL[period]}${comparative ? ` dibandingkan ${PERIOD_LABEL[comparePeriod]}` : ''}` : 'Tren bulanan Jan–Nov 2025'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-sm"><Icon name="refresh" size={13}/> Refresh</button>
            <button className="btn btn-sm"><Icon name="download" size={13}/> Export PDF</button>
            <button className="btn btn-sm"><Icon name="download" size={13}/> Export Excel</button>
            <button className="btn btn-primary btn-sm" onClick={() => push('Laporan disimpan', 'success')}><Icon name="save" size={13}/> Simpan View</button>
          </div>
        </div>

        {/* Tab strip */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 12 }}>
          {([
            { key: 'bulanan', label: 'Laporan Bulanan', icon: 'calendar' },
            { key: 'timeseries', label: 'Tren Tahunan', icon: 'chart' },
          ] as const).map(t => (
            <button
              key={t.key}
              onClick={() => setView(t.key)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '7px 14px', fontSize: 13, fontWeight: 600,
                color: view === t.key ? 'var(--brand-maroon)' : 'var(--fg-secondary)',
                borderBottom: view === t.key ? '2px solid var(--brand-maroon)' : '2px solid transparent',
                marginBottom: -1, display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.15s',
              }}
            >
              <Icon name={t.icon} size={13}/>
              {t.label}
            </button>
          ))}
        </div>

        {view === 'bulanan' && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div>
              <label className="field-label">Periode</label>
              <select className="input input-sm select" style={{ width: 180 }} value={period} onChange={(e) => setPeriod(e.target.value)}>
                <option value="2025-11">November 2025</option>
                <option value="2025-10">Oktober 2025</option>
                <option value="2025-09">September 2025</option>
              </select>
            </div>
            <div>
              <label className="field-label">Bandingkan dengan</label>
              <select className="input input-sm select" style={{ width: 180 }} value={comparePeriod} disabled={!comparative} onChange={(e) => setComparePeriod(e.target.value)}>
                <option value="2025-10">Oktober 2025</option>
                <option value="2024-11">November 2024 (YoY)</option>
              </select>
            </div>
            <div>
              <label className="field-label">Unit / Cost Center</label>
              <select className="input input-sm select" style={{ width: 200 }}>
                <option value="all">Semua Unit</option>
                <option value="ri">Rawat Inap</option>
                <option value="rj">Rawat Jalan</option>
                <option value="igd">IGD</option>
              </select>
            </div>
            <div style={{ flex: 1 }}/>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--fg-secondary)', cursor: 'pointer' }}>
              <input type="checkbox" checked={comparative} onChange={(e) => setComparative(e.target.checked)} style={{ accentColor: 'var(--brand-maroon)' }}/>
              Mode comparative
            </label>
          </div>
        )}
      </div>

      {view === 'timeseries' && <LabaRugiTimeSeries/>}
      {view === 'bulanan' && <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {summaryCards.map((c, i) => {
            const delta = pctChange(c.current, c.prev)
            return (
              <div key={i} className="card" style={{ padding: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>{c.label}</div>
                <div className="num" style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 5 }}>{fmtIDR(c.current, { decimals: 0 })}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 5, fontSize: 11.5 }}>
                  <span className="num" style={{ color: 'var(--fg-tertiary)' }}>vs {fmtIDR(c.prev, { decimals: 0 })}</span>
                  <PctChange delta={delta}/>
                </div>
              </div>
            )
          })}
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Income Statement</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-tertiary)', marginTop: 2 }}>Format PSAK · klik nominal untuk drill-down ke buku besar</div>
            </div>
            <div className="badge" style={{ background: 'var(--bg-subtle)', color: 'var(--fg-tertiary)', fontSize: 10.5 }}>Last refresh: 26 Nov 09:42</div>
          </div>
          <table className="tbl" style={{ fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ width: 80, paddingLeft: 20 }}>Kode</th>
                <th>Akun / Bagian</th>
                <th className="col-num" style={{ width: 180 }}>{PERIOD_LABEL[period]}</th>
                {comparative && (
                  <>
                    <th className="col-num" style={{ width: 180 }}>{PERIOD_LABEL[comparePeriod]}</th>
                    <th className="col-num" style={{ width: 110 }}>% Δ</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {LABA_RUGI.map((row, i) => {
                if (row.kind === 'section') {
                  return (
                    <tr key={i}>
                      <td colSpan={comparative ? 5 : 3} style={{ padding: '12px 20px 6px', background: 'var(--bg-subtle)', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brand-maroon)', fontWeight: 700, borderBottom: '1px solid var(--border)' }}>
                        {row.label}
                      </td>
                    </tr>
                  )
                }
                if (row.kind === 'line') {
                  const delta = pctChange(row.current!, row.prev!)
                  return (
                    <tr key={i} style={{ cursor: 'pointer' }} onClick={() => navigate('/buku-besar')}>
                      <td className="mono" style={{ paddingLeft: 20, fontSize: 11.5, color: 'var(--fg-tertiary)' }}>{row.kode}</td>
                      <td style={{ paddingLeft: 12 }}>
                        <span style={{ borderBottom: '1px dotted var(--border-strong)' }}>{row.nama}</span>
                      </td>
                      <td className="num col-num">{fmtIDR(row.current!, { decimals: 0, withSymbol: false })}</td>
                      {comparative && (
                        <>
                          <td className="num col-num" style={{ color: 'var(--fg-tertiary)' }}>{fmtIDR(row.prev!, { decimals: 0, withSymbol: false })}</td>
                          <td className="num col-num"><PctChange delta={delta} inverted={(row.current ?? 0) < 0}/></td>
                        </>
                      )}
                    </tr>
                  )
                }
                if (row.kind === 'subtotal') {
                  const delta = pctChange(row.current!, row.prev!)
                  return (
                    <tr key={i} style={{ background: 'rgba(91,2,2,0.03)' }}>
                      <td style={{ paddingLeft: 20 }}></td>
                      <td style={{ paddingLeft: 12, fontWeight: 600 }}>{row.label}</td>
                      <td className="num col-num" style={{ fontWeight: 700 }}>{fmtIDR(row.current!, { decimals: 0, withSymbol: false })}</td>
                      {comparative && (
                        <>
                          <td className="num col-num" style={{ fontWeight: 600, color: 'var(--fg-secondary)' }}>{fmtIDR(row.prev!, { decimals: 0, withSymbol: false })}</td>
                          <td className="num col-num"><PctChange delta={delta} inverted={(row.current ?? 0) < 0}/></td>
                        </>
                      )}
                    </tr>
                  )
                }
                if (row.kind === 'gross' || row.kind === 'net' || row.kind === 'final') {
                  const isFinal = row.kind === 'final'
                  const delta = pctChange(row.current!, row.prev!)
                  return (
                    <tr key={i} style={{ background: isFinal ? 'var(--brand-maroon)' : 'var(--bg-subtle)', color: isFinal ? 'var(--fg-on-brand)' : 'var(--fg)', borderTop: '2px solid var(--border-strong)' }}>
                      <td style={{ paddingLeft: 20, padding: '12px 10px 12px 20px' }}></td>
                      <td style={{ padding: '12px 12px', fontWeight: 700, fontSize: isFinal ? 14 : 13, letterSpacing: '0.02em', textTransform: 'uppercase' }}>{row.label}</td>
                      <td className="num col-num" style={{ padding: '12px 10px', fontWeight: 700, fontSize: isFinal ? 16 : 14 }}>{fmtIDR(row.current!, { decimals: 0, withSymbol: false })}</td>
                      {comparative && (
                        <>
                          <td className="num col-num" style={{ padding: '12px 10px', fontWeight: 600, color: isFinal ? 'var(--fg-on-brand)' : 'var(--fg-secondary)', opacity: isFinal ? 0.7 : 1 }}>{fmtIDR(row.prev!, { decimals: 0, withSymbol: false })}</td>
                          <td className="num col-num" style={{ padding: '12px 10px' }}><PctChange delta={delta} onDark={isFinal}/></td>
                        </>
                      )}
                    </tr>
                  )
                }
                return null
              })}
            </tbody>
          </table>

          <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5, color: 'var(--fg-tertiary)' }}>
            <div>Disusun otomatis dari posting jurnal di periode terpilih. Tidak termasuk jurnal pending/draft.</div>
            {grandTotal && <div>Net margin: <strong className="num" style={{ color: 'var(--positive)', fontSize: 13 }}>{((grandTotal.current! / totalPendapatan) * 100).toFixed(1)}%</strong></div>}
          </div>
        </div>

        <div style={{ marginTop: 14, padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--bg-elevated)', fontSize: 11.5, color: 'var(--fg-tertiary)', display: 'flex', gap: 10 }}>
          <Icon name="info" size={14} style={{ flexShrink: 0, marginTop: 1 }}/>
          <div>
            Laporan ini bersifat <strong>preliminary</strong> hingga periode ditutup oleh Manajer Keuangan. Penyesuaian akhir periode (akrual jasa medis, depresiasi, PPh badan) belum dimasukkan untuk November 2025.
          </div>
        </div>
      </div>}
    </div>
  )
}
