import React from 'react'

import './Web-UI.css'

// Stand-in site — swap SITE and the section copy for a real project; the frame doesn't care.
const SITE = {
  brand: 'Meridian',
  domain: 'meridian.studio',
  nav: ['Work', 'Studio', 'Journal', 'Contact'],
}

const CLIENTS = ['Arclight', 'Foundry', 'Northwind', 'Talos', 'Kestrel']

const FEATURES = [
  { icon: 'icon-[lucide--pen-tool]', title: 'Brand systems', copy: 'Identity, type and motion built as one kit.' },
  { icon: 'icon-[lucide--layout-dashboard]', title: 'Product design', copy: 'Interfaces drawn against the real data model.' },
  { icon: 'icon-[lucide--rocket]', title: 'Launch', copy: 'Shipped, measured and handed over.' },
]

const GALLERY = [
  'from-sky-200 to-indigo-300',
  'from-amber-100 to-rose-200',
  'from-emerald-200 to-teal-300',
  'from-violet-200 to-fuchsia-300',
]

const STATS = [
  { value: '120+', label: 'Projects' },
  { value: '14', label: 'Countries' },
  { value: '9 yrs', label: 'In practice' },
  { value: '4.9', label: 'Client rating' },
]

const FOOTER = [
  { heading: 'Studio', links: ['About', 'Careers', 'Press'] },
  { heading: 'Work', links: ['Case studies', 'Clients', 'Awards'] },
  { heading: 'Contact', links: ['Enquiries', 'Instagram', 'LinkedIn'] },
]

