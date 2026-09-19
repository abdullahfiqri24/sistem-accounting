/* ===== Neraca (Balance Sheet) + Chart of Accounts ===== */

const Neraca = ({ onNav }) => {
  const { NERACA, fmtIDR } = window.YarsiData;
  const [comparative, setComparative] = React.useState(true);
  const [layout, setLayout] = React.useState("split"); // split | vertical

  const sumSection = (section) => section.items.reduce((s, i) => s + i.current, 0);
  const sumSectionPrev = (section) => section.items.reduce((s, i) => s + i.prev, 0);

  const sumGroup = (group) => group.reduce((s, sec) => s + sumSection(sec), 0);
  const sumGroupPrev = (group) => group.reduce((s, sec) => s + sumSectionPrev(sec), 0);

  const totalAset = sumGroup(NERACA.aset);
  const totalKewajiban = sumGroup(NERACA.kewajiban);
  const totalEkuitas = sumGroup(NERACA.ekuitas);
  const totalAsetPrev = sumGroupPrev(NERACA.aset);
  const totalKewajibanPrev = sumGroupPrev(NERACA.kewajiban);
  const totalEkuitasPrev = sumGroupPrev(NERACA.ekuitas);

  const renderGroup = (group, title, color) => (
    <div>
      <div style={{
        padding: "10px 16px",
        background: color,
        color: "#fff",
        fontSize: 11.5,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        borderRadius: "6px 6px 0 0",
      }}>{title}</div>
      <table className="tbl" style={{ fontSize: 12.5, border: "1px solid var(--border)", borderTop: "none", borderRadius: "0 0 6px 6px" }}>
        <colgroup>
          <col style={{ width: 80 }}/>
          <col/>
          <col style={{ width: 140 }}/>
          {comparative && <col style={{ width: 140 }}/>}
        </colgroup>
        <tbody>
          {group.map((section, si) => (
            <React.Fragment key={si}>
              <tr style={{ background: "var(--bg-subtle)" }}>
                <td colSpan={comparative ? 4 : 3} style={{ padding: "8px 16px", fontSize: 11, color: "var(--fg-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600, borderBottom: "1px solid var(--border)" }}>
                  {section.section}
                </td>
              </tr>
              {section.items.map((it, ii) => (
                <tr key={ii} style={{ cursor: "pointer" }} onClick={() => onNav("buku-besar")}>
                  <td className="mono" style={{ paddingLeft: 16, color: "var(--fg-tertiary)", fontSize: 11.5 }}>{it.kode}</td>
                  <td><span style={{ borderBottom: "1px dotted var(--border-strong)" }}>{it.nama}</span></td>
                  <td className="num col-num">{fmtIDR(it.current, { decimals: 0, withSymbol: false })}</td>
                  {comparative && <td className="num col-num" style={{ color: "var(--fg-tertiary)" }}>{fmtIDR(it.prev, { decimals: 0, withSymbol: false })}</td>}
                </tr>
              ))}
              <tr style={{ background: "rgba(91,2,2,0.04)" }}>
                <td></td>
                <td style={{ fontWeight: 600, paddingLeft: 16 }}>Subtotal {section.section}</td>
                <td className="num col-num" style={{ fontWeight: 700 }}>{fmtIDR(sumSection(section), { decimals: 0, withSymbol: false })}</td>
                {comparative && <td className="num col-num" style={{ fontWeight: 600, color: "var(--fg-secondary)" }}>{fmtIDR(sumSectionPrev(section), { decimals: 0, withSymbol: false })}</td>}
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderTotal = (label, value, prev, accent) => (
    <div style={{
      padding: "14px 18px",
      background: accent,
      color: "#fff",
      borderRadius: 6,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 12,
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
      <div style={{ textAlign: "right" }}>
        <div className="num" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em" }}>{fmtIDR(value, { decimals: 0 })}</div>
        {comparative && <div className="num" style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 1 }}>sebelumnya: {fmtIDR(prev, { decimals: 0 })}</div>}
      </div>
    </div>
  );

  const balanceCheck = totalAset - (totalKewajiban + totalEkuitas);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "14px 24px", borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>Laporan Neraca</h1>
            <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--fg-tertiary)" }}>
              RS YARSI · Per 30 November 2025 {comparative && <>vs 30 Oktober 2025</>}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div className="btn-group" style={{ display: "inline-flex", borderRadius: 6, border: "1px solid var(--border-strong)", overflow: "hidden" }}>
              <button onClick={() => setLayout("split")} className="btn btn-sm" style={{ border: "none", borderRadius: 0, background: layout === "split" ? "var(--bg-subtle)" : "var(--bg-elevated)", fontWeight: layout === "split" ? 600 : 400 }}>2 Kolom</button>
              <button onClick={() => setLayout("vertical")} className="btn btn-sm" style={{ border: "none", borderRadius: 0, background: layout === "vertical" ? "var(--bg-subtle)" : "var(--bg-elevated)", fontWeight: layout === "vertical" ? 600 : 400 }}>Vertikal</button>
            </div>
            <button className="btn btn-sm"><Icon name="download" size={13}/> Excel</button>
            <button className="btn btn-sm"><Icon name="download" size={13}/> PDF</button>
          </div>
        </div>

        <div className="filter-row">
          <div style={{ flex: "0 0 180px" }}>
            <label className="field-label">Per Tanggal</label>
            <input className="input input-sm" type="date" defaultValue="2025-11-30"/>
          </div>
          <div style={{ flex: "0 0 200px" }}>
            <label className="field-label">Bandingkan dengan</label>
            <select className="input input-sm select" disabled={!comparative}>
              <option>30 Oktober 2025</option>
              <option>30 November 2024 (YoY)</option>
            </select>
          </div>
          <div style={{ flex: 1 }}/>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--fg-secondary)", cursor: "pointer", alignSelf: "flex-end", height: 30 }}>
            <input type="checkbox" checked={comparative} onChange={(e) => setComparative(e.target.checked)} style={{ accentColor: "var(--brand-maroon)" }}/>
            Comparative mode
          </label>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {/* Balance check */}
        <div style={{
          marginBottom: 16, padding: "10px 14px", borderRadius: 6,
          background: balanceCheck === 0 ? "var(--status-approved-bg)" : "var(--status-void-bg)",
          color: balanceCheck === 0 ? "var(--status-approved)" : "var(--status-void)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontSize: 12.5, fontWeight: 600,
        }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon name={balanceCheck === 0 ? "check" : "alert"} size={14}/>
            {balanceCheck === 0
              ? "Neraca seimbang: Total Aset = Kewajiban + Ekuitas"
              : `Tidak seimbang: selisih ${fmtIDR(balanceCheck, { decimals: 0 })}`}
          </span>
          <span className="num" style={{ fontSize: 12 }}>
            {fmtIDR(totalAset, { decimals: 0 })} = {fmtIDR(totalKewajiban + totalEkuitas, { decimals: 0 })}
          </span>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: layout === "split" ? "1fr 1fr" : "1fr",
          gap: 18,
        }}>
          <div>
            {renderGroup(NERACA.aset, "Aset", "var(--brand-maroon)")}
            {renderTotal("Total Aset", totalAset, totalAsetPrev, "var(--brand-maroon)")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              {renderGroup(NERACA.kewajiban, "Kewajiban", "#5a3c0a")}
              {renderTotal("Total Kewajiban", totalKewajiban, totalKewajibanPrev, "#5a3c0a")}
            </div>
            <div>
              {renderGroup(NERACA.ekuitas, "Ekuitas", "#3a3a3a")}
              {renderTotal("Total Ekuitas", totalEkuitas, totalEkuitasPrev, "#3a3a3a")}
            </div>
            {renderTotal("Total Kewajiban + Ekuitas", totalKewajiban + totalEkuitas, totalKewajibanPrev + totalEkuitasPrev, "var(--brand-maroon)")}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===== Chart of Accounts (tree view) ===== */
const ChartOfAccounts = () => {
  const { COA_TREE, fmtIDR } = window.YarsiData;
  const { push } = useToast();
  const [expanded, setExpanded] = React.useState(new Set(["1", "11", "120", "111", "2", "4", "5"]));
  const [q, setQ] = React.useState("");

  const toggle = (kode) => {
    const n = new Set(expanded);
    if (n.has(kode)) n.delete(kode); else n.add(kode);
    setExpanded(n);
  };

  const matches = (node) => {
    if (!q) return true;
    const term = q.toLowerCase();
    if (node.kode.includes(term) || node.nama.toLowerCase().includes(term)) return true;
    if (node.children) return node.children.some(matches);
    return false;
  };

  const tipeColor = {
    "Aset": "var(--status-posted)",
    "Kewajiban": "#5a3c0a",
    "Ekuitas": "#3a3a3a",
    "Pendapatan": "var(--status-approved)",
    "Beban": "var(--brand-maroon)",
  };
  const tipeBg = {
    "Aset": "var(--status-posted-bg)",
    "Kewajiban": "var(--status-pending-bg)",
    "Ekuitas": "var(--bg-subtle)",
    "Pendapatan": "var(--status-approved-bg)",
    "Beban": "var(--status-void-bg)",
  };

  const renderNode = (node, depth = 0) => {
    if (!matches(node)) return null;
    const hasChildren = node.children && node.children.length > 0;
    const open = expanded.has(node.kode) || !!q;
    const isHeader = hasChildren;
    return (
      <React.Fragment key={node.kode}>
        <tr style={{
          background: depth === 0 ? "var(--bg-subtle)" : "var(--bg-table-row)",
          fontWeight: isHeader ? 600 : 400,
        }}>
          <td style={{ paddingLeft: 24 + depth * 20, position: "relative" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              {hasChildren ? (
                <button onClick={() => toggle(node.kode)} className="btn btn-ghost btn-icon" style={{ width: 18, height: 18, padding: 0, border: "none" }}>
                  <Icon name="chevron-right" size={11} className={`chev ${open ? "open" : ""}`} style={{ color: "var(--fg-tertiary)" }}/>
                </button>
              ) : <span style={{ width: 18 }}/>}
              <span className="mono" style={{ fontSize: depth === 0 ? 12.5 : 12, fontWeight: depth === 0 ? 700 : 500 }}>{node.kode}</span>
            </span>
          </td>
          <td>
            <span style={{ fontSize: depth === 0 ? 13.5 : 12.5, fontWeight: depth === 0 ? 700 : (isHeader ? 600 : 400), textTransform: depth === 0 ? "uppercase" : "none", letterSpacing: depth === 0 ? "0.04em" : 0 }}>
              {node.nama}
            </span>
          </td>
          <td>
            {depth > 0 && (
              <span className="badge no-dot" style={{ background: tipeBg[node.tipe], color: tipeColor[node.tipe], fontSize: 10 }}>
                {node.tipe}
              </span>
            )}
          </td>
          <td style={{ textAlign: "center" }}>
            {depth > 0 && <span className="mono" style={{ fontSize: 11, color: "var(--fg-tertiary)" }}>{node.saldoNormal === "D" ? "Debit" : "Kredit"}</span>}
          </td>
          <td className="num col-num" style={{ fontWeight: hasChildren ? 700 : 500 }}>
            {node.saldo !== undefined ? fmtIDR(node.saldo, { decimals: 0, withSymbol: false }) : <span style={{ color: "var(--fg-quaternary)" }}>—</span>}
          </td>
          <td>
            {node.aktif !== false && depth > 0 && <span className="dot" style={{ background: "var(--positive)" }}></span>}
          </td>
          <td style={{ paddingRight: 24 }}>
            <button className="btn btn-ghost btn-icon btn-sm"><Icon name="more" size={12}/></button>
          </td>
        </tr>
        {hasChildren && open && node.children.map(c => renderNode(c, depth + 1))}
      </React.Fragment>
    );
  };

  // count totals
  const countAccounts = (nodes) => nodes.reduce((s, n) => s + (n.children ? countAccounts(n.children) : 1), 0);
  const total = countAccounts(COA_TREE);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "14px 24px", borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>Chart of Accounts</h1>
            <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--fg-tertiary)" }}>
              {total} akun detail · 5 kategori utama · standar PSAK
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn btn-sm" onClick={() => setExpanded(new Set())}>Collapse All</button>
            <button className="btn btn-sm" onClick={() => {
              const all = new Set();
              const walk = (nodes) => nodes.forEach(n => { all.add(n.kode); if (n.children) walk(n.children); });
              walk(COA_TREE);
              setExpanded(all);
            }}>Expand All</button>
            <button className="btn btn-sm"><Icon name="download" size={13}/> Export</button>
            <button className="btn btn-primary btn-sm" onClick={() => push("Modal akun baru akan dibuka", "info")}>
              <Icon name="plus" size={13}/> Akun Baru
            </button>
          </div>
        </div>

        <div className="filter-row">
          <div style={{ flex: "1 1 320px", position: "relative" }}>
            <label className="field-label">Cari</label>
            <div style={{ position: "relative" }}>
              <Icon name="search" size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--fg-quaternary)" }}/>
              <input className="input input-sm" style={{ paddingLeft: 30 }} placeholder="Kode atau nama akun…" value={q} onChange={(e) => setQ(e.target.value)}/>
            </div>
          </div>
          <div style={{ flex: "0 0 160px" }}>
            <label className="field-label">Tipe</label>
            <select className="input input-sm select">
              <option>Semua tipe</option>
              <option>Aset</option><option>Kewajiban</option><option>Ekuitas</option><option>Pendapatan</option><option>Beban</option>
            </select>
          </div>
          <div style={{ flex: "0 0 140px" }}>
            <label className="field-label">Status</label>
            <select className="input input-sm select">
              <option>Aktif saja</option><option>Semua</option><option>Non-aktif</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto" }}>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ paddingLeft: 24, width: 180 }}>Kode</th>
                <th>Nama Akun</th>
                <th style={{ width: 110 }}>Tipe</th>
                <th style={{ width: 100, textAlign: "center" }}>Saldo Normal</th>
                <th className="col-num" style={{ width: 160 }}>Saldo</th>
                <th style={{ width: 60 }}>Status</th>
                <th style={{ width: 60, paddingRight: 24 }}></th>
              </tr>
            </thead>
            <tbody>
              {COA_TREE.map(n => renderNode(n))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Neraca, ChartOfAccounts });
