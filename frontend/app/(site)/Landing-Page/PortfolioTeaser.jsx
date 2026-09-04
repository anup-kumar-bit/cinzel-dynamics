import React from 'react'
import Link from 'next/link'

// -------** PortfolioTeaser **---------
export default function PortfolioTeaser() {
  return (
    <section className="px-4 pb-4 sm:px-8 sm:pb-6 lg:px-16">
      <div className="container mx-auto flex justify-center">
        <Link
          href="/portfolio"
          aria-label="Browse the portfolio"
          className="group flex w-full max-w-2xl items-center gap-3 rounded-full border border-base-300 bg-base-100 py-3 pr-4 pl-4 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md motion-reduce:hover:translate-y-0 sm:gap-4 sm:pl-5"
        >
          <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-600 sm:size-9">
            <span aria-hidden="true" className="icon-[lucide--layout-grid] size-4" />
            <span aria-hidden="true" className="absolute -top-0.5 -right-0.5 flex size-2.5 motion-reduce:hidden">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-violet-500" />
            </span>
          </span>

          <span className="font-opensans flex-1 text-left text-[13px] leading-tight text-base-content/70 sm:text-sm">
            <span className="font-semibold text-base-content">20+ builds, shipped and still running.</span>{' '}
            {/* <span className="hidden sm:inline">See the work before you ask for references.</span> */}
          </span>

          <span className="font-opensans inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-violet-600">
            <span className="hidden sm:inline">Browse the portfolio</span>
            <span
              aria-hidden="true"
              className="icon-[lucide--arrow-right] size-3.5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
            />
          </span>
        </Link>
      </div>
    </section>
  )
}
