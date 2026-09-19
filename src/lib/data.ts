import type {
  Account, CostCenter, Journal, DashboardKpi,
  PiutangJatuhTempo, UtangJatuhTempo, PendingApproval,
  RevenueTrend, PendapatanUnit, LabaRugiRow,
  BukuBesarData, TrialBalanceRow, PiutangItem, NeracaData,
  LabaRugiTsLine,
} from '@/types'

export const ACCOUNTS: Account[] = [
  { kode: '1101', nama: 'Kas Besar', tipe: 'Aset', saldoNormal: 'D' },
  { kode: '1102', nama: 'Kas Kecil — IGD', tipe: 'Aset', saldoNormal: 'D' },
  { kode: '1103', nama: 'Kas Kecil — Rawat Jalan', tipe: 'Aset', saldoNormal: 'D' },
  { kode: '1111', nama: 'Bank Mandiri — Operasional', tipe: 'Aset', saldoNormal: 'D' },
  { kode: '1112', nama: 'Bank BNI Syariah — Penerimaan', tipe: 'Aset', saldoNormal: 'D' },
  { kode: '1113', nama: 'Bank BSI — Payroll', tipe: 'Aset', saldoNormal: 'D' },
  { kode: '1201', nama: 'Piutang Pasien Umum', tipe: 'Aset', saldoNormal: 'D' },
  { kode: '1202', nama: 'Piutang BPJS Kesehatan', tipe: 'Aset', saldoNormal: 'D' },
  { kode: '1203', nama: 'Piutang Asuransi Swasta', tipe: 'Aset', saldoNormal: 'D' },
  { kode: '1301', nama: 'Persediaan Farmasi', tipe: 'Aset', saldoNormal: 'D' },
  { kode: '1302', nama: 'Persediaan Alat Kesehatan', tipe: 'Aset', saldoNormal: 'D' },
  { kode: '1501', nama: 'Tanah', tipe: 'Aset', saldoNormal: 'D' },
  { kode: '1502', nama: 'Bangunan', tipe: 'Aset', saldoNormal: 'D' },
  { kode: '1503', nama: 'Peralatan Medis', tipe: 'Aset', saldoNormal: 'D' },
  { kode: '2101', nama: 'Utang Usaha — Vendor Farmasi', tipe: 'Kewajiban', saldoNormal: 'K' },
  { kode: '2102', nama: 'Utang Usaha — Vendor Umum', tipe: 'Kewajiban', saldoNormal: 'K' },
  { kode: '2201', nama: 'Utang Gaji', tipe: 'Kewajiban', saldoNormal: 'K' },
  { kode: '2202', nama: 'Utang PPh 21', tipe: 'Kewajiban', saldoNormal: 'K' },
  { kode: '2203', nama: 'Utang PPh 23', tipe: 'Kewajiban', saldoNormal: 'K' },
  { kode: '3101', nama: 'Modal Yayasan', tipe: 'Ekuitas', saldoNormal: 'K' },
  { kode: '3201', nama: 'Saldo Laba Ditahan', tipe: 'Ekuitas', saldoNormal: 'K' },
  { kode: '4101', nama: 'Pendapatan Rawat Inap', tipe: 'Pendapatan', saldoNormal: 'K' },
  { kode: '4102', nama: 'Pendapatan Rawat Jalan', tipe: 'Pendapatan', saldoNormal: 'K' },
  { kode: '4103', nama: 'Pendapatan IGD', tipe: 'Pendapatan', saldoNormal: 'K' },
  { kode: '4104', nama: 'Pendapatan Penunjang Medis', tipe: 'Pendapatan', saldoNormal: 'K' },
  { kode: '4105', nama: 'Pendapatan Farmasi', tipe: 'Pendapatan', saldoNormal: 'K' },
  { kode: '4106', nama: 'Pendapatan Lab & Radiologi', tipe: 'Pendapatan', saldoNormal: 'K' },
  { kode: '5101', nama: 'Beban Gaji & Tunjangan', tipe: 'Beban', saldoNormal: 'D' },
  { kode: '5102', nama: 'Beban Jasa Medis', tipe: 'Beban', saldoNormal: 'D' },
  { kode: '5201', nama: 'Beban Obat & Alkes', tipe: 'Beban', saldoNormal: 'D' },
  { kode: '5301', nama: 'Beban Listrik & Air', tipe: 'Beban', saldoNormal: 'D' },
  { kode: '5302', nama: 'Beban Pemeliharaan', tipe: 'Beban', saldoNormal: 'D' },
  { kode: '5303', nama: 'Beban Penyusutan', tipe: 'Beban', saldoNormal: 'D' },
]

export const COST_CENTERS: CostCenter[] = [
  { kode: 'CC-RI', nama: 'Rawat Inap' },
  { kode: 'CC-RJ', nama: 'Rawat Jalan' },
  { kode: 'CC-IGD', nama: 'IGD' },
  { kode: 'CC-LAB', nama: 'Laboratorium' },
  { kode: 'CC-RAD', nama: 'Radiologi' },
  { kode: 'CC-FAR', nama: 'Farmasi' },
  { kode: 'CC-OK', nama: 'Kamar Operasi' },
  { kode: 'CC-ADM', nama: 'Administrasi & Umum' },
]

