import React from 'react'

// EVERYTHING HERE IS PUBLISHED AS A PROMISE — blank values are skipped, never guessed.
export const COMPANY = {
  registeredName: '', // e.g. 'Cinzel Dynamics Pvt Ltd'
  registration: '', // company number / CIN / VAT, whichever applies
  founded: '', // e.g. '2019'
  team: '', // e.g. 'Six engineers and a designer'
  based: 'Remote-first · working across EU and US time zones',
  hours: '', // e.g. 'Monday to Friday, 09:00–18:00 IST'
  email: 'hello@cinzeldynamics.com',
  phone: '', // published only if somebody will answer it
}

const FACTS = [
  { label: 'Trading as', value: 'Cinzel Dynamics' },
  { label: 'Registered name', value: COMPANY.registeredName },
  { label: 'Registration', value: COMPANY.registration, mono: true },
  { label: 'Building since', value: COMPANY.founded },
  { label: 'Team', value: COMPANY.team },
  { label: 'Based', value: COMPANY.based },
  { label: 'Hours', value: COMPANY.hours },
  { label: 'Email', value: COMPANY.email, href: `mailto:${COMPANY.email}`, mono: true },
  { label: 'Phone', value: COMPANY.phone, href: `tel:${COMPANY.phone.replace(/\s/g, '')}`, mono: true },
].filter((fact) => fact.value)

// What an engagement costs at each point, stated next to the step itself.
const STEPS = [
  {
    title: 'You send a line about what you need',
    cost: 'Free',
    copy: 'Answered within one working day by somebody who could build the thing, not by a form auto-reply.',
  },
  {
    title: 'A thirty-minute call',
    cost: 'Free',
    copy: 'We ask what the thing has to achieve and who has to use it. We do not ask which framework you would like.',
  },
  {
    title: 'Scope and price, in writing',
    cost: 'Free',
    copy: 'Milestones, dates and a number. The number does not move unless you change what you asked for — and then you see the new one before we act on it.',
  },
  {
    title: 'You approve it and we start',
    cost: 'Billed per milestone',
    copy: 'Nothing is billed before this point. If the estimate is wrong on our side, that is our problem, not a change request.',
  },
  {
    title: 'Something usable every two to three weeks',
    cost: 'Included',
    copy: 'You get working software you can open, not a status report. If a milestone is going to be late you hear it the day we know.',
  },
  {
    title: 'Launch',
    cost: 'Included',
    copy: 'Stores, domains, monitoring and alerts, plus handover documents written for whoever comes after us — including an engineer who has never met us.',
  },
  {
    title: 'The thirty days after launch',
    cost: 'Free',
    copy: 'Anything we built that breaks in that window is fixed at no cost. After it, a support plan or a clean handover. Both are normal and neither is a downgrade.',
  },
]

const YOURS = [
  'The source code, with the full commit history',
  'The cloud accounts and the billing on them',
  'Domains and DNS',
  'App Store and Google Play listings',
  'Design files, not just exported images',
  'Every credential, key and certificate',
  'All of the customer data, in a format you can read without us',
]

const OURS = [
  'Our own internal tooling and project templates',
  'Nothing else — there is no licence, no per-seat fee and no runtime you have to keep paying us for',
]

const DATA = [
  {
    title: 'Where it lives',
    copy: 'In your cloud accounts, in the region you pick, from the first line of infrastructure onward. We do not host your product on our own tenancy and then hand you an export later.',
  },
  {
    title: 'Who can see it',
    copy: 'Only the engineers working on your build. Access is granted per person and removed the week the engagement ends, not the quarter after.',
  },
  {
    title: 'What we test on',
    copy: 'Dummy data by default. Real customer records only where there is genuinely no way around it, only with your written agreement, and only for as long as the task takes.',
  },
  {
    title: 'Confidentiality',
    copy: 'We sign your NDA. We do not ask you to sign ours first, and we do not treat an unsigned one as permission.',
  },
  {
    title: 'What we never do',
    copy: 'Sell it, share it, use it to train anything, or put your product in a case study, a portfolio or a tweet without your written say-so.',
  },
  {
    title: 'Deleting it',
    copy: 'Ask, and everything we still hold is deleted and confirmed to you in writing. No retention window we forgot to mention.',
  },
]

