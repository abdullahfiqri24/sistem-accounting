import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import { NERACA } from '@/lib/data'
import { fmtIDR } from '@/lib/utils'
import type { NeracaSection } from '@/types'

export default function Neraca() {
  const navigate = useNavigate()
  const [comparative, setComparative] = useState(true)
  const [layout, setLayout] = useState<'split' | 'vertical'>('split')

  const sumSection = (sec: NeracaSection) => sec.items.reduce((s, i) => s + i.current, 0)
  const sumSectionPrev = (sec: NeracaSection) => sec.items.reduce((s, i) => s + i.prev, 0)
  const sumGroup = (group: NeracaSection[]) => group.reduce((s, sec) => s + sumSection(sec), 0)
  const sumGroupPrev = (group: NeracaSection[]) => group.reduce((s, sec) => s + sumSectionPrev(sec), 0)

  const totalAset = sumGroup(NERACA.aset)
  const totalKewajiban = sumGroup(NERACA.kewajiban)
  const totalEkuitas = sumGroup(NERACA.ekuitas)
  const totalAsetPrev = sumGroupPrev(NERACA.aset)
  const totalKewajibanPrev = sumGroupPrev(NERACA.kewajiban)
  const totalEkuitasPrev = sumGroupPrev(NERACA.ekuitas)
  const balanceCheck = totalAset - (totalKewajiban + totalEkuitas)

  const renderGroup = (group: NeracaSection[], title: string, color: string) => (
    <div>
      <div style={{ padding: '10px 16px', background: color, color: '#fff', fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', borderRadius: '6px 6px 0 0' }}>{title}</div>
      <table className="tbl" style={{ fontSize: 12.5, border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 6px 6px' }}>
        <tbody>
          {group.map((section, si) => (
            <tr key={si}>
              <td colSpan={comparative ? 4 : 3} style={{ padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr style={{ background: 'var(--bg-subtle)' }}>
                      <td colSpan={comparative ? 4 : 3} style={{ padding: '8px 16px', fontSize: 11, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>
                        {section.section}
                      </td>
                    </tr>
                    {section.items.map((it, ii) => (
                      <tr key={ii} style={{ cursor: 'pointer' }} onClick={() => navigate('/buku-besar')}>
                        <td className="mono" style={{ paddingLeft: 16, color: 'var(--fg-tertiary)', fontSize: 11.5, width: 80 }}>{it.kode}</td>
                        <td><span style={{ borderBottom: '1px dotted var(--border-strong)' }}>{it.nama}</span></td>
                        <td className="num col-num" style={{ width: 140 }}>{fmtIDR(it.current, { decimals: 0, withSymbol: false })}</td>
                        {comparative && <td className="num col-num" style={{ color: 'var(--fg-tertiary)', width: 140 }}>{fmtIDR(it.prev, { decimals: 0, withSymbol: false })}</td>}
                      </tr>
                    ))}
                    <tr style={{ background: 'rgba(91,2,2,0.04)' }}>
                      <td></td>
                      <td style={{ fontWeight: 600, paddingLeft: 16 }}>Subtotal {section.section}</td>
                      <td className="num col-num" style={{ fontWeight: 700 }}>{fmtIDR(sumSection(section), { decimals: 0, withSymbol: false })}</td>
                      {comparative && <td className="num col-num" style={{ fontWeight: 600, color: 'var(--fg-secondary)' }}>{fmtIDR(sumSectionPrev(section), { decimals: 0, withSymbol: false })}</td>}
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderTotal = (label: string, value: number, prev: number, accent: string) => (
    <div style={{ padding: '14px 18px', background: accent, color: '#fff', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ textAlign: 'right' }}>
        <div className="num" style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em' }}>{fmtIDR(value, { decimals: 0 })}</div>
        {comparative && <div className="num" style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 1 }}>sebelumnya: {fmtIDR(prev, { decimals: 0 })}</div>}
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Laporan Neraca</h1>
            <p style={{ margin: '3px 0 0', fontSize: 12.5, color: 'var(--fg-tertiary)' }}>
              RS YARSI · Per 30 November 2025{comparative && ' vs 30 Oktober 2025'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', borderRadius: 6, border: '1px solid var(--border-strong)', overflow: 'hidden' }}>
              <button onClick={() => setLayout('split')} className="btn btn-sm" style={{ border: 'none', borderRadius: 0, background: layout === 'split' ? 'var(--bg-subtle)' : 'var(--bg-elevated)', fontWeight: layout === 'split' ? 600 : 400 }}>2 Kolom</button>
              <button onClick={() => setLayout('vertical')} className="btn btn-sm" style={{ border: 'none', borderRadius: 0, background: layout === 'vertical' ? 'var(--bg-subtle)' : 'var(--bg-elevated)', fontWeight: layout === 'vertical' ? 600 : 400 }}>Vertikal</button>
            </div>
            <button className="btn btn-sm"><Icon name="download" size={13}/> Excel</button>
            <button className="btn btn-sm"><Icon name="download" size={13}/> PDF</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 180px' }}>
            <label className="field-label">Per Tanggal</label>
            <input className="input input-sm" type="date" defaultValue="2025-11-30"/>
          </div>
          <div style={{ flex: '0 0 200px' }}>
            <label className="field-label">Bandingkan dengan</label>
            <select className="input input-sm select" disabled={!comparative}><option>30 Oktober 2025</option><option>30 November 2024 (YoY)</option></select>
          </div>
          <div style={{ flex: 1 }}/>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--fg-secondary)', cursor: 'pointer', height: 30 }}>
            <input type="checkbox" checked={comparative} onChange={(e) => setComparative(e.target.checked)} style={{ accentColor: 'var(--brand-maroon)' }}/>
            Comparative mode
          </label>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 6, background: balanceCheck === 0 ? 'var(--status-approved-bg)' : 'var(--status-void-bg)', color: balanceCheck === 0 ? 'var(--status-approved)' : 'var(--status-void)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5, fontWeight: 600 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name={balanceCheck === 0 ? 'check' : 'alert'} size={14}/>
            {balanceCheck === 0 ? 'Neraca seimbang: Total Aset = Kewajiban + Ekuitas' : `Tidak seimbang: selisih ${fmtIDR(balanceCheck, { decimals: 0 })}`}
          </span>
          <span className="num" style={{ fontSize: 12 }}>{fmtIDR(totalAset, { decimals: 0 })} = {fmtIDR(totalKewajiban + totalEkuitas, { decimals: 0 })}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: layout === 'split' ? '1fr 1fr' : '1fr', gap: 18 }}>
          <div>
            {renderGroup(NERACA.aset, 'Aset', 'var(--brand-maroon)')}
            {renderTotal('Total Aset', totalAset, totalAsetPrev, 'var(--brand-maroon)')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              {renderGroup(NERACA.kewajiban, 'Kewajiban', '#5a3c0a')}
              {renderTotal('Total Kewajiban', totalKewajiban, totalKewajibanPrev, '#5a3c0a')}
            </div>
            <div>
              {renderGroup(NERACA.ekuitas, 'Ekuitas', '#3a3a3a')}
              {renderTotal('Total Ekuitas', totalEkuitas, totalEkuitasPrev, '#3a3a3a')}
            </div>
            {renderTotal('Total Kewajiban + Ekuitas', totalKewajiban + totalEkuitas, totalKewajibanPrev + totalEkuitasPrev, 'var(--brand-maroon)')}
          </div>
        </div>
      </div>
    </div>
  )
}