export const JOURNALS: Journal[] = [
  { id: 'JV-2025-11-0241', tgl: '2025-11-26', desc: 'Penerimaan pembayaran pasien rawat inap — Nyonya Siti R.', akun: '1111 — Bank Mandiri Op.', debit: 8450000, kredit: 0, cc: 'CC-RI', status: 'posted', createdBy: 'kasir.ratna', ref: 'INV/RI/2025/11/0418', lines: [
    { akun: '1111 — Bank Mandiri — Operasional', desc: 'Pembayaran INV/RI/2025/11/0418', cc: 'CC-RI', debit: 8450000, kredit: 0 },
    { akun: '1201 — Piutang Pasien Umum', desc: 'Pelunasan pasien Siti R.', cc: 'CC-RI', debit: 0, kredit: 8450000 },
  ]},
  { id: 'JV-2025-11-0240', tgl: '2025-11-26', desc: 'Klaim BPJS batch November w4', akun: '1202 — Piutang BPJS', debit: 312500000, kredit: 0, cc: 'CC-RJ', status: 'pending', createdBy: 'akt.dewi', ref: 'BPJS/2025/11/W4', lines: [
    { akun: '1202 — Piutang BPJS Kesehatan', desc: 'Klaim batch 4 — 218 pasien', cc: 'CC-RJ', debit: 312500000, kredit: 0 },
    { akun: '4102 — Pendapatan Rawat Jalan', desc: 'Pendapatan klaim BPJS', cc: 'CC-RJ', debit: 0, kredit: 187300000 },
    { akun: '4101 — Pendapatan Rawat Inap', desc: 'Pendapatan klaim BPJS', cc: 'CC-RI', debit: 0, kredit: 125200000 },
  ]},
  { id: 'JV-2025-11-0239', tgl: '2025-11-26', desc: 'Pembelian obat — Kimia Farma (jatuh tempo 30 hari)', akun: '1301 — Persediaan Farmasi', debit: 47820000, kredit: 0, cc: 'CC-FAR', status: 'posted', createdBy: 'akt.dewi', ref: 'PO/FAR/2025/0612' },
  { id: 'JV-2025-11-0238', tgl: '2025-11-25', desc: 'Bayar listrik PLN bulan Oktober 2025', akun: '5301 — Beban Listrik & Air', debit: 28450000, kredit: 0, cc: 'CC-ADM', status: 'posted', createdBy: 'akt.budi', ref: 'PLN-OKT-2025' },
  { id: 'JV-2025-11-0237', tgl: '2025-11-25', desc: 'Pendapatan tindakan operasi — Bpk. Hartono', akun: '4101 — Pendapatan Rawat Inap', debit: 0, kredit: 22500000, cc: 'CC-OK', status: 'posted', createdBy: 'kasir.ratna', ref: 'INV/OK/2025/11/0089' },
  { id: 'JV-2025-11-0236', tgl: '2025-11-25', desc: 'Reklas saldo kas kecil IGD', akun: '1102 — Kas Kecil IGD', debit: 5000000, kredit: 0, cc: 'CC-IGD', status: 'draft', createdBy: 'akt.dewi', ref: '—' },
  { id: 'JV-2025-11-0235', tgl: '2025-11-24', desc: 'Pembayaran jasa dokter spesialis November w3', akun: '5102 — Beban Jasa Medis', debit: 165780000, kredit: 0, cc: 'CC-ADM', status: 'pending', createdBy: 'akt.budi', ref: 'JM/2025/11/W3' },
  { id: 'JV-2025-11-0234', tgl: '2025-11-24', desc: 'Penyusutan peralatan medis November 2025', akun: '5303 — Beban Penyusutan', debit: 42180000, kredit: 0, cc: 'CC-ADM', status: 'posted', createdBy: 'akt.dewi', ref: 'DEP-2025-11' },
  { id: 'JV-2025-11-0233', tgl: '2025-11-24', desc: 'Penerimaan klaim Mandiri Inhealth', akun: '1111 — Bank Mandiri Op.', debit: 78450000, kredit: 0, cc: 'CC-RI', status: 'posted', createdBy: 'kasir.ratna', ref: 'INH/2025/11/0042' },
  { id: 'JV-2025-11-0232', tgl: '2025-11-23', desc: 'Refund pasien — pembatalan rawat inap', akun: '4101 — Pendapatan Rawat Inap', debit: 3200000, kredit: 0, cc: 'CC-RI', status: 'void', createdBy: 'kasir.ratna', ref: 'REF/2025/11/0007' },
  { id: 'JV-2025-11-0231', tgl: '2025-11-23', desc: 'Pembelian reagen lab — Roche Diagnostics', akun: '1302 — Persediaan Alat Kesehatan', debit: 24890000, kredit: 0, cc: 'CC-LAB', status: 'posted', createdBy: 'akt.dewi', ref: 'PO/LAB/2025/0218' },
  { id: 'JV-2025-11-0230', tgl: '2025-11-22', desc: 'Pendapatan farmasi rawat jalan', akun: '4105 — Pendapatan Farmasi', debit: 0, kredit: 18450000, cc: 'CC-FAR', status: 'posted', createdBy: 'kasir.ratna', ref: 'FAR/2025/11/22' },
  { id: 'JV-2025-11-0229', tgl: '2025-11-22', desc: 'Bayar PBB Bangunan Q4 2025', akun: '5301 — Beban Listrik & Air', debit: 12500000, kredit: 0, cc: 'CC-ADM', status: 'posted', createdBy: 'akt.budi', ref: 'PBB-Q4-2025' },
  { id: 'JV-2025-11-0228', tgl: '2025-11-21', desc: 'Pemeliharaan AC dan genset', akun: '5302 — Beban Pemeliharaan', debit: 8740000, kredit: 0, cc: 'CC-ADM', status: 'draft', createdBy: 'akt.budi', ref: '—' },
  { id: 'JV-2025-11-0227', tgl: '2025-11-21', desc: 'Penerimaan kas — laboratorium walk-in', akun: '1101 — Kas Besar', debit: 4280000, kredit: 0, cc: 'CC-LAB', status: 'posted', createdBy: 'kasir.ratna', ref: 'LAB/2025/11/21' },
  { id: 'JV-2025-11-0226', tgl: '2025-11-21', desc: 'Pendapatan radiologi — paket MCU corporate PT Astra', akun: '4106 — Pendapatan Lab & Radiologi', debit: 0, kredit: 35600000, cc: 'CC-RAD', status: 'posted', createdBy: 'kasir.ratna', ref: 'MCU/AST/2025/11' },
  { id: 'JV-2025-11-0225', tgl: '2025-11-20', desc: 'Pembayaran utang vendor — PT Sumber Sehat', akun: '2101 — Utang Usaha Farmasi', debit: 67250000, kredit: 0, cc: 'CC-FAR', status: 'posted', createdBy: 'akt.budi', ref: 'PV/2025/11/0084' },
  { id: 'JV-2025-11-0224', tgl: '2025-11-20', desc: 'Pendapatan IGD — pasien BPJS', akun: '4103 — Pendapatan IGD', debit: 0, kredit: 8920000, cc: 'CC-IGD', status: 'posted', createdBy: 'kasir.ratna', ref: 'IGD/2025/11/20' },
]

