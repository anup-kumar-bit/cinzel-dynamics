import React from 'react'
import Image from 'next/image'

// `organic` flags the free row, so the table says so instead of printing a misleading £0.00 CPL.
const REPORT = [
  {
    channel: 'Google Search ads',
    icon: 'icon-[logos--google-ads]',
    spend: '£1,240',
    clicks: '1,860',
    enquiries: '86',
    cost: '£14.42',
  },
  {
    channel: 'Instagram & Meta',
    icon: 'icon-[logos--meta-icon]',
    spend: '£840',
    clicks: '2,410',
    enquiries: '61',
    cost: '£13.77',
  },
  {
    channel: 'Business Profile & Maps',
    icon: 'icon-[logos--google-maps]',
    spend: '—',
    clicks: '640',
    enquiries: '47',
    cost: 'organic',
  },
]

const SERVICES = [
  { name: 'Google Ads & Performance Max', detail: 'Search, shopping and remarketing, run on your own ad account.' },
  { name: 'Meta, Instagram & TikTok', detail: 'Creative, audiences and the tracking that proves what converted.' },
  { name: 'Google Business Profile', detail: 'Maps listing, photos, hours, posts and review replies kept current.' },
  { name: 'Landing pages that convert', detail: 'One page per campaign, built to the offer — not your homepage.' },
  { name: 'Email & WhatsApp campaigns', detail: 'Follow-up sequences for the enquiries that did not buy first time.' },
  { name: 'GA4 & attribution', detail: 'Events, conversions and call tracking wired up before the spend starts.' },
]

// Runs as printed matter, unlike the grid/panel sections beside it: ad figures, a report table, an index.
export default function DigitalMarketingSection() {
  return (
    <section id="marketing" className="px-4 py-16 sm:px-8 sm:py-20 lg:px-16">
      <div className="container mx-auto flex flex-col items-center text-center">
        <p className="font-opensans text-xs font-semibold tracking-widest text-base-content/65 uppercase">
          Digital marketing
        </p>

        <h2 className="font-cinzel mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-base-content sm:text-5xl">
          Take the business digital. Then put it in front of people.
        </h2>

        <p className="font-opensans mt-5 max-w-xl text-sm text-base-content/60 sm:text-base">
          A website is where they land — ads, listings and social are how they get there. We open the accounts, write
          the creative, run the spend and send one report that says what it bought.
        </p>
      </div>

      {/* Three placements, as they actually appear to a customer */}
      <div className="container mx-auto mt-16 grid max-w-7xl gap-8 lg:grid-cols-3">
        <Figure caption="Fig. 1 — Paid search. Top of the page, only on queries with buying intent.">
          <SearchAd />
        </Figure>

        <Figure caption="Fig. 2 — Social. Same offer, written for a feed instead of a search bar.">
          <SocialAd />
        </Figure>

        <Figure caption="Fig. 3 — Maps. The listing people call from without visiting the site at all.">
          <LocalListing />
        </Figure>
      </div>

      <MonthlyReport />

      <ServiceIndex />
    </section>
  )
}

// Shared figure frame so all three creatives sit on the same baseline grid.
function Figure({ caption, children }) {
  return (
    <figure className="flex flex-col">
      <div className="flex-1">{children}</div>
      <figcaption className="font-opensans mt-3 border-t border-base-200 pt-3 text-xs leading-relaxed text-base-content/50">
        {caption}
      </figcaption>
    </figure>
  )
}

