/* ===== App shell — auth + routing + dark mode + cmd palette ===== */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "brandMaroon": "#5b0202",
  "brandGold": "#daa520",
  "denseTables": true
}/*EDITMODE-END*/;

const App = () => {
  const [user, setUser] = React.useState(null);
  const [page, setPage] = React.useState("dashboard");
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [dark, setDark] = React.useState(false);
  const [cmdOpen, setCmdOpen] = React.useState(false);
  const [tweaks, setTweaks] = useTweaks(TWEAK_DEFAULTS);

  // apply dark mode
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // apply theme colors
  React.useEffect(() => {
    document.documentElement.style.setProperty("--brand-maroon", tweaks.brandMaroon);
    document.documentElement.style.setProperty("--brand-gold", tweaks.brandGold);
  }, [tweaks.brandMaroon, tweaks.brandGold]);

  // keyboard shortcuts
  React.useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen(true);
      }
      if (e.key.toLowerCase() === "n" && !e.metaKey && !e.ctrlKey && !e.altKey
          && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        handleAction("new-journal");
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        setDark(d => !d);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleAction = (id) => {
    if (id === "new-journal") setPage("jurnal-baru");
    else if (id === "new-kas-masuk") setPage("kas-masuk-baru");
    else if (id === "new-kas-keluar") setPage("kas-keluar-baru");
    else if (id === "toggle-dark") setDark(d => !d);
  };

  const navigate = (p) => { setPage(p); setMobileNavOpen(false); };

  if (!user) return <Login onLogin={setUser}/>;

  return (
    <ToastProvider>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg)" }}>
        <Sidebar
          page={page} onNav={navigate}
          collapsed={collapsed} onToggle={() => setCollapsed(c => !c)}
          mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)}
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
          <Header
            user={user}
            page={page}
            onNav={navigate}
            onOpenCmd={() => setCmdOpen(true)}
            dark={dark}
            onToggleDark={() => setDark(d => !d)}
            onLogout={() => setUser(null)}
            onOpenMobileNav={() => setMobileNavOpen(true)}
          />
          <main style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
            <PageRouter
              page={page}
              user={user}
              onNav={navigate}
              onAction={handleAction}
            />
          </main>
        </div>

        <CommandPalette
          open={cmdOpen}
          onClose={() => setCmdOpen(false)}
          onNav={navigate}
          onAction={handleAction}
        />

        <TweaksHost tweaks={tweaks} setTweak={setTweaks}/>
      </div>
    </ToastProvider>
  );
};

const PageRouter = ({ page, user, onNav, onAction }) => {
  switch (page) {
    case "dashboard": return <Dashboard user={user} onNav={onNav} onAction={onAction}/>;
    case "jurnal-umum": return <JournalList onNav={onNav} onAction={onAction}/>;
    case "jurnal-baru": return <JournalForm onCancel={() => onNav("jurnal-umum")} onSaved={() => onNav("jurnal-umum")}/>;
    case "kas-masuk":
    case "kas-keluar":
      return <KasFormListPlaceholder mode={page} onNav={onNav} onAction={onAction}/>;
    case "kas-masuk-baru": return <KasForm mode="masuk" onCancel={() => onNav("kas-masuk")} onSaved={() => onNav("kas-masuk")}/>;
    case "kas-keluar-baru": return <KasForm mode="keluar" onCancel={() => onNav("kas-keluar")} onSaved={() => onNav("kas-keluar")}/>;
    case "buku-besar": return <BukuBesar onNav={onNav}/>;
    case "trial-balance": return <TrialBalance onNav={onNav}/>;
    case "piutang":
    case "piutang-umum":
    case "piutang-bpjs":
    case "piutang-asuransi":
      return <Piutang pageMode={page === "piutang" ? "all" : page} onNav={onNav}/>;
    case "neraca": return <Neraca onNav={onNav}/>;
    case "coa": return <ChartOfAccounts/>;
    case "laba-rugi": return <LabaRugi onNav={onNav}/>;
    default: return <PlaceholderPage page={page} onNav={onNav}/>;
  }
};