export const DASHBOARD_KPI: DashboardKpi = {
  kas: { value: 1284560000, delta: 4.2, sub: '3 rekening kas' },
  bank: { value: 8642180500, delta: -1.8, sub: '5 rekening bank' },
  piutang: { value: 4218400000, delta: 12.6, sub: '327 invoice outstanding' },
  utang: { value: 1542800000, delta: -3.1, sub: '84 invoice outstanding' },
}

export const PIUTANG_JT: PiutangJatuhTempo[] = [
  { inv: 'INV/RI/2025/10/0218', payer: 'BPJS Kesehatan', pasien: 'Batch Oktober W3', due: '2025-11-28', aging: 2, amount: 187500000 },
  { inv: 'INV/RJ/2025/10/0741', payer: 'PT Asuransi Astra Buana', pasien: 'Karyawan Astra MCU', due: '2025-11-29', aging: 3, amount: 42180000 },
  { inv: 'INV/RI/2025/11/0102', payer: 'Pasien Umum — Hartono S.', pasien: 'Hartono Susanto', due: '2025-11-30', aging: 4, amount: 22500000 },
  { inv: 'INV/RJ/2025/11/0214', payer: 'BPJS Kesehatan', pasien: 'Batch November W2', due: '2025-12-02', aging: 6, amount: 218450000 },
  { inv: 'INV/RI/2025/11/0186', payer: 'Mandiri Inhealth', pasien: 'Klaim Oktober batch 2', due: '2025-12-03', aging: 7, amount: 78450000 },
]

export const UTANG_JT: UtangJatuhTempo[] = [
  { id: 'PO/FAR/2025/0598', vendor: 'Kimia Farma Tbk', due: '2025-11-28', aging: 2, amount: 142800000 },
  { id: 'PO/ALK/2025/0214', vendor: 'Roche Diagnostics', due: '2025-11-30', aging: 4, amount: 89400000 },
  { id: 'PO/UMUM/2025/0089', vendor: 'PT Jasa Cleaning', due: '2025-12-01', aging: 5, amount: 18500000 },
  { id: 'PO/FAR/2025/0612', vendor: 'PT Sumber Sehat', due: '2025-12-04', aging: 8, amount: 47820000 },
]

export const PENDING_APPROVAL: PendingApproval[] = [
  { id: 'JV-2025-11-0240', desc: 'Klaim BPJS batch November w4', amount: 312500000, by: 'akt.dewi', waktu: '2 jam lalu' },
  { id: 'JV-2025-11-0235', desc: 'Pembayaran jasa dokter spesialis November w3', amount: 165780000, by: 'akt.budi', waktu: '5 jam lalu' },
  { id: 'JV-2025-11-0221', desc: 'Reklas akun beban listrik IGD', amount: 4280000, by: 'akt.dewi', waktu: 'kemarin' },
  { id: 'JV-2025-11-0218', desc: 'Penghapusan piutang macet pasien umum', amount: 8700000, by: 'akt.budi', waktu: 'kemarin' },
]

export const REVENUE_TREND: RevenueTrend[] = [
  { bulan: 'Jun', value: 4820000000 },
  { bulan: 'Jul', value: 5140000000 },
  { bulan: 'Agu', value: 4980000000 },
  { bulan: 'Sep', value: 5320000000 },
  { bulan: 'Okt', value: 5680000000 },
  { bulan: 'Nov', value: 5340000000 },
]

export const PENDAPATAN_UNIT: PendapatanUnit[] = [
  { unit: 'Rawat Inap', value: 2180000000, color: '#5b0202' },
  { unit: 'Rawat Jalan', value: 1420000000, color: '#8a2828' },
  { unit: 'IGD', value: 680000000, color: '#daa520' },
  { unit: 'Lab & Radiologi', value: 540000000, color: '#a87814' },
  { unit: 'Farmasi', value: 380000000, color: '#5d5d5d' },
  { unit: 'Penunjang Lainnya', value: 140000000, color: '#bfbfbf' },
]

