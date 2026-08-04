import React from 'react'
import Link from 'next/link'

// Hrefs are rooted at `/` so a section link still works from the portfolio
// route — a bare `#services` would do nothing on any page but the landing one.
const navLinks = [
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Process', href: '/#process' },
  { label: 'Trust', href: '/#trust' },
]

export default function NavBar() {
  return (
    <div className="navbar sticky top-0 z-50 bg-base-100/80 backdrop-blur border-b border-base-200 px-4 sm:px-8 lg:px-16">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" aria-label="Open menu" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={-1} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-48 p-2 shadow">
            {navLinks.map((link) => (
              <li key={link.label}><Link href={link.href}>{link.label}</Link></li>
            ))}
          </ul>
        </div>
        <Link href="/" className="flex items-center gap-2 px-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-slate-900 to-blue-600 text-sm font-bold text-white shadow-sm">
            C
          </span>
          <span className="text-lg font-semibold tracking-tight text-base-content whitespace-nowrap">
            Cinzel Dynamics
          </span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="font-opensans menu menu-horizontal gap-1 px-1 text-md font-medium text-base-content/70">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="rounded-field hover:bg-base-200 hover:text-base-content">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end">
        <a href="#contact" className="btn btn-neutral btn-sm sm:btn-md rounded-full px-4 sm:px-5">
          Book a Demo
        </a>
      </div>
    </div>
  )
}
