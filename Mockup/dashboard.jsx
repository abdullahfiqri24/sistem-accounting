/* ===== Dashboard page ===== */

const Dashboard = ({ user, onNav, onAction }) => {
  const { DASHBOARD_KPI, PIUTANG_JT, UTANG_JT, PENDING_APPROVAL, REVENUE_TREND, PENDAPATAN_UNIT, fmtIDR, fmtIDRShort, fmtDate } = window.YarsiData;
  const { push } = useToast();

  const Kpi = ({ label, value, delta, sub, icon, accent }) => (
    <div className="card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ fontSize: 11.5, color: "var(--fg-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>{label}</div>
        <div style={{
          width: 24, height: 24, borderRadius: 6,
          background: accent === "maroon" ? "rgba(91,2,2,0.08)" : "rgba(218,165,32,0.12)",
          color: accent === "maroon" ? "var(--brand-maroon)" : "#a87814",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name={icon} size={13}/>
        </div>
      </div>
      <div className="num" style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginTop: 2 }}>
        {fmtIDR(value, { decimals: 0 })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11.5 }}>
        <span style={{ color: "var(--fg-tertiary)" }}>{sub}</span>
        <span className="num" style={{
          color: delta >= 0 ? "var(--positive)" : "var(--negative)",
          fontWeight: 600,
        }}>
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%
        </span>
      </div>
    </div>
  );

  const agingPill = (days) => {
    const color = days <= 3 ? "var(--status-pending)" : days <= 7 ? "#c84a00" : "var(--negative)";
    const bg = days <= 3 ? "var(--status-pending-bg)" : days <= 7 ? "rgba(200,74,0,0.12)" : "var(--status-void-bg)";
    return <span className="badge no-dot num" style={{ color, background: bg, fontSize: 10.5 }}>{days} hari</span>;
  };

  // Chart: bar trend
  const trendMax = Math.max(...REVENUE_TREND.map(d => d.value));
  const trendMin = Math.min(...REVENUE_TREND.map(d => d.value));

  // Donut data
  const totalUnit = PENDAPATAN_UNIT.reduce((s, u) => s + u.value, 0);
  let acc = 0;
  const donut = PENDAPATAN_UNIT.map(u => {
    const start = acc / totalUnit;
    acc += u.value;
    const end = acc / totalUnit;
    return { ...u, start, end, pct: u.value / totalUnit };
  });

  return (
    <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>
            Selamat pagi, {user.name.split(" ")[0]}
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--fg-tertiary)" }}>
            Rabu, 26 November 2025 · Ringkasan posisi keuangan hari ini
          </p>
        </div>
        <div className="dashboard-actions" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn btn-sm" onClick={() => onAction("new-kas-masuk")}>
            <Icon name="arrow-down-circle" size={13}/> Kas Masuk
          </button>
          <button className="btn btn-sm" onClick={() => onAction("new-kas-keluar")}>
            <Icon name="arrow-up-circle" size={13}/> Kas Keluar
          </button>
          <button className="btn btn-sm" onClick={() => onAction("new-journal")}>
            <Icon name="plus" size={13}/> Jurnal Baru
            <Kbd>N</Kbd>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => { push("Posting batch 8 jurnal draft berhasil", "success"); }}>
            <Icon name="send" size={13}/> Posting Batch
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid-kpi-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <Kpi label="Saldo Kas" value={DASHBOARD_KPI.kas.value} delta={DASHBOARD_KPI.kas.delta} sub={DASHBOARD_KPI.kas.sub} icon="arrow-down-circle" accent="gold"/>
        <Kpi label="Saldo Bank" value={DASHBOARD_KPI.bank.value} delta={DASHBOARD_KPI.bank.delta} sub={DASHBOARD_KPI.bank.sub} icon="database" accent="gold"/>
        <Kpi label="Piutang Outstanding" value={DASHBOARD_KPI.piutang.value} delta={DASHBOARD_KPI.piutang.delta} sub={DASHBOARD_KPI.piutang.sub} icon="users" accent="maroon"/>
        <Kpi label="Utang Outstanding" value={DASHBOARD_KPI.utang.value} delta={DASHBOARD_KPI.utang.delta} sub={DASHBOARD_KPI.utang.sub} icon="inbox" accent="maroon"/>
      </div>

      {/* Row 2: charts */}
      <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12 }}>
        {/* Revenue trend */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Tren Pendapatan Bruto</div>
              <div style={{ fontSize: 11.5, color: "var(--fg-tertiary)", marginTop: 2 }}>6 bulan terakhir · semua unit</div>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <button className="btn btn-xs" style={{ background: "var(--bg-subtle)" }}>6 Bln</button>
              <button className="btn btn-xs btn-ghost">12 Bln</button>
              <button className="btn btn-xs btn-ghost">YTD</button>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 160, padding: "0 8px" }}>
            {REVENUE_TREND.map((m, i) => {
              const h = ((m.value - trendMin * 0.85) / (trendMax - trendMin * 0.85)) * 100;
              const isCurrent = i === REVENUE_TREND.length - 1;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                  <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end", position: "relative" }}>
                    <div style={{
                      width: "100%",
                      height: `${h}%`,
                      background: isCurrent ? "var(--brand-maroon)" : "linear-gradient(180deg, rgba(91,2,2,0.6), rgba(91,2,2,0.4))",
                      borderRadius: "4px 4px 0 0",
                      position: "relative",
                    }}>
                      <div className="num" style={{
                        position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)",
                        fontSize: 10.5, color: "var(--fg-tertiary)", whiteSpace: "nowrap",
                      }}>
                        {fmtIDRShort(m.value)}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--fg-tertiary)", fontWeight: isCurrent ? 600 : 400 }}>{m.bulan}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pendapatan per unit */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Pendapatan per Unit</div>
            <div style={{ fontSize: 11.5, color: "var(--fg-tertiary)", marginTop: 2 }}>November 2025 (MTD)</div>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {/* donut */}
            <svg width="120" height="120" viewBox="0 0 120 120" style={{ flexShrink: 0 }}>
              {donut.map((u, i) => {
                const r = 48, cx = 60, cy = 60;
                const a0 = u.start * Math.PI * 2 - Math.PI / 2;
                const a1 = u.end * Math.PI * 2 - Math.PI / 2;
                const large = u.end - u.start > 0.5 ? 1 : 0;
                const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
                const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
                return <path key={i} d={`M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`} fill={u.color}/>;
              })}
              <circle cx="60" cy="60" r="28" fill="var(--bg-elevated)"/>
              <text x="60" y="56" textAnchor="middle" style={{ fontSize: 9, fill: "var(--fg-tertiary)" }}>TOTAL</text>
              <text x="60" y="69" textAnchor="middle" className="num" style={{ fontSize: 11, fontWeight: 700, fill: "var(--fg)" }}>
                {fmtIDRShort(totalUnit).replace("Rp\u00a0", "")}
              </text>
            </svg>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5, minWidth: 0 }}>
              {donut.map((u, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5 }}>
                  <span className="dot" style={{ background: u.color, flexShrink: 0 }}></span>
                  <span style={{ flex: 1, color: "var(--fg-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.unit}</span>
                  <span className="num" style={{ color: "var(--fg-tertiary)" }}>{(u.pct * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: pending approval + due tables */}
      <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Jurnal Pending Approval</div>
              <div style={{ fontSize: 11.5, color: "var(--fg-tertiary)", marginTop: 2 }}>{PENDING_APPROVAL.length} jurnal menunggu — total {fmtIDRShort(PENDING_APPROVAL.reduce((s, x) => s + x.amount, 0))}</div>
            </div>
            <a onClick={() => onNav("jurnal-umum")} style={{ fontSize: 11.5, color: "var(--brand-maroon)", cursor: "pointer", fontWeight: 600 }}>Lihat semua →</a>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="tbl compact">
              <thead>
                <tr>
                  <th>No. Jurnal</th>
                  <th>Deskripsi</th>
                  <th className="col-num">Jumlah</th>
                  <th style={{ width: 64 }}></th>
                </tr>
              </thead>
              <tbody>
                {PENDING_APPROVAL.map(j => (
                  <tr key={j.id}>
                    <td className="mono" style={{ fontSize: 11.5 }}>{j.id}</td>
                    <td>
                      <div style={{ fontSize: 12.5 }}>{j.desc}</div>
                      <div style={{ fontSize: 10.5, color: "var(--fg-tertiary)", marginTop: 1 }}>oleh {j.by} · {j.waktu}</div>
                    </td>
                    <td className="num col-num" style={{ fontWeight: 600 }}>{fmtIDR(j.amount, { decimals: 0 })}</td>
                    <td>
                      <button className="btn btn-xs btn-primary" onClick={() => push(`${j.id} disetujui`, "success")}>
                        <Icon name="check" size={11}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Piutang Jatuh Tempo Minggu Ini</div>
              <div style={{ fontSize: 11.5, color: "var(--fg-tertiary)", marginTop: 2 }}>{PIUTANG_JT.length} invoice · total {fmtIDRShort(PIUTANG_JT.reduce((s, x) => s + x.amount, 0))}</div>
            </div>
            <a onClick={() => onNav("piutang")} style={{ fontSize: 11.5, color: "var(--brand-maroon)", cursor: "pointer", fontWeight: 600 }}>Lihat semua →</a>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="tbl compact">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Payer</th>
                  <th>Aging</th>
                  <th className="col-num">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {PIUTANG_JT.map(p => (
                  <tr key={p.inv}>
                    <td className="mono" style={{ fontSize: 11.5 }}>{p.inv}</td>
                    <td>
                      <div style={{ fontSize: 12.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>{p.payer}</div>
                      <div style={{ fontSize: 10.5, color: "var(--fg-tertiary)" }}>{fmtDate(p.due)}</div>
                    </td>
                    <td>{agingPill(p.aging)}</td>
                    <td className="num col-num" style={{ fontWeight: 600 }}>{fmtIDR(p.amount, { decimals: 0 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 4: utang JT + quick stats */}
      <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Utang Jatuh Tempo Minggu Ini</div>
              <div style={{ fontSize: 11.5, color: "var(--fg-tertiary)", marginTop: 2 }}>{UTANG_JT.length} PO · total {fmtIDRShort(UTANG_JT.reduce((s, x) => s + x.amount, 0))}</div>
            </div>
            <a onClick={() => onNav("utang")} style={{ fontSize: 11.5, color: "var(--brand-maroon)", cursor: "pointer", fontWeight: 600 }}>Lihat semua →</a>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="tbl compact">
              <thead>
                <tr><th>PO</th><th>Vendor</th><th>Jatuh Tempo</th><th className="col-num">Jumlah</th></tr>
              </thead>
              <tbody>
                {UTANG_JT.map(u => (
                  <tr key={u.id}>
                    <td className="mono" style={{ fontSize: 11.5 }}>{u.id}</td>
                    <td style={{ fontSize: 12.5 }}>{u.vendor}</td>
                    <td>{agingPill(u.aging)}<span style={{ marginLeft: 6, fontSize: 11, color: "var(--fg-tertiary)" }}>{fmtDate(u.due)}</span></td>
                    <td className="num col-num" style={{ fontWeight: 600 }}>{fmtIDR(u.amount, { decimals: 0 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Aktivitas Periode Berjalan</div>
              <div style={{ fontSize: 11.5, color: "var(--fg-tertiary)", marginTop: 2 }}>Closing target: 5 Desember 2025</div>
            </div>
            <span className="badge badge-open">17 hari lagi</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "Jurnal posted", v: "1.247", sub: "+184 vs Okt" },
              { label: "Jurnal draft", v: "8", sub: "perlu review" },
              { label: "Rekonsiliasi bank", v: "4 / 5", sub: "BSI belum" },
              { label: "Closing checklist", v: "12 / 18", sub: "67% selesai" },
            ].map((s, i) => (
              <div key={i} style={{ padding: 12, background: "var(--bg-subtle)", borderRadius: 6 }}>
                <div style={{ fontSize: 11, color: "var(--fg-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</div>
                <div className="num" style={{ fontSize: 20, fontWeight: 700, marginTop: 4, letterSpacing: "-0.02em" }}>{s.v}</div>
                <div style={{ fontSize: 11, color: "var(--fg-tertiary)", marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: 10, background: "var(--status-pending-bg)", color: "var(--status-pending)", borderRadius: 6, display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12 }}>
            <Icon name="alert" size={14} style={{ marginTop: 1, flexShrink: 0 }}/>
            <span>Rekonsiliasi BSI Payroll belum dilakukan untuk minggu lalu. <a onClick={() => onNav("kas-masuk")} style={{ fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>Buka rekonsiliasi →</a></span>
          </div>
        </div>
      </div>
    </div>
  );
};

window.Dashboard = Dashboard;