export const LABA_RUGI: LabaRugiRow[] = [
  { kind: 'section', label: 'PENDAPATAN OPERASIONAL' },
  { kind: 'line', kode: '4101', nama: 'Pendapatan Rawat Inap', current: 2180000000, prev: 1980000000 },
  { kind: 'line', kode: '4102', nama: 'Pendapatan Rawat Jalan', current: 1420000000, prev: 1340000000 },
  { kind: 'line', kode: '4103', nama: 'Pendapatan IGD', current: 680000000, prev: 610000000 },
  { kind: 'line', kode: '4104', nama: 'Pendapatan Penunjang Medis', current: 240000000, prev: 220000000 },
  { kind: 'line', kode: '4105', nama: 'Pendapatan Farmasi', current: 380000000, prev: 360000000 },
  { kind: 'line', kode: '4106', nama: 'Pendapatan Lab & Radiologi', current: 540000000, prev: 480000000 },
  { kind: 'subtotal', label: 'Total Pendapatan', current: 5440000000, prev: 4990000000 },
  { kind: 'section', label: 'HARGA POKOK PELAYANAN' },
  { kind: 'line', kode: '5201', nama: 'Beban Obat & Alkes', current: -1180000000, prev: -1080000000 },
  { kind: 'line', kode: '5102', nama: 'Beban Jasa Medis', current: -820000000, prev: -760000000 },
  { kind: 'subtotal', label: 'Total HPP', current: -2000000000, prev: -1840000000 },
  { kind: 'gross', label: 'LABA KOTOR', current: 3440000000, prev: 3150000000 },
  { kind: 'section', label: 'BEBAN OPERASIONAL' },
  { kind: 'line', kode: '5101', nama: 'Beban Gaji & Tunjangan', current: -1620000000, prev: -1540000000 },
  { kind: 'line', kode: '5301', nama: 'Beban Listrik & Air', current: -118000000, prev: -112000000 },
  { kind: 'line', kode: '5302', nama: 'Beban Pemeliharaan', current: -68000000, prev: -54000000 },
  { kind: 'line', kode: '5303', nama: 'Beban Penyusutan', current: -210000000, prev: -210000000 },
  { kind: 'subtotal', label: 'Total Beban Operasional', current: -2016000000, prev: -1916000000 },
  { kind: 'net', label: 'LABA OPERASIONAL', current: 1424000000, prev: 1234000000 },
  { kind: 'section', label: 'PENDAPATAN / BEBAN LAIN' },
  { kind: 'line', kode: '6101', nama: 'Pendapatan Jasa Giro', current: 18400000, prev: 16800000 },
  { kind: 'line', kode: '6201', nama: 'Beban Administrasi Bank', current: -4200000, prev: -3900000 },
  { kind: 'subtotal', label: 'Net Pendapatan Lain', current: 14200000, prev: 12900000 },
  { kind: 'final', label: 'LABA BERSIH SEBELUM PAJAK', current: 1438200000, prev: 1246900000 },
]

const _TSM = ['2025-01','2025-02','2025-03','2025-04','2025-05','2025-06','2025-07','2025-08','2025-09','2025-10','2025-11']
function _mk(base: number, f: number[]): Record<string, number> {
  const r: Record<string, number> = {}
  _TSM.forEach((m, i) => { r[m] = Math.round(base * f[i] / 1e5) * 1e5 })
  return r
}

export const LABA_RUGI_TS: LabaRugiTsLine[] = [
  // Pendapatan
  { kode: '4101', nama: 'Pendapatan Rawat Inap',   group: 'pendapatan', months: _mk(2180000000, [0.94,0.91,0.96,0.98,0.88,0.92,0.97,0.98,0.96,0.98,1.00]) },
  { kode: '4102', nama: 'Pendapatan Rawat Jalan',  group: 'pendapatan', months: _mk(1420000000, [0.90,0.86,0.93,0.96,0.88,0.92,0.95,0.96,0.94,0.98,1.00]) },
  { kode: '4103', nama: 'Pendapatan IGD',          group: 'pendapatan', months: _mk(680000000,  [0.95,0.94,0.93,0.91,0.88,0.95,0.94,0.96,0.94,0.97,1.00]) },
  { kode: '4104', nama: 'Pendapatan Penunjang',    group: 'pendapatan', months: _mk(240000000,  [0.89,0.85,0.92,0.94,0.88,0.91,0.94,0.95,0.93,0.97,1.00]) },
  { kode: '4105', nama: 'Pendapatan Farmasi',      group: 'pendapatan', months: _mk(380000000,  [0.91,0.88,0.93,0.96,0.90,0.93,0.95,0.97,0.94,0.97,1.00]) },
  { kode: '4106', nama: 'Pendapatan Lab & Rad',    group: 'pendapatan', months: _mk(540000000,  [0.89,0.85,0.91,0.94,0.89,0.92,0.94,0.96,0.93,0.96,1.00]) },
  // HPP
  { kode: '5201', nama: 'Beban Obat & Alkes',      group: 'hpp',        months: _mk(-1180000000,[0.93,0.91,0.94,0.96,0.91,0.93,0.95,0.96,0.94,0.97,1.00]) },
  { kode: '5102', nama: 'Beban Jasa Medis',        group: 'hpp',        months: _mk(-820000000, [0.93,0.91,0.94,0.96,0.91,0.93,0.95,0.96,0.94,0.97,1.00]) },
  // Beban Operasional
  { kode: '5101', nama: 'Beban Gaji & Tunjangan',  group: 'beban_ops',  months: _mk(-1620000000,[1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00]) },
  { kode: '5301', nama: 'Beban Listrik & Air',     group: 'beban_ops',  months: _mk(-118000000, [0.98,0.96,0.97,0.97,0.97,1.02,1.01,1.02,0.98,0.98,1.00]) },
  { kode: '5302', nama: 'Beban Pemeliharaan',      group: 'beban_ops',  months: _mk(-68000000,  [1.10,0.85,1.20,0.85,0.85,1.15,0.85,0.85,1.10,0.85,1.00]) },
  { kode: '5303', nama: 'Beban Penyusutan',        group: 'beban_ops',  months: _mk(-210000000, [1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00]) },
  // Lain
  { kode: '6101', nama: 'Pendapatan Jasa Giro',    group: 'lain',       months: _mk(18400000,   [0.95,0.92,0.96,0.97,0.94,0.96,0.97,0.98,0.96,0.98,1.00]) },
  { kode: '6201', nama: 'Beban Administrasi Bank', group: 'lain',       months: _mk(-4200000,   [0.97,0.95,0.97,0.97,0.96,0.98,0.97,0.98,0.97,0.98,1.00]) },
]

