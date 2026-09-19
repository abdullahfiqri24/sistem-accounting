import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'

interface NavNode {
  id: string
  label: string
  icon?: string
  badge?: number
  children?: NavNode[]
}
interface NavGroup { kind: 'group'; label: string }
type NavItem = NavNode | NavGroup

const NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home' },
  { kind: 'group', label: 'Transaksi' },
  { id: 'transaksi', label: 'Transaksi', icon: 'inbox', children: [
    { id: 'kas-masuk', label: 'Kas Masuk' },
    { id: 'kas-keluar', label: 'Kas Keluar' },
    { id: 'jurnal-umum', label: 'Jurnal Umum' },
    { id: 'piutang', label: 'Piutang (AR)', children: [
      { id: 'piutang-umum', label: 'Pasien Umum' },
      { id: 'piutang-bpjs', label: 'BPJS' },
      { id: 'piutang-asuransi', label: 'Asuransi Swasta' },
    ]},
    { id: 'utang', label: 'Utang (AP)' },
  ]},
  { kind: 'group', label: 'Pembukuan' },
  { id: 'buku-besar', label: 'Buku Besar', icon: 'book' },
  { id: 'trial-balance', label: 'Trial Balance', icon: 'scale' },
  { kind: 'group', label: 'Laporan' },
  { id: 'laporan', label: 'Laporan', icon: 'chart', children: [
    { id: 'laba-rugi', label: 'Laba Rugi' },
    { id: 'neraca', label: 'Neraca' },
    { id: 'arus-kas', label: 'Arus Kas' },
    { id: 'lap-pendapatan', label: 'Pendapatan per Unit' },
    { id: 'aging-ar', label: 'Aging Piutang' },
    { id: 'aging-ap', label: 'Aging Utang' },
  ]},
  { kind: 'group', label: 'Master Data' },
  { id: 'master', label: 'Master Data', icon: 'database', children: [
    { id: 'coa', label: 'Chart of Accounts' },
    { id: 'cost-center', label: 'Cost Center' },
    { id: 'vendor', label: 'Vendor' },
    { id: 'customer', label: 'Customer / Pasien' },
    { id: 'payer', label: 'Payer (BPJS/Asuransi)' },
  ]},
  { kind: 'group', label: 'Pengaturan' },
  { id: 'pengaturan', label: 'Pengaturan', icon: 'settings', children: [
    { id: 'periode', label: 'Periode Akuntansi' },
    { id: 'user-role', label: 'User & Role' },
    { id: 'approval', label: 'Approval Workflow' },
    { id: 'integrasi', label: 'Integrasi SIMRS' },
  ]},
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

interface FlyoutState {
  item: NavNode
  top: number
  left: number
}

