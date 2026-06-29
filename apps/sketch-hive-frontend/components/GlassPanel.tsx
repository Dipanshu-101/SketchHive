import { ReactNode } from 'react'
export default function GlassPanel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background:           'rgba(255,255,255,0.07)',
      backdropFilter:       'blur(32px) saturate(160%)',
      WebkitBackdropFilter: 'blur(32px) saturate(160%)',
      borderRadius:         '22px',
      border:               '1px solid rgba(255,255,255,0.22)',
      boxShadow: `
        0 0 0 1px rgba(255,255,255,0.04),
        0 2px 0 0 rgba(255,255,255,0.18) inset,
        0 -1px 0 0 rgba(255,255,255,0.06) inset,
        0 24px 64px rgba(0,0,0,0.75),
        0 4px 16px rgba(0,0,0,0.5)
      `,
      padding: '48px 44px 44px',
    }}>
      {children}
    </div>
  )
}