export const BUKU_BESAR_BPJS: BukuBesarData = {
  akun: '1202 — Piutang BPJS Kesehatan',
  saldoAwal: 2480300000,
  rows: [
    { tgl: '2025-11-02', jurnal: 'JV-2025-11-0018', desc: 'Klaim BPJS batch Oktober W5', debit: 285400000, kredit: 0 },
    { tgl: '2025-11-05', jurnal: 'JV-2025-11-0042', desc: 'Pelunasan klaim BPJS Sep W3', debit: 0, kredit: 192800000 },
    { tgl: '2025-11-08', jurnal: 'JV-2025-11-0071', desc: 'Klaim BPJS batch November W1', debit: 218450000, kredit: 0 },
    { tgl: '2025-11-12', jurnal: 'JV-2025-11-0098', desc: 'Pelunasan klaim BPJS Sep W4', debit: 0, kredit: 174200000 },
    { tgl: '2025-11-15', jurnal: 'JV-2025-11-0124', desc: 'Klaim BPJS batch November W2', debit: 218450000, kredit: 0 },
    { tgl: '2025-11-19', jurnal: 'JV-2025-11-0168', desc: 'Pelunasan klaim BPJS Okt W1', debit: 0, kredit: 165800000 },
    { tgl: '2025-11-22', jurnal: 'JV-2025-11-0198', desc: 'Klaim BPJS batch November W3', debit: 245680000, kredit: 0 },
    { tgl: '2025-11-26', jurnal: 'JV-2025-11-0240', desc: 'Klaim BPJS batch November W4', debit: 312500000, kredit: 0 },
  ],
}

export const TRIAL_BALANCE: TrialBalanceRow[] = [
  { kode: '1101', nama: 'Kas Besar', awalD: 180000000, awalK: 0, mutD: 1240000000, mutK: 1085440000, akhirD: 334560000, akhirK: 0, tipe: 'Aset' },
  { kode: '1102', nama: 'Kas Kecil — IGD', awalD: 12000000, awalK: 0, mutD: 25000000, mutK: 22000000, akhirD: 15000000, akhirK: 0, tipe: 'Aset' },
  { kode: '1103', nama: 'Kas Kecil — Rawat Jalan', awalD: 8000000, awalK: 0, mutD: 18000000, mutK: 16000000, akhirD: 10000000, akhirK: 0, tipe: 'Aset' },
  { kode: '1111', nama: 'Bank Mandiri — Operasional', awalD: 3420000000, awalK: 0, mutD: 4180000000, mutK: 3680000000, akhirD: 3920000000, akhirK: 0, tipe: 'Aset' },
  { kode: '1112', nama: 'Bank BNI Syariah — Penerimaan', awalD: 2840000000, awalK: 0, mutD: 1620000000, mutK: 1180000000, akhirD: 3280000000, akhirK: 0, tipe: 'Aset' },
  { kode: '1113', nama: 'Bank BSI — Payroll', awalD: 1820000000, awalK: 0, mutD: 240000000, mutK: 718000000, akhirD: 1342000000, akhirK: 0, tipe: 'Aset' },
  { kode: '1201', nama: 'Piutang Pasien Umum', awalD: 482400000, awalK: 0, mutD: 218600000, mutK: 196800000, akhirD: 504200000, akhirK: 0, tipe: 'Aset' },
  { kode: '1202', nama: 'Piutang BPJS Kesehatan', awalD: 2480300000, awalK: 0, mutD: 1280480000, mutK: 532800000, akhirD: 3227980000, akhirK: 0, tipe: 'Aset' },
  { kode: '1203', nama: 'Piutang Asuransi Swasta', awalD: 412800000, awalK: 0, mutD: 186200000, mutK: 112780000, akhirD: 486220000, akhirK: 0, tipe: 'Aset' },
  { kode: '1301', nama: 'Persediaan Farmasi', awalD: 824000000, awalK: 0, mutD: 412000000, mutK: 380000000, akhirD: 856000000, akhirK: 0, tipe: 'Aset' },
  { kode: '1503', nama: 'Peralatan Medis (net)', awalD: 8420000000, awalK: 0, mutD: 0, mutK: 42180000, akhirD: 8377820000, akhirK: 0, tipe: 'Aset' },
  { kode: '2101', nama: 'Utang Usaha — Farmasi', awalD: 0, awalK: 380000000, mutD: 268700000, mutK: 412800000, akhirD: 0, akhirK: 524100000, tipe: 'Kewajiban' },
  { kode: '2102', nama: 'Utang Usaha — Umum', awalD: 0, awalK: 142800000, mutD: 86400000, mutK: 94800000, akhirD: 0, akhirK: 151200000, tipe: 'Kewajiban' },
  { kode: '2201', nama: 'Utang Gaji', awalD: 0, awalK: 0, mutD: 1620000000, mutK: 1620000000, akhirD: 0, akhirK: 0, tipe: 'Kewajiban' },
  { kode: '2202', nama: 'Utang PPh 21', awalD: 0, awalK: 84200000, mutD: 84200000, mutK: 88400000, akhirD: 0, akhirK: 88400000, tipe: 'Kewajiban' },
  { kode: '3101', nama: 'Modal Yayasan', awalD: 0, awalK: 12000000000, mutD: 0, mutK: 0, akhirD: 0, akhirK: 12000000000, tipe: 'Ekuitas' },
  { kode: '3201', nama: 'Saldo Laba Ditahan', awalD: 0, awalK: 8420000000, mutD: 0, mutK: 0, akhirD: 0, akhirK: 8420000000, tipe: 'Ekuitas' },
  { kode: '4101', nama: 'Pendapatan Rawat Inap', awalD: 0, awalK: 0, mutD: 0, mutK: 2180000000, akhirD: 0, akhirK: 2180000000, tipe: 'Pendapatan' },
  { kode: '4102', nama: 'Pendapatan Rawat Jalan', awalD: 0, awalK: 0, mutD: 0, mutK: 1420000000, akhirD: 0, akhirK: 1420000000, tipe: 'Pendapatan' },
  { kode: '4103', nama: 'Pendapatan IGD', awalD: 0, awalK: 0, mutD: 0, mutK: 680000000, akhirD: 0, akhirK: 680000000, tipe: 'Pendapatan' },
  { kode: '4105', nama: 'Pendapatan Farmasi', awalD: 0, awalK: 0, mutD: 0, mutK: 380000000, akhirD: 0, akhirK: 380000000, tipe: 'Pendapatan' },
  { kode: '4106', nama: 'Pendapatan Lab & Radiologi', awalD: 0, awalK: 0, mutD: 0, mutK: 540000000, akhirD: 0, akhirK: 540000000, tipe: 'Pendapatan' },
  { kode: '5101', nama: 'Beban Gaji & Tunjangan', awalD: 0, awalK: 0, mutD: 1620000000, mutK: 0, akhirD: 1620000000, akhirK: 0, tipe: 'Beban' },
  { kode: '5102', nama: 'Beban Jasa Medis', awalD: 0, awalK: 0, mutD: 820000000, mutK: 0, akhirD: 820000000, akhirK: 0, tipe: 'Beban' },
  { kode: '5201', nama: 'Beban Obat & Alkes', awalD: 0, awalK: 0, mutD: 1180000000, mutK: 0, akhirD: 1180000000, akhirK: 0, tipe: 'Beban' },
  { kode: '5301', nama: 'Beban Listrik & Air', awalD: 0, awalK: 0, mutD: 118000000, mutK: 0, akhirD: 118000000, akhirK: 0, tipe: 'Beban' },
  { kode: '5302', nama: 'Beban Pemeliharaan', awalD: 0, awalK: 0, mutD: 68000000, mutK: 0, akhirD: 68000000, akhirK: 0, tipe: 'Beban' },
  { kode: '5303', nama: 'Beban Penyusutan', awalD: 0, awalK: 0, mutD: 210000000, mutK: 0, akhirD: 210000000, akhirK: 0, tipe: 'Beban' },
]

