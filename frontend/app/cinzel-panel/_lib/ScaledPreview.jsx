'use client'

import { useEffect, useRef, useState } from 'react'

// The service templates use `sm:`/`lg:` breakpoints keyed to the browser
// viewport, same as the real public page. The admin's preview column is
// narrower than that even on a wide monitor, so rendering content straight
// into it lets `lg:` fire while there's nowhere near 1024px to actually lay
// out in — the 3-column grid template in particular breaks badly. Rendering
// at a fixed 1024px design width and zooming the whole thing down keeps the
// exact layout the real page gets, just smaller, instead of a squeezed one
// Tailwind was never asked to produce.
const DESIGN_WIDTH = 1024

export default function ScaledPreview({ children }) {
  const wrapperRef = useRef(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width
      setScale(width > 0 ? Math.min(1, width / DESIGN_WIDTH) : 1)
    })
    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={wrapperRef}>
      {/* `zoom` (not `transform: scale`) so the box's rendered height shrinks
          with it too — the scrollable parent doesn't need a manual height calc.
          Browsers without `zoom` support just show it at full 1024px width,
          scrollable — still correct, never squeezed. */}
      <div style={{ width: DESIGN_WIDTH, zoom: scale }}>{children}</div>
    </div>
  )
}
