'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { listPublishedRoutes } from '@/lib/cinzelPanel/db'
import ThemeToggle from './ThemeToggle'

// Hrefs are rooted at `/` so section links still work from the portfolio route.
// Split around Services since it renders as a hover panel / expandable
// group rather than a plain link, so it can't just live in one mapped array.
// Order: Home, Portfolio, Services, Trust.
const beforeServicesLinks = [
  { label: 'Home', href: '/' },
  { label: 'Portfolio', href: '/portfolio' },
]
const afterServicesLinks = [
  { label: 'Products', href: '/products' },
  { label: 'Trust', href: '/trust' },
  { label: 'Blog', href: '/blog' },
]

const CLOSE_DELAY_MS = 150

// Home only matches the exact root; every other link also covers its nested routes.
function isNavActive(pathname, href) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}

export default function NavBar() {
  const [services, setServices] = useState([])
  const [desktopOpen, setDesktopOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const closeTimerRef = useRef(null)

  useEffect(() => {
    listPublishedRoutes()
      .then(setServices)
      .catch(() => setServices([]))
  }, [])

  useEffect(() => {
    setDesktopOpen(false)
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
  }, [])

  function openDesktopMenu() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setDesktopOpen(true)
  }

  function closeDesktopMenuSoon() {
    closeTimerRef.current = setTimeout(() => setDesktopOpen(false), CLOSE_DELAY_MS)
  }
  function handleKeyDown(event) {
    if (event.key !== 'Escape') return
    setDesktopOpen(false)
    setMobileOpen(false)
  }

  const onServicePage = pathname.startsWith('/services')

  return (
    <div onKeyDown={handleKeyDown} className="sticky top-0 z-50 border-b border-base-200 bg-base-100/80 backdrop-blur">
      <div className="navbar px-4 sm:px-8 lg:px-16">
        <div className="navbar-start">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="btn btn-ghost lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </button>

          <Link href="/" className="flex items-center py-1">
            <Image
              src="/images/LogoH.png"
              alt="Cinzel Dynamics"
              width={1272}
              height={454}
              className="h-10 w-auto dark:hidden sm:h-12"
              priority
            />
            <Image
              src="/images/LogoH-dark.png"
              alt="Cinzel Dynamics"
              width={1272}
              height={454}
              className="hidden h-10 w-auto dark:block sm:h-12"
              priority
            />
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="font-opensans menu menu-horizontal gap-1 px-1 text-md font-medium text-base-content/70">
            {beforeServicesLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`rounded-field hover:bg-base-200 hover:text-base-content ${
                    isNavActive(pathname, link.href) ? 'bg-base-200 text-base-content' : ''
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            <li>
              <button
                type="button"
                onClick={() => setDesktopOpen((value) => !value)}
                onMouseEnter={openDesktopMenu}
                onMouseLeave={closeDesktopMenuSoon}
                onFocus={openDesktopMenu}
                aria-expanded={desktopOpen}
                aria-haspopup="true"
                className={`rounded-field flex items-center gap-1.5 hover:bg-base-200 hover:text-base-content ${
                  onServicePage || desktopOpen ? 'bg-base-200 text-base-content' : ''
                }`}
              >
                Services
                <span
                  aria-hidden="true"
                  className={`icon-[lucide--chevron-down] size-3.5 transition-transform ${desktopOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </li>

            {afterServicesLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`rounded-field hover:bg-base-200 hover:text-base-content ${
                    isNavActive(pathname, link.href) ? 'bg-base-200 text-base-content' : ''
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="navbar-end gap-1">
          <ThemeToggle className="btn-sm sm:btn-md" />
          <a href="#contact" className="btn btn-neutral btn-sm sm:btn-md rounded-full px-4 sm:px-5">
            Book a Demo
          </a>
        </div>
      </div>

      {desktopOpen ? (
        <ServicesMenu
          services={services}
          onNavigate={() => setDesktopOpen(false)}
          onMouseEnter={openDesktopMenu}
          onMouseLeave={closeDesktopMenuSoon}
        />
      ) : null}

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} services={services} pathname={pathname} />
    </div>
  )
}

// Full-width panel under the bar: every service page is a sibling, so they are
// listed flat rather than nested under a parent link.
function ServicesMenu({ services, onNavigate, onMouseEnter, onMouseLeave }) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute inset-x-0 top-full hidden border-t border-base-200 bg-base-100 shadow-lg lg:block"
    >
      <div className="container mx-auto px-4 py-8 sm:px-8 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <div>
            <p className="font-mono text-[11px] font-semibold tracking-widest text-base-content/45 uppercase">
              Services
            </p>
            <p className="font-opensans mt-3 text-sm leading-relaxed text-base-content/55">
              Each one is a page of its own — what we build, how it runs, and what it costs to keep running.
            </p>
          </div>

          {services.length > 0 ? (
            <ul className="grid list-none gap-x-8 gap-y-px border-t border-base-200 p-0 sm:grid-cols-2 xl:grid-cols-3">
              {services.map((service, index) => (
                <li key={service.id} className="border-b border-base-200">
                  <Link
                    href={`/services/${service.slug}`}
                    onClick={onNavigate}
                    className="group flex items-baseline gap-3 py-4"
                  >
                    <span className="font-mono text-[10px] text-base-content/30">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="font-opensans block text-sm font-bold text-base-content">
                        {service.navName}
                      </span>
                      <span className="font-opensans mt-1 block truncate text-[13px] text-base-content/50">
                        {service.title}
                      </span>
                    </span>

                    <span
                      aria-hidden="true"
                      className="icon-[lucide--arrow-right] size-3.5 shrink-0 self-center text-base-content/25 transition-transform group-hover:translate-x-1 group-hover:text-base-content/60 motion-reduce:group-hover:translate-x-0"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function MobileDrawer({ open, onClose, services, pathname }) {
  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-40 cursor-default bg-black/40 lg:hidden"
        />
      ) : null}

      <aside
        aria-hidden={!open}
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 max-w-[85vw] flex-col border-r border-base-200 bg-base-100 transition-transform duration-200 lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-base-200 px-4 py-4">
          <Link href="/" onClick={onClose} className="flex items-center">
            <Image src="/images/LogoH.png" alt="Cinzel Dynamics" width={1272} height={454} className="h-8 w-auto dark:hidden" priority />
            <Image src="/images/LogoH-dark.png" alt="Cinzel Dynamics" width={1272} height={454} className="hidden h-8 w-auto dark:block" priority />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex size-9 items-center justify-center rounded-lg text-base-content/60 hover:bg-base-200"
          >
            <span aria-hidden="true" className="icon-[lucide--x] size-5" />
          </button>
        </div>

        <nav className="font-opensans flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {beforeServicesLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={onClose}
              className={`rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-base-200 ${
                isNavActive(pathname, link.href) ? 'bg-base-200 text-base-content' : 'text-base-content/80'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <details open={pathname.startsWith('/services')} className="collapse-arrow collapse rounded-lg">
            <summary
              className={`collapse-title min-h-0 rounded-lg px-3 py-2.5 text-sm font-semibold after:!size-3.5 hover:bg-base-200 ${
                pathname.startsWith('/services') ? 'text-base-content' : 'text-base-content/80'
              }`}
            >
              Services
            </summary>

            <div className="collapse-content !px-0 !pb-0">
              <div className="flex flex-col gap-0.5">
                {services.map((service) => {
                  const href = `/services/${service.slug}`
                  return (
                    <Link
                      key={service.id}
                      href={href}
                      onClick={onClose}
                      className={`rounded-lg px-3 py-2 text-sm hover:bg-base-200 ${
                        pathname === href ? 'bg-base-200 text-base-content' : 'text-base-content/65'
                      }`}
                    >
                      {service.navName}
                    </Link>
                  )
                })}
              </div>
            </div>
          </details>

          {afterServicesLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={onClose}
              className={`rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-base-200 ${
                isNavActive(pathname, link.href) ? 'bg-base-200 text-base-content' : 'text-base-content/80'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 border-t border-base-200 p-4">
          <a href="#contact" onClick={onClose} className="btn btn-neutral flex-1 rounded-full">
            Book a Demo
          </a>
          <ThemeToggle />
        </div>
      </aside>
    </>
  )
}
