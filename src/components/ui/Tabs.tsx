interface Tab { value: string; label: string; count?: number }

interface TabsProps {
  tabs: Tab[]
  value: string
  onChange: (v: string) => void
}

export function Tabs({ tabs, value, onChange }: TabsProps) {
  return (
    <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 0 }}>
      {tabs.map((t) => {
        const active = t.value === value
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            style={{
              background: 'transparent', border: 'none',
              borderBottom: active ? '2px solid var(--brand-maroon)' : '2px solid transparent',
              color: active ? 'var(--fg)' : 'var(--fg-tertiary)',
              fontWeight: active ? 600 : 500,
              fontSize: 13, padding: '8px 12px',
              cursor: 'pointer', marginBottom: '-1px',
            }}
          >
            {t.label}
            {t.count !== undefined && (
              <span className="num" style={{ marginLeft: 6, fontSize: 11, color: 'var(--fg-quaternary)' }}>
                {t.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