export const PIUTANG: PiutangItem[] = [
  { inv: 'INV/RI/2025/10/0218', tgl: '2025-10-28', payer: 'BPJS Kesehatan', payerType: 'bpjs', pasien: 'Batch Oktober W3 (218 pasien)', episode: 'Rawat Inap', tagihan: 187500000, bayar: 0, outstanding: 187500000, aging: 29, status: 'open' },
  { inv: 'INV/RJ/2025/10/0741', tgl: '2025-10-30', payer: 'PT Asuransi Astra Buana', payerType: 'asuransi', pasien: 'MCU karyawan Astra', episode: 'Rawat Jalan', tagihan: 42180000, bayar: 0, outstanding: 42180000, aging: 27, status: 'open' },
  { inv: 'INV/RI/2025/11/0102', tgl: '2025-11-08', payer: 'Hartono Susanto', payerType: 'umum', pasien: 'Hartono Susanto', episode: 'Rawat Inap (5 hari)', tagihan: 22500000, bayar: 10000000, outstanding: 12500000, aging: 18, status: 'partial' },
  { inv: 'INV/RJ/2025/11/0214', tgl: '2025-11-12', payer: 'BPJS Kesehatan', payerType: 'bpjs', pasien: 'Batch November W2 (184 pasien)', episode: 'Rawat Jalan', tagihan: 218450000, bayar: 0, outstanding: 218450000, aging: 14, status: 'open' },
  { inv: 'INV/RI/2025/11/0186', tgl: '2025-11-14', payer: 'Mandiri Inhealth', payerType: 'asuransi', pasien: 'Batch Oktober 2', episode: 'Rawat Inap', tagihan: 78450000, bayar: 0, outstanding: 78450000, aging: 12, status: 'open' },
  { inv: 'INV/RI/2025/11/0220', tgl: '2025-11-16', payer: 'Siti Rahmawati', payerType: 'umum', pasien: 'Siti Rahmawati', episode: 'Rawat Inap (3 hari)', tagihan: 8450000, bayar: 8450000, outstanding: 0, aging: 10, status: 'paid' },
  { inv: 'INV/RI/2025/11/0245', tgl: '2025-11-18', payer: 'BPJS Kesehatan', payerType: 'bpjs', pasien: 'Batch November W3', episode: 'Rawat Inap', tagihan: 245680000, bayar: 0, outstanding: 245680000, aging: 8, status: 'open' },
  { inv: 'INV/RJ/2025/11/0298', tgl: '2025-11-20', payer: 'Allianz Life Indonesia', payerType: 'asuransi', pasien: 'Ahmad Fauzi', episode: 'Rawat Jalan', tagihan: 12800000, bayar: 0, outstanding: 12800000, aging: 6, status: 'open' },
  { inv: 'INV/RJ/2025/11/0312', tgl: '2025-11-22', payer: 'Budi Santoso', payerType: 'umum', pasien: 'Budi Santoso', episode: 'Konsultasi + Lab', tagihan: 3850000, bayar: 0, outstanding: 3850000, aging: 4, status: 'open' },
  { inv: 'INV/RI/2025/11/0288', tgl: '2025-11-23', payer: 'BPJS Kesehatan', payerType: 'bpjs', pasien: 'Batch November W4 partial', episode: 'Rawat Inap', tagihan: 312500000, bayar: 0, outstanding: 312500000, aging: 3, status: 'open' },
  { inv: 'INV/RJ/2025/11/0334', tgl: '2025-11-24', payer: 'Prudential', payerType: 'asuransi', pasien: 'Maria Wijaya', episode: 'MCU lengkap', tagihan: 18400000, bayar: 0, outstanding: 18400000, aging: 2, status: 'open' },
  { inv: 'INV/RI/2025/11/0301', tgl: '2025-11-25', payer: 'Hj. Aminah', payerType: 'umum', pasien: 'Hj. Aminah', episode: 'Rawat Inap (2 hari)', tagihan: 6280000, bayar: 0, outstanding: 6280000, aging: 1, status: 'open' },
]

