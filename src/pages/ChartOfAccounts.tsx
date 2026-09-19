import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { useToast } from '@/components/ui/Toast'
import { COA_TREE } from '@/lib/data'
import { fmtIDR } from '@/lib/utils'
import type { Account } from '@/types'

const TIPE_COLOR: Record<string, string> = {
  Aset: 'var(--status-posted)', Kewajiban: '#5a3c0a', Ekuitas: '#3a3a3a', Pendapatan: 'var(--status-approved)', Beban: 'var(--brand-maroon)',
}
const TIPE_BG: Record<string, string> = {
  Aset: 'var(--status-posted-bg)', Kewajiban: 'var(--status-pending-bg)', Ekuitas: 'var(--bg-subtle)', Pendapatan: 'var(--status-approved-bg)', Beban: 'var(--status-void-bg)',
}

function countAccounts(nodes: Account[]): number {
  return nodes.reduce((s, n) => s + (n.children ? countAccounts(n.children) : 1), 0)
}

export default function ChartOfAccounts() {
  const { push } = useToast()
  const [expanded, setExpanded] = useState(new Set(['1', '11', '120', '111', '2', '4', '5']))
  const [q, setQ] = useState('')

  const toggle = (kode: string) => {
    const n = new Set(expanded)
    if (n.has(kode)) n.delete(kode); else n.add(kode)
    setExpanded(n)
  }

  const matches = (node: Account): boolean => {
    if (!q) return true
    const term = q.toLowerCase()
    if (node.kode.includes(term) || node.nama.toLowerCase().includes(term)) return true
    if (node.children) return node.children.some(matches)
    return false
  }

  const renderNode = (node: Account, depth = 0): React.ReactNode[] => {
    if (!matches(node)) return []
    const hasChildren = (node.children?.length ?? 0) > 0
    const open = expanded.has(node.kode) || !!q

    const row = (
      <tr key={node.kode} style={{ background: depth === 0 ? 'var(--bg-subtle)' : undefined, fontWeight: hasChildren ? 600 : 400 }}>
        <td style={{ paddingLeft: 24 + depth * 20 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {hasChildren ? (
              <button onClick={() => toggle(node.kode)} className="btn btn-ghost btn-icon" style={{ width: 18, height: 18, padding: 0, border: 'none' }}>
                <Icon name="chevron-right" size={11} className={`chev ${open ? 'open' : ''}`} style={{ color: 'var(--fg-tertiary)' }}/>
              </button>
            ) : <span style={{ width: 18 }}/>}
            <span className="mono" style={{ fontSize: depth === 0 ? 12.5 : 12, fontWeight: depth === 0 ? 700 : 500 }}>{node.kode}</span>
          </span>
        </td>
        <td>
          <span style={{ fontSize: depth === 0 ? 13.5 : 12.5, fontWeight: depth === 0 ? 700 : (hasChildren ? 600 : 400), textTransform: depth === 0 ? 'uppercase' : 'none', letterSpacing: depth === 0 ? '0.04em' : 0 }}>
            {node.nama}
          </span>
        </td>
        <td>
          {depth > 0 && node.tipe && (
            <span className="badge" style={{ background: TIPE_BG[node.tipe] || 'var(--bg-subtle)', color: TIPE_COLOR[node.tipe] || 'var(--fg)', fontSize: 10 }}>
              {node.tipe}
            </span>
          )}
        </td>
        <td style={{ textAlign: 'center' }}>
          {depth > 0 && node.saldoNormal && (
            <span className="mono" style={{ fontSize: 11, color: 'var(--fg-tertiary)' }}>{node.saldoNormal === 'D' ? 'Debit' : 'Kredit'}</span>
          )}
        </td>
        <td className="num col-num" style={{ fontWeight: hasChildren ? 700 : 500 }}>
          {node.saldo !== undefined ? fmtIDR(node.saldo, { decimals: 0, withSymbol: false }) : <span style={{ color: 'var(--fg-quaternary)' }}>—</span>}
        </td>
        <td>
          {node.aktif !== false && depth > 0 && <span className="dot" style={{ background: 'var(--positive)' }}></span>}
        </td>
        <td style={{ paddingRight: 24 }}>
          <button className="btn btn-ghost btn-icon btn-sm"><Icon name="more" size={12}/></button>
        </td>
      </tr>
    )

    const childRows = hasChildren && open ? node.children!.flatMap((c) => renderNode(c, depth + 1)) : []
    return [row, ...childRows]
  }

  const total = countAccounts(COA_TREE)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Chart of Accounts</h1>
            <p style={{ margin: '3px 0 0', fontSize: 12.5, color: 'var(--fg-tertiary)' }}>{total} akun detail · 5 kategori utama · standar PSAK</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-sm" onClick={() => setExpanded(new Set())}>Collapse All</button>
            <button className="btn btn-sm" onClick={() => {
              const all = new Set<string>()
              const walk = (nodes: Account[]) => nodes.forEach((n) => { all.add(n.kode); if (n.children) walk(n.children) })
              walk(COA_TREE)
              setExpanded(all)
            }}>Expand All</button>
            <button className="btn btn-sm"><Icon name="download" size={13}/> Export</button>
            <button className="btn btn-primary btn-sm" onClick={() => push('Modal akun baru akan dibuka', 'info')}>
              <Icon name="plus" size={13}/> Akun Baru
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 320px', position: 'relative' }}>
            <label className="field-label">Cari</label>
            <div style={{ position: 'relative' }}>
              <Icon name="search" size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-quaternary)' }}/>
              <input className="input input-sm" style={{ paddingLeft: 30 }} placeholder="Kode atau nama akun…" value={q} onChange={(e) => setQ(e.target.value)}/>
            </div>
          </div>
          <div style={{ flex: '0 0 160px' }}>
            <label className="field-label">Tipe</label>
            <select className="input input-sm select">
              <option>Semua tipe</option><option>Aset</option><option>Kewajiban</option><option>Ekuitas</option><option>Pendapatan</option><option>Beban</option>
            </select>
          </div>
          <div style={{ flex: '0 0 140px' }}>
            <label className="field-label">Status</label>
            <select className="input input-sm select"><option>Aktif saja</option><option>Semua</option><option>Non-aktif</option></select>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ paddingLeft: 24, width: 180 }}>Kode</th>
              <th>Nama Akun</th>
              <th style={{ width: 110 }}>Tipe</th>
              <th style={{ width: 100, textAlign: 'center' }}>Saldo Normal</th>
              <th className="col-num" style={{ width: 160 }}>Saldo</th>
              <th style={{ width: 60 }}>Status</th>
              <th style={{ width: 60, paddingRight: 24 }}></th>
            </tr>
          </thead>
          <tbody>
            {COA_TREE.flatMap((n) => renderNode(n))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
