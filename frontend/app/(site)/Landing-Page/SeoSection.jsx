import React from 'react'
import Image from 'next/image'

const SCORES = [
  { label: 'Performance', value: 98 },
  { label: 'Accessibility', value: 100 },
  { label: 'Best practices', value: 100 },
  { label: 'SEO', value: 100 },
]

const SIGNALS = ['Technical SEO', 'Core Web Vitals', 'Structured data', 'App Store Optimization', 'Search Console']

// -------** SeoSection **---------
export default function SeoSection() {
  return (
    <section id="seo" className="px-4 py-16 sm:px-8 sm:py-20 lg:px-16">
      <div className="container mx-auto flex flex-col items-center text-center">
        <p className="font-opensans text-xs font-semibold tracking-widest text-base-content/65 uppercase">
          Search &amp; visibility
        </p>

        <h2 className="font-cinzel mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-base-content sm:text-5xl">
          Shipped is half of it. Then you get found.
        </h2>

        <p className="font-opensans mt-5 max-w-xl text-sm text-base-content/60 sm:text-base">
          The team that builds your site and your apps does the SEO too — on the web and inside both app stores.
        </p>
      </div>

      <SeoGraphic />

      <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
        {SIGNALS.map((signal) => (
          <span
            key={signal}
            className="font-opensans rounded-full border border-base-200 bg-base-100 px-4 py-1.5 text-xs text-base-content/60 shadow-sm sm:text-sm"
          >
            {signal}
          </span>
        ))}
      </div>
    </section>
  )
}

// ---------- Search results panel + Lighthouse-style scores ----------
function SeoGraphic() {
  return (
    <div className="relative mt-16 flex justify-center">
      {/* Same frame as the domain panel: full width up to 7xl, centred */}
      <div className="relative w-full max-w-7xl overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-indigo-900 to-slate-800 p-6 shadow-2xl sm:p-10 lg:p-14">
        {/* Same noise sheet the domain panel uses, so the gradient does not read as flat */}
        <div aria-hidden="true" className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10" />

        <div className="relative grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <SerpMockup />

          <div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-3">
              {SCORES.map((score) => (
                <ScoreRing key={score.label} label={score.label} value={score.value} />
              ))}
            </div>

            <p className="font-opensans mt-4 text-center text-[10px] tracking-wide text-white/45 uppercase">
              Lighthouse — every page we hand over
            </p>

            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/8 px-5 py-4 backdrop-blur">
              <span aria-hidden="true" className="icon-[lucide--trending-up] size-8 shrink-0 text-emerald-400" />
              <div>
                <p className="font-opensans text-xl font-bold text-white">+212%</p>
                <p className="font-opensans mt-0.5 text-xs text-white/55">organic clicks · 90 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// CSS keyframes on a 9s clock animate the search and swap in the Rank #1 listing; statics match reduced motion.
function SerpMockup() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-lg sm:p-5">
      {/* Search field */}
      <div className="relative flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-2">
        <span aria-hidden="true" className="icon-[lucide--search] size-4 shrink-0 text-neutral-400" />
        <span className="font-opensans truncate text-xs text-neutral-700 sm:text-sm">
          custom app development agency
        </span>

        <span className="relative ml-auto shrink-0 rounded-full bg-blue-600 px-3 py-1">
          <span className="font-opensans text-[10px] font-semibold text-white">Search</span>

          {/* Ring thrown off by the click */}
          <span
            aria-hidden="true"
            className="animate-serp-click absolute inset-0 rounded-full opacity-0 ring-2 ring-blue-500/60 motion-reduce:animate-none"
          />

          {/* Pointer — parked on the button, tip landing dead centre */}
          <span
            aria-hidden="true"
            className="animate-serp-cursor pointer-events-none absolute top-1/2 left-1/2 z-30 opacity-0 motion-reduce:animate-none"
          >
            <span className="icon-[lucide--mouse-pointer-2] block size-5 text-neutral-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]" />
          </span>
        </span>
      </div>

      {/* Page-load bar */}
      <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-neutral-100">
        <div
          aria-hidden="true"
          className="animate-serp-load h-full w-full origin-left scale-x-0 rounded-full bg-blue-600 opacity-0 motion-reduce:animate-none"
        />
      </div>

      {/* Position one: grey placeholder and the real listing share the same cell */}
      <div className="mt-3 grid">
        <div
          aria-hidden="true"
          className="animate-serp-skeleton col-start-1 row-start-1 px-3 pt-1 opacity-0 motion-reduce:animate-none"
        >
          <div className="h-2 w-1/3 rounded-full bg-neutral-300" />
          <div className="mt-2 h-2.5 w-3/5 rounded-full bg-neutral-300" />
          <div className="mt-2 h-2 w-full rounded-full bg-neutral-200" />
          <div className="mt-1.5 h-2 w-4/5 rounded-full bg-neutral-200" />
        </div>

        <div className="animate-serp-result col-start-1 row-start-1 motion-reduce:animate-none">
          <WinningResult />
        </div>
      </div>

      {/* Everyone else, greyed back */}
      {[0, 1].map((row) => (
        <div key={row} className="mt-3 px-3 opacity-45">
          <div className="h-2 w-1/3 rounded-full bg-neutral-300" />
          <div className="mt-2 h-2.5 w-3/5 rounded-full bg-blue-300" />
          <div className="mt-2 h-2 w-full rounded-full bg-neutral-200" />
          <div className="mt-1.5 h-2 w-4/5 rounded-full bg-neutral-200" />
        </div>
      ))}
    </div>
  )
}

