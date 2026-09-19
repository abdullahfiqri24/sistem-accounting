import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { Tabs } from '@/components/ui/Tabs'
import { useToast } from '@/components/ui/Toast'
import { PIUTANG } from '@/lib/data'
import { fmtIDR, fmtDate } from '@/lib/utils'
import type { PiutangItem } from '@/types'

function AgingPill({ days }: { days: number }) {
  const cls = days <= 30 ? 'badge-approved' : days <= 60 ? 'badge-pending' : days <= 90 ? 'badge-pending' : 'badge-void'
  return <span className={`badge num ${cls}`} style={{ fontSize: 10.5 }}>{days} hari</span>
}

function StatusBadgePiutang({ st }: { st: string }) {
  if (st === 'paid') return <span className="badge badge-approved">Lunas</span>
  if (st === 'partial') return <span className="badge badge-pending">Cicilan</span>
  return <span className="badge badge-posted">Open</span>
}

function PiutangSlideOver({ invoice, onClose, onPay }: { invoice: PiutangItem; onClose: () => void; onPay: () => void }) {
  const breakdown = invoice.episode.includes('Rawat Inap') ? [
    { item: 'Akomodasi Kamar (3 malam)', qty: 3, total: 2400000 },
    { item: 'Visite Dokter Spesialis', qty: 6, total: 1500000 },
    { item: 'Tindakan Medis & Operasi', qty: 1, total: Math.round(invoice.tagihan * 0.45) },
    { item: 'Farmasi & Alkes', qty: 1, total: Math.round(invoice.tagihan * 0.28) },
    { item: 'Laboratorium & Radiologi', qty: 1, total: Math.round(invoice.tagihan * 0.12) },
    { item: 'Lain-lain', qty: 1, total: Math.max(Math.round(invoice.tagihan - 3900000 - invoice.tagihan * 0.85), 200000) },
  ] : [
    { item: 'Konsultasi Dokter', qty: 1, total: Math.round(invoice.tagihan * 0.3) },
    { item: 'Pemeriksaan', qty: 1, total: Math.round(invoice.tagihan * 0.5) },
    { item: 'Farmasi', qty: 1, total: Math.round(invoice.tagihan * 0.2) },
  ]

  const history = invoice.bayar > 0 ? [
    { tgl: '2025-11-15', method: 'Transfer Bank Mandiri', ref: 'TRX2025111501288', amount: invoice.bayar },
  ] : []

  return (
    <>
      <div onClick={onClose} className="anim-fadein" style={{ position: 'fixed', inset: 0, background: 'rgba(10,12,16,0.32)', zIndex: 40 }}/>
      <div className="anim-slidein-right" style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 580, maxWidth: '92vw',
        background: 'var(--bg-elevated)', borderLeft: '1px solid var(--border)',
        boxShadow: '-12px 0 40px rgba(0,0,0,0.15)', zIndex: 41,
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{invoice.inv}</div>
            <div style={{ fontSize: 11.5, color: 'var(--fg-tertiary)', marginTop: 1 }}>{invoice.payer} · {fmtDate(invoice.tgl)}</div>
          </div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><Icon name="x" size={14}/></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 18 }}>
            <div style={{ padding: 12, background: 'var(--bg-subtle)', borderRadius: 6 }}>
              <div style={{ fontSize: 10.5, color: 'var(--fg-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Tagihan</div>
              <div className="num" style={{ fontSize: 15, fontWeight: 700, marginTop: 3 }}>{fmtIDR(invoice.tagihan, { decimals: 0 })}</div>
            </div>
            <div style={{ padding: 12, background: 'var(--status-approved-bg)', borderRadius: 6 }}>
              <div style={{ fontSize: 10.5, color: 'var(--status-approved)', textTransform: 'uppercase', fontWeight: 600 }}>Dibayar</div>
              <div className="num" style={{ fontSize: 15, fontWeight: 700, marginTop: 3, color: 'var(--status-approved)' }}>{fmtIDR(invoice.bayar, { decimals: 0 })}</div>
            </div>
            <div style={{ padding: 12, background: invoice.outstanding > 0 ? 'rgba(91,2,2,0.08)' : 'var(--bg-subtle)', borderRadius: 6 }}>
              <div style={{ fontSize: 10.5, color: 'var(--brand-maroon)', textTransform: 'uppercase', fontWeight: 600 }}>Outstanding</div>
              <div className="num" style={{ fontSize: 15, fontWeight: 700, marginTop: 3, color: 'var(--brand-maroon)' }}>{fmtIDR(invoice.outstanding, { decimals: 0 })}</div>
            </div>
          </div>

          <div className="field-label" style={{ marginBottom: 6 }}>Rincian Tagihan</div>
          <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', marginBottom: 18 }}>
            <table className="tbl compact" style={{ fontSize: 12 }}>
              <thead><tr><th>Item</th><th className="col-num">Qty</th><th className="col-num">Subtotal</th></tr></thead>
              <tbody>
                {breakdown.map((b, i) => (
                  <tr key={i}><td>{b.item}</td><td className="num col-num">{b.qty}</td><td className="num col-num">{fmtIDR(b.total, { decimals: 0, withSymbol: false })}</td></tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: 'var(--bg-subtle)', fontWeight: 600 }}>
                  <td colSpan={2} style={{ padding: '8px 10px', borderTop: '1px solid var(--border)' }}>Total Tagihan</td>
                  <td className="num col-num" style={{ padding: '8px 10px', borderTop: '1px solid var(--border)' }}>{fmtIDR(invoice.tagihan, { decimals: 0, withSymbol: false })}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="field-label" style={{ marginBottom: 6 }}>Riwayat Pembayaran</div>
          {history.length > 0 ? (
            <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', marginBottom: 18 }}>
              <table className="tbl compact" style={{ fontSize: 12 }}>
                <thead><tr><th>Tanggal</th><th>Metode</th><th>Referensi</th><th className="col-num">Jumlah</th></tr></thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i}>
                      <td className="num">{fmtDate(h.tgl)}</td>
                      <td>{h.method}</td>
                      <td className="mono" style={{ fontSize: 11 }}>{h.ref}</td>
                      <td className="num col-num" style={{ color: 'var(--positive)' }}>{fmtIDR(h.amount, { decimals: 0, withSymbol: false })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '16px 14px', background: 'var(--bg-subtle)', borderRadius: 6, color: 'var(--fg-tertiary)', fontSize: 12.5, textAlign: 'center', marginBottom: 18 }}>
              Belum ada pembayaran tercatat untuk invoice ini.
            </div>
          )}

          <div className="field-label" style={{ marginBottom: 6 }}>Log Reminder</div>
          <div style={{ fontSize: 12, color: 'var(--fg-tertiary)', padding: '8px 0' }}>
            {invoice.aging > 14
              ? <>📧 Reminder 1 dikirim {fmtDate('2025-11-22')} via email · 📞 Telepon follow-up {fmtDate('2025-11-25')}</>
              : 'Belum ada reminder dikirim.'}
          </div>
        </div>

        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-subtle)', display: 'flex', gap: 6, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {invoice.outstanding > 0 && (
              <>
                <button className="btn btn-sm btn-primary" onClick={onPay}><Icon name="plus" size={12}/> Record Payment</button>
                <button className="btn btn-sm"><Icon name="send" size={12}/> Reminder</button>
              </>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-sm"><Icon name="download" size={12}/> Invoice PDF</button>
            <button className="btn btn-sm" onClick={onClose}>Tutup</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default function Piutang() {
  const { push } = useToast()
  const [tab, setTab] = useState('all')
  const [agingFilter, setAgingFilter] = useState('all')
  const [detail, setDetail] = useState<PiutangItem | null>(null)

  const filtered = PIUTANG.filter((p) => {
    if (tab === 'umum' && p.payerType !== 'umum') return false
    if (tab === 'bpjs' && p.payerType !== 'bpjs') return false
    if (tab === 'asuransi' && p.payerType !== 'asuransi') return false
    if (agingFilter === '0-30' && p.aging > 30) return false
    if (agingFilter === '31-60' && (p.aging < 31 || p.aging > 60)) return false
    if (agingFilter === '61-90' && (p.aging < 61 || p.aging > 90)) return false
    if (agingFilter === '90+' && p.aging < 91) return false
    return true
  })

  const counts = {
    all: PIUTANG.length,
    umum: PIUTANG.filter((p) => p.payerType === 'umum').length,
    bpjs: PIUTANG.filter((p) => p.payerType === 'bpjs').length,
    asuransi: PIUTANG.filter((p) => p.payerType === 'asuransi').length,
  }

  const totalOutstanding = filtered.reduce((s, p) => s + p.outstanding, 0)
  const totalTagihan = filtered.reduce((s, p) => s + p.tagihan, 0)

  const buckets = {
    '0-30': filtered.filter((p) => p.aging <= 30).reduce((s, p) => s + p.outstanding, 0),
    '31-60': filtered.filter((p) => p.aging > 30 && p.aging <= 60).reduce((s, p) => s + p.outstanding, 0),
    '61-90': filtered.filter((p) => p.aging > 60 && p.aging <= 90).reduce((s, p) => s + p.outstanding, 0),
    '90+': filtered.filter((p) => p.aging > 90).reduce((s, p) => s + p.outstanding, 0),
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '14px 24px 0', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Piutang Usaha (AR)</h1>
            <p style={{ margin: '3px 0 0', fontSize: 12.5, color: 'var(--fg-tertiary)' }}>
              Outstanding: <strong className="num" style={{ color: 'var(--brand-maroon)' }}>{fmtIDR(totalOutstanding, { decimals: 0 })}</strong> · {filtered.length} invoice
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-sm"><Icon name="send" size={13}/> Kirim Reminder</button>
            <button className="btn btn-sm"><Icon name="download" size={13}/> Statement</button>
            <button className="btn btn-primary btn-sm"><Icon name="plus" size={13}/> Record Payment</button>
          </div>
        </div>
        <Tabs
          tabs={[
            { value: 'all', label: 'Semua', count: counts.all },
            { value: 'umum', label: 'Pasien Umum', count: counts.umum },
            { value: 'bpjs', label: 'BPJS', count: counts.bpjs },
            { value: 'asuransi', label: 'Asuransi Swasta', count: counts.asuransi },
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>

      {/* Aging buckets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
        {[
          { key: '0-30', label: '0 — 30 hari', color: 'var(--positive)' },
          { key: '31-60', label: '31 — 60 hari', color: 'var(--status-pending)' },
          { key: '61-90', label: '61 — 90 hari', color: '#c84a00' },
          { key: '90+', label: 'Lebih dari 90 hari', color: 'var(--negative)' },
        ].map((b, i) => {
          const active = agingFilter === b.key
          return (
            <button key={b.key}
              onClick={() => setAgingFilter(agingFilter === b.key ? 'all' : b.key)}
              style={{
                padding: '12px 20px', borderRight: i < 3 ? '1px solid var(--border)' : 'none',
                borderBottom: active ? '2px solid var(--brand-maroon)' : '2px solid transparent',
                marginBottom: -1, background: active ? 'var(--bg-hover)' : 'transparent',
                border: 'none', borderTop: 'none', borderLeft: 'none', textAlign: 'left', cursor: 'pointer',
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                <span className="dot" style={{ background: b.color }}></span>
                {b.label}
              </div>
              <div className="num" style={{ fontSize: 17, fontWeight: 700, marginTop: 4, letterSpacing: '-0.01em' }}>
                {fmtIDR(buckets[b.key as keyof typeof buckets], { decimals: 0 })}
              </div>
              <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', marginTop: 2 }}>
                {totalOutstanding > 0 ? ((buckets[b.key as keyof typeof buckets] / totalOutstanding) * 100).toFixed(1) : 0}% dari total
              </div>
            </button>
          )
        })}
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ paddingLeft: 24 }}>Invoice</th>
              <th>Tgl</th>
              <th>Payer</th>
              <th>Pasien / Episode</th>
              <th className="col-num">Tagihan</th>
              <th className="col-num">Dibayar</th>
              <th className="col-num">Outstanding</th>
              <th>Aging</th>
              <th>Status</th>
              <th style={{ width: 44 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.inv} onClick={() => setDetail(p)} style={{ cursor: 'pointer' }}>
                <td className="mono" style={{ paddingLeft: 24, fontSize: 11.5, fontWeight: 600 }}>{p.inv}</td>
                <td className="num" style={{ whiteSpace: 'nowrap', color: 'var(--fg-secondary)' }}>{fmtDate(p.tgl)}</td>
                <td>
                  <div style={{ fontSize: 12.5, fontWeight: 500 }}>{p.payer}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{p.payerType}</div>
                </td>
                <td>
                  <div style={{ fontSize: 12.5 }}>{p.pasien}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--fg-tertiary)' }}>{p.episode}</div>
                </td>
                <td className="num col-num">{fmtIDR(p.tagihan, { decimals: 0, withSymbol: false })}</td>
                <td className="num col-num" style={{ color: p.bayar > 0 ? 'var(--positive)' : 'var(--fg-quaternary)' }}>
                  {p.bayar > 0 ? fmtIDR(p.bayar, { decimals: 0, withSymbol: false }) : '—'}
                </td>
                <td className="num col-num" style={{ fontWeight: 700, color: p.outstanding > 0 ? 'var(--brand-maroon)' : 'var(--fg-quaternary)' }}>
                  {p.outstanding > 0 ? fmtIDR(p.outstanding, { decimals: 0, withSymbol: false }) : '—'}
                </td>
                <td><AgingPill days={p.aging}/></td>
                <td><StatusBadgePiutang st={p.status}/></td>
                <td onClick={(e) => e.stopPropagation()}>
                  <button className="btn btn-ghost btn-icon btn-sm"><Icon name="more" size={13}/></button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: 'var(--bg-subtle)', fontWeight: 700, borderTop: '2px solid var(--border-strong)' }}>
              <td colSpan={4} style={{ paddingLeft: 24, padding: '12px 10px 12px 24px' }}>TOTAL ({filtered.length} invoice)</td>
              <td className="num col-num" style={{ padding: '12px 10px' }}>{fmtIDR(totalTagihan, { decimals: 0, withSymbol: false })}</td>
              <td className="num col-num" style={{ padding: '12px 10px', color: 'var(--positive)' }}>{fmtIDR(filtered.reduce((s, p) => s + p.bayar, 0), { decimals: 0, withSymbol: false })}</td>
              <td className="num col-num" style={{ padding: '12px 10px', color: 'var(--brand-maroon)', fontSize: 14 }}>{fmtIDR(totalOutstanding, { decimals: 0, withSymbol: false })}</td>
              <td colSpan={3}></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {detail && (
        <PiutangSlideOver
          invoice={detail}
          onClose={() => setDetail(null)}
          onPay={() => { push(`Pembayaran dicatat untuk ${detail.inv}`, 'success'); setDetail(null) }}
        />
      )}
    </div>
  )
}
