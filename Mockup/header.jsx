/* ===== Global Header + Command Palette ===== */

const BREADCRUMBS = {
  "dashboard": ["Dashboard"],
  "kas-masuk": ["Transaksi", "Kas Masuk"],
  "kas-keluar": ["Transaksi", "Kas Keluar"],
  "jurnal-umum": ["Transaksi", "Jurnal Umum"],
  "jurnal-baru": ["Transaksi", "Jurnal Umum", "Buat Baru"],
  "piutang": ["Transaksi", "Piutang"],
  "piutang-umum": ["Transaksi", "Piutang", "Pasien Umum"],
  "piutang-bpjs": ["Transaksi", "Piutang", "BPJS"],
  "piutang-asuransi": ["Transaksi", "Piutang", "Asuransi"],
  "utang": ["Transaksi", "Utang"],
  "buku-besar": ["Buku Besar"],
  "trial-balance": ["Trial Balance"],
  "laba-rugi": ["Laporan", "Laba Rugi"],
  "neraca": ["Laporan", "Neraca"],
  "arus-kas": ["Laporan", "Arus Kas"],
  "lap-pendapatan": ["Laporan", "Pendapatan per Unit"],
  "aging-ar": ["Laporan", "Aging Piutang"],
  "aging-ap": ["Laporan", "Aging Utang"],
  "coa": ["Master Data", "Chart of Accounts"],
  "cost-center": ["Master Data", "Cost Center"],
  "vendor": ["Master Data", "Vendor"],
  "customer": ["Master Data", "Customer / Pasien"],
  "payer": ["Master Data", "Payer"],
  "periode": ["Pengaturan", "Periode Akuntansi"],
  "user-role": ["Pengaturan", "User & Role"],
  "approval": ["Pengaturan", "Approval Workflow"],
  "integrasi": ["Pengaturan", "Integrasi SIMRS"],
};