const TROUBLE = [
  {
    q: 'We miss a date',
    a: 'You hear it the day we know, not on the day it was due. You get a revised plan within two working days, and you are never billed twice for a milestone we ran over.',
  },
  {
    q: 'Something we built breaks in production',
    a: 'Inside thirty days of launch, it is fixed free. On a support plan, it is fixed inside the response time in that plan. Outside both, we still pick up the phone — we just quote for the work.',
  },
  {
    q: 'You are not happy with where it is going',
    a: 'Say so at any milestone. You pay for the milestones you have accepted, you take everything built so far, and you leave. There is no notice period and no termination fee.',
  },
  {
    q: 'You want to bring it in-house',
    a: 'We write the handover, brief your engineer on a call, and stay reachable for thirty days of questions. That costs nothing. Keeping a client by making the exit expensive is not a business we want.',
  },
  {
    q: 'We are the wrong team for the job',
    a: 'We say so on the first call, and where we can we point you at somebody better. We would rather lose the project than learn on your budget.',
  },
]

const REFUSED = [
  'Work we cannot staff properly this quarter. We will tell you when we are free instead of taking it and quietly queueing it.',
  'Rescue jobs where the current team is still on the project and has not been told.',
  'Build it exactly like that famous app but cheaper. We will tell you what it actually costs to build and to run.',
  'Anything that needs us to mislead your users — invented urgency, fake reviews, a cancel button designed not to be found.',
  'Projects where nobody on your side is allowed to make a decision. It ends badly for both of us and we have stopped pretending otherwise.',
]

