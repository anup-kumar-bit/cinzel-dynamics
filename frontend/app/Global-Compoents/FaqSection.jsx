import React from 'react'

const FAQS = [
  {
    q: 'What kind of projects do you take on?',
    a: 'Backends and APIs, full-stack web apps, and cross-platform mobile apps that ship to both the App Store and Google Play. Most engagements are a new product build, a rebuild of something that outgrew its stack, or a long-running partnership on a platform already in production.',
  },
  {
    q: 'How long does a typical build take?',
    a: 'A focused MVP usually runs 6 to 10 weeks from kickoff to launch. Larger platforms are split into milestones so something usable ships every two to three weeks — you never wait until the end to see working software.',
  },
  {
    q: 'How do you price the work?',
    a: 'Fixed-price milestones for scoped projects, or a monthly retainer when the roadmap keeps moving. Either way you get the estimate in writing after the first call, before anything is billed.',
  },
  {
    q: 'Who owns the code and the accounts?',
    a: 'You do — completely. Repositories, cloud infrastructure, domains and both store listings are created under your organisation from day one. Nothing is locked behind our accounts, and there is nothing to migrate if you take the project in-house later.',
  },
  {
    q: 'Do you handle App Store and Google Play submissions?',
    a: 'Yes. Signing, store artwork, privacy declarations, review submissions and every release after launch are handled end to end. One codebase goes out to iOS 15 and later and Android 10 and later.',
  },
  {
    q: 'Which technologies do you build on?',
    a: 'The stack follows the product, not the other way around. In practice that is usually React and Next.js on the web, React Native on mobile, Node or Python services behind typed APIs, PostgreSQL for data, and AWS or Vercel for hosting.',
  },
  {
    q: 'What happens after launch?',
    a: 'Every build ships with logs, metrics and alerts already wired in. From there you can take it over yourself or keep us on a support plan covering monitoring, dependency updates, fixes and new feature work.',
  },
  {
    q: 'Can you work with our existing team or codebase?',
    a: 'Regularly. We come in for code and infrastructure audits, take over stalled projects, or embed alongside an in-house team to add backend or mobile capacity for a stretch.',
  },
]

// -------** FaqSection **---------
// Full-container split: the intro rail sticks on the left while the list scrolls,
// so the answers get the whole remaining container width instead of a narrow column.
export default function FaqSection() {
  return (
    <section id="faq" className="px-4 py-16 sm:px-8 sm:py-20 lg:px-16">
      <FaqSchema />

      <div className="container mx-auto grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] lg:gap-16">
        <FaqIntro />

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, index) => (
            <FaqItem key={faq.q} index={index} question={faq.q} answer={faq.a} open={index === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}

// JSON-LD mirrors the rendered FAQ content so search engines can surface it directly.
function FaqSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  )
}

// ---------- Left rail ----------
// No call to action here on purpose: CtaSection now sits directly underneath in
// the layout, and two "Book a Free Consultation" buttons a screen apart is one
// too many.
function FaqIntro() {
  return (
    <div className="text-center lg:sticky lg:top-24 lg:self-start lg:text-left">
      <p className="font-opensans text-xs font-semibold tracking-widest text-base-content/65 uppercase">
        Frequently asked
      </p>

      <h2 className="font-cinzel mt-4 text-4xl font-extrabold tracking-tight text-base-content sm:text-5xl">
        Everything you want to ask first.
      </h2>

      <p className="font-opensans mt-5 text-sm text-base-content/60 sm:text-base">
        The questions that come up on almost every first call — scope, timelines, ownership and what happens once your
        product is live.
      </p>
    </div>
  )
}

// ---------- One disclosure row ----------
// Native <details> keeps this keyboard- and screen-reader-friendly with no client
// JS; the shared `name` makes the browser close the previous row when a new one
// opens, so the list only ever has one answer expanded.
function FaqItem({ index, question, answer, open }) {
  return (
    <details
      name="faq"
      open={open}
      className="collapse-arrow collapse rounded-2xl border border-base-200 bg-base-100 shadow-sm transition-colors open:border-base-300 open:shadow-md hover:border-base-300"
    >
      <summary className="collapse-title flex items-start gap-3 text-left">
        <span className="font-opensans mt-0.5 text-xs font-semibold text-base-content/55 tabular-nums">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="font-opensans text-sm font-semibold text-base-content sm:text-base">{question}</span>
      </summary>

      <div className="collapse-content">
        <p className="font-opensans pl-8 text-sm text-base-content/60">{answer}</p>
      </div>
    </details>
  )
}
