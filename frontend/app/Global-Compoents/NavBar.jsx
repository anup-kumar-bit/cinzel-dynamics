import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Hrefs are rooted at `/` so section links still work from the portfolio route.
const navLinks = [
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  // { label: 'Process', href: '/#process' },
  { label: 'Trust', href: '/trust' },
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
        <Link href="/" className="flex items-center py-1">
          <Image src="/images/LogoH.png" alt="Cinzel Dynamics" width={1272} height={454} className="h-10 w-auto sm:h-12" priority />
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