function WinningResult() {
  return (
    <div className="relative rounded-xl border border-blue-500/25 bg-blue-50/60 p-3">
      <span className="animate-serp-badge absolute -top-2.5 right-3 flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 shadow-md motion-reduce:animate-none">
        <span aria-hidden="true" className="icon-[lucide--trophy] size-3 text-white" />
        <span className="font-opensans text-[9px] font-bold tracking-wide text-white uppercase">Rank #1</span>
      </span>

      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-neutral-200">
          <Image src="/svgs/logoA.svg" alt="" width={1254} height={1254} className="size-full object-cover" />
        </span>
        <div className="min-w-0 leading-tight">
          <p className="font-opensans truncate text-[11px] font-medium text-neutral-800">Cinzel Dynamics</p>
          <p className="font-opensans truncate text-[10px] text-neutral-500">https://cinzeldynamics.com</p>
        </div>
      </div>

      <p className="font-opensans mt-2 text-sm font-medium text-blue-700 sm:text-base">
        Custom App &amp; Web Development Agency
      </p>
      <p className="font-opensans mt-1 line-clamp-2 text-[11px] text-neutral-600 sm:text-xs">
        Backends, web platforms and mobile apps built to scale — and tuned to rank.
      </p>

      <div className="mt-2 flex items-center gap-1.5">
        <span aria-hidden="true" className="font-opensans text-[11px] tracking-tight text-amber-500">
          ★★★★★
        </span>
        <span className="font-opensans text-[10px] text-neutral-500">4.9 · 128 reviews</span>
      </div>
    </div>
  )
}

// ---------- Score dial: one full circle, drawn back to `value` percent ----------
const RING_RADIUS = 26
const RING_LENGTH = 2 * Math.PI * RING_RADIUS

function ScoreRing({ label, value }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative size-14 sm:size-16 lg:size-20">
        <svg viewBox="0 0 64 64" className="size-full -rotate-90" aria-hidden="true">
          <circle cx="32" cy="32" r={RING_RADIUS} fill="none" strokeWidth="5" className="stroke-white/15" />
          <circle
            cx="32"
            cy="32"
            r={RING_RADIUS}
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={RING_LENGTH}
            strokeDashoffset={RING_LENGTH * (1 - value / 100)}
            className="stroke-emerald-400"
          />
        </svg>
        <span className="font-opensans absolute inset-0 flex items-center justify-center text-sm font-semibold text-white lg:text-lg">
          {value}
        </span>
      </div>
      <span className="font-opensans text-center text-[9px] leading-tight text-white/55 sm:text-[10px]">{label}</span>
    </div>
  )
}