export const NERACA: NeracaData = {
  aset: [
    { section: 'Aset Lancar', items: [
      { kode: '1101-1103', nama: 'Kas', current: 359560000, prev: 200000000 },
      { kode: '1111-1113', nama: 'Bank', current: 8542000000, prev: 8080000000 },
      { kode: '1201', nama: 'Piutang Pasien Umum', current: 504200000, prev: 482400000 },
      { kode: '1202', nama: 'Piutang BPJS Kesehatan', current: 3227980000, prev: 2480300000 },
      { kode: '1203', nama: 'Piutang Asuransi Swasta', current: 486220000, prev: 412800000 },
      { kode: '1301', nama: 'Persediaan Farmasi', current: 856000000, prev: 824000000 },
      { kode: '1302', nama: 'Persediaan Alkes', current: 218400000, prev: 196800000 },
    ]},
    { section: 'Aset Tidak Lancar', items: [
      { kode: '1501', nama: 'Tanah', current: 18400000000, prev: 18400000000 },
      { kode: '1502', nama: 'Bangunan (net)', current: 32800000000, prev: 33240000000 },
      { kode: '1503', nama: 'Peralatan Medis (net)', current: 8377820000, prev: 8420000000 },
    ]},
  ],
  kewajiban: [
    { section: 'Kewajiban Lancar', items: [
      { kode: '2101', nama: 'Utang Usaha Farmasi', current: 524100000, prev: 380000000 },
      { kode: '2102', nama: 'Utang Usaha Umum', current: 151200000, prev: 142800000 },
      { kode: '2202', nama: 'Utang PPh 21', current: 88400000, prev: 84200000 },
      { kode: '2203', nama: 'Utang PPh 23', current: 18600000, prev: 17400000 },
    ]},
    { section: 'Kewajiban Jangka Panjang', items: [
      { kode: '2301', nama: 'Utang Bank Jangka Panjang', current: 4200000000, prev: 4350000000 },
    ]},
  ],
  ekuitas: [
    { section: 'Ekuitas', items: [
      { kode: '3101', nama: 'Modal Yayasan', current: 12000000000, prev: 12000000000 },
      { kode: '3201', nama: 'Saldo Laba Ditahan', current: 8420000000, prev: 7180000000 },
      { kode: '3202', nama: 'Laba Periode Berjalan', current: 28570280000, prev: 26266100000 },
    ]},
  ],
}