const Header = ({ user, page, onNav, onOpenCmd, dark, onToggleDark, onLogout, onOpenMobileNav }) => {
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [userOpen, setUserOpen] = React.useState(false);
  const crumbs = BREADCRUMBS[page] || ["Dashboard"];

  return (
    <header style={{
      height: "var(--header-h)",
      borderBottom: "1px solid var(--border)",
      background: "var(--bg-elevated)",
      display: "flex", alignItems: "center",
      padding: "0 16px",
      gap: 12,
      position: "sticky", top: 0, zIndex: 30,
      flexShrink: 0,
    }}>
      {/* Mobile menu trigger */}
      <button className="btn btn-ghost btn-icon mobile-menu-trigger" onClick={onOpenMobileNav} style={{ marginLeft: -6 }}>
        <Icon name="menu" size={16}/>
      </button>

      {/* Breadcrumbs (desktop) */}
      <div className="header-breadcrumbs" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--fg-tertiary)", minWidth: 0 }}>
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <Icon name="chevron-right" size={11} style={{ color: "var(--fg-quaternary)", flexShrink: 0 }}/>}
            <span style={{ color: i === crumbs.length - 1 ? "var(--fg)" : "var(--fg-tertiary)", fontWeight: i === crumbs.length - 1 ? 600 : 400, whiteSpace: "nowrap" }}>
              {c}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Mobile page title */}
      <div className="mobile-page-title" style={{ flex: 1, fontSize: 14, fontWeight: 600, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "none" }}>
        {crumbs[crumbs.length - 1]}
      </div>
      <style>{`@media (max-width: 1024px) { .mobile-page-title { display: block !important; } }`}</style>

      <div style={{ flex: 1 }} className="header-spacer"/>

      {/* Period */}
      <div className="header-period" style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        height: 28, padding: "0 10px",
        border: "1px solid var(--border)",
        borderRadius: 6,
        fontSize: 12,
        background: "var(--bg-subtle)",
        flexShrink: 0,
      }}>
        <Icon name="calendar" size={12} style={{ color: "var(--fg-tertiary)" }}/>
        <span style={{ color: "var(--fg-tertiary)" }}>Periode:</span>
        <span style={{ fontWeight: 600 }}>Nov 2025</span>
        <span className="badge badge-open" style={{ height: 16, fontSize: 9.5, padding: "0 6px", marginLeft: 2 }}>Open</span>
      </div>

      {/* Command palette trigger */}
      <button onClick={onOpenCmd} className="header-cmd" style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        height: 28, padding: "0 8px 0 10px",
        border: "1px solid var(--border)",
        borderRadius: 6,
        background: "var(--bg-subtle)",
        color: "var(--fg-tertiary)",
        fontSize: 12,
        cursor: "pointer",
        minWidth: 240,
        flexShrink: 0,
      }}>
        <Icon name="search" size={13} className="cmd-icon"/>
        <span>Cari atau jalankan perintah…</span>
        <span style={{ marginLeft: "auto", display: "inline-flex", gap: 2 }}>
          <Kbd>⌘</Kbd><Kbd>K</Kbd>
        </span>
      </button>

      {/* Dark mode */}
      <button className="btn btn-ghost btn-icon header-dark" onClick={onToggleDark} title="Toggle dark mode">
        <Icon name={dark ? "sun" : "moon"} size={15}/>
      </button>

      {/* Notif */}
      <div className="header-notif" style={{ position: "relative" }}>
        <button className="btn btn-ghost btn-icon" onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}>
          <Icon name="bell" size={15}/>
          <span style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, borderRadius: "50%", background: "var(--brand-gold)", border: "1.5px solid var(--bg-elevated)" }}/>
        </button>
        {notifOpen && <NotifDropdown onClose={() => setNotifOpen(false)} onNav={onNav}/>}
      </div>

      <div className="vdivider" style={{ height: 24, alignSelf: "center" }}/>

      {/* User */}
      <div style={{ position: "relative" }}>
        <button onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }} style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "transparent", border: "none", padding: "4px 6px", borderRadius: 6, cursor: "pointer",
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--brand-maroon), var(--brand-maroon-700))",
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700,
            flexShrink: 0,
          }}>
            {user.name.split(" ").slice(0, 2).map(n => n[0]).join("")}
          </div>
          <div className="header-user-meta" style={{ textAlign: "left", lineHeight: 1.15 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{user.name.length > 22 ? user.name.slice(0, 22) + "…" : user.name}</div>
            <div style={{ fontSize: 10.5, color: "var(--fg-tertiary)" }}>{user.role}</div>
          </div>
          <Icon name="chevron-down" size={11} style={{ color: "var(--fg-quaternary)" }} className="header-user-chev"/>
        </button>
        {userOpen && <UserDropdown user={user} onClose={() => setUserOpen(false)} onLogout={onLogout}/>}
      </div>
    </header>
  );
};