export default function TrustCharter() {
  return (
    <div className="px-4 py-16 sm:px-8 sm:py-20 lg:px-16">
      <div className="container mx-auto flex max-w-7xl flex-col gap-16 sm:gap-20">
        <Block index={0} id="who" title="Who you are dealing with">
          <p className="font-opensans max-w-5xl text-base leading-relaxed text-base-content/70">
            A small engineering team that builds the thing and then keeps it running. There is no sales layer: the
            person on your first call is the person who writes your code, and they will still be reachable a year
            later.
          </p>

          <p className="font-opensans mt-4 max-w-5xl text-sm leading-relaxed text-base-content/60">
            We stay small deliberately. It means we take fewer projects than we are asked to, we say no more often than
            most agencies would, and nobody on your project is juggling six others. It also means you will know
            everyone who touches your product by name — which is the part that actually matters when something breaks
            at nine on a Friday.
          </p>

          <dl className="mt-8 max-w-2xl border-t border-base-200">
            {FACTS.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-1 border-b border-base-200 py-3 sm:flex-row sm:gap-6">
                <dt className="font-opensans w-40 shrink-0 text-[10px] font-semibold tracking-widest text-base-content/35 uppercase sm:pt-0.5">
                  {fact.label}
                </dt>
                <dd
                  className={`text-[13px] text-base-content/70 ${fact.mono ? 'font-mono break-all' : 'font-opensans'}`}
                >
                  {fact.href ? (
                    <a href={fact.href} className="underline underline-offset-4 hover:text-base-content">
                      {fact.value}
                    </a>
                  ) : (
                    fact.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Block>

        <Block
          index={1}
          id="engagement"
          title="How an engagement runs"
          lede="Seven steps, and what each one costs. Nothing is billed before step four."
        >
          <ol className="flex list-none flex-col p-0">
            {STEPS.map((step, index) => (
              <li key={step.title} className="border-t border-base-200 py-4 first:border-t-0 first:pt-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-[11px] text-base-content/35">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-opensans text-sm font-bold text-base-content">{step.title}</h3>
                  <span className="font-opensans ml-auto text-[10px] font-semibold tracking-widest text-base-content/40 uppercase">
                    {step.cost}
                  </span>
                </div>

                <p className="font-opensans mt-1.5 max-w-2xl pl-7 text-sm leading-relaxed text-base-content/60">
                  {step.copy}
                </p>
              </li>
            ))}
          </ol>
        </Block>

        <Block
          index={2}
          id="ownership"
          title="Who owns what"
          lede="Every item on the left is created in your name on day one, not transferred at the end."
        >
          <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
            <div>
              <p className="font-opensans text-[10px] font-semibold tracking-widest text-emerald-700 uppercase dark:text-emerald-400">
                Yours from day one
              </p>

              <ul className="mt-3 flex list-none flex-col gap-2.5 p-0">
                {YOURS.map((item) => (
                  <li
                    key={item}
                    className="font-opensans flex items-start gap-2.5 text-sm leading-relaxed text-base-content/65"
                  >
                    <span
                      aria-hidden="true"
                      className="icon-[lucide--check] mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-opensans text-[10px] font-semibold tracking-widest text-base-content/35 uppercase">
                Stays ours
              </p>

              <ul className="mt-3 flex list-none flex-col gap-2.5 p-0">
                {OURS.map((item) => (
                  <li
                    key={item}
                    className="font-opensans flex items-start gap-2.5 text-sm leading-relaxed text-base-content/65"
                  >
                    <span
                      aria-hidden="true"
                      className="icon-[lucide--minus] mt-0.5 size-3.5 shrink-0 text-base-content/35"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="font-opensans mt-5 border-t border-base-200 pt-4 text-[13px] leading-relaxed text-base-content/50">
                After handover we keep no copy of your source unless you have asked us to hold it for support. If you
                want that confirmed in writing, ask and it is yours the same day.
              </p>
            </div>
          </div>
        </Block>

        <Block index={3} id="data" title="Your data, plainly">
          <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {DATA.map((item) => (
              <div key={item.title}>
                <h3 className="font-opensans text-sm font-bold text-base-content">{item.title}</h3>
                <p className="font-opensans mt-1.5 text-sm leading-relaxed text-base-content/60">{item.copy}</p>
              </div>
            ))}
          </div>
        </Block>

        <Block
          index={4}
          id="trouble"
          title="When it goes wrong"
          lede="Every project has one of these. Here is what happens on ours."
        >
          <dl className="flex flex-col">
            {TROUBLE.map((item) => (
              <div key={item.q} className="border-t border-base-200 py-4 first:border-t-0 first:pt-0">
                <dt className="font-opensans flex items-start gap-2.5 text-sm font-bold text-base-content">
                  <span aria-hidden="true" className="icon-[lucide--corner-down-right] mt-0.5 size-3.5 shrink-0 text-base-content/30" />
                  {item.q}
                </dt>
                <dd className="font-opensans mt-1.5 max-w-2xl pl-6 text-sm leading-relaxed text-base-content/60">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </Block>

        <Block
          index={5}
          id="refused"
          title="What we turn down"
          lede="A list nobody puts on a homepage, which is exactly why it is worth reading."
        >
          <ul className="flex list-none flex-col gap-3 p-0">
            {REFUSED.map((item) => (
              <li
                key={item}
                className="font-opensans flex items-start gap-2.5 text-sm leading-relaxed text-base-content/65"
              >
                <span aria-hidden="true" className="icon-[lucide--x] mt-0.5 size-3.5 shrink-0 text-base-content/30" />
                {item}
              </li>
            ))}
          </ul>
        </Block>
      </div>
    </div>
  )
}

// Sticky left rail carries the number and heading, same shape as the landing-page FAQ list.
function Block({ index, id, title, lede, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="grid gap-6 lg:grid-cols-[15rem_1fr] lg:gap-14">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <span aria-hidden="true" className="block h-0.5 w-10 bg-base-content/20" />

          <p className="font-mono mt-4 text-[11px] text-base-content/35">{String(index + 1).padStart(2, '0')}</p>

          <h2 className="font-cinzel mt-1 text-2xl font-extrabold tracking-tight text-base-content sm:text-3xl">
            {title}
          </h2>

          {lede ? (
            <p className="font-opensans mt-3 text-[13px] leading-relaxed text-base-content/50">{lede}</p>
          ) : null}
        </div>

        <div className="lg:pt-1">{children}</div>
      </div>
    </section>
  )
}
