'use client'
import { useEffect, useRef } from 'react'

interface Trail { x: number; y: number; t: number }
interface Pulse { x: number; y: number; t: number }

export default function WaterRippleBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const mouse     = useRef({ x: -999, y: -999, active: false })
  const trail     = useRef<Trail[]>([])
  const pulses    = useRef<Pulse[]>([])

  useEffect(() => {
    const canvas = canvasRef.current!
    const wrap   = wrapRef.current!
    const ctx    = canvas.getContext('2d')!
    let W = 0, H = 0, raf = 0

    const resize = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY, active: true }
      trail.current.push({ x: e.clientX, y: e.clientY, t: performance.now() })
      if (trail.current.length > 80) trail.current.shift()
    }

    const onLeave = () => {
      mouse.current.active = false
      trail.current = []
    }

    const onClick = (e: MouseEvent) => {
      pulses.current.push({ x: e.clientX, y: e.clientY, t: performance.now() / 1000 })
    }

    const draw = () => {
      raf = requestAnimationFrame(draw)
      const now = performance.now() / 1000
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, W, H)

      const { x: mx, y: my, active } = mouse.current

      if (active && trail.current.length > 1) {
        // Soft glow blobs along trail
        for (let i = 1; i < trail.current.length; i++) {
          const q    = trail.current[i]
          const age  = (performance.now() - q.t) / 1000
          const alpha = Math.max(0, 1 - age / 0.6)
          const t    = i / trail.current.length
          const r    = 6 + t * 18

          const grd = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, r * 3.5)
          grd.addColorStop(0, `rgba(0,150,255,${alpha * 0.55})`)
          grd.addColorStop(0.35, `rgba(0,80,220,${alpha * 0.18})`)
          grd.addColorStop(1, 'rgba(0,20,80,0)')
          ctx.beginPath()
          ctx.arc(q.x, q.y, r * 3.5, 0, Math.PI * 2)
          ctx.fillStyle = grd
          ctx.fill()
        }

        // Bright core dots with wobble
        for (let i = 1; i < trail.current.length; i++) {
          const q    = trail.current[i]
          const age  = (performance.now() - q.t) / 1000
          const alpha = Math.max(0, 1 - age / 0.35)
          const t    = i / trail.current.length
          const wobble = Math.sin(now * 4 + i * 0.3) * 2

          ctx.beginPath()
          ctx.arc(q.x + wobble, q.y + wobble * 0.5, 1.5 + t * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(120,200,255,${alpha * 0.9})`
          ctx.fill()
        }

        // Animated cursor rings
        for (let r = 0; r < 3; r++) {
          const phase = now * 2.5 + r * (Math.PI * 2 / 3)
          const rad   = 18 + Math.sin(phase) * 6 + r * 10
          const a     = 0.12 + Math.sin(phase + r) * 0.08
          ctx.beginPath()
          ctx.arc(mx, my, rad, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(80,180,255,${a})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      // Click pulse rings
      for (const p of pulses.current) {
        const age  = now - p.t
        if (age > 1.8) continue
        const maxR = Math.min(W, H) * 0.45
        for (let w = 0; w < 4; w++) {
          const wf = Math.max(0, (age / 1.8) - 0.07 * w)
          const r  = wf * maxR
          const a  = Math.max(0, (1 - wf) * (0.28 - w * 0.06))
          ctx.beginPath()
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(0,140,255,${a})`
          ctx.lineWidth = 1.5 - w * 0.3
          ctx.stroke()
        }
        if (age < 0.3) {
          const flash = 1 - age / 0.3
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 60 * flash)
          grd.addColorStop(0, `rgba(0,180,255,${flash * 0.4})`)
          grd.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.fillStyle = grd
          ctx.fillRect(0, 0, W, H)
        }
      }

      pulses.current = pulses.current.filter(p => now - p.t < 1.8)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    resize()
    draw()

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <div ref={wrapRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}