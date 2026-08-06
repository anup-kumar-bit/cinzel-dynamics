import React from 'react'

import { COMPANY } from './TrustCharter'

// Not another "book a consultation" band — CtaSection covers that; this is the plain address.
const BRIEF = [
  'What the thing has to do, in your own words. Screens and features can wait.',
  'When you need it live, and what is driving that date.',
  'Any budget you already have in mind. A range is fine, and it saves us both a week of guessing.',
]

const NEXT = [
  'A reply from a person within one working day — an actual answer, not a request for a call to have the answer.',
  'If it is a fit, a thirty-minute call at a time you pick.',
  'Scope, milestones and a fixed number in writing before anything is billed.',
]

export default function TrustContact() {
  return (
    <section id="direct-line" className="scroll-mt-24 border-t border-base-200 px-4 py-16 sm:px-8 sm:py-20 lg:px-16">
      <div className="container mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <span aria-hidden="true" className="block h-0.5 w-10 bg-base-content/20" />

          <h2 className="font-cinzel mt-4 text-2xl font-extrabold tracking-tight text-base-content sm:text-3xl">
            The direct line
          </h2>

          <p className="font-opensans mt-3 max-w-md text-sm leading-relaxed text-base-content/60">
            One address, read by the people who do the work. No ticket number, no routing, no newsletter afterwards.
          </p>

          <a
            href={`mailto:${COMPANY.email}`}
            className="font-mono mt-6 inline-flex items-center gap-2.5 text-base text-base-content underline underline-offset-4 hover:text-emerald-700 sm:text-lg dark:hover:text-emerald-400"
          >
            <span aria-hidden="true" className="icon-[lucide--mail] size-4 shrink-0 text-base-content/40" />
            {COMPANY.email}
          </a>

          {COMPANY.phone ? (
            <a
              href={`tel:${COMPANY.phone.replace(/\s/g, '')}`}
              className="font-mono mt-3 flex items-center gap-2.5 text-sm text-base-content/70 hover:text-base-content"
            >
              <span aria-hidden="true" className="icon-[lucide--phone] size-4 shrink-0 text-base-content/40" />
              {COMPANY.phone}
            </a>
          ) : null}

          <dl className="mt-6 flex flex-col gap-2 border-t border-base-200 pt-5 text-[13px]">
            <div className="flex gap-3">
              <dt className="font-opensans w-28 shrink-0 text-base-content/40">Answered in</dt>
              <dd className="font-opensans text-base-content/70">One working day</dd>
            </div>

            {COMPANY.hours ? (
              <div className="flex gap-3">
                <dt className="font-opensans w-28 shrink-0 text-base-content/40">Hours</dt>
                <dd className="font-opensans text-base-content/70">{COMPANY.hours}</dd>
              </div>
            ) : null}

            <div className="flex gap-3">
              <dt className="font-opensans w-28 shrink-0 text-base-content/40">Based</dt>
              <dd className="font-opensans text-base-content/70">{COMPANY.based}</dd>
            </div>
          </dl>

          <a href="#contact" className="btn btn-neutral mt-7 rounded-full px-6">
            Or leave a number and we will call
          </a>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:gap-10">
          <List title="Put this in the first message" items={BRIEF} icon="icon-[lucide--pencil-line]" />
          <List title="What lands back" items={NEXT} icon="icon-[lucide--corner-down-left]" />
        </div>
      </div>
    </section>
  )
}

function List({ title, items, icon }) {
  return (
    <div>
      <p className="font-opensans text-[10px] font-semibold tracking-widest text-base-content/35 uppercase">{title}</p>

      <ul className="mt-3 flex list-none flex-col gap-3 p-0">
        {items.map((item) => (
          <li
            key={item}
            className="font-opensans flex items-start gap-2.5 text-sm leading-relaxed text-base-content/65"
          >
            <span aria-hidden="true" className={`${icon} mt-0.5 size-3.5 shrink-0 text-base-content/30`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
