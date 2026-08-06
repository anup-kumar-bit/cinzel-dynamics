import React from 'react'
import Link from 'next/link'

// Full-bleed closing band rendered once from the root layout, ending every route the same way.
export default function CtaSection() {
  return (
    <section className="relative isolate overflow-hidden border-t border-base-200 bg-base-200/60 px-4 py-20 sm:px-8 lg:px-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="dot-grid absolute top-8 left-[6%] hidden size-24 text-blue-500/35 sm:block dark:text-blue-400/20" />
        <div className="dot-grid absolute right-[6%] bottom-8 hidden size-24 text-violet-500/35 sm:block dark:text-violet-400/20" />
      </div>

      <div className="container relative mx-auto flex flex-col items-center text-center">
        <h2 className="font-cinzel max-w-3xl text-3xl font-extrabold tracking-tight text-base-content sm:text-4xl">
          Your product could be next.
        </h2>

        <p className="font-opensans mt-4 max-w-lg text-sm text-base-content/60 sm:text-base">
          Tell us what you are building. You leave the first call with a scope and a number.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#contact" className="btn btn-neutral rounded-full px-6">
            Book a Free Consultation
          </a>
          <Link href="/#services" className="btn btn-ghost rounded-full px-6">
            See what we build
          </Link>
        </div>
      </div>
    </section>
  )
}
