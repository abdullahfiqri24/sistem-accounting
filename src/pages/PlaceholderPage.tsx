import { Icon } from '@/components/ui/Icon'

const PAGE_LABELS: Record<string, { title: string; desc: string; icon: string }> = {
  'kas-masuk':    { title: 'Kas Masuk', desc: 'Daftar transaksi penerimaan kas dan bank', icon: 'plus' },
  'kas-keluar':   { title: 'Kas Keluar', desc: 'Daftar transaksi pengeluaran kas dan bank', icon: 'plus' },
  'utang':        { title: 'Utang Usaha (AP)', desc: 'Daftar hutang dan jadwal pembayaran', icon: 'inbox' },
  'piutang-umum': { title: 'Piutang Pasien Umum', desc: 'AR segmen pasien umum (non BPJS)', icon: 'users' },
  'piutang-bpjs': { title: 'Piutang BPJS', desc: 'AR segmen peserta BPJS Kesehatan', icon: 'users' },
  'piutang-asuransi': { title: 'Piutang Asuransi', desc: 'AR segmen asuransi swasta', icon: 'users' },
  'arus-kas':     { title: 'Laporan Arus Kas', desc: 'Cash flow statement PSAK', icon: 'chart' },
  'lap-pendapatan': { title: 'Laporan Pendapatan per Unit', desc: 'Revenue breakdown by cost center', icon: 'chart' },
  'aging-ar':     { title: 'Aging Piutang', desc: 'Analisis umur piutang berdasarkan bucket', icon: 'clock' },
  'aging-ap':     { title: 'Aging Utang', desc: 'Analisis umur hutang berdasarkan bucket', icon: 'clock' },
  'cost-center':  { title: 'Cost Center', desc: 'Master data pusat biaya dan unit organisasi', icon: 'database' },
  'vendor':       { title: 'Vendor', desc: 'Master data pemasok dan mitra bisnis', icon: 'users' },
  'customer':     { title: 'Customer / Pasien', desc: 'Master data pasien dan pelanggan', icon: 'users' },
  'payer':        { title: 'Payer (BPJS/Asuransi)', desc: 'Master data penjamin dan penanggung biaya', icon: 'users' },
  'periode':      { title: 'Periode Akuntansi', desc: 'Manajemen buka/tutup periode akuntansi', icon: 'calendar' },
  'user-role':    { title: 'User & Role', desc: 'Manajemen pengguna dan hak akses', icon: 'user' },
  'approval':     { title: 'Approval Workflow', desc: 'Konfigurasi alur persetujuan jurnal', icon: 'check' },
  'integrasi':    { title: 'Integrasi SIMRS', desc: 'Konfigurasi sinkronisasi data dari SIMRS', icon: 'refresh' },
}

interface PlaceholderPageProps {
  pageId: string
}

export default function PlaceholderPage({ pageId }: PlaceholderPageProps) {
  const info = PAGE_LABELS[pageId] || { title: pageId, desc: 'Halaman ini sedang dalam pengembangan', icon: 'settings' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>{info.title}</h1>
        <p style={{ margin: '3px 0 0', fontSize: 12.5, color: 'var(--fg-tertiary)' }}>{info.desc}</p>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 12,
            background: 'rgba(91,2,2,0.08)', color: 'var(--brand-maroon)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Icon name={info.icon} size={24}/>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{info.title}</div>
          <div style={{ fontSize: 13, color: 'var(--fg-tertiary)', lineHeight: 1.6, marginBottom: 20 }}>
            {info.desc}. Halaman ini sedang dalam pengembangan dan akan tersedia segera.
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11.5, color: 'var(--fg-tertiary)' }}>
            <span className="dot" style={{ background: 'var(--status-pending)' }}></span>
            Dalam Pengembangan
          </div>
        </div>
      </div>
    </div>
  )
}
