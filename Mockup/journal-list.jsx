/* ===== Journal List + Slide-over detail ===== */

const JournalList = ({ onNav, onAction }) => {
  const { JOURNALS, COST_CENTERS, fmtIDR, fmtDate } = window.YarsiData;
  const { push } = useToast();
  const [selected, setSelected] = React.useState(new Set());
  const [detail, setDetail] = React.useState(null);
  const [filters, setFilters] = React.useState({ status: "all", cc: "all", q: "" });

  const filtered = JOURNALS.filter(j => {
    if (filters.status !== "all" && j.status !== filters.status) return false;
    if (filters.cc !== "all" && j.cc !== filters.cc) return false;
    if (filters.q && !(j.desc.toLowerCase().includes(filters.q.toLowerCase()) || j.id.toLowerCase().includes(filters.q.toLowerCase()))) return false;
    return true;
  });

  const allSelected = filtered.length > 0 && filtered.every(j => selected.has(j.id));
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map(j => j.id)));
  };
  const toggleOne = (id) => {
    const n = new Set(selected);
    if (n.has(id)) n.delete(id); else n.add(id);
    setSelected(n);
  };

  const statusCounts = {
    all: JOURNALS.length,
    posted: JOURNALS.filter(j => j.status === "posted").length,
    pending: JOURNALS.filter(j => j.status === "pending").length,
    draft: JOURNALS.filter(j => j.status === "draft").length,
    void: JOURNALS.filter(j => j.status === "void").length,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Page header */}
      <div style={{ padding: "16px 24px 12px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>Jurnal Umum</h1>
            <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--fg-tertiary)" }}>
              {JOURNALS.length} jurnal · periode November 2025
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-sm"><Icon name="filter" size={13}/> Filter Lanjutan</button>
            <button className="btn btn-sm"><Icon name="download" size={13}/> Export</button>
            <button className="btn btn-primary btn-sm" onClick={() => onAction("new-journal")}>
              <Icon name="plus" size={13}/> Buat Jurnal <Kbd>N</Kbd>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          tabs={[
            { value: "all", label: "Semua", count: statusCounts.all },
            { value: "posted", label: "Posted", count: statusCounts.posted },
            { value: "pending", label: "Pending Approval", count: statusCounts.pending },
            { value: "draft", label: "Draft", count: statusCounts.draft },
            { value: "void", label: "Void", count: statusCounts.void },
          ]}
          value={filters.status}
          onChange={(v) => setFilters({ ...filters, status: v })}
        />
      </div>

      {/* Filter bar */}
      <div style={{
        padding: "10px 24px",
        display: "flex", gap: 8, alignItems: "center",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-subtle)",
      }}>
        <div style={{ position: "relative", minWidth: 280 }}>
          <Icon name="search" size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--fg-quaternary)" }}/>
          <input
            className="input input-sm"
            style={{ paddingLeft: 30 }}
            placeholder="Cari No. Jurnal, deskripsi, akun…"
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          />
        </div>
        <select className="input input-sm select" style={{ width: "auto" }}>
          <option>Tanggal: November 2025</option>
          <option>Tanggal: Oktober 2025</option>
          <option>Range kustom…</option>
        </select>
        <select
          className="input input-sm select"
          style={{ width: "auto" }}
          value={filters.cc}
          onChange={(e) => setFilters({ ...filters, cc: e.target.value })}
        >
          <option value="all">Cost Center: Semua</option>
          {COST_CENTERS.map(cc => <option key={cc.kode} value={cc.kode}>{cc.kode} — {cc.nama}</option>)}
        </select>
        <select className="input input-sm select" style={{ width: "auto" }}>
          <option>Payer: Semua</option>
          <option>BPJS Kesehatan</option>
          <option>Asuransi Swasta</option>
          <option>Pasien Umum</option>
        </select>
        <div style={{ flex: 1 }}/>
        <div style={{ fontSize: 12, color: "var(--fg-tertiary)" }}>
          Menampilkan <strong style={{ color: "var(--fg)" }}>{filtered.length}</strong> dari {JOURNALS.length}
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="anim-fadein" style={{
          padding: "8px 24px", background: "rgba(91,2,2,0.06)",
          borderBottom: "1px solid var(--border)",
          display: "flex", gap: 8, alignItems: "center", fontSize: 12.5,
        }}>
          <strong>{selected.size} dipilih</strong>
          <span style={{ color: "var(--fg-tertiary)" }}>·</span>
          <button className="btn btn-xs" onClick={() => { push(`${selected.size} jurnal di-post`, "success"); setSelected(new Set()); }}>
            <Icon name="send" size={11}/> Post Selected
          </button>
          <button className="btn btn-xs"><Icon name="check" size={11}/> Approve</button>
          <button className="btn btn-xs"><Icon name="x" size={11}/> Void</button>
          <button className="btn btn-xs"><Icon name="download" size={11}/> Export</button>
          <div style={{ flex: 1 }}/>
          <button className="btn btn-xs btn-ghost" onClick={() => setSelected(new Set())}>Batalkan</button>
        </div>
      )}

      {/* Table */}
      <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 32, paddingLeft: 24 }}>
                <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ accentColor: "var(--brand-maroon)" }}/>
              </th>
              <th>Tanggal</th>
              <th>No. Jurnal</th>
              <th style={{ minWidth: 280 }}>Deskripsi</th>
              <th>Akun</th>
              <th>Cost Center</th>
              <th className="col-num">Debit</th>
              <th className="col-num">Kredit</th>
              <th>Status</th>
              <th>Created By</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(j => (
              <tr key={j.id}
                  className={selected.has(j.id) ? "selected" : ""}
                  onClick={() => setDetail(j)}
                  style={{ cursor: "pointer" }}>
                <td style={{ paddingLeft: 24 }} onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" checked={selected.has(j.id)} onChange={() => toggleOne(j.id)} style={{ accentColor: "var(--brand-maroon)" }}/>
                </td>
                <td className="num" style={{ whiteSpace: "nowrap", color: "var(--fg-secondary)" }}>{fmtDate(j.tgl)}</td>
                <td className="mono" style={{ fontSize: 12, fontWeight: 600 }}>{j.id}</td>
                <td>
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 380 }}>{j.desc}</div>
                  {j.ref && <div className="mono" style={{ fontSize: 10.5, color: "var(--fg-tertiary)", marginTop: 2 }}>ref: {j.ref}</div>}
                </td>
                <td style={{ fontSize: 12 }}>{j.akun}</td>
                <td className="mono" style={{ fontSize: 11.5, color: "var(--fg-secondary)" }}>{j.cc}</td>
                <td className="num col-num" style={{ color: j.debit > 0 ? "var(--fg)" : "var(--fg-quaternary)", fontWeight: j.debit > 0 ? 600 : 400 }}>
                  {j.debit > 0 ? fmtIDR(j.debit, { decimals: 0, withSymbol: false }) : "—"}
                </td>
                <td className="num col-num" style={{ color: j.kredit > 0 ? "var(--fg)" : "var(--fg-quaternary)", fontWeight: j.kredit > 0 ? 600 : 400 }}>
                  {j.kredit > 0 ? fmtIDR(j.kredit, { decimals: 0, withSymbol: false }) : "—"}
                </td>
                <td><StatusBadge status={j.status}/></td>
                <td style={{ fontSize: 11.5, color: "var(--fg-tertiary)" }} className="mono">{j.createdBy}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <button className="btn btn-ghost btn-icon btn-sm"><Icon name="more" size={13}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer pagination */}
      <div style={{
        padding: "8px 24px", borderTop: "1px solid var(--border)",
        background: "var(--bg-elevated)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontSize: 12, color: "var(--fg-tertiary)",
      }}>
        <div>Hal. 1 dari 13 · {JOURNALS.length} jurnal ditampilkan dari 247 total</div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button className="btn btn-xs"><Icon name="chevron-right" size={11} style={{ transform: "rotate(180deg)" }}/> Sebelumnya</button>
          <button className="btn btn-xs">Berikutnya <Icon name="chevron-right" size={11}/></button>
        </div>
      </div>

      {/* Slide-over detail */}
      {detail && <JournalSlideOver journal={detail} onClose={() => setDetail(null)} onAction={(act) => {
        if (act === "approve") push(`${detail.id} disetujui`, "success");
        if (act === "void") push(`${detail.id} di-void`, "info");
        if (act === "post") push(`${detail.id} di-post`, "success");
        setDetail(null);
      }}/>}
    </div>
  );
};

