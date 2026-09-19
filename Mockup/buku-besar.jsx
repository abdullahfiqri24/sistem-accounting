/* ===== Buku Besar (General Ledger) + Trial Balance ===== */

const BukuBesar = ({ onNav }) => {
  const { BUKU_BESAR_BPJS, ACCOUNTS, COST_CENTERS, fmtIDR, fmtDate } = window.YarsiData;
  const [akun, setAkun] = React.useState("1202");

  const data = BUKU_BESAR_BPJS;

  // running balance
  let saldo = data.saldoAwal;
  const rowsWithBalance = data.rows.map(r => {
    saldo = saldo + r.debit - r.kredit;
    return { ...r, saldo };
  });
  const totalDebit = data.rows.reduce((s, r) => s + r.debit, 0);
  const totalKredit = data.rows.reduce((s, r) => s + r.kredit, 0);
  const saldoAkhir = data.saldoAwal + totalDebit - totalKredit;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Toolbar */}
      <div style={{ padding: "14px 24px", borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>Buku Besar</h1>
            <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--fg-tertiary)" }}>
              {data.akun} · Periode November 2025
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn btn-sm"><Icon name="filter" size={13}/> Filter</button>
            <button className="btn btn-sm"><Icon name="download" size={13}/> Excel</button>
            <button className="btn btn-sm"><Icon name="download" size={13}/> PDF</button>
          </div>
        </div>

        <div className="filter-row">
          <div style={{ flex: "1 1 280px", minWidth: 0 }}>
            <label className="field-label">Akun *</label>
            <select className="input input-sm select" value={akun} onChange={(e) => setAkun(e.target.value)}>
              {ACCOUNTS.map(a => <option key={a.kode} value={a.kode}>{a.kode} — {a.nama}</option>)}
            </select>
          </div>
          <div style={{ flex: "0 0 160px" }}>
            <label className="field-label">Dari Tanggal</label>
            <input className="input input-sm" type="date" defaultValue="2025-11-01"/>
          </div>
          <div style={{ flex: "0 0 160px" }}>
            <label className="field-label">Sampai Tanggal</label>
            <input className="input input-sm" type="date" defaultValue="2025-11-30"/>
          </div>
          <div style={{ flex: "1 1 180px" }}>
            <label className="field-label">Cost Center</label>
            <select className="input input-sm select">
              <option>Semua Cost Center</option>
              {COST_CENTERS.map(cc => <option key={cc.kode}>{cc.kode} — {cc.nama}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Summary strip */}
      <div className="kpi-strip" style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0,
        background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)",
      }}>
        {[
          { label: "Saldo Awal", value: data.saldoAwal, color: "var(--fg)" },
          { label: "Total Mutasi Debit", value: totalDebit, color: "var(--fg)" },
          { label: "Total Mutasi Kredit", value: totalKredit, color: "var(--fg)" },
          { label: "Saldo Akhir", value: saldoAkhir, color: "var(--brand-maroon)", strong: true },
        ].map((s, i) => (
          <div key={i} style={{ padding: "12px 20px", borderRight: i < 3 ? "1px solid var(--border)" : "none" }}>
            <div style={{ fontSize: 10.5, color: "var(--fg-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>{s.label}</div>
            <div className="num" style={{ fontSize: s.strong ? 19 : 16, fontWeight: s.strong ? 700 : 600, marginTop: 4, color: s.color, letterSpacing: "-0.01em" }}>
              {fmtIDR(s.value, { decimals: 0 })}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ paddingLeft: 24 }}>Tanggal</th>
                <th>No. Jurnal</th>
                <th style={{ minWidth: 280 }}>Deskripsi</th>
                <th className="col-num">Debit</th>
                <th className="col-num">Kredit</th>
                <th className="col-num">Saldo</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: "var(--bg-subtle)", fontWeight: 600 }}>
                <td style={{ paddingLeft: 24 }} colSpan="3" className="num">Saldo Awal — 01 Nov 2025</td>
                <td className="num col-num" style={{ color: "var(--fg-quaternary)" }}>—</td>
                <td className="num col-num" style={{ color: "var(--fg-quaternary)" }}>—</td>
                <td className="num col-num">{fmtIDR(data.saldoAwal, { decimals: 0, withSymbol: false })}</td>
              </tr>
              {rowsWithBalance.map((r, i) => (
                <tr key={i} style={{ cursor: "pointer" }} onClick={() => onNav("jurnal-umum")}>
                  <td style={{ paddingLeft: 24 }} className="num">{fmtDate(r.tgl)}</td>
                  <td className="mono" style={{ fontSize: 11.5, fontWeight: 600, color: "var(--brand-maroon)" }}>{r.jurnal}</td>
                  <td>{r.desc}</td>
                  <td className="num col-num" style={{ color: r.debit > 0 ? "var(--fg)" : "var(--fg-quaternary)", fontWeight: r.debit > 0 ? 600 : 400 }}>
                    {r.debit > 0 ? fmtIDR(r.debit, { decimals: 0, withSymbol: false }) : "—"}
                  </td>
                  <td className="num col-num" style={{ color: r.kredit > 0 ? "var(--fg)" : "var(--fg-quaternary)", fontWeight: r.kredit > 0 ? 600 : 400 }}>
                    {r.kredit > 0 ? fmtIDR(r.kredit, { decimals: 0, withSymbol: false }) : "—"}
                  </td>
                  <td className="num col-num" style={{ fontWeight: 600 }}>{fmtIDR(r.saldo, { decimals: 0, withSymbol: false })}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: "var(--bg-subtle)", fontWeight: 700, borderTop: "2px solid var(--border-strong)" }}>
                <td style={{ paddingLeft: 24, padding: "12px 10px 12px 24px" }} colSpan="3" className="num">Total & Saldo Akhir</td>
                <td className="num col-num" style={{ padding: "12px 10px" }}>{fmtIDR(totalDebit, { decimals: 0, withSymbol: false })}</td>
                <td className="num col-num" style={{ padding: "12px 10px" }}>{fmtIDR(totalKredit, { decimals: 0, withSymbol: false })}</td>
                <td className="num col-num" style={{ padding: "12px 10px", color: "var(--brand-maroon)", fontSize: 14 }}>{fmtIDR(saldoAkhir, { decimals: 0, withSymbol: false })}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ===== Trial Balance ===== */
const TrialBalance = ({ onNav }) => {
  const { TRIAL_BALANCE, fmtIDR } = window.YarsiData;

  const totals = TRIAL_BALANCE.reduce((acc, r) => ({
    awalD: acc.awalD + r.awalD,
    awalK: acc.awalK + r.awalK,
    mutD: acc.mutD + r.mutD,
    mutK: acc.mutK + r.mutK,
    akhirD: acc.akhirD + r.akhirD,
    akhirK: acc.akhirK + r.akhirK,
  }), { awalD: 0, awalK: 0, mutD: 0, mutK: 0, akhirD: 0, akhirK: 0 });

  const isBalanced = totals.akhirD === totals.akhirK;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "14px 24px", borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>Trial Balance (Neraca Saldo)</h1>
            <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--fg-tertiary)" }}>
              Cutoff: 30 November 2025 · {TRIAL_BALANCE.length} akun aktif
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-sm"><Icon name="download" size={13}/> Excel</button>
            <button className="btn btn-sm"><Icon name="download" size={13}/> PDF</button>
          </div>
        </div>

        <div className="filter-row">
          <div style={{ flex: "0 0 180px" }}>
            <label className="field-label">Cutoff Tanggal</label>
            <input className="input input-sm" type="date" defaultValue="2025-11-30"/>
          </div>
          <div style={{ flex: "0 0 180px" }}>
            <label className="field-label">Level Akun</label>
            <select className="input input-sm select">
              <option>Detail (akun terkecil)</option>
              <option>Summary (header 2 digit)</option>
            </select>
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <label className="field-label">Cost Center</label>
            <select className="input input-sm select">
              <option>Semua Cost Center</option>
            </select>
          </div>
          <div style={{ flex: "1 1 220px" }}>
            <label className="field-label">Tipe Akun</label>
            <select className="input input-sm select">
              <option>Semua tipe</option>
              <option>Aset</option><option>Kewajiban</option><option>Ekuitas</option><option>Pendapatan</option><option>Beban</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto" }}>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ paddingLeft: 24 }} rowSpan="2">Kode</th>
                <th rowSpan="2">Nama Akun</th>
                <th rowSpan="2">Tipe</th>
                <th colSpan="2" className="col-num" style={{ borderLeft: "1px solid var(--border)", textAlign: "center" }}>Saldo Awal</th>
                <th colSpan="2" className="col-num" style={{ borderLeft: "1px solid var(--border)", textAlign: "center" }}>Mutasi</th>
                <th colSpan="2" className="col-num" style={{ borderLeft: "1px solid var(--border)", textAlign: "center" }}>Saldo Akhir</th>
              </tr>
              <tr>
                <th className="col-num" style={{ borderLeft: "1px solid var(--border)", paddingTop: 0 }}>Debit</th>
                <th className="col-num" style={{ paddingTop: 0 }}>Kredit</th>
                <th className="col-num" style={{ borderLeft: "1px solid var(--border)", paddingTop: 0 }}>Debit</th>
                <th className="col-num" style={{ paddingTop: 0 }}>Kredit</th>
                <th className="col-num" style={{ borderLeft: "1px solid var(--border)", paddingTop: 0 }}>Debit</th>
                <th className="col-num" style={{ paddingTop: 0 }}>Kredit</th>
              </tr>
            </thead>
            <tbody>
              {TRIAL_BALANCE.map((r, i) => (
                <tr key={r.kode} style={{ cursor: "pointer" }} onClick={() => onNav("buku-besar")}>
                  <td style={{ paddingLeft: 24 }} className="mono" >{r.kode}</td>
                  <td>{r.nama}</td>
                  <td><span style={{ fontSize: 11, color: "var(--fg-tertiary)" }}>{r.tipe}</span></td>
                  <td className="num col-num" style={{ borderLeft: "1px solid var(--border)" }}>{r.awalD ? fmtIDR(r.awalD, { decimals: 0, withSymbol: false }) : <span style={{ color: "var(--fg-quaternary)" }}>—</span>}</td>
                  <td className="num col-num">{r.awalK ? fmtIDR(r.awalK, { decimals: 0, withSymbol: false }) : <span style={{ color: "var(--fg-quaternary)" }}>—</span>}</td>
                  <td className="num col-num" style={{ borderLeft: "1px solid var(--border)" }}>{r.mutD ? fmtIDR(r.mutD, { decimals: 0, withSymbol: false }) : <span style={{ color: "var(--fg-quaternary)" }}>—</span>}</td>
                  <td className="num col-num">{r.mutK ? fmtIDR(r.mutK, { decimals: 0, withSymbol: false }) : <span style={{ color: "var(--fg-quaternary)" }}>—</span>}</td>
                  <td className="num col-num" style={{ borderLeft: "1px solid var(--border)", fontWeight: r.akhirD ? 600 : 400 }}>{r.akhirD ? fmtIDR(r.akhirD, { decimals: 0, withSymbol: false }) : <span style={{ color: "var(--fg-quaternary)" }}>—</span>}</td>
                  <td className="num col-num" style={{ fontWeight: r.akhirK ? 600 : 400 }}>{r.akhirK ? fmtIDR(r.akhirK, { decimals: 0, withSymbol: false }) : <span style={{ color: "var(--fg-quaternary)" }}>—</span>}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{
                background: isBalanced ? "var(--status-approved-bg)" : "var(--status-void-bg)",
                fontWeight: 700, borderTop: "2px solid var(--border-strong)",
              }}>
                <td style={{ paddingLeft: 24, padding: "12px 10px 12px 24px" }} colSpan="3">
                  TOTAL
                  {isBalanced
                    ? <span className="badge badge-approved" style={{ marginLeft: 10 }}>Balance ✓</span>
                    : <span className="badge badge-void" style={{ marginLeft: 10 }}>Tidak Balance</span>}
                </td>
                <td className="num col-num" style={{ padding: "12px 10px", borderLeft: "1px solid var(--border)" }}>{fmtIDR(totals.awalD, { decimals: 0, withSymbol: false })}</td>
                <td className="num col-num" style={{ padding: "12px 10px" }}>{fmtIDR(totals.awalK, { decimals: 0, withSymbol: false })}</td>
                <td className="num col-num" style={{ padding: "12px 10px", borderLeft: "1px solid var(--border)" }}>{fmtIDR(totals.mutD, { decimals: 0, withSymbol: false })}</td>
                <td className="num col-num" style={{ padding: "12px 10px" }}>{fmtIDR(totals.mutK, { decimals: 0, withSymbol: false })}</td>
                <td className="num col-num" style={{ padding: "12px 10px", borderLeft: "1px solid var(--border)" }}>{fmtIDR(totals.akhirD, { decimals: 0, withSymbol: false })}</td>
                <td className="num col-num" style={{ padding: "12px 10px" }}>{fmtIDR(totals.akhirK, { decimals: 0, withSymbol: false })}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { BukuBesar, TrialBalance });
