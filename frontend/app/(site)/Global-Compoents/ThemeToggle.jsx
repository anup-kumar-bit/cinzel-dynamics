'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

// Defaults to light; only flips to dark when the visitor asks for it here —
// see the blocking script in layout.js that applies the stored choice before paint.
export default function ThemeToggle({ className = '' }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.getAttribute('data-theme') === 'dark')
  }, [])

  function toggle() {
    const next = isDark ? 'light' : 'dark'
    if (next === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {}
    setIsDark(next === 'dark')
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`btn btn-ghost btn-circle ${className}`}
    >
      <span aria-hidden="true" className={`icon-[lucide--sun] size-4.5 ${isDark ? '' : 'hidden'}`} />
      <span aria-hidden="true" className={`icon-[lucide--moon] size-4.5 ${isDark ? 'hidden' : ''}`} />
    </button>
  )
}