function isNavNode(item: NavItem): item is NavNode {
  return !('kind' in item)
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPage = location.pathname.replace('/', '') || 'dashboard'

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    transaksi: true, laporan: false, master: false, piutang: false, pengaturan: false,
  })
  const [flyout, setFlyout] = useState<FlyoutState | null>(null)
  const flyoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isActive = (id: string) => currentPage === id
  const isParentActive = (item: NavNode): boolean => {
    if (!item.children) return false
    return item.children.some((c) => c.id === currentPage || isParentActive(c))
  }

  const openFlyout = (item: NavNode, e: React.MouseEvent<HTMLDivElement>) => {
    if (flyoutTimer.current) clearTimeout(flyoutTimer.current)
    const rect = e.currentTarget.getBoundingClientRect()
    setFlyout({ item, top: rect.top, left: rect.right })
  }

  const scheduleFlyoutClose = () => {
    flyoutTimer.current = setTimeout(() => setFlyout(null), 180)
  }

  const cancelFlyoutClose = () => {
    if (flyoutTimer.current) clearTimeout(flyoutTimer.current)
  }

  function NavItemEl({ item, depth = 0 }: { item: NavNode; depth?: number }) {
    const hasChildren = (item.children?.length ?? 0) > 0
    const open = expanded[item.id]
    const active = isActive(item.id) || (hasChildren && isParentActive(item))

    return (
      <>
        <div
          className={`nav-item ${active && !hasChildren ? 'active' : ''} ${active && hasChildren && !collapsed ? 'parent-active' : ''}`}
          style={{ paddingLeft: 10 + depth * 16 }}
          onClick={() => {
            if (hasChildren) {
              if (collapsed) {
                // In collapsed mode: toggle flyout on click (for touch devices)
                if (flyout?.item.id === item.id) {
                  setFlyout(null)
                } else {
                  const el = document.querySelector(`[data-nav-id="${item.id}"]`) as HTMLElement
                  if (el) {
                    const rect = el.getBoundingClientRect()
                    setFlyout({ item, top: rect.top, left: rect.right })
                  }
                }
              } else {
                setExpanded((e) => ({ ...e, [item.id]: !e[item.id] }))
              }
            } else {
              navigate(`/${item.id}`)
              setFlyout(null)
              onMobileClose()
            }
          }}
          onMouseEnter={(e) => {
            if (collapsed && hasChildren) openFlyout(item, e)
          }}
          onMouseLeave={() => {
            if (collapsed && hasChildren) scheduleFlyoutClose()
          }}
          data-nav-id={item.id}
          title={collapsed ? item.label : undefined}
        >
          {item.icon && <Icon name={item.icon} size={15} style={{ color: active ? 'var(--brand-maroon)' : 'var(--fg-tertiary)', flexShrink: 0, width: 16, height: 16 }}/>}
          {!collapsed && (
            <>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
              {hasChildren && <Icon name="chevron-right" size={12} className={`chev ${open ? 'open' : ''}`} style={{ color: 'var(--fg-quaternary)' }}/>}
              {item.badge && (
                <span className="num" style={{ background: 'var(--brand-maroon)', color: '#fff', fontSize: 10, padding: '1px 6px', borderRadius: 999, fontWeight: 600 }}>
                  {item.badge}
                </span>
              )}
            </>
          )}
        </div>
        {hasChildren && open && !collapsed && item.children!.map((c) => (
          <NavItemEl key={c.id} item={c} depth={depth + 1}/>
        ))}
      </>
    )
  }

  // Render children items inside the flyout panel
  function FlyoutItem({ item }: { item: NavNode }) {
    const hasChildren = (item.children?.length ?? 0) > 0
    const active = isActive(item.id) || (hasChildren && isParentActive(item))

    if (hasChildren) {
      return (
        <>
          <div style={{ padding: '8px 14px 3px', fontSize: 10.5, fontWeight: 700, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {item.label}
          </div>
          {item.children!.map(c => (
            <FlyoutItem key={c.id} item={c}/>
          ))}
        </>
      )
    }

    return (
      <div
        className={`nav-item ${active ? 'active' : ''}`}
        style={{ paddingLeft: 14, fontSize: 13 }}
        onClick={() => {
          navigate(`/${item.id}`)
          setFlyout(null)
          onMobileClose()
        }}
      >
        {item.label}
      </div>
    )
  }

  return (
    <>
      {mobileOpen && (
        <div
          className="mobile-sidebar-overlay anim-fadein"
          onClick={onMobileClose}
          style={{ display: 'block', position: 'fixed', top: 0, right: 0, bottom: 0, left: 260, background: 'rgba(10,12,16,0.45)', zIndex: 55 }}
        />
      )}
      <aside
        className={`app-sidebar ${mobileOpen ? 'open' : ''}`}
        style={{
          width: collapsed ? 'var(--sidebar-w-collapsed)' : 'var(--sidebar-w)',
          transition: 'width 180ms ease',
          borderRight: '1px solid var(--border)',
          background: 'var(--bg-elevated)',
          display: 'flex', flexDirection: 'column',
          height: '100vh',
          position: 'sticky', top: 0,
          flexShrink: 0, zIndex: 5,
        }}
      >
        {/* Brand */}
        <div style={{
          height: 'var(--header-h)', borderBottom: '1px solid var(--border)',
          padding: collapsed ? '0' : '0 14px',
          display: 'flex', alignItems: 'center', gap: 10,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: 'var(--brand-maroon)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M9.5 4h5v4H18v5h-3.5V18h-5v-5H6v-5h3.5z" fill="#daa520"/></svg>
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '-0.01em' }}>RS YARSI</div>
              <div style={{ fontSize: 10, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Akuntansi Keuangan</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
          {NAV.map((item, i) => {
            if (!isNavNode(item)) {
              if (collapsed) return <div key={`g${i}`} style={{ height: 1, background: 'var(--border)', margin: '8px 12px' }}/>
              return (
                <div key={`g${i}`} style={{ padding: '10px 16px 4px', fontSize: 10.5, fontWeight: 600, color: 'var(--fg-quaternary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {item.label}
                </div>
              )
            }
            return <NavItemEl key={item.id} item={item}/>
          })}
        </div>

        {/* Collapse toggle */}
        <div style={{ borderTop: '1px solid var(--border)', padding: 6 }}>
          <div className="nav-item" onClick={onToggle} style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <Icon name={collapsed ? 'chevron-right' : 'menu'} size={14} style={{ color: 'var(--fg-tertiary)', width: 16, height: 16 }}/>
            {!collapsed && <span>Collapse</span>}
          </div>
        </div>

        {/* Flyout popover for collapsed mode */}
        {collapsed && flyout && (
          <div
            onMouseEnter={cancelFlyoutClose}
            onMouseLeave={scheduleFlyoutClose}
            style={{
              position: 'fixed',
              left: flyout.left + 4,
              top: Math.min(flyout.top - 4, window.innerHeight - 400),
              zIndex: 200,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
              minWidth: 200,
              maxHeight: 'calc(100vh - 32px)',
              overflowY: 'auto',
              padding: '4px 0 6px',
            }}
          >
            {/* Flyout header */}
            <div style={{
              padding: '7px 14px 6px',
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.07em', color: 'var(--brand-maroon)',
              borderBottom: '1px solid var(--border)',
              marginBottom: 3,
            }}>
              {flyout.item.icon && <Icon name={flyout.item.icon} size={11} style={{ marginRight: 5, verticalAlign: 'middle', opacity: 0.7 }}/>}
              {flyout.item.label}
            </div>
            {flyout.item.children!.map(c => (
              <FlyoutItem key={c.id} item={c}/>
            ))}
          </div>
        )}
      </aside>
    </>
  )
}
