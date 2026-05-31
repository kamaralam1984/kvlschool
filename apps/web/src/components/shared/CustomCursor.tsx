'use client'

import React, { useEffect, useRef } from 'react'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const isMobile = window.matchMedia('(hover: none)').matches
    if (isMobile) return

    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    function onMove(e: MouseEvent) {
      posRef.current = { x: e.clientX, y: e.clientY }
      dot!.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`
    }

    function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

    function animate() {
      ringPos.current.x = lerp(ringPos.current.x, posRef.current.x, 0.12)
      ringPos.current.y = lerp(ringPos.current.y, posRef.current.y, 0.12)
      ring!.style.transform = `translate(${ringPos.current.x - 18}px, ${ringPos.current.y - 18}px)`
      rafRef.current = requestAnimationFrame(animate)
    }

    function onEnterLink() {
      ring!.style.width = '60px'
      ring!.style.height = '60px'
      ring!.style.opacity = '0.6'
    }
    function onLeaveLink() {
      ring!.style.width = '36px'
      ring!.style.height = '36px'
      ring!.style.opacity = '1'
    }
    function onDown() { dot!.style.transform += ' scale(0.5)' }
    function onUp()   { dot!.style.transform = dot!.style.transform.replace(' scale(0.5)', '') }

    const links = document.querySelectorAll('a, button, [role="button"]')
    links.forEach(l => { l.addEventListener('mouseenter', onEnterLink); l.addEventListener('mouseleave', onLeaveLink) })

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    rafRef.current = requestAnimationFrame(animate)

    dot.style.display = 'block'
    ring.style.display = 'block'

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      links.forEach(l => { l.removeEventListener('mouseenter', onEnterLink); l.removeEventListener('mouseleave', onLeaveLink) })
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  style={{ display: 'none' }} aria-hidden />
      <div ref={ringRef} className="cursor-ring" style={{ display: 'none' }} aria-hidden />
    </>
  )
}
