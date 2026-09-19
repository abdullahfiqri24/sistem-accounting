import React, { createContext, useContext, useState, useCallback } from 'react'

type ToastKind = 'info' | 'success' | 'error'
interface ToastItem { id: string; msg: string; kind: ToastKind }
interface ToastCtx { push: (msg: string, kind?: ToastKind) => void }

const ToastContext = createContext<ToastCtx>({ push: () => {} })

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const push = useCallback((msg: string, kind: ToastKind = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, msg, kind }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500)
  }, [])

  const borderColor = (kind: ToastKind) => {
    if (kind === 'error') return 'var(--negative)'
    if (kind === 'success') return 'var(--positive)'
    return 'var(--brand-maroon)'
  }

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 100, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
        {toasts.map((t) => (
          <div key={t.id} className="anim-fadein card" style={{
            borderLeft: `3px solid ${borderColor(t.kind)}`,
            padding: '10px 14px',
            fontSize: 12.5,
            minWidth: 260, maxWidth: 380,
            color: 'var(--fg)',
            boxShadow: '0 6px 24px rgba(0,0,0,0.10)',
            pointerEvents: 'auto',
          }}>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
