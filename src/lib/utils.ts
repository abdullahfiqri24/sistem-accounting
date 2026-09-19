import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fmtIDR(n: number | null | undefined, opts: { withSymbol?: boolean; decimals?: number } = {}): string {
  const { withSymbol = true, decimals = 2 } = opts
  if (n === null || n === undefined || isNaN(n)) return '—'
  const abs = Math.abs(n)
  const sign = n < 0 ? '(' : ''
  const close = n < 0 ? ')' : ''
  const formatted = abs.toLocaleString('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  return `${sign}${withSymbol ? 'Rp ' : ''}${formatted}${close}`
}

export function fmtIDRShort(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—'
  const abs = Math.abs(n)
  if (abs >= 1e9) return `Rp ${(n / 1e9).toFixed(2)} M`
  if (abs >= 1e6) return `Rp ${(n / 1e6).toFixed(1)} Jt`
  if (abs >= 1e3) return `Rp ${(n / 1e3).toFixed(0)} Rb`
  return `Rp ${n}`
}

export function fmtDate(d: string | Date): string {
  const date = typeof d === 'string' ? new Date(d) : d
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
  return `${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`
}

export function parseAmount(str: string): number {
  if (!str) return 0
  try {
    const cleaned = String(str).replace(/[^\d+\-*/.()]/g, '')
    if (!cleaned) return 0
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${cleaned})`)() as number
    return isFinite(result) ? result : 0
  } catch { return 0 }
}

export function pctChange(cur: number, prev: number): number | null {
  if (!prev || prev === 0) return null
  return ((cur - prev) / Math.abs(prev)) * 100
}