export const COA_TREE: Account[] = [
  { kode: '1', nama: 'ASET', tipe: 'Aset', saldoNormal: 'D', aktif: true, children: [
    { kode: '11', nama: 'Aset Lancar', tipe: 'Aset', saldoNormal: 'D', aktif: true, children: [
      { kode: '1101', nama: 'Kas Besar', tipe: 'Aset', saldoNormal: 'D', aktif: true, saldo: 334560000 },
      { kode: '1102', nama: 'Kas Kecil — IGD', tipe: 'Aset', saldoNormal: 'D', aktif: true, saldo: 15000000 },
      { kode: '1103', nama: 'Kas Kecil — Rawat Jalan', tipe: 'Aset', saldoNormal: 'D', aktif: true, saldo: 10000000 },
      { kode: '111', nama: 'Bank', tipe: 'Aset', saldoNormal: 'D', aktif: true, children: [
        { kode: '1111', nama: 'Bank Mandiri — Operasional', tipe: 'Aset', saldoNormal: 'D', aktif: true, saldo: 3920000000 },
        { kode: '1112', nama: 'Bank BNI Syariah — Penerimaan', tipe: 'Aset', saldoNormal: 'D', aktif: true, saldo: 3280000000 },
        { kode: '1113', nama: 'Bank BSI — Payroll', tipe: 'Aset', saldoNormal: 'D', aktif: true, saldo: 1342000000 },
      ]},
      { kode: '120', nama: 'Piutang', tipe: 'Aset', saldoNormal: 'D', aktif: true, children: [
        { kode: '1201', nama: 'Piutang Pasien Umum', tipe: 'Aset', saldoNormal: 'D', aktif: true, saldo: 504200000 },
        { kode: '1202', nama: 'Piutang BPJS Kesehatan', tipe: 'Aset', saldoNormal: 'D', aktif: true, saldo: 3227980000 },
        { kode: '1203', nama: 'Piutang Asuransi Swasta', tipe: 'Aset', saldoNormal: 'D', aktif: true, saldo: 486220000 },
      ]},
      { kode: '130', nama: 'Persediaan', tipe: 'Aset', saldoNormal: 'D', aktif: true, children: [
        { kode: '1301', nama: 'Persediaan Farmasi', tipe: 'Aset', saldoNormal: 'D', aktif: true, saldo: 856000000 },
        { kode: '1302', nama: 'Persediaan Alat Kesehatan', tipe: 'Aset', saldoNormal: 'D', aktif: true, saldo: 218400000 },
      ]},
    ]},
    { kode: '15', nama: 'Aset Tidak Lancar', tipe: 'Aset', saldoNormal: 'D', aktif: true, children: [
      { kode: '1501', nama: 'Tanah', tipe: 'Aset', saldoNormal: 'D', aktif: true, saldo: 18400000000 },
      { kode: '1502', nama: 'Bangunan', tipe: 'Aset', saldoNormal: 'D', aktif: true, saldo: 32800000000 },
      { kode: '1503', nama: 'Peralatan Medis', tipe: 'Aset', saldoNormal: 'D', aktif: true, saldo: 8377820000 },
    ]},
  ]},
  { kode: '2', nama: 'KEWAJIBAN', tipe: 'Kewajiban', saldoNormal: 'K', aktif: true, children: [
    { kode: '21', nama: 'Kewajiban Lancar', tipe: 'Kewajiban', saldoNormal: 'K', aktif: true, children: [
      { kode: '2101', nama: 'Utang Usaha — Vendor Farmasi', tipe: 'Kewajiban', saldoNormal: 'K', aktif: true, saldo: 524100000 },
      { kode: '2102', nama: 'Utang Usaha — Vendor Umum', tipe: 'Kewajiban', saldoNormal: 'K', aktif: true, saldo: 151200000 },
      { kode: '2201', nama: 'Utang Gaji', tipe: 'Kewajiban', saldoNormal: 'K', aktif: true, saldo: 0 },
      { kode: '2202', nama: 'Utang PPh 21', tipe: 'Kewajiban', saldoNormal: 'K', aktif: true, saldo: 88400000 },
      { kode: '2203', nama: 'Utang PPh 23', tipe: 'Kewajiban', saldoNormal: 'K', aktif: true, saldo: 18600000 },
    ]},
  ]},
  { kode: '3', nama: 'EKUITAS', tipe: 'Ekuitas', saldoNormal: 'K', aktif: true, children: [
    { kode: '3101', nama: 'Modal Yayasan', tipe: 'Ekuitas', saldoNormal: 'K', aktif: true, saldo: 12000000000 },
    { kode: '3201', nama: 'Saldo Laba Ditahan', tipe: 'Ekuitas', saldoNormal: 'K', aktif: true, saldo: 8420000000 },
  ]},
  { kode: '4', nama: 'PENDAPATAN', tipe: 'Pendapatan', saldoNormal: 'K', aktif: true, children: [
    { kode: '4101', nama: 'Pendapatan Rawat Inap', tipe: 'Pendapatan', saldoNormal: 'K', aktif: true, saldo: 2180000000 },
    { kode: '4102', nama: 'Pendapatan Rawat Jalan', tipe: 'Pendapatan', saldoNormal: 'K', aktif: true, saldo: 1420000000 },
    { kode: '4103', nama: 'Pendapatan IGD', tipe: 'Pendapatan', saldoNormal: 'K', aktif: true, saldo: 680000000 },
    { kode: '4104', nama: 'Pendapatan Penunjang Medis', tipe: 'Pendapatan', saldoNormal: 'K', aktif: true, saldo: 240000000 },
    { kode: '4105', nama: 'Pendapatan Farmasi', tipe: 'Pendapatan', saldoNormal: 'K', aktif: true, saldo: 380000000 },
    { kode: '4106', nama: 'Pendapatan Lab & Radiologi', tipe: 'Pendapatan', saldoNormal: 'K', aktif: true, saldo: 540000000 },
  ]},
  { kode: '5', nama: 'BEBAN', tipe: 'Beban', saldoNormal: 'D', aktif: true, children: [
    { kode: '51', nama: 'Beban Tenaga Kerja', tipe: 'Beban', saldoNormal: 'D', aktif: true, children: [
      { kode: '5101', nama: 'Beban Gaji & Tunjangan', tipe: 'Beban', saldoNormal: 'D', aktif: true, saldo: 1620000000 },
      { kode: '5102', nama: 'Beban Jasa Medis', tipe: 'Beban', saldoNormal: 'D', aktif: true, saldo: 820000000 },
    ]},
    { kode: '52', nama: 'Beban Operasional Medis', tipe: 'Beban', saldoNormal: 'D', aktif: true, children: [
      { kode: '5201', nama: 'Beban Obat & Alkes', tipe: 'Beban', saldoNormal: 'D', aktif: true, saldo: 1180000000 },
    ]},
    { kode: '53', nama: 'Beban Umum', tipe: 'Beban', saldoNormal: 'D', aktif: true, children: [
      { kode: '5301', nama: 'Beban Listrik & Air', tipe: 'Beban', saldoNormal: 'D', aktif: true, saldo: 118000000 },
      { kode: '5302', nama: 'Beban Pemeliharaan', tipe: 'Beban', saldoNormal: 'D', aktif: true, saldo: 68000000 },
      { kode: '5303', nama: 'Beban Penyusutan', tipe: 'Beban', saldoNormal: 'D', aktif: true, saldo: 210000000 },
    ]},
  ]},
]
