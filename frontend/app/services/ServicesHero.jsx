import React from 'react'

const SECTORS = ['Retail', 'Clinics', 'Education', 'Restaurants', 'Fitness', 'Logistics', 'Field teams']

export default function ServicesHero() {
  return (
    <section id="top" className="relative isolate overflow-hidden px-4 pt-16 pb-4 sm:px-8 sm:pt-20 lg:px-16">
      <HeroBackdrop />

      <div className="container relative mx-auto flex flex-col items-center text-center">
        <p className="font-opensans text-xs font-semibold tracking-widest text-base-content/45 uppercase">Services</p>

        <h1 className="font-cinzel mt-4 text-4xl leading-tight font-extrabold tracking-tight text-base-content uppercase sm:text-5xl md:text-6xl">
          Tell us your goal. We'll build the solution.
        </h1>

        <p className="font-opensans mt-5 max-w-4xl text-sm text-base-content/60 sm:text-base">
          You don't need an app. You need your business to run better. We build the tools that make that happen.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          {SECTORS.map((sector) => (
            <span
              key={sector}
              className="font-opensans rounded-full border border-base-200 bg-base-100 px-4 py-1.5 text-xs text-base-content/60 shadow-sm sm:text-sm"
            >
              {sector}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute top-[-10%] left-[8%] size-96 rounded-full bg-emerald-400/18 blur-3xl dark:bg-emerald-500/12" />
      <div className="absolute top-[-6%] right-[6%] size-88 rounded-full bg-violet-400/18 blur-3xl dark:bg-violet-500/12" />
      <div className="dot-grid absolute top-[42%] left-[4%] hidden size-28 text-emerald-500/40 sm:block dark:text-emerald-400/25" />
      <div className="dot-grid absolute top-[46%] right-[4%] hidden size-28 text-violet-500/40 sm:block dark:text-violet-400/25" />
    </div>
  )
}
