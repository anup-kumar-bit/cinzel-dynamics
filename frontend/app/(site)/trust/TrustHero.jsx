import React from 'react'

// Not vanity numbers — four things a client can hold us to, stated before the prose.
const COMMITMENTS = [
  { value: '1 working day', label: 'Every first message answered by a person' },
  { value: 'Day one', label: 'Repos, cloud and store listings in your name' },
  { value: 'In writing', label: 'Scope and price before anything is billed' },
  { value: 'No queue', label: 'You talk to the engineer, not an account manager' },
]

export default function TrustHero() {
  return (
    <section id="top" className="relative isolate overflow-hidden px-4 pt-16 pb-4 sm:px-8 sm:pt-20 lg:px-16">
      <HeroBackdrop />

      <div className="container relative mx-auto flex flex-col items-center text-center">
        <p className="font-opensans text-xs font-semibold tracking-widest text-base-content/45 uppercase">Trust</p>

        <h1 className="font-cinzel mt-4 max-w-4xl text-4xl leading-tight font-extrabold tracking-tight text-base-content uppercase sm:text-5xl md:text-6xl">
          What you are actually signing up for.
        </h1>

        <p className="font-opensans mt-5 max-w-2xl text-sm text-base-content/60 sm:text-base">
          Anyone can show you screenshots. This is the rest of it — who you are dealing with, what it costs, who owns
          what at the end, and what happens on the day something breaks.
        </p>

        <div className="mt-12 grid w-full max-w-4xl gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {COMMITMENTS.map((commitment) => (
            <div key={commitment.value} className="flex flex-col items-center px-3">
              <span className="font-cinzel text-xl font-extrabold text-base-content sm:text-2xl">
                {commitment.value}
              </span>
              <span className="font-opensans mt-1.5 max-w-52 text-xs text-base-content/50">{commitment.label}</span>
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
      <div className="absolute -top-[10%] left-[8%] size-96 rounded-full bg-emerald-400/18 blur-3xl dark:bg-emerald-500/12" />
      <div className="absolute -top-[6%] right-[6%] size-88 rounded-full bg-blue-400/18 blur-3xl dark:bg-blue-500/12" />
      <div className="dot-grid absolute top-[42%] left-[4%] hidden size-28 text-emerald-500/40 sm:block dark:text-emerald-400/25" />
      <div className="dot-grid absolute top-[46%] right-[4%] hidden size-28 text-blue-500/40 sm:block dark:text-blue-400/25" />
    </div>
  )
}