// ---------- Fig. 1: a sponsored result ----------
function SearchAd() {
  return (
    <div className="h-full rounded-2xl bg-white p-4 shadow-lg sm:p-5">
      <p className="font-mono text-[10px] text-neutral-400">query — “app development agency near me”</p>

      <div className="mt-3 border-t border-neutral-100 pt-3">
        <p className="font-opensans text-[11px] font-bold text-neutral-800">Sponsored</p>

        <div className="mt-2 flex items-center gap-2">
          <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-neutral-200">
            <Image src="/svgs/logoA.svg" alt="" width={1254} height={1254} className="size-full object-cover" />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="font-opensans truncate text-[11px] font-medium text-neutral-800">Cinzel Dynamics</p>
            <p className="font-opensans truncate text-[10px] text-neutral-500">cinzeldynamics.com/quote</p>
          </div>
        </div>

        <p className="font-opensans mt-2 text-sm font-medium text-[#1a0dab] sm:text-base">
          Custom App Development — Fixed Quote in 48 Hours
        </p>
        <p className="font-opensans mt-1 text-[11px] leading-relaxed text-neutral-600 sm:text-xs">
          Backends, web platforms and mobile apps built by the team that maintains them. UK hours, references on
          request.
        </p>

        {/* Sitelinks — the extra rows an ad earns once it is set up properly */}
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-neutral-100 pt-3">
          {['See the portfolio', 'Pricing & timelines', 'Book a call', 'What we build'].map((link) => (
            <p key={link} className="font-opensans truncate text-[11px] text-[#1a0dab]">
              {link}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------- Fig. 2: a feed ad ----------
function SocialAd() {
  return (
    <div className="h-full overflow-hidden rounded-2xl bg-white shadow-lg">
      <div className="flex items-center gap-2 px-3.5 py-3">
        <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-neutral-200">
          <Image src="/svgs/logoA.svg" alt="" width={1254} height={1254} className="size-full object-cover" />
        </span>
        <div className="min-w-0 leading-tight">
          <p className="font-opensans truncate text-[11px] font-semibold text-neutral-900">cinzeldynamics</p>
          <p className="font-opensans truncate text-[10px] text-neutral-500">Sponsored</p>
        </div>
        <span aria-hidden="true" className="icon-[lucide--ellipsis] ml-auto size-4 shrink-0 text-neutral-400" />
      </div>

      {/* The creative itself: typeset copy, which is what these ads actually are */}
      <div className="relative bg-slate-950 px-6 py-9">
        <p className="font-cinzel text-2xl leading-tight font-extrabold text-white">
          Still taking bookings
          <br />
          by phone?
        </p>
        <p className="font-opensans mt-3 max-w-60 text-xs leading-relaxed text-white/60">
          A booking system your customers use at 11pm, wired into the calendar you already keep.
        </p>
        <p className="font-opensans mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold text-neutral-900">
          Get a quote
          <span aria-hidden="true" className="icon-[lucide--arrow-right] size-3.5" />
        </p>
      </div>

      <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-3.5 py-2.5">
        <p className="font-opensans text-[11px] font-semibold text-neutral-900">Learn more</p>
        <span aria-hidden="true" className="icon-[lucide--chevron-right] size-4 text-neutral-400" />
      </div>

      <div className="px-3.5 py-3">
        <div className="flex items-center gap-3.5 text-neutral-800">
          <span aria-hidden="true" className="icon-[lucide--heart] size-5" />
          <span aria-hidden="true" className="icon-[lucide--message-circle] size-5" />
          <span aria-hidden="true" className="icon-[lucide--send] size-5" />
          <span aria-hidden="true" className="icon-[lucide--bookmark] ml-auto size-5" />
        </div>

        <p className="font-opensans mt-2.5 text-[11px] font-semibold text-neutral-900">1,284 likes</p>
        <p className="font-opensans mt-1 text-[11px] leading-relaxed text-neutral-600">
          <span className="font-semibold text-neutral-900">cinzeldynamics</span> Six weeks from first call to live
          bookings. Link in bio.
        </p>
      </div>
    </div>
  )
}

// ---------- Fig. 3: the Maps listing ----------
function LocalListing() {
  return (
    <div className="h-full overflow-hidden rounded-2xl bg-white shadow-lg">
      <MapStrip />

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-opensans truncate text-sm font-semibold text-neutral-900">Cinzel Dynamics</p>
            <p className="font-opensans mt-0.5 text-[11px] text-neutral-500">Software company · Open until 18:00</p>
          </div>
          <span className="font-opensans flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            <span aria-hidden="true" className="icon-[lucide--badge-check] size-3" />
            Verified
          </span>
        </div>

        <div className="mt-2 flex items-center gap-1.5">
          <span className="font-opensans text-[11px] font-semibold text-neutral-800">4.9</span>
          <span aria-hidden="true" className="font-opensans text-[11px] tracking-tight text-amber-500">
            ★★★★★
          </span>
          <span className="font-opensans text-[10px] text-neutral-500">128 Google reviews</span>
        </div>

        <div className="mt-3.5 flex flex-wrap gap-2">
          {[
            { label: 'Directions', icon: 'icon-[lucide--navigation]' },
            { label: 'Call', icon: 'icon-[lucide--phone]' },
            { label: 'Website', icon: 'icon-[lucide--globe]' },
          ].map((action) => (
            <span
              key={action.label}
              className="font-opensans flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1 text-[11px] font-medium text-[#1a73e8]"
            >
              <span aria-hidden="true" className={`${action.icon} size-3.5`} />
              {action.label}
            </span>
          ))}
        </div>

        <p className="font-opensans mt-4 border-t border-neutral-100 pt-3 text-[11px] leading-relaxed text-neutral-600">
          “Found them on Maps, called at 9am, had a quote the same day.”
          <span className="mt-1 block text-[10px] text-neutral-400">Local review · 2 weeks ago</span>
        </p>
      </div>
    </div>
  )
}

// Flat street plan, not a screenshot — reads as a map without pretending to be a real address.
function MapStrip() {
  return (
    <div className="relative h-24 w-full">
      <svg viewBox="0 0 320 96" preserveAspectRatio="none" className="size-full" aria-hidden="true">
        <rect width="320" height="96" fill="#eaeff2" />
        <rect x="18" y="8" width="70" height="34" rx="3" fill="#dfe8dc" />
        <rect x="232" y="52" width="74" height="40" rx="3" fill="#dfe8dc" />
        <g stroke="#ffffff" strokeLinecap="square">
          <path d="M0 47h320" strokeWidth="11" />
          <path d="M104 0v96" strokeWidth="8" />
          <path d="M228 0v96" strokeWidth="5" />
          <path d="M0 76h320" strokeWidth="5" />
          <path d="M46 47 L0 12" strokeWidth="5" />
        </g>
        <path d="M104 47h124" stroke="#f5c518" strokeWidth="4" />
      </svg>

      <span
        aria-hidden="true"
        className="icon-[lucide--map-pin] absolute top-1/2 left-1/2 size-7 -translate-x-1/2 -translate-y-full text-red-500 drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
      />
    </div>
  )
}

// ---------- The report, as a report ----------
function MonthlyReport() {
  return (
    <figure className="container mx-auto mt-16 max-w-7xl">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-base-content/20 pb-3">
        <p className="font-opensans text-sm font-semibold text-base-content">Where the month went</p>
        <p className="font-mono text-[11px] text-base-content/45">01–31 · all channels</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-xl border-collapse text-left">
          <thead>
            <tr className="font-opensans text-[10px] tracking-widest text-base-content/50 uppercase">
              <th scope="col" className="py-2.5 pr-4 font-semibold">
                Channel
              </th>
              <th scope="col" className="py-2.5 pr-4 text-right font-semibold">
                Spend
              </th>
              <th scope="col" className="py-2.5 pr-4 text-right font-semibold">
                Clicks
              </th>
              <th scope="col" className="py-2.5 pr-4 text-right font-semibold">
                Enquiries
              </th>
              <th scope="col" className="py-2.5 text-right font-semibold">
                Cost each
              </th>
            </tr>
          </thead>

          <tbody>
            {REPORT.map((row) => (
              <tr key={row.channel} className="border-t border-base-200">
                <th scope="row" className="py-3 pr-4 font-normal">
                  <span className="font-opensans flex items-center gap-2.5 text-sm text-base-content/80">
                    <span aria-hidden="true" className={`${row.icon} size-4 shrink-0`} />
                    {row.channel}
                  </span>
                </th>
                <td className="py-3 pr-4 text-right font-mono text-sm tabular-nums text-base-content/70">
                  {row.spend}
                </td>
                <td className="py-3 pr-4 text-right font-mono text-sm tabular-nums text-base-content/70">
                  {row.clicks}
                </td>
                <td className="py-3 pr-4 text-right font-mono text-sm tabular-nums text-base-content">
                  {row.enquiries}
                </td>
                <td className="py-3 text-right font-mono text-sm tabular-nums text-base-content/70">{row.cost}</td>
              </tr>
            ))}

            <tr className="border-t border-base-content/20">
              <th scope="row" className="font-opensans py-3 pr-4 text-sm font-semibold text-base-content">
                Total
              </th>
              <td className="py-3 pr-4 text-right font-mono text-sm font-semibold tabular-nums text-base-content">
                £2,080
              </td>
              <td className="py-3 pr-4 text-right font-mono text-sm font-semibold tabular-nums text-base-content">
                4,910
              </td>
              <td className="py-3 pr-4 text-right font-mono text-sm font-semibold tabular-nums text-base-content">
                194
              </td>
              <td className="py-3 text-right font-mono text-sm font-semibold tabular-nums text-base-content">
                £10.72
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <figcaption className="font-opensans mt-3 text-xs leading-relaxed text-base-content/50">
        The shape of the report that lands on the 1st — figures here are illustrative, yours come straight from your own
        ad and analytics accounts, which stay in your name.
      </figcaption>
    </figure>
  )
}

// ---------- What actually gets run ----------
function ServiceIndex() {
  return (
    <div className="container mx-auto mt-16 max-w-7xl">
      <p className="font-opensans text-xs font-semibold tracking-widest text-base-content/65 uppercase">
        What we run
      </p>

      <div className="mt-5 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service, index) => (
          <div key={service.name} className="flex gap-4 border-t border-base-200 py-4">
            <span className="font-mono text-[11px] leading-6 text-base-content/35">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0">
              <p className="font-opensans text-sm font-medium text-base-content">{service.name}</p>
              <p className="font-opensans mt-1 text-xs leading-relaxed text-base-content/50">{service.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
