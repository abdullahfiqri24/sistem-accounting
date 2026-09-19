import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { useToast } from '@/components/ui/Toast'
import { LABA_RUGI_TS } from '@/lib/data'
import { fmtIDR } from '@/lib/utils'

const TS_MONTHS = [
  { key: '2025-01', label: 'Jan' },
  { key: '2025-02', label: 'Feb' },
  { key: '2025-03', label: 'Mar' },
  { key: '2025-04', label: 'Apr' },
  { key: '2025-05', label: 'Mei' },
  { key: '2025-06', label: 'Jun' },
  { key: '2025-07', label: 'Jul' },
  { key: '2025-08', label: 'Ags' },
  { key: '2025-09', label: 'Sep' },
  { key: '2025-10', label: 'Okt' },
  { key: '2025-11', label: 'Nov' },
]

function fmtJt(n: number): string {
  if (n === 0) return '—'
  const m = Math.round(n / 1_000_000)
  if (m === 0) return '<1'
  const abs = Math.abs(m).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return m < 0 ? `(${abs})` : abs
}

type TsLine = typeof LABA_RUGI_TS[number]

export default function LabaRugiTimeSeries() {
  const { push } = useToast()
  const [year] = useState('2025')

  const pendapatanLines = LABA_RUGI_TS.filter(l => l.group === 'pendapatan')
  const hppLines        = LABA_RUGI_TS.filter(l => l.group === 'hpp')
  const bebanLines      = LABA_RUGI_TS.filter(l => l.group === 'beban_ops')
  const lainLines       = LABA_RUGI_TS.filter(l => l.group === 'lain')

  const sumM   = (lines: TsLine[], mk: string) => lines.reduce((s, l) => s + (l.months[mk] ?? 0), 0)
  const lineYtd = (l: TsLine) => TS_MONTHS.reduce((s, m) => s + (l.months[m.key] ?? 0), 0)
  const grpYtd  = (lines: TsLine[]) => TS_MONTHS.reduce((s, m) => s + sumM(lines, m.key), 0)

  const labaKotorM  = (mk: string) => sumM(pendapatanLines, mk) + sumM(hppLines, mk)
  const labaOpsM    = (mk: string) => labaKotorM(mk) + sumM(bebanLines, mk)
  const labaBersihM = (mk: string) => labaOpsM(mk) + sumM(lainLines, mk)

  const pendapatanYtd = grpYtd(pendapatanLines)
  const labaKotorYtd  = TS_MONTHS.reduce((s, m) => s + labaKotorM(m.key), 0)
  const labaOpsYtd    = TS_MONTHS.reduce((s, m) => s + labaOpsM(m.key), 0)
  const labaBersihYtd = TS_MONTHS.reduce((s, m) => s + labaBersihM(m.key), 0)
  const netMargin     = pendapatanYtd ? (labaBersihYtd / pendapatanYtd) * 100 : 0

  const TOTAL_COLS = TS_MONTHS.length + 2

  const sTh: React.CSSProperties = {
    position: 'sticky', left: 0, zIndex: 3, background: 'var(--bg-subtle)',
    padding: '8px 14px', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.04em',
    textTransform: 'uppercase', color: 'var(--fg-tertiary)',
    borderBottom: '1px solid var(--border)', minWidth: 220, textAlign: 'left',
    whiteSpace: 'nowrap',
  }
  const sTd = (bg = 'var(--bg)'): React.CSSProperties => ({
    position: 'sticky', left: 0, zIndex: 2, background: bg,
    padding: '5px 14px', borderBottom: '1px solid var(--border)',
    minWidth: 220, whiteSpace: 'nowrap',
  })
  const nTh: React.CSSProperties = {
    padding: '8px 8px', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.04em',
    textTransform: 'uppercase', color: 'var(--fg-tertiary)',
    borderBottom: '1px solid var(--border)', textAlign: 'right', minWidth: 90,
  }
  const nTd = (val: number, bold = false): React.CSSProperties => ({
    padding: '5px 8px', borderBottom: '1px solid var(--border)',
    textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12,
    fontWeight: bold ? 700 : 400,
    color: val < 0 ? 'var(--negative)' : val === 0 ? 'var(--fg-quaternary)' : 'var(--fg)',
  })
  const ytdTd = (val: number, bold = false): React.CSSProperties => ({
    ...nTd(val, bold),
    background: 'rgba(91,2,2,0.04)',
    fontWeight: bold ? 700 : 500,
    borderLeft: '1px solid var(--border)',
    minWidth: 100,
  })

  const SectionHdr = ({ label }: { label: string }) => (
    <tr>
      <td colSpan={TOTAL_COLS} style={{
        padding: '10px 14px 5px', background: 'var(--bg-subtle)',
        fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em',
        color: 'var(--brand-maroon)', fontWeight: 700, borderBottom: '1px solid var(--border)',
      }}>
        {label}
      </td>
    </tr>
  )

  const SubtotalRow = ({ label, monthFn, ytd }: { label: string; monthFn: (mk: string) => number; ytd: number }) => (
    <tr style={{ background: 'rgba(91,2,2,0.03)' }}>
      <td style={{ ...sTd('rgba(91,2,2,0.03)'), fontWeight: 700, fontSize: 12 }}>{label}</td>
      {TS_MONTHS.map(m => { const v = monthFn(m.key); return <td key={m.key} style={nTd(v, true)}>{fmtJt(v)}</td> })}
      <td style={ytdTd(ytd, true)}>{fmtJt(ytd)}</td>
    </tr>
  )

  const TotalRow = ({ label, monthFn, ytd, isFinal = false }: { label: string; monthFn: (mk: string) => number; ytd: number; isFinal?: boolean }) => (
    <tr style={{ background: isFinal ? 'var(--brand-maroon)' : 'var(--bg-subtle)', color: isFinal ? 'var(--fg-on-brand)' : 'var(--fg)', borderTop: '2px solid var(--border-strong)' }}>
      <td style={{ ...sTd(isFinal ? 'var(--brand-maroon)' : 'var(--bg-subtle)'), color: isFinal ? 'var(--fg-on-brand)' : 'var(--fg)', fontWeight: 700, fontSize: isFinal ? 12.5 : 12, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
        {label}
      </td>
      {TS_MONTHS.map(m => {
        const v = monthFn(m.key)
        return (
          <td key={m.key} style={{ ...nTd(v, true), fontSize: isFinal ? 12.5 : 12, background: isFinal ? 'var(--brand-maroon)' : undefined, color: isFinal ? 'var(--fg-on-brand)' : (v >= 0 ? 'var(--positive)' : 'var(--negative)') }}>
            {fmtJt(v)}
          </td>
        )
      })}
      <td style={{ ...ytdTd(ytd, true), fontSize: isFinal ? 13 : 12.5, background: isFinal ? 'var(--brand-maroon)' : 'rgba(91,2,2,0.07)', color: isFinal ? 'var(--fg-on-brand)' : (ytd >= 0 ? 'var(--positive)' : 'var(--negative)'), borderLeft: '2px solid rgba(91,2,2,0.25)' }}>
        {fmtJt(ytd)}
      </td>
    </tr>
  )

  const LineRow = ({ l }: { l: TsLine }) => {
    const ytd = lineYtd(l)
    return (
      <tr>
        <td style={sTd()}>
          <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="mono" style={{ fontSize: 10.5, color: 'var(--fg-quaternary)', flexShrink: 0, width: 34 }}>{l.kode}</span>
            <span style={{ fontSize: 12 }}>{l.nama}</span>
          </span>
        </td>
        {TS_MONTHS.map(m => { const v = l.months[m.key] ?? 0; return <td key={m.key} style={nTd(v)}>{fmtJt(v)}</td> })}
        <td style={ytdTd(ytd)}>{fmtJt(ytd)}</td>
      </tr>
    )
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
      {/* Header controls */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <div>
          <label className="field-label">Tahun</label>
          <select className="input input-sm select" style={{ width: 100 }} value={year} onChange={() => push('Data tahun lain belum tersedia', 'info')}>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>
        <div>
          <label className="field-label">Unit / Cost Center</label>
          <select className="input input-sm select" style={{ width: 180 }}>
            <option>Semua Unit</option>
            <option>Rawat Inap</option>
            <option>Rawat Jalan</option>
            <option>IGD</option>
          </select>
        </div>
        <div style={{ flex: 1 }}/>
        <div style={{ alignSelf: 'flex-end' }}>
          <button className="btn btn-sm" onClick={() => push('Export Excel sedang diproses', 'info')}>
            <Icon name="download" size={13}/> Export Excel
          </button>
        </div>
      </div>

      {/* YTD summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Pendapatan YTD', value: pendapatanYtd, sub: null },
          { label: 'Laba Kotor YTD', value: labaKotorYtd, sub: `${pendapatanYtd ? (labaKotorYtd/pendapatanYtd*100).toFixed(1) : '—'}% gross margin` },
          { label: 'Laba Operasional YTD', value: labaOpsYtd, sub: `${pendapatanYtd ? (labaOpsYtd/pendapatanYtd*100).toFixed(1) : '—'}% op. margin` },
          { label: 'Laba Bersih YTD', value: labaBersihYtd, sub: `${netMargin.toFixed(1)}% net margin` },
        ].map((c, i) => (
          <div key={i} className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>{c.label}</div>
            <div className="num" style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 5 }}>{fmtIDR(c.value, { decimals: 0 })}</div>
            {c.sub && <div style={{ fontSize: 11.5, color: 'var(--positive)', fontWeight: 600, marginTop: 4 }}>{c.sub}</div>}
          </div>
        ))}
      </div>

      {/* Time series table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700 }}>Laba Rugi Bulanan Jan–Nov {year}</div>
            <div style={{ fontSize: 11.5, color: 'var(--fg-tertiary)', marginTop: 2 }}>Nilai dalam Rp juta · scroll ➜ untuk lihat semua bulan</div>
          </div>
          <span className="badge" style={{ background: 'var(--bg-subtle)', color: 'var(--fg-tertiary)', fontSize: 10.5 }}>Des {year} belum tersedia</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'separate', borderSpacing: 0, minWidth: 1380, fontSize: 12 }}>
            <thead>
              <tr style={{ background: 'var(--bg-subtle)' }}>
                <th style={sTh}>
                  Akun
                  <div style={{ fontSize: 9.5, fontWeight: 400, letterSpacing: 0, textTransform: 'none', color: 'var(--fg-quaternary)', marginTop: 1 }}>Kode — Nama</div>
                </th>
                {TS_MONTHS.map(m => (
                  <th key={m.key} style={nTh}>
                    {m.label}
                    <div style={{ fontSize: 9.5, fontWeight: 400, letterSpacing: 0, textTransform: 'none', color: 'var(--fg-quaternary)', marginTop: 1 }}>{year}</div>
                  </th>
                ))}
                <th style={{ ...nTh, minWidth: 100, background: 'rgba(91,2,2,0.06)', color: 'var(--brand-maroon)', borderLeft: '2px solid rgba(91,2,2,0.15)' }}>
                  YTD
                  <div style={{ fontSize: 9.5, fontWeight: 400, letterSpacing: 0, textTransform: 'none', color: 'var(--fg-tertiary)', marginTop: 1 }}>{year}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <SectionHdr label="Pendapatan Operasional"/>
              {pendapatanLines.map(l => <LineRow key={l.kode} l={l}/>)}
              <SubtotalRow label="Total Pendapatan" monthFn={mk => sumM(pendapatanLines, mk)} ytd={pendapatanYtd}/>

              <SectionHdr label="Harga Pokok Pelayanan"/>
              {hppLines.map(l => <LineRow key={l.kode} l={l}/>)}
              <SubtotalRow label="Total HPP" monthFn={mk => sumM(hppLines, mk)} ytd={grpYtd(hppLines)}/>

              <TotalRow label="Laba Kotor" monthFn={labaKotorM} ytd={labaKotorYtd}/>

              <SectionHdr label="Beban Operasional"/>
              {bebanLines.map(l => <LineRow key={l.kode} l={l}/>)}
              <SubtotalRow label="Total Beban Operasional" monthFn={mk => sumM(bebanLines, mk)} ytd={grpYtd(bebanLines)}/>

              <TotalRow label="Laba Operasional" monthFn={labaOpsM} ytd={labaOpsYtd}/>

              <SectionHdr label="Pendapatan / Beban Lain"/>
              {lainLines.map(l => <LineRow key={l.kode} l={l}/>)}
              <SubtotalRow label="Net Pendapatan Lain" monthFn={mk => sumM(lainLines, mk)} ytd={grpYtd(lainLines)}/>

              <TotalRow label="Laba Bersih Sebelum Pajak" monthFn={labaBersihM} ytd={labaBersihYtd} isFinal/>
            </tbody>
          </table>
        </div>

        <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-subtle)', fontSize: 11, color: 'var(--fg-tertiary)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Nilai dalam Rp juta · Data Jan–Nov {year} · Laporan bersifat preliminary hingga periode ditutup</span>
          <span>Net margin YTD: <strong className="num" style={{ color: 'var(--positive)' }}>{netMargin.toFixed(1)}%</strong></span>
        </div>
      </div>
    </div>
  )
}
