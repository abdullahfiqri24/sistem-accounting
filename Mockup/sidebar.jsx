/* ===== Sidebar nav ===== */

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { kind: "group", label: "Transaksi" },
  { id: "transaksi", label: "Transaksi", icon: "inbox", children: [
    { id: "kas-masuk", label: "Kas Masuk" },
    { id: "kas-keluar", label: "Kas Keluar" },
    { id: "jurnal-umum", label: "Jurnal Umum" },
    { id: "piutang", label: "Piutang (AR)", children: [
      { id: "piutang-umum", label: "Pasien Umum" },
      { id: "piutang-bpjs", label: "BPJS" },
      { id: "piutang-asuransi", label: "Asuransi Swasta" },
    ]},
    { id: "utang", label: "Utang (AP)" },
  ]},
  { kind: "group", label: "Pembukuan" },
  { id: "buku-besar", label: "Buku Besar", icon: "book" },
  { id: "trial-balance", label: "Trial Balance", icon: "scale" },
  { kind: "group", label: "Laporan" },
  { id: "laporan", label: "Laporan", icon: "chart", children: [
    { id: "laba-rugi", label: "Laba Rugi" },
    { id: "neraca", label: "Neraca" },
    { id: "arus-kas", label: "Arus Kas" },
    { id: "lap-pendapatan", label: "Pendapatan per Unit" },
    { id: "aging-ar", label: "Aging Piutang" },
    { id: "aging-ap", label: "Aging Utang" },
  ]},
  { kind: "group", label: "Master Data" },
  { id: "master", label: "Master Data", icon: "database", children: [
    { id: "coa", label: "Chart of Accounts" },
    { id: "cost-center", label: "Cost Center" },
    { id: "vendor", label: "Vendor" },
    { id: "customer", label: "Customer / Pasien" },
    { id: "payer", label: "Payer (BPJS/Asuransi)" },
  ]},
  { kind: "group", label: "Pengaturan" },
  { id: "pengaturan", label: "Pengaturan", icon: "settings", children: [
    { id: "periode", label: "Periode Akuntansi" },
    { id: "user-role", label: "User & Role" },
    { id: "approval", label: "Approval Workflow" },
    { id: "integrasi", label: "Integrasi SIMRS" },
  ]},
];

const Sidebar = ({ page, onNav, collapsed, onToggle, mobileOpen, onMobileClose }) => {
  const [expanded, setExpanded] = React.useState({
    "transaksi": true,
    "laporan": false,
    "master": false,
    "piutang": false,
    "pengaturan": false,
  });

  const isActive = (id) => page === id;
  const isParentActive = (item) => {
    if (!item.children) return false;
    return item.children.some(c => c.id === page || isParentActive(c));
  };

  const NavItem = ({ item, depth = 0 }) => {
    const hasChildren = item.children && item.children.length > 0;
    const open = expanded[item.id];
    const active = isActive(item.id) || (hasChildren && isParentActive(item));
    return (
      <>
        <div
          className={`nav-item ${active && !hasChildren ? "active" : ""}`}
          style={{ paddingLeft: 10 + depth * 16 }}
          onClick={() => {
            if (hasChildren) setExpanded((e) => ({ ...e, [item.id]: !e[item.id] }));
            else { onNav(item.id); onMobileClose && onMobileClose(); }
          }}
          title={collapsed ? item.label : undefined}
        >
          {item.icon && <Icon name={item.icon} size={15} className="nav-icon"/>}
          {!collapsed && (
            <>
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</span>
              {hasChildren && <Icon name="chevron-right" size={12} className={`chev ${open ? "open" : ""}`} style={{ color: "var(--fg-quaternary)" }}/>}
              {item.badge && (
                <span className="num" style={{
                  background: "var(--brand-maroon)", color: "#fff",
                  fontSize: 10, padding: "1px 6px", borderRadius: 999, fontWeight: 600,
                }}>{item.badge}</span>
              )}
            </>
          )}
        </div>
        {hasChildren && open && !collapsed && item.children.map((c) => (
          <NavItem key={c.id} item={c} depth={depth + 1}/>
        ))}
      </>
    );
  };

  return (
    <>
      {mobileOpen && <div className="mobile-sidebar-overlay" onClick={onMobileClose}/>}
      <aside className={`app-sidebar ${mobileOpen ? "open" : ""}`} style={{
        width: collapsed ? "var(--sidebar-w-collapsed)" : "var(--sidebar-w)",
        transition: "width 180ms ease",
        borderRight: "1px solid var(--border)",
        background: "var(--bg-elevated)",
        display: "flex", flexDirection: "column",
        height: "100vh",
        position: "sticky", top: 0,
        flexShrink: 0,
        zIndex: 5,
      }}>
      {/* Brand */}
      <div style={{
        height: "var(--header-h)",
        borderBottom: "1px solid var(--border)",
        padding: collapsed ? "0" : "0 14px",
        display: "flex", alignItems: "center", gap: 10,
        justifyContent: collapsed ? "center" : "flex-start",
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: "var(--brand-maroon)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24"><path d="M9.5 4h5v4H18v5h-3.5V18h-5v-5H6v-5h3.5z" fill="var(--brand-gold)"/></svg>
        </div>
        {!collapsed && (
          <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "-0.01em" }}>RS YARSI</div>
            <div style={{ fontSize: 10, color: "var(--fg-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Akuntansi Keuangan</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: "auto", padding: "6px 0" }}>
        {NAV.map((item, i) => {
          if (item.kind === "group") {
            if (collapsed) return <div key={`g${i}`} className="divider" style={{ margin: "8px 12px" }}/>;
            return <div key={`g${i}`} className="nav-group-label">{item.label}</div>;
          }
          return <NavItem key={item.id} item={item}/>;
        })}
      </div>

      {/* Collapse button */}
      <div style={{ borderTop: "1px solid var(--border)", padding: 6 }}>
        <div className="nav-item" onClick={onToggle} style={{ justifyContent: collapsed ? "center" : "flex-start" }}>
          <Icon name={collapsed ? "chevron-right" : "menu"} size={14} className="nav-icon"/>
          {!collapsed && <span>Collapse</span>}
        </div>
      </div>
    </aside>
    </>
  );
};

window.Sidebar = Sidebar;
window.NAV = NAV;