const KasFormListPlaceholder = ({ mode, onNav, onAction }) => {
  const isMasuk = mode === "kas-masuk";
  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>{isMasuk ? "Kas Masuk" : "Kas Keluar"}</h1>
          <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--fg-tertiary)" }}>
            Tabel ringkas transaksi {isMasuk ? "penerimaan" : "pengeluaran"} kas/bank · klik tombol di kanan untuk input baru
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => onAction(isMasuk ? "new-kas-masuk" : "new-kas-keluar")}>
          <Icon name="plus" size={13}/> Input {isMasuk ? "Kas Masuk" : "Kas Keluar"}
        </button>
      </div>
      <div className="card" style={{ padding: 40, textAlign: "center" }}>
        <Icon name={isMasuk ? "arrow-down-circle" : "arrow-up-circle"} size={32} style={{ color: "var(--brand-maroon)", marginBottom: 8 }}/>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Daftar {isMasuk ? "kas masuk" : "kas keluar"} menggunakan filter & tabel yang sama dengan Jurnal Umum.</div>
        <div style={{ fontSize: 12.5, color: "var(--fg-tertiary)", marginBottom: 14 }}>Klik tombol di kanan atas untuk mencoba form input.</div>
        <button className="btn btn-sm" onClick={() => onNav("jurnal-umum")}>Buka Jurnal Umum →</button>
      </div>
    </div>
  );
};

const PLACEHOLDER_LABELS = {
  "kas-masuk": "Kas Masuk", "kas-keluar": "Kas Keluar",
  "kas-masuk-baru": "Input Kas Masuk", "kas-keluar-baru": "Input Kas Keluar",
  "piutang": "Piutang (AR)", "piutang-umum": "Piutang Pasien Umum",
  "piutang-bpjs": "Piutang BPJS", "piutang-asuransi": "Piutang Asuransi Swasta",
  "utang": "Utang (AP)", "buku-besar": "Buku Besar", "trial-balance": "Trial Balance",
  "neraca": "Neraca", "arus-kas": "Arus Kas", "lap-pendapatan": "Pendapatan per Unit",
  "aging-ar": "Aging Piutang", "aging-ap": "Aging Utang",
  "coa": "Chart of Accounts", "cost-center": "Cost Center", "vendor": "Vendor",
  "customer": "Customer / Pasien", "payer": "Payer (BPJS/Asuransi)",
  "periode": "Periode Akuntansi", "user-role": "User & Role",
  "approval": "Approval Workflow", "integrasi": "Integrasi SIMRS",
};

const PlaceholderPage = ({ page, onNav }) => {
  const label = PLACEHOLDER_LABELS[page] || page;
  return (
    <div style={{ padding: "20px 24px" }}>
      <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>{label}</h1>
      <p style={{ margin: "4px 0 20px", fontSize: 13, color: "var(--fg-tertiary)" }}>
        Halaman ini menggunakan pola layout dan komponen yang sama dengan modul lain.
      </p>
      <div className="card" style={{ padding: 60, textAlign: "center" }}>
        <div style={{
          width: 48, height: 48, borderRadius: 10,
          background: "rgba(91,2,2,0.08)", color: "var(--brand-maroon)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          marginBottom: 12,
        }}>
          <Icon name="database" size={24}/>
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Layout modul: {label}</div>
        <div style={{ fontSize: 13, color: "var(--fg-tertiary)", maxWidth: 480, margin: "0 auto", lineHeight: 1.5 }}>
          Mockup berfokus pada Dashboard, Jurnal Umum (list + slide-over), Form Input Jurnal, dan Laporan Laba Rugi.
          Modul ini menggunakan pola yang serupa: header global, filter bar, tabel dengan slide-over detail.
        </div>
        <div style={{ marginTop: 18, display: "flex", gap: 8, justifyContent: "center" }}>
          <button className="btn btn-sm" onClick={() => onNav("dashboard")}>Kembali ke Dashboard</button>
          <button className="btn btn-primary btn-sm" onClick={() => onNav("jurnal-umum")}>Lihat Jurnal Umum →</button>
        </div>
      </div>
    </div>
  );
};

const TweaksHost = ({ tweaks, setTweak }) => (
  <TweaksPanel title="Tweaks">
    <TweakSection label="Tema Warna">
      <TweakColor label="Warna primer" value={tweaks.brandMaroon}
        onChange={(v) => setTweak("brandMaroon", v)}
        options={["#5b0202", "#0e4d3a", "#1d3a7a", "#2a2a2a", "#7a3a00"]}/>
      <TweakColor label="Warna aksen" value={tweaks.brandGold}
        onChange={(v) => setTweak("brandGold", v)}
        options={["#daa520", "#b58a3a", "#c0a062", "#8a7a4a"]}/>
    </TweakSection>
    <TweakSection label="Tampilan">
      <TweakToggle label="Tabel compact" value={tweaks.denseTables} onChange={(v) => setTweak("denseTables", v)}/>
    </TweakSection>
  </TweaksPanel>
);

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
