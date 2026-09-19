import type { JournalStatus } from '@/types'

const statusMap: Record<string, { cls: string; label: string }> = {
  draft:    { cls: 'badge-draft',    label: 'Draft' },
  posted:   { cls: 'badge-posted',   label: 'Posted' },
  approved: { cls: 'badge-approved', label: 'Approved' },
  pending:  { cls: 'badge-pending',  label: 'Pending' },
  void:     { cls: 'badge-void',     label: 'Void' },
  open:     { cls: 'badge-open',     label: 'Open' },
}

export function StatusBadge({ status }: { status: JournalStatus | string }) {
  const m = statusMap[status] ?? statusMap['draft']
  return <span className={`badge ${m.cls}`}>{m.label}</span>
}
