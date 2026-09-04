import React from 'react'

const STATS = [
  { value: '50+', label: 'Apps delivered' },
  { value: '100k+', label: 'Active users' },
  { value: '99.9%', label: 'Backend uptime' },
  { value: '12', label: 'Countries shipped to' },
]

export default function PortfolioHero() {
  return (
    <section id="top" className="relative isolate overflow-hidden px-4 pt-16 pb-4 sm:px-8 sm:pt-20 lg:px-16">
      <HeroBackdrop />

      <div className="container relative mx-auto flex flex-col items-center text-center">
        <p className="font-opensans text-xs font-semibold tracking-widest text-base-content/45 uppercase">
          Portfolio
        </p>

        <h1 className="font-cinzel mt-4 max-w-4xl text-4xl leading-tight font-extrabold tracking-tight text-base-content uppercase sm:text-5xl md:text-6xl">
          Work we have shipped.
        </h1>

        <p className="font-opensans mt-5 max-w-xl text-sm text-base-content/60 sm:text-base">
          Platforms, apps and backends running in production today — built, launched and still maintained by the same
          team.
        </p>

        <div className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-y-8 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center px-2">
              <span className="text-2xl font-extrabold text-base-content sm:text-3xl">{stat.value}</span>
              <span className="font-opensans mt-1 text-xs text-base-content/50 sm:text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-[10%] left-[8%] size-96 rounded-full bg-blue-400/18 blur-3xl dark:bg-blue-500/12" />
      <div className="absolute -top-[6%] right-[6%] size-88 rounded-full bg-violet-400/18 blur-3xl dark:bg-violet-500/12" />
      <div className="dot-grid absolute top-[42%] left-[4%] hidden size-28 text-blue-500/40 sm:block dark:text-blue-400/25" />
      <div className="dot-grid absolute top-[46%] right-[4%] hidden size-28 text-violet-500/40 sm:block dark:text-violet-400/25" />
    </div>
  )
}
