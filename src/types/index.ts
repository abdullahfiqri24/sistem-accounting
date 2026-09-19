export type JournalStatus = 'draft' | 'posted' | 'pending' | 'void' | 'approved'
export type PiutangStatus = 'open' | 'partial' | 'paid'
export type PayerType = 'umum' | 'bpjs' | 'asuransi'
export type AkunTipe = 'Aset' | 'Kewajiban' | 'Ekuitas' | 'Pendapatan' | 'Beban'
export type SaldoNormal = 'D' | 'K'

export interface User {
  name: string
  role: string
  username: string
}

export interface Account {
  kode: string
  nama: string
  tipe: AkunTipe
  saldoNormal: SaldoNormal
  aktif?: boolean
  saldo?: number
  children?: Account[]
}

export interface CostCenter {
  kode: string
  nama: string
}

export interface JournalLine {
  akun: string
  desc: string
  cc: string
  debit: number
  kredit: number
}

export interface Journal {
  id: string
  tgl: string
  desc: string
  akun: string
  debit: number
  kredit: number
  cc: string
  status: JournalStatus
  createdBy: string
  ref: string
  lines?: JournalLine[]
}

export interface DashboardKpi {
  kas: { value: number; delta: number; sub: string }
  bank: { value: number; delta: number; sub: string }
  piutang: { value: number; delta: number; sub: string }
  utang: { value: number; delta: number; sub: string }
}

export interface PiutangJatuhTempo {
  inv: string
  payer: string
  pasien: string
  due: string
  aging: number
  amount: number
}

export interface UtangJatuhTempo {
  id: string
  vendor: string
  due: string
  aging: number
  amount: number
}

export interface PendingApproval {
  id: string
  desc: string
  amount: number
  by: string
  waktu: string
}

export interface RevenueTrend {
  bulan: string
  value: number
}

export interface PendapatanUnit {
  unit: string
  value: number
  color: string
}

export interface LabaRugiRow {
  kind: 'section' | 'line' | 'subtotal' | 'gross' | 'net' | 'final'
  label?: string
  kode?: string
  nama?: string
  current?: number
  prev?: number
}

export interface BukuBesarRow {
  tgl: string
  jurnal: string
  desc: string
  debit: number
  kredit: number
  saldo?: number
}

export interface BukuBesarData {
  akun: string
  saldoAwal: number
  rows: BukuBesarRow[]
}

export interface TrialBalanceRow {
  kode: string
  nama: string
  tipe: AkunTipe
  awalD: number
  awalK: number
  mutD: number
  mutK: number
  akhirD: number
  akhirK: number
}

export interface PiutangItem {
  inv: string
  tgl: string
  payer: string
  payerType: PayerType
  pasien: string
  episode: string
  tagihan: number
  bayar: number
  outstanding: number
  aging: number
  status: PiutangStatus
}

export interface NeracaItem {
  kode: string
  nama: string
  current: number
  prev: number
}

export interface NeracaSection {
  section: string
  items: NeracaItem[]
}

export interface NeracaData {
  aset: NeracaSection[]
  kewajiban: NeracaSection[]
  ekuitas: NeracaSection[]
}

export interface LabaRugiTsLine {
  kode: string
  nama: string
  group: 'pendapatan' | 'hpp' | 'beban_ops' | 'lain'
  months: Record<string, number>
}

export interface CoaNode {
  kode: string
  nama: string
  tipe?: string
  saldoNormal?: 'D' | 'K'
  saldo?: number
  aktif?: boolean
  children?: CoaNode[]
}
