import React from 'react'
import Link from 'next/link'

// Outermost chevron first — sizes and delays shrink inward, so the brightening travels toward the button.
const CHEVRONS = [
  { size: 'size-8 sm:size-12', delay: 0 },
  { size: 'size-7 sm:size-10', delay: 0.14 },
  { size: 'size-6 sm:size-9', delay: 0.28 },
  { size: 'size-5 sm:size-7', delay: 0.42 },
  { size: 'size-4 sm:size-6', delay: 0.56 },
]

// No panel to read, just direction — every chevron points at the one button.
export default function ClientWorkCorridor() {
  return (
    <section id="client-work" className="px-4 pb-10 sm:pb-10 sm:px-8  lg:px-16">
      {/* <div className="container mx-auto flex flex-col items-center text-center">
        <p className="font-opensans text-xs font-semibold tracking-widest text-base-content/65 uppercase">
          Client work
        </p>

        <h2 className="font-cinzel mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-base-content sm:text-5xl">
          This way to the work.
        </h2>

        <p className="font-opensans mt-5 max-w-lg text-sm text-base-content/60 sm:text-base">
          Shipped, live and still maintained — all of it on one page, in the open.
        </p>
      </div> */}

      {/* Same frame as the domain and SEO panels: full width up to 7xl, centred */}
      <div className="relative mt-12 flex justify-center">
        <Link
          href="/portfolio"
          aria-label="Browse the portfolio"
          className="group relative flex w-full max-w-7xl items-center justify-center overflow-hidden rounded-3xl bg-slate-950 px-4 py-16 shadow-2xl ring-1 ring-violet-400/20 transition duration-300 hover:-translate-y-1 hover:ring-violet-400/40 motion-reduce:hover:translate-y-0 sm:py-24"
        >
          <div aria-hidden="true" className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.07]" />

          {/* Light at the end of it */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/25 blur-[80px] transition-opacity duration-500 group-hover:opacity-75 sm:size-96"
          />

          <div className="relative flex items-center justify-center gap-1 sm:gap-2">
            <ChevronRun side="left" />

            <span className="font-opensans mx-2 inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-semibold whitespace-nowrap text-neutral-900 shadow-xl transition-transform duration-300 group-hover:scale-105 motion-reduce:group-hover:scale-100 sm:mx-5 sm:px-7 sm:text-sm">
              Browse the portfolio
              <span
                aria-hidden="true"
                className="icon-[lucide--arrow-right] size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
              />
            </span>

            <ChevronRun side="right" />
          </div>

          <p className="font-opensans absolute inset-x-0 bottom-6 text-center text-[10px] tracking-[0.25em] text-white/35 uppercase sm:bottom-8">
            50+ builds · live in production · references on request
          </p>
        </Link>
      </div>
    </section>
  )
}

// The right-hand run is the same list mirrored, so both sides point inward.
function ChevronRun({ side }) {
  const isLeft = side === 'left'
  const run = isLeft ? CHEVRONS : [...CHEVRONS].reverse()

  return (
    <div aria-hidden="true" className="flex items-center gap-0.5 sm:gap-1">
      {run.map((chevron) => (
        <span
          key={`${side}-${chevron.delay}`}
          style={{ animationDelay: `${chevron.delay}s` }}
          className={`animate-corridor-pulse motion-reduce:animate-none shrink-0 text-violet-300 opacity-40 motion-reduce:opacity-40 ${
            chevron.size
          } ${isLeft ? 'icon-[lucide--chevron-right]' : 'icon-[lucide--chevron-left]'}`}
        />
      ))}
    </div>
  )
}
