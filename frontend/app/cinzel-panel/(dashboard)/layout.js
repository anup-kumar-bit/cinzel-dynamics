'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { label: 'Apps', href: '/cinzel-panel/apps', icon: 'icon-[lucide--smartphone]', hint: 'Portfolio mockups' },
  { label: 'Routes', href: '/cinzel-panel/routes', icon: 'icon-[lucide--layout-template]', hint: 'Service pages' },
  { label: 'Blog', href: '/cinzel-panel/blog', icon: 'icon-[lucide--newspaper]', hint: 'Articles' },
  {
    label: 'Categories',
    href: '/cinzel-panel/categories',
    icon: 'icon-[lucide--tags]',
    hint: 'Blog taxonomy',
    nested: true,
  },
]

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  // Below `lg` the sidebar becomes an off-canvas drawer instead of disappearing.
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  async function handleLogout() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, { method: 'POST', credentials: 'include' })
    router.push('/cinzel-panel/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen bg-base-200">
      {open ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-60 shrink-0 -translate-x-full flex-col border-r border-black/20 bg-neutral text-neutral-content transition-transform duration-200 lg:sticky lg:top-0 lg:translate-x-0 ${
          open ? 'translate-x-0' : ''
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sm font-bold">
            C
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">Cinzel</p>
            <p className="font-mono truncate text-[10px] tracking-widest text-neutral-content/45 uppercase">
              Control panel
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="ml-auto flex size-8 shrink-0 items-center justify-center rounded-lg text-neutral-content/60 hover:bg-white/10 hover:text-neutral-content lg:hidden"
          >
            <span aria-hidden="true" className="icon-[lucide--x] size-4" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 pt-2">
          <p className="font-mono px-3 pb-2 text-[10px] font-semibold tracking-widest text-neutral-content/35 uppercase">
            Manage
          </p>

          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative flex items-center gap-3 rounded-lg py-2.5 transition ${
                  link.nested ? 'pr-3 pl-7' : 'px-3'
                } ${
                  active
                    ? 'bg-white/12 text-neutral-content'
                    : 'text-neutral-content/55 hover:bg-white/6 hover:text-neutral-content/90'
                }`}
              >
                {active ? (
                  <span aria-hidden="true" className="absolute top-2.5 bottom-2.5 -left-3 w-0.5 rounded-r bg-white" />
                ) : null}

                <span aria-hidden="true" className={`${link.icon} size-4 shrink-0`} />
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{link.label}</span>
                  <span className="block truncate text-[11px] text-neutral-content/40">{link.hint}</span>
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="flex flex-col gap-1 border-t border-white/10 p-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-content/55 transition hover:bg-white/6 hover:text-neutral-content/90"
          >
            <span aria-hidden="true" className="icon-[lucide--external-link] size-4 shrink-0" />
            View site
          </a>

          <button
            type="button"
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-neutral-content/55 transition hover:bg-white/6 hover:text-neutral-content/90"
          >
            <span aria-hidden="true" className="icon-[lucide--log-out] size-4 shrink-0" />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-base-300 bg-base-100 px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-base-content/70 hover:bg-base-200"
          >
            <span aria-hidden="true" className="icon-[lucide--menu] size-5" />
          </button>
          <p className="text-sm font-bold text-base-content">Cinzel · Control panel</p>
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          <div className="mx-auto w-full max-w-[110rem]">{children}</div>
        </main>
      </div>
    </div>
  )
}