const JournalSlideOver = ({ journal, onClose, onAction }) => {
  const { fmtIDR, fmtDate } = window.YarsiData;
  React.useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  // synthesize lines if missing
  const lines = journal.lines || [
    journal.debit > 0
      ? { akun: journal.akun, desc: journal.desc, cc: journal.cc, debit: journal.debit, kredit: 0 }
      : { akun: journal.akun, desc: journal.desc, cc: journal.cc, debit: 0, kredit: journal.kredit },
    journal.debit > 0
      ? { akun: "1111 — Bank Mandiri — Operasional", desc: "lawan akun", cc: journal.cc, debit: 0, kredit: journal.debit }
      : { akun: "1111 — Bank Mandiri — Operasional", desc: "lawan akun", cc: journal.cc, debit: journal.kredit, kredit: 0 },
  ];

  const totalD = lines.reduce((s, l) => s + l.debit, 0);
  const totalK = lines.reduce((s, l) => s + l.kredit, 0);

  return (
    <>
      <div onClick={onClose} className="anim-fadein" style={{
        position: "fixed", inset: 0, background: "rgba(10,12,16,0.32)", zIndex: 40,
      }}/>
      <div className="anim-slidein-right" style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: 560, maxWidth: "92vw",
        background: "var(--bg-elevated)",
        borderLeft: "1px solid var(--border)",
        boxShadow: "-12px 0 40px rgba(0,0,0,0.15)",
        zIndex: 41,
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          padding: "14px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <div>
              <div className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{journal.id}</div>
              <div style={{ fontSize: 11.5, color: "var(--fg-tertiary)", marginTop: 1 }}>{fmtDate(journal.tgl)} · oleh {journal.createdBy}</div>
            </div>
            <StatusBadge status={journal.status}/>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <button className="btn btn-ghost btn-icon btn-sm"><Icon name="external" size={13}/></button>
            <button className="btn btn-ghost btn-icon btn-sm"><Icon name="edit" size={13}/></button>
            <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><Icon name="x" size={14}/></button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {/* Description block */}
          <div style={{ marginBottom: 18 }}>
            <div className="field-label" style={{ marginBottom: 6 }}>Deskripsi</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>{journal.desc}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
            <div>
              <div className="field-label">Referensi</div>
              <div className="mono" style={{ fontSize: 12.5, marginTop: 4 }}>{journal.ref || "—"}</div>
            </div>
            <div>
              <div className="field-label">Cost Center</div>
              <div className="mono" style={{ fontSize: 12.5, marginTop: 4 }}>{journal.cc}</div>
            </div>
          </div>

          {/* Lines */}
          <div className="field-label" style={{ marginBottom: 6 }}>Baris Jurnal</div>
          <div style={{ border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
            <table className="tbl compact" style={{ fontSize: 12 }}>
              <thead>
                <tr>
                  <th>Akun</th>
                  <th>Cost Center</th>
                  <th className="col-num">Debit</th>
                  <th className="col-num">Kredit</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((l, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{l.akun}</div>
                      <div style={{ fontSize: 10.5, color: "var(--fg-tertiary)", marginTop: 1 }}>{l.desc}</div>
                    </td>
                    <td className="mono" style={{ fontSize: 11 }}>{l.cc}</td>
                    <td className="num col-num">{l.debit > 0 ? fmtIDR(l.debit, { decimals: 0, withSymbol: false }) : "—"}</td>
                    <td className="num col-num">{l.kredit > 0 ? fmtIDR(l.kredit, { decimals: 0, withSymbol: false }) : "—"}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: "var(--bg-subtle)", fontWeight: 600 }}>
                  <td colSpan="2" style={{ padding: "8px 10px", borderTop: "2px solid var(--border-strong)", fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--fg-tertiary)" }}>Total</td>
                  <td className="num col-num" style={{ padding: "8px 10px", borderTop: "2px solid var(--border-strong)" }}>{fmtIDR(totalD, { decimals: 0, withSymbol: false })}</td>
                  <td className="num col-num" style={{ padding: "8px 10px", borderTop: "2px solid var(--border-strong)" }}>{fmtIDR(totalK, { decimals: 0, withSymbol: false })}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Audit trail */}
          <div className="field-label" style={{ marginBottom: 8 }}>Audit Trail</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, fontSize: 12 }}>
            {[
              { actor: journal.createdBy, action: "Membuat jurnal", time: `${fmtDate(journal.tgl)} · 09:24`, kind: "create" },
              ...(journal.status === "posted" ? [{ actor: "mgr.bambang", action: "Approved & posted", time: `${fmtDate(journal.tgl)} · 14:08`, kind: "approve" }] : []),
              ...(journal.status === "pending" ? [{ actor: "system", action: "Menunggu approval Manajer Keuangan", time: "ongoing", kind: "wait" }] : []),
              ...(journal.status === "void" ? [{ actor: "mgr.bambang", action: "Void: pembatalan transaksi", time: `${fmtDate(journal.tgl)} · 16:42`, kind: "void" }] : []),
            ].map((ev, i, arr) => (
              <div key={i} style={{ display: "flex", gap: 12, paddingBottom: 12, position: "relative" }}>
                <div style={{
                  width: 20, display: "flex", flexDirection: "column", alignItems: "center",
                  position: "relative",
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: ev.kind === "approve" ? "var(--positive)" :
                               ev.kind === "void" ? "var(--negative)" :
                               ev.kind === "wait" ? "var(--status-pending)" : "var(--brand-maroon)",
                    marginTop: 5, flexShrink: 0, zIndex: 1,
                  }}/>
                  {i < arr.length - 1 && <div style={{ flex: 1, width: 1, background: "var(--border)" }}/>}
                </div>
                <div style={{ flex: 1, paddingBottom: 4 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{ev.action}</div>
                  <div style={{ fontSize: 11, color: "var(--fg-tertiary)", marginTop: 1 }}>
                    <span className="mono">{ev.actor}</span> · {ev.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{
          padding: "12px 20px",
          borderTop: "1px solid var(--border)",
          background: "var(--bg-subtle)",
          display: "flex", gap: 8, justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", gap: 6 }}>
            {journal.status === "draft" && (
              <button className="btn btn-sm btn-primary" onClick={() => onAction("post")}><Icon name="send" size={12}/> Post Jurnal</button>
            )}
            {journal.status === "pending" && (
              <>
                <button className="btn btn-sm btn-primary" onClick={() => onAction("approve")}><Icon name="check" size={12}/> Approve & Post</button>
                <button className="btn btn-sm" onClick={() => onAction("void")}><Icon name="x" size={12}/> Tolak</button>
              </>
            )}
            {journal.status === "posted" && (
              <button className="btn btn-sm" onClick={() => onAction("void")}><Icon name="x" size={12}/> Void Jurnal</button>
            )}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn btn-sm"><Icon name="download" size={12}/> Cetak</button>
            <button className="btn btn-sm" onClick={onClose}>Tutup <Kbd>esc</Kbd></button>
          </div>
        </div>
      </div>
    </>
  );
};

Object.assign(window, { JournalList, JournalSlideOver });