// A browser window that scrolls inside the frame — the desktop counterpart to the iOS mock.
export default function WebUi({ className = '' }) {
  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/10 ${className}`}
    >
      <BrowserChrome />

      {/* The scroll region — focusable so it can be reached from the keyboard too. */}
      <div
        tabIndex={0}
        role="group"
        aria-label={`Scrollable preview of ${SITE.domain}`}
        className="web-ui-scroll relative min-h-0 flex-1 overflow-y-auto focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-500"
      >
        <div className="web-ui-page-in">
          <SiteNav />
          <SiteHero />
          <ClientStrip />
          <FeatureRow />
          <GalleryRow />
          <StatBand />
          <SiteFooter />
        </div>
      </div>

      <ScrollHint />
    </div>
  )
}

// ---------- Browser chrome ----------
function BrowserChrome() {
  return (
    <div className="relative z-10 shrink-0 border-b border-neutral-200 bg-neutral-50">
      <div className="flex items-center gap-2 px-3 py-2">
        <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-red-400" />
        <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-yellow-400" />
        <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-green-500" />

        <span aria-hidden="true" className="ml-2 hidden items-center gap-1.5 text-neutral-400 sm:flex">
          <span className="icon-[lucide--chevron-left] size-3.5" />
          <span className="icon-[lucide--chevron-right] size-3.5" />
          <span className="icon-[lucide--rotate-cw] size-3" />
        </span>

        <span className="ml-1 flex min-w-0 flex-1 items-center gap-1.5 rounded-full bg-white px-2.5 py-1 ring-1 ring-neutral-200">
          <span aria-hidden="true" className="icon-[lucide--lock] size-2.5 shrink-0 text-neutral-400" />
          <span className="font-opensans truncate text-[10px] text-neutral-500">
            {SITE.domain}
            <span className="text-neutral-800">/work</span>
          </span>
        </span>

        <span aria-hidden="true" className="hidden shrink-0 items-center gap-1.5 text-neutral-400 sm:flex">
          <span className="icon-[lucide--share] size-3" />
          <span className="icon-[lucide--plus] size-3" />
        </span>
      </div>

      {/* Page-load bar, one sweep on first paint */}
      <span
        aria-hidden="true"
        className="web-ui-progress absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-blue-500 to-violet-500"
      />
    </div>
  )
}

// Nothing here is interactive — buttons and links are spans, not dead tab stops.
function SiteNav() {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-neutral-100 bg-white/85 px-5 py-2.5 backdrop-blur">
      <span className="flex items-center gap-1.5">
        <span aria-hidden="true" className="size-3 rounded-full bg-linear-to-br from-neutral-900 to-neutral-600" />
        <span className="font-cinzel text-[11px] font-bold tracking-tight text-neutral-900">{SITE.brand}</span>
      </span>

      <span className="ml-auto hidden items-center gap-4 sm:flex">
        {SITE.nav.map((item) => (
          <span key={item} className="font-opensans text-[10px] text-neutral-500">
            {item}
          </span>
        ))}
      </span>

      <span className="font-opensans rounded-full bg-neutral-900 px-2.5 py-1 text-[9px] font-semibold text-white">
        Start a project
      </span>
    </div>
  )
}

function SiteHero() {
  return (
    <div className="grid items-center gap-5 px-5 py-7 sm:grid-cols-2">
      <div>
        <span className="font-opensans rounded-full bg-neutral-100 px-2 py-0.5 text-[8px] font-semibold tracking-widest text-neutral-500 uppercase">
          Design studio
        </span>

        <p className="font-cinzel mt-2.5 text-xl leading-tight font-extrabold tracking-tight text-neutral-900 sm:text-2xl">
          We build brands that behave like products.
        </p>

        <p className="font-opensans mt-2 text-[10px] leading-relaxed text-neutral-500">
          Identity, interface and the systems that keep them consistent long after the launch deck is closed.
        </p>

        <div className="mt-3 flex items-center gap-2">
          <span className="font-opensans rounded-full bg-neutral-900 px-3 py-1.5 text-[9px] font-semibold text-white">
            See the work
          </span>
          <span className="font-opensans rounded-full px-3 py-1.5 text-[9px] font-semibold text-neutral-600 ring-1 ring-neutral-200">
            Book a call
          </span>
        </div>
      </div>

      <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-linear-to-br from-indigo-200 via-sky-200 to-emerald-100">
        <span className="absolute bottom-3 left-3 h-1.5 w-16 rounded-full bg-white/70" />
        <span className="absolute bottom-6 left-3 h-1.5 w-10 rounded-full bg-white/50" />
      </div>
    </div>
  )
}

function ClientStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-y border-neutral-100 bg-neutral-50 px-5 py-3">
      {CLIENTS.map((client) => (
        <span key={client} className="font-cinzel text-[10px] font-bold tracking-wide text-neutral-400 uppercase">
          {client}
        </span>
      ))}
    </div>
  )
}

function FeatureRow() {
  return (
    <div className="px-5 py-7">
      <p className="font-cinzel text-sm font-extrabold tracking-tight text-neutral-900">What we do</p>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="rounded-lg p-3 ring-1 ring-neutral-200">
            <span aria-hidden="true" className={`${feature.icon} size-3.5 text-indigo-500`} />
            <p className="font-opensans mt-2 text-[10px] font-bold text-neutral-800">{feature.title}</p>
            <p className="font-opensans mt-1 text-[9px] leading-relaxed text-neutral-500">{feature.copy}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function GalleryRow() {
  return (
    <div className="bg-neutral-50 px-5 py-7">
      <div className="flex items-baseline justify-between">
        <p className="font-cinzel text-sm font-extrabold tracking-tight text-neutral-900">Selected work</p>
        <span className="font-opensans text-[9px] text-neutral-400">View all</span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {GALLERY.map((gradient, index) => (
          <div key={gradient} className="overflow-hidden rounded-lg bg-white ring-1 ring-neutral-200">
            <div className={`aspect-4/3 bg-linear-to-br ${gradient}`} />
            <div className="px-2 py-1.5">
              <p className="font-opensans text-[9px] font-semibold text-neutral-700">Project {index + 1}</p>
              <p className="font-opensans text-[8px] text-neutral-400">Identity · Web</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatBand() {
  return (
    <div className="grid grid-cols-4 gap-2 bg-neutral-900 px-5 py-5">
      {STATS.map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="font-opensans text-sm font-extrabold tracking-tight text-white">{stat.value}</p>
          <p className="font-opensans mt-0.5 text-[8px] tracking-wide text-white/50 uppercase">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

function SiteFooter() {
  return (
    <div className="px-5 pt-6 pb-5">
      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="size-3 rounded-full bg-linear-to-br from-neutral-900 to-neutral-600" />
            <span className="font-cinzel text-[11px] font-bold tracking-tight text-neutral-900">{SITE.brand}</span>
          </span>
          <p className="font-opensans mt-2 text-[9px] leading-relaxed text-neutral-500">
            A small studio, working with people who ship.
          </p>
        </div>

        {FOOTER.map((column) => (
          <div key={column.heading}>
            <p className="font-opensans text-[9px] font-bold tracking-wide text-neutral-800 uppercase">
              {column.heading}
            </p>
            <div className="mt-1.5 flex flex-col gap-1">
              {column.links.map((link) => (
                <span key={link} className="font-opensans text-[9px] text-neutral-500">
                  {link}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-3">
        <span className="font-opensans text-[8px] text-neutral-400">© 2026 {SITE.brand}</span>
        <span className="font-opensans text-[8px] text-neutral-400">Privacy · Terms</span>
      </div>
    </div>
  )
}

// Hints that the frame scrolls on its own; steps aside on hover so it never covers the page.
function ScrollHint() {
  return (
    <span
      aria-hidden="true"
      className="font-opensans pointer-events-none absolute bottom-2.5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-neutral-900/70 px-2 py-1 text-[8px] font-medium text-white opacity-100 backdrop-blur transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0"
    >
      <span className="icon-[lucide--chevrons-down] size-2.5 animate-bounce motion-reduce:animate-none" />
      Scroll the site
    </span>
  )
}