const NotifDropdown = ({ onClose, onNav }) => {
  React.useEffect(() => {
    const h = (e) => { if (!e.target.closest("[data-notif-popover]")) onClose(); };
    setTimeout(() => document.addEventListener("click", h), 0);
    return () => document.removeEventListener("click", h);
  }, []);
  const items = [
    { kind: "approval", icon: "check", title: "4 jurnal menunggu approval", sub: "Total Rp 491.3 Jt — paling lama 2 hari", time: "baru saja", target: "jurnal-umum" },
    { kind: "due", icon: "clock", title: "5 piutang jatuh tempo minggu ini", sub: "Rp 548.0 Jt termasuk BPJS batch Okt W3", time: "2 jam lalu", target: "piutang" },
    { kind: "warn", icon: "alert", title: "Selisih kas kecil IGD Rp 280.000", sub: "Perlu rekonsiliasi sebelum closing", time: "kemarin", target: "kas-masuk" },
    { kind: "info", icon: "info", title: "Closing periode Oktober 2025 selesai", sub: "Dilakukan oleh mgr.bambang", time: "12 Nov", target: "periode" },
  ];
  return (
    <div data-notif-popover className="card anim-fadein" style={{
      position: "absolute", top: 38, right: 0, width: 360, zIndex: 50,
      boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
    }}>
      <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Notifikasi</div>
        <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 11, color: "var(--brand-maroon)", textDecoration: "none" }}>Tandai semua dibaca</a>
      </div>
      <div style={{ maxHeight: 320, overflowY: "auto" }}>
        {items.map((it, i) => (
          <div key={i} onClick={() => { onNav(it.target); onClose(); }} style={{
            display: "flex", gap: 10, padding: "10px 14px",
            borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none",
            cursor: "pointer",
          }} onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-hover)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
            <div style={{
              width: 28, height: 28, borderRadius: 6, flexShrink: 0,
              background: it.kind === "warn" ? "var(--status-pending-bg)" : it.kind === "approval" ? "var(--status-posted-bg)" : "var(--bg-subtle)",
              color: it.kind === "warn" ? "var(--status-pending)" : it.kind === "approval" ? "var(--status-posted)" : "var(--fg-tertiary)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name={it.icon} size={14}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 2 }}>{it.title}</div>
              <div style={{ fontSize: 11.5, color: "var(--fg-tertiary)" }}>{it.sub}</div>
              <div style={{ fontSize: 10.5, color: "var(--fg-quaternary)", marginTop: 3 }}>{it.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserDropdown = ({ user, onClose, onLogout }) => {
  React.useEffect(() => {
    const h = (e) => { if (!e.target.closest("[data-user-popover]")) onClose(); };
    setTimeout(() => document.addEventListener("click", h), 0);
    return () => document.removeEventListener("click", h);
  }, []);
  return (
    <div data-user-popover className="card anim-fadein" style={{
      position: "absolute", top: 42, right: 0, width: 240, zIndex: 50,
      boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
    }}>
      <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
        <div style={{ fontSize: 11.5, color: "var(--fg-tertiary)", marginTop: 2 }}>{user.username} · {user.role}</div>
      </div>
      <div style={{ padding: 4 }}>
        {[
          { icon: "user", label: "Profil saya" },
          { icon: "settings", label: "Preferensi" },
          { icon: "book", label: "Dokumentasi" },
        ].map((it, i) => (
          <div key={i} className="nav-item" style={{ margin: "1px 0", height: 30 }}>
            <Icon name={it.icon} size={14} className="nav-icon"/>
            <span style={{ fontSize: 12.5 }}>{it.label}</span>
          </div>
        ))}
        <div className="divider" style={{ margin: "4px 0" }}/>
        <div className="nav-item" onClick={onLogout} style={{ color: "var(--negative)", height: 30 }}>
          <Icon name="logout" size={14}/>
          <span style={{ fontSize: 12.5 }}>Keluar</span>
        </div>
      </div>
    </div>
  );
};

/* ===== Command Palette ===== */
const COMMANDS = [
  { kind: "nav", id: "dashboard", label: "Buka Dashboard", icon: "home", group: "Navigasi" },
  { kind: "nav", id: "jurnal-umum", label: "Buka Jurnal Umum", icon: "inbox", group: "Navigasi" },
  { kind: "nav", id: "buku-besar", label: "Buka Buku Besar", icon: "book", group: "Navigasi" },
  { kind: "nav", id: "trial-balance", label: "Buka Trial Balance", icon: "scale", group: "Navigasi" },
  { kind: "nav", id: "laba-rugi", label: "Buka Laporan Laba Rugi", icon: "chart", group: "Navigasi" },
  { kind: "nav", id: "piutang-bpjs", label: "Buka Piutang BPJS", icon: "users", group: "Navigasi" },
  { kind: "nav", id: "coa", label: "Buka Chart of Accounts", icon: "database", group: "Navigasi" },
  { kind: "action", id: "new-journal", label: "Buat Jurnal Baru", icon: "plus", shortcut: "N", group: "Aksi Cepat" },
  { kind: "action", id: "new-kas-masuk", label: "Input Kas Masuk", icon: "arrow-down-circle", group: "Aksi Cepat" },
  { kind: "action", id: "new-kas-keluar", label: "Input Kas Keluar", icon: "arrow-up-circle", group: "Aksi Cepat" },
  { kind: "action", id: "post-batch", label: "Posting Batch Jurnal Draft", icon: "send", group: "Aksi Cepat" },
  { kind: "action", id: "toggle-dark", label: "Toggle Dark Mode", icon: "moon", shortcut: "⇧⌘D", group: "Pengaturan" },
  { kind: "doc", id: "JV-2025-11-0240", label: "JV-2025-11-0240 — Klaim BPJS batch Nov W4", icon: "inbox", group: "Dokumen" },
  { kind: "doc", id: "JV-2025-11-0239", label: "JV-2025-11-0239 — Pembelian obat Kimia Farma", icon: "inbox", group: "Dokumen" },
  { kind: "akun", id: "1202", label: "1202 — Piutang BPJS Kesehatan", icon: "database", group: "Akun" },
  { kind: "akun", id: "4101", label: "4101 — Pendapatan Rawat Inap", icon: "database", group: "Akun" },
  { kind: "akun", id: "5101", label: "5101 — Beban Gaji & Tunjangan", icon: "database", group: "Akun" },
];

const CommandPalette = ({ open, onClose, onNav, onAction }) => {
  const [q, setQ] = React.useState("");
  const [idx, setIdx] = React.useState(0);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      setQ(""); setIdx(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const filtered = React.useMemo(() => {
    const term = q.toLowerCase().trim();
    if (!term) return COMMANDS;
    return COMMANDS.filter(c => c.label.toLowerCase().includes(term));
  }, [q]);

  const grouped = React.useMemo(() => {
    const g = {};
    filtered.forEach(c => { (g[c.group] = g[c.group] || []).push(c); });
    return g;
  }, [filtered]);

  const flat = filtered;

  const handleKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx(i => Math.min(i + 1, flat.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setIdx(i => Math.max(i - 1, 0)); }
    if (e.key === "Enter") { e.preventDefault(); pick(flat[idx]); }
    if (e.key === "Escape") onClose();
  };

  const pick = (cmd) => {
    if (!cmd) return;
    if (cmd.kind === "nav") onNav(cmd.id);
    else if (cmd.kind === "action") onAction(cmd.id);
    else if (cmd.kind === "doc") onNav("jurnal-umum");
    else if (cmd.kind === "akun") onNav("buku-besar");
    onClose();
  };

  if (!open) return null;

  let runningIdx = -1;
  return (
    <div onClick={onClose} className="anim-fadein" style={{
      position: "fixed", inset: 0, background: "rgba(10,12,16,0.4)",
      backdropFilter: "blur(2px)", zIndex: 100,
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      paddingTop: "8vh",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 580, maxWidth: "90vw",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-strong)",
        borderRadius: 10,
        boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
        overflow: "hidden",
      }}>
        <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="search" size={14} style={{ color: "var(--fg-tertiary)" }}/>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => { setQ(e.target.value); setIdx(0); }}
            onKeyDown={handleKey}
            placeholder="Cari menu, jurnal, akun, atau aksi…"
            style={{
              flex: 1, border: "none", background: "transparent", outline: "none",
              fontSize: 14, color: "var(--fg)",
            }}
          />
          <Kbd>esc</Kbd>
        </div>
        <div style={{ maxHeight: 380, overflowY: "auto", padding: "6px 0" }}>
          {flat.length === 0 && (
            <div style={{ padding: 24, textAlign: "center", color: "var(--fg-tertiary)", fontSize: 13 }}>
              Tidak ada hasil untuk "<strong>{q}</strong>"
            </div>
          )}
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <div style={{ padding: "6px 14px 4px", fontSize: 10.5, color: "var(--fg-quaternary)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
                {group}
              </div>
              {items.map(cmd => {
                runningIdx++;
                const active = runningIdx === idx;
                return (
                  <div
                    key={cmd.kind + cmd.id + cmd.label}
                    onMouseEnter={() => setIdx(runningIdx)}
                    onClick={() => pick(cmd)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "7px 14px",
                      background: active ? "var(--bg-hover)" : "transparent",
                      color: active ? "var(--fg)" : "var(--fg-secondary)",
                      cursor: "pointer", fontSize: 13,
                      borderLeft: active ? "2px solid var(--brand-maroon)" : "2px solid transparent",
                    }}
                  >
                    <Icon name={cmd.icon} size={14} style={{ color: "var(--fg-tertiary)" }}/>
                    <span style={{ flex: 1 }}>{cmd.label}</span>
                    {cmd.shortcut && <Kbd>{cmd.shortcut}</Kbd>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{
          padding: "8px 14px", borderTop: "1px solid var(--border)",
          background: "var(--bg-subtle)", fontSize: 11, color: "var(--fg-tertiary)",
          display: "flex", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", gap: 12 }}>
            <span><Kbd>↑↓</Kbd> navigasi</span>
            <span><Kbd>↵</Kbd> pilih</span>
            <span><Kbd>esc</Kbd> tutup</span>
          </div>
          <span>{flat.length} hasil</span>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Header, CommandPalette });
