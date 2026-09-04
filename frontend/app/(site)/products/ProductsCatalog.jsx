import React from 'react'

import { Scene, inkOf } from './ProductsScenes'

// Fifteen jobs stated as the result the customer wants, each with a plain write-up and its platforms.
const SERVICES = [
  {
    id: 'whatsapp',
    eyebrow: 'WhatsApp automation',
    title: 'Run your whole shop in one WhatsApp chat',
    icon: 'icon-[logos--whatsapp-icon]',
    intro: 'People already have WhatsApp open. Now your shop lives there too.',
    platforms: ['web'],
    scene: 'chat',
    ink: 'emerald',
    float: { title: 'One chat, start to finish', copy: 'Ask, order, pay, and get confirmed — all without leaving the chat.' },
    stat: { value: '24/7', label: 'Always answering', copy: 'It replies fast, day or night, even on a busy Sunday.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'People message the same number you already use. The moment they write, they get an answer — what you sell, what you have, and how much it costs. If they want to buy something, they order right there, get a link to pay, and see it confirmed the second they pay. It remembers what someone bought last time, so their next order takes just one line. It also sends reminders on its own. But if something is tricky — a big refund, an angry customer, an unusual question — it hands the chat to your team, with the whole story attached, so nobody has to explain themselves twice.',
    chips: [
      { icon: 'icon-[lucide--message-square]', label: 'Takes orders' },
      { icon: 'icon-[lucide--credit-card]', label: 'Sends payment' },
      { icon: 'icon-[lucide--bell-ring]', label: 'Chases replies' },
      { icon: 'icon-[lucide--users]', label: 'Hands to you' },
    ],
  },
  {
    id: 'health',
    eyebrow: 'Healthcare',
    title: 'A health app that knows the person using it',
    icon: 'icon-[lucide--heart-pulse]',
    intro: 'You log a reading, and it gives you a plan that actually changes.',
    platforms: ['ios', 'android', 'web'],
    scene: 'vitals',
    ink: 'rose',
    float: { title: 'Made for one person — you', copy: 'Your plan changes when your numbers change, not just at your next visit.' },
    stat: { value: '3×', label: 'More check-ins', copy: 'People log more when it takes one tap, not a paper diary.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'You open the app and see what to do today — take this reading, walk this far, drink this much water. Your watch or blood-pressure cuff sends the numbers in by itself, so there is nothing to type. When your numbers change, your plan changes too, and it tells you why in simple words, not a chart you have to figure out. If something looks wrong, it tells your clinic right away instead of just sitting there. Your doctor gets a simple one-page summary for each patient: what changed, what was missed, who needs a call. Records move between the app and the hospital by themselves, so nobody has to type them twice.',
    chips: [
      { icon: 'icon-[lucide--watch]', label: 'Wearable sync' },
      { icon: 'icon-[lucide--list-checks]', label: 'Daily plan' },
      { icon: 'icon-[lucide--stethoscope]', label: 'Clinic view' },
      { icon: 'icon-[lucide--bell]', label: 'Risk alerts' },
    ],
  },
  {
    id: 'teaching',
    eyebrow: 'Education',
    title: 'Teach on your own app, not someone else’s',
    icon: 'icon-[lucide--graduation-cap]',
    intro: 'You keep your students, your data, and your money.',
    platforms: ['ios', 'android', 'web'],
    scene: 'course',
    ink: 'indigo',
    float: { title: 'Your name on the door', copy: 'No other logo, no cut taken, no other teacher shown next to you.' },
    stat: { value: '0%', label: 'Platform cut', copy: 'Course fees go straight to you. The only fee is for handling payments.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'Students use your own app, not a marketplace where three other teachers are shown right next to you. Inside, they get the lessons, live classes, notes, and quizzes all in one place, and it remembers exactly where they left off. Live classes run on a set schedule with reminders, so people actually show up. Quizzes grade themselves, and certificates are handed out the moment someone finishes. You get a simple screen showing who is falling behind, where people give up, and who needs to renew. Fees are paid inside the app, and your course also gets its own web page, so people can find you on Google without you paying for ads.',
    chips: [
      { icon: 'icon-[lucide--video]', label: 'Live classes' },
      { icon: 'icon-[lucide--book-open]', label: 'Course library' },
      { icon: 'icon-[lucide--award]', label: 'Certificates' },
      { icon: 'icon-[lucide--trending-up]', label: 'Drop-off data' },
    ],
  },
  {
    id: 'bookings',
    eyebrow: 'Appointments',
    title: 'Take bookings while you sleep',
    icon: 'icon-[lucide--calendar-check]',
    intro: 'A slot gets filled at midnight — no one has to answer the phone.',
    platforms: ['web', 'ios', 'android'],
    scene: 'day',
    ink: 'amber',
    float: { title: 'Held, paid, confirmed', copy: 'A deposit turns a maybe into a real booking you can plan around.' },
    stat: { value: '−62%', label: 'No-shows', copy: 'A deposit and two reminders stop most empty seats.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'Customers open a page — no app to download, no account needed — pick a person, pick a time, and pay a small deposit to hold it. It only shows times you can actually cover, because it knows who works when, how long each job takes, and how much gap to leave between them. Reminders go out the day before and an hour before, which is when most no-shows happen. If someone cancels late, that slot goes back up for sale right away, and anyone waiting is told. Your team sees today’s plan on their phone, and you see the whole week. It also matches the calendar you already use, so nothing gets booked twice by mistake.',
    chips: [
      { icon: 'icon-[lucide--credit-card]', label: 'Deposits' },
      { icon: 'icon-[lucide--bell-ring]', label: 'Reminders' },
      { icon: 'icon-[lucide--users]', label: 'Staff rotas' },
      { icon: 'icon-[lucide--refresh-cw]', label: 'Waiting list' },
    ],
  },
  {
    id: 'food',
    eyebrow: 'Restaurants',
    title: 'Sell food without paying a big commission',
    icon: 'icon-[lucide--utensils-crossed]',
    intro: 'The order goes straight to your kitchen. The customer stays yours.',
    platforms: ['ios', 'android', 'web'],
    scene: 'kitchen',
    ink: 'orange',
    float: { title: 'Scan, order, done', copy: 'The QR code on the table opens your own menu, not an app full of your rivals.' },
    stat: { value: '0%', label: 'Marketplace fee', copy: 'On a ₹500 order, the 25% a delivery app usually takes stays with you.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'Every table gets a QR code. Scanning it opens your menu with today’s prices, and anything sold out is already hidden. The order goes straight to your kitchen screen, so nobody is running paper tickets around, and customers can pay right from their phone if they want. The same menu also works for takeaway and delivery. Because people order straight from you, you keep their phone number and can tell them about a Friday deal without paying anyone to reach them. You can change photos, prices, or sold-out items yourself in a minute, right from your phone in the kitchen. No developer needed, no waiting for an app store.',
    chips: [
      { icon: 'icon-[lucide--scan-qr-code]', label: 'Table QR' },
      { icon: 'icon-[lucide--truck]', label: 'Own delivery' },
      { icon: 'icon-[lucide--repeat]', label: 'Repeat orders' },
      { icon: 'icon-[lucide--percent]', label: 'Your offers' },
    ],
  },
  {
    id: 'agent',
    eyebrow: 'AI support',
    title: 'A support helper that reads your files, not a script',
    icon: 'icon-[lucide--bot]',
    intro: 'It reads your rules, so your customers don’t have to ask.',
    platforms: ['web'],
    scene: 'agent',
    ink: 'violet',
    float: { title: 'Shows its work', copy: 'Every answer points to the exact document and page it came from.' },
    stat: { value: '82%', label: 'Never reach a human', copy: 'The rest reach your team already summed up and sorted.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'We give it what you already have — your policies, your price list, your delivery rules, and last year’s support chats. From then on, it answers customers in seconds, in your tone, using only what is in those files. It never makes up an answer just to sound helpful — every reply names the exact document and page it came from, so you and the customer can both check it. You decide what it is not allowed to answer. Anything about a big refund, anything legal, or anything it is not sure about gets sent to a real person, along with a short summary of what was already asked. When you change a rule, you upload the new file, and the answers change that same day.',
    chips: [
      { icon: 'icon-[lucide--file-text]', label: 'Your documents' },
      { icon: 'icon-[lucide--check]', label: 'Cited answers' },
      { icon: 'icon-[lucide--split]', label: 'Escalation rules' },
      { icon: 'icon-[lucide--bar-chart-3]', label: 'Gap reports' },
    ],
  },
  {
    id: 'delivery',
    eyebrow: 'Logistics',
    title: 'Let customers watch their order arrive',
    icon: 'icon-[lucide--truck]',
    intro: 'The "where is my order" phone call stops happening.',
    platforms: ['ios', 'android', 'web'],
    scene: 'route',
    ink: 'sky',
    float: { title: 'A map, not a guess', copy: 'The arrival time updates with the traffic the driver is really stuck in.' },
    stat: { value: '−40%', label: 'Support calls', copy: 'People stop calling once they can see the van on a map.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'Your driver gets an app with today’s stops already sorted in the best order, turn-by-turn directions, and a spot to grab a signature or photo at the door. Your customer gets a link — no app to install — showing exactly where their order is, with an arrival time that updates as the driver moves, not a guess made in the morning. If a delivery fails, the reason and a photo are saved before the driver even leaves the street, which settles most complaints before they start. You see your whole team on one screen: who is running late, who is done, and what tomorrow should look like based on today.',
    chips: [
      { icon: 'icon-[lucide--map-pin]', label: 'Live map' },
      { icon: 'icon-[lucide--navigation]', label: 'Driver app' },
      { icon: 'icon-[lucide--image]', label: 'Photo proof' },
      { icon: 'icon-[lucide--route]', label: 'Route order' },
    ],
  },
  {
    id: 'membership',
    eyebrow: 'Fitness',
    title: 'A gym membership that renews itself',
    icon: 'icon-[lucide--dumbbell]',
    intro: 'A failed card shouldn’t quietly lose you a member.',
    platforms: ['ios', 'android', 'web'],
    scene: 'member',
    ink: 'emerald',
    float: { title: 'Check in, book, pay', copy: 'One app for the door, the class list, and the monthly fee.' },
    stat: { value: '+18%', label: 'Renewals kept', copy: 'Retrying a failed card politely saves most memberships that would’ve been lost.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'Members join on their phone, pick a plan, and get a code that opens the door. Classes are booked in the app, and if someone cancels, the next person on the waiting list is added automatically. The monthly fee is charged by itself. If a card fails, it tries again on the days cards usually work, and messages the member before they lose access — this alone saves memberships you would otherwise lose without even knowing. Pausing a membership for a holiday takes one tap, not a chat at the front desk. You can see who hasn’t shown up in three weeks — right when a friendly message still works.',
    chips: [
      { icon: 'icon-[lucide--user-check]', label: 'Door check-in' },
      { icon: 'icon-[lucide--calendar-check]', label: 'Class booking' },
      { icon: 'icon-[lucide--banknote]', label: 'Auto-billing' },
      { icon: 'icon-[lucide--trending-up]', label: 'At-risk list' },
    ],
  },
  {
    id: 'inventory',
    eyebrow: 'Retail',
    title: 'Stock that reorders itself before it runs out',
    icon: 'icon-[lucide--boxes]',
    intro: 'One count that your counter, website, and app all agree on.',
    platforms: ['web', 'android'],
    scene: 'stock',
    ink: 'sky',
    float: { title: 'Scan it, it’s counted', copy: 'A phone camera now does the job a handheld scanner used to.' },
    stat: { value: '1 count', label: 'Across every channel', copy: 'You can’t sell the same last item twice by accident anymore.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'Everything you sell lives in one list. The moment something sells — at the counter, on the website, or in the app — the count drops everywhere at once, so you never sell the last one twice and have to apologise. Staff scan barcodes with a phone to receive new stock or do a count, which now takes minutes instead of a whole Sunday. You set a minimum for each item, and when stock hits it, the system either warns you or sends the usual order to your supplier automatically. It also tells you the boring but costly stuff: what hasn’t sold in 90 days, what always runs out on weekends, and what you keep buying in tiny amounts.',
    chips: [
      { icon: 'icon-[lucide--scan-line]', label: 'Phone scanning' },
      { icon: 'icon-[lucide--bell]', label: 'Low-stock alerts' },
      { icon: 'icon-[lucide--file-text]', label: 'Auto purchase orders' },
      { icon: 'icon-[lucide--bar-chart-3]', label: 'Dead stock report' },
    ],
  },
  {
    id: 'field',
    eyebrow: 'Field teams',
    title: 'Send your crew out with the paperwork already done',
    icon: 'icon-[lucide--clipboard-list]',
    intro: 'It has to work even in a basement with no signal.',
    platforms: ['ios', 'android'],
    scene: 'job',
    ink: 'teal',
    float: { title: 'No signal? No problem', copy: 'Everything saves on the phone and sends itself once the signal returns.' },
    stat: { value: '0 bars', label: 'Still works', copy: 'Jobs, forms, and photos are captured even with zero connection.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'Each worker opens the app in the morning and sees today’s jobs in a sensible order, with the address, the site’s history, and a checklist for the work. They tick off tasks, take photos, and get the customer to sign right on the screen. None of this needs a signal — it saves on the phone and uploads the moment they are back in range, so nobody loses a day’s work in a basement. The office watches jobs turn green as they finish, and the report the customer gets is built from what actually happened on site, not typed up from memory two days later.',
    chips: [
      { icon: 'icon-[lucide--wifi-off]', label: 'Works offline' },
      { icon: 'icon-[lucide--list-checks]', label: 'Checklists' },
      { icon: 'icon-[lucide--image]', label: 'Photo proof' },
      { icon: 'icon-[lucide--signature]', label: 'On-site sign-off' },
    ],
  },
  {
    id: 'loyalty',
    eyebrow: 'Retention',
    title: 'Loyalty points and referrals that run by themselves',
    icon: 'icon-[lucide--gift]',
    intro: 'No paper cards, no stamps, no arguing at the till.',
    platforms: ['ios', 'android', 'web'],
    scene: 'points',
    ink: 'fuchsia',
    float: { title: 'Points you can actually see', copy: 'A balance on the phone beats a card that’s always lost.' },
    stat: { value: '2.4×', label: 'Repeat rate', copy: 'Members come back far more often than they used to.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'Customers earn points when they buy, and they see their balance on their phone instead of hunting for a card with a few stamps on it. Rewards unlock by themselves and apply at checkout, so your staff never have to guess if someone qualifies. Tiers give regulars something to aim for, and the app shows how close they are. Referrals work the same way: a customer shares a link, and when a friend buys, both people get their reward automatically — no code to remember, nothing to prove. You choose what earns points and what they are worth, and you can see clearly if the whole thing brings back enough business to be worth it.',
    chips: [
      { icon: 'icon-[lucide--star]', label: 'Points & tiers' },
      { icon: 'icon-[lucide--handshake]', label: 'Referral links' },
      { icon: 'icon-[lucide--gift]', label: 'Auto rewards' },
      { icon: 'icon-[lucide--bar-chart-3]', label: 'Scheme payback' },
    ],
  },
  {
    id: 'property',
    eyebrow: 'Real estate',
    title: 'Let buyers walk through a home before they drive there',
    icon: 'icon-[lucide--building-2]',
    intro: 'Fewer wasted visits. Better ones.',
    platforms: ['web', 'ios', 'android'],
    scene: 'listing',
    ink: 'amber',
    float: { title: 'Tour it from your sofa', copy: 'A video walkthrough answers questions that photos can’t.' },
    stat: { value: '−35%', label: 'Wasted viewings', copy: 'People who take the online tour arrive already interested.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'Each home gets its own page with real photos, a floor plan, and a video walkthrough, so someone can decide from their sofa if it’s worth the drive. Buyers save their searches and get told the second something new matches — often before it shows up on the big property sites. Booking a visit is one button, and it lands straight in your agent’s calendar with the buyer’s details attached. Your team updates a listing once, and it changes everywhere — website, app, and other listing sites — at the same time. Because your listing pages are built to show up in search, the enquiries you get are yours, not leads you had to buy back every month.',
    chips: [
      { icon: 'icon-[lucide--video]', label: 'Virtual tours' },
      { icon: 'icon-[lucide--search]', label: 'Saved searches' },
      { icon: 'icon-[lucide--bell-ring]', label: 'Instant alerts' },
      { icon: 'icon-[lucide--calendar-check]', label: 'Viewing booking' },
    ],
  },
  {
    id: 'marketplace',
    eyebrow: 'Marketplace',
    title: 'Let others sell for you — and get paid automatically',
    icon: 'icon-[lucide--store]',
    intro: 'The hard part is the money. That is the part we automate.',
    platforms: ['web', 'ios', 'android'],
    scene: 'payout',
    ink: 'blue',
    float: { title: 'Split the moment it sells', copy: 'Your share and their share are separated before anyone has to ask.' },
    stat: { value: 'T+1', label: 'Seller payouts', copy: 'Sellers get paid on schedule, with no spreadsheets on your side.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'Sellers sign themselves up, add what they’re selling, and manage their own orders and stock — your team never has to type in someone else’s catalogue. When a customer buys, the payment splits itself automatically: your commission to you, the rest set aside for the seller, with tax worked out correctly on both sides. Payouts happen on a schedule, and every seller can see exactly what they’re owed and why, which cuts out most of the emails you’d otherwise be answering. You decide who is allowed to sell, what quality of photo is okay, and what happens with a refund. Buyers just see one shop, one cart, and one checkout, no matter how many sellers are behind it.',
    chips: [
      { icon: 'icon-[lucide--user-check]', label: 'Vendor onboarding' },
      { icon: 'icon-[lucide--split]', label: 'Split payments' },
      { icon: 'icon-[lucide--wallet]', label: 'Auto payouts' },
      { icon: 'icon-[lucide--shield-check]', label: 'Listing rules' },
    ],
  },
  {
    id: 'events',
    eyebrow: 'Events',
    title: 'Sell tickets and keep the door moving',
    icon: 'icon-[lucide--ticket]',
    intro: 'The queue outside is a scanning problem, not a staffing one.',
    platforms: ['web', 'ios', 'android'],
    scene: 'ticket',
    ink: 'cyan',
    float: { title: 'Scans without wi-fi', copy: 'The door still works even when the venue’s wi-fi doesn’t.' },
    stat: { value: '3s', label: 'Per guest at the door', copy: 'Scanning a ticket beats hunting for a name on a printed list.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'You set up a page with your ticket types — early bird, general, VIP, whatever you’re selling — and it takes payment and sends a QR ticket straight to each buyer’s phone and email. At the door, your staff scan tickets with their own phones. It works even with no wi-fi, because the guest list is already saved on the phone, and a ticket that has already been scanned won’t work again, even on a different phone. You watch the headcount grow live, so you know exactly when to open another door or stop selling. Afterwards, you keep the full list of who came, so your next event starts with real people, not an empty mailing list.',
    chips: [
      { icon: 'icon-[lucide--ticket]', label: 'Tiered tickets' },
      { icon: 'icon-[lucide--scan-qr-code]', label: 'Offline entry' },
      { icon: 'icon-[lucide--users]', label: 'Live headcount' },
      { icon: 'icon-[lucide--repeat]', label: 'Attendee list' },
    ],
  },
  {
    id: 'invoicing',
    eyebrow: 'Trades & studios',
    title: 'Turn a quote into money without chasing anyone',
    icon: 'icon-[lucide--receipt]',
    intro: 'Quote, signature, invoice, and reminder — all in one flow.',
    platforms: ['web', 'ios'],
    scene: 'quote',
    ink: 'slate',
    float: { title: 'Signed on a phone', copy: 'Approved on the spot — no printer, no scanner needed.' },
    stat: { value: '11 days', label: 'Faster payment', copy: 'Automatic reminders collect what a busy week would forget.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'You build a quote using the prices you already use, and send it as a link. Your client opens it on their phone, sees exactly what’s included, and signs it right there — no printing, no scanning. The moment it’s approved, it becomes a job, and once the work is done, it becomes an invoice with the same numbers already on it, so nothing gets retyped or missed. If it isn’t paid, reminders go out by themselves, politely, on a schedule you choose — the part everyone hates doing. You can see at a glance what’s been quoted, what’s approved, what’s invoiced, and what’s actually overdue.',
    chips: [
      { icon: 'icon-[lucide--file-text]', label: 'Quick quotes' },
      { icon: 'icon-[lucide--signature]', label: 'E-signature' },
      { icon: 'icon-[lucide--receipt]', label: 'Auto invoicing' },
      { icon: 'icon-[lucide--banknote]', label: 'Payment chasing' },
    ],
  },
]

const PLATFORM_META = {
  ios: { label: 'iOS app', short: 'iOS', icon: 'icon-[simple-icons--apple]' },
  android: { label: 'Android app', short: 'Android', icon: 'icon-[simple-icons--android]' },
  web: { label: 'Website', short: 'Web', icon: 'icon-[lucide--globe]' },
}

// Even entries render as a plate; odd entries cycle through the other three layouts.
const LAYOUTS = [FigureBlock, SpecBlock, PlainBlock]

export default function ProductsCatalog() {
  return (
    <section id="catalog" className="px-4 py-16 sm:px-8 sm:py-20 lg:px-16">
      <div className="container mx-auto flex max-w-7xl flex-col gap-20 sm:gap-28">
        {SERVICES.map((service, index) => {
          const Block = index % 2 === 1 ? PlateBlock : LAYOUTS[Math.floor(index / 2) % LAYOUTS.length]
          return <Block key={service.id} service={service} index={index} />
        })}
      </div>

      <p className="font-opensans mt-16 text-center text-sm text-base-content/50">
        Don't see what you need? It's still the same team —{' '}
        <a href="#contact" className="font-semibold text-base-content underline underline-offset-4">
          tell us what you want
        </a>{' '}
        and we'll tell you how we can build it.
      </p>
    </section>
  )
}

// ---------- Shared parts ----------
function num(index) {
  return String(index + 1).padStart(2, '0')
}

function platformLine(service) {
  return service.platforms.map((platform) => PLATFORM_META[platform].short).join(' · ')
}

// One flat surface for every screenshot, so it reads as photographed, not styled.
function Figure({ service, className = '' }) {
  return (
    <div className={`flex justify-center rounded-lg border border-base-200 bg-base-200/40 p-5 sm:p-6 ${className}`}>
      <Scene service={service} bare />
    </div>
  )
}

function Spec({ label, children, className = '' }) {
  return (
    <div className={className}>
      <p className="font-opensans text-[10px] font-semibold tracking-widest text-base-content/35 uppercase">{label}</p>
      <div className="font-opensans mt-1 text-[13px] text-base-content/70">{children}</div>
    </div>
  )
}

// Layout one: figure and caption, printed-catalogue style — nothing floats or glows.
function FigureBlock({ service, index }) {
  const ink = inkOf(service)

  return (
    <article id={service.id} className="scroll-mt-24">
      <span aria-hidden="true" className={`block h-0.5 w-10 ${ink.bg}`} />

      <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <p className="font-mono text-[11px] font-semibold tracking-wide text-base-content">
          {num(index)} / {service.eyebrow}
        </p>
        <p className="font-opensans ml-auto text-[11px] text-base-content/40">{platformLine(service)}</p>
      </div>

      <h3 className="font-cinzel mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-base-content sm:text-4xl">
        {service.title}
      </h3>

      <div className="mt-8 grid gap-8 lg:grid-cols-[22rem_1fr] lg:gap-14">
        <figure className="m-0">
          <Figure service={service} />

          <figcaption className="font-opensans mt-3 text-[11px] leading-relaxed text-base-content/45">
            <span className="font-mono text-base-content/35">Fig. {num(index)}</span> — {service.float.title}.{' '}
            {service.float.copy}
          </figcaption>
        </figure>

        <div>
          <p className="font-opensans text-base leading-relaxed text-base-content/80 sm:text-lg">{service.intro}</p>

          <p className="font-opensans mt-4 text-sm leading-relaxed text-base-content/60">{service.description}</p>

          <p className="font-opensans mt-5 flex items-baseline gap-2.5 text-sm leading-relaxed text-base-content/60">
            <span className={`font-cinzel shrink-0 text-lg font-bold ${ink.text}`}>{service.stat.value}</span>
            <span>
              <span className="font-semibold text-base-content/80">{service.stat.label.toLowerCase()}</span> —{' '}
              {service.stat.copy}
            </span>
          </p>

          <p className="font-opensans mt-6 border-t border-base-200 pt-4 text-[12px] text-base-content/45">
            {service.chips.map((chip) => chip.label).join(' · ')}
          </p>
        </div>
      </div>
    </article>
  )
}

// Layout two: a datasheet — countable facts sit in a left spec column beside the prose.
function SpecBlock({ service, index }) {
  const ink = inkOf(service)

  return (
    <article id={service.id} className="scroll-mt-24 border-y border-base-200 py-10">
      <div className="grid gap-8 lg:grid-cols-[12rem_1fr] lg:gap-12">
        {/* order-2 keeps the headline first on mobile — the spec sheet is
            reference material, not the pitch, so it follows instead of leading. */}
        <aside className="order-2 flex flex-col gap-5 lg:order-0">
          <div className="flex items-center gap-2 border-b border-base-200 pb-4">
            <span aria-hidden="true" className={`${service.icon} size-4 ${ink.text}`} />
            <p className="font-mono text-[11px] font-semibold text-base-content">{num(index)}</p>
          </div>

          <Spec label="Sector">{service.eyebrow}</Spec>

          <Spec label="Platforms">
            {service.platforms.map((platform) => (
              <span key={platform} className="block">
                {PLATFORM_META[platform].label}
              </span>
            ))}
          </Spec>

          <Spec label={service.stat.label}>
            <span className={`font-cinzel text-2xl font-extrabold ${ink.text}`}>{service.stat.value}</span>
          </Spec>

          <Spec label="Includes">
            <ul className="flex list-none flex-col gap-1 p-0">
              {service.chips.map((chip) => (
                <li key={chip.label} className="text-[12px] text-base-content/60">
                  {chip.label}
                </li>
              ))}
            </ul>
          </Spec>
        </aside>

        <div className="order-1 flex h-full flex-col lg:order-0">
          <h3 className="font-cinzel text-3xl font-extrabold tracking-tight text-base-content sm:text-4xl">
            {service.title}
          </h3>

          <p className="font-opensans mt-3 max-w-2xl text-base leading-relaxed text-base-content/70">{service.intro}</p>

          <div className="mt-6 flex flex-1 flex-col gap-6 sm:flex-row sm:gap-8">
            <div className="flex shrink-0 flex-col rounded-lg border border-base-200 bg-base-200/40 p-5 sm:w-80">
              <div className="flex flex-1 items-center justify-center">
                <Scene service={service} bare />
              </div>

              <p className="font-opensans mt-4 border-t border-base-200 pt-3 text-[11px] leading-relaxed text-base-content/45">
                <span className="font-semibold text-base-content/60">{service.float.title}</span> — {service.float.copy}
              </p>
            </div>

            <div>
              <p className="font-opensans text-sm leading-relaxed text-base-content/60">{service.description}</p>
              <p className="font-opensans mt-4 text-[12px] leading-relaxed text-base-content/45">
                {service.stat.copy}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

// Layout three: the original shape, deflated — keeps pills and heading, drops gradients and glass.
function PlainBlock({ service, index }) {
  const ink = inkOf(service)

  return (
    <article id={service.id} className="scroll-mt-24">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-base-200 pb-4">
        <span aria-hidden="true" className={`${service.icon} size-5 shrink-0 ${ink.text}`} />

        <h3 className="font-cinzel text-2xl font-extrabold tracking-tight text-base-content sm:text-3xl">
          {service.title}
        </h3>

        <p className="font-mono ml-auto text-[11px] font-semibold text-base-content">
          {num(index)} / {service.eyebrow}
        </p>
      </header>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_22rem] lg:gap-12">
        <div>
          <p className="font-opensans max-w-2xl text-base leading-relaxed text-base-content/70">{service.intro}</p>

          <p className="mt-5 border-l-2 border-base-300 pl-4">
            <span className="font-cinzel text-2xl font-extrabold tracking-tight text-base-content">
              {service.stat.value}
            </span>{' '}
            <span className="font-opensans text-[10px] font-semibold tracking-widest text-base-content/40 uppercase">
              {service.stat.label}
            </span>
            <span className="font-opensans mt-1 block text-[13px] leading-relaxed text-base-content/55">
              {service.stat.copy}
            </span>
          </p>

          <h4 className="font-opensans mt-6 text-sm font-bold text-base-content">{service.summaryTitle}</h4>
          <p className="font-opensans mt-2 max-w-2xl text-sm leading-relaxed text-base-content/60">
            {service.description}
          </p>
        </div>

        <aside>
          <Figure service={service} />

          <p className="font-opensans mt-3 text-[11px] leading-relaxed text-base-content/45">
            <span className="font-semibold text-base-content/60">{service.float.title}</span> — {service.float.copy}
          </p>

          <div className="mt-5 border-t border-base-200 pt-5">
            <ul className="grid list-none grid-cols-2 gap-x-4 gap-y-2.5 p-0">
              {service.chips.map((chip) => (
                <li
                  key={chip.label}
                  className="font-opensans flex items-center gap-2 text-[12px] text-base-content/60"
                >
                  <span aria-hidden="true" className={`${chip.icon} size-3.5 shrink-0 ${ink.text}`} />
                  {chip.label}
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap gap-2">
              {service.platforms.map((platform) => (
                <span
                  key={platform}
                  className="font-opensans flex items-center gap-1.5 rounded-full border border-base-200 px-2.5 py-1 text-[11px] text-base-content/55"
                >
                  <span aria-hidden="true" className={`${PLATFORM_META[platform].icon} size-3`} />
                  {PLATFORM_META[platform].label}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </article>
  )
}

// Layout four: the plate — full-width headline, screenshot mounted as a plate, write-up in two columns.
function PlateBlock({ service, index }) {
  const ink = inkOf(service)

  return (
    <article id={service.id} className="scroll-mt-24">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-base-200 pb-3">
        <span aria-hidden="true" className={`${service.icon} size-4 shrink-0 ${ink.text}`} />
        <p className="font-mono text-[11px] font-semibold tracking-wide text-base-content">{num(index)}</p>
        <p className="font-opensans text-[11px] font-bold tracking-[0.18em] text-base-content uppercase">
          {service.eyebrow}
        </p>
        <p className="font-opensans ml-auto text-[11px] text-base-content/40">{platformLine(service)}</p>
      </div>

      <h3 className="font-cinzel mt-5 max-w-4xl text-3xl font-extrabold tracking-tight text-base-content sm:text-4xl">
        {service.title}
      </h3>

      <p className="font-opensans mt-3 max-w-2xl text-base leading-relaxed text-base-content/70 sm:text-lg">
        {service.intro}
      </p>

      <div className="mt-7 flex flex-col gap-6 rounded-lg border border-base-200 bg-base-200/40 p-5 sm:flex-row sm:items-center sm:gap-8 sm:p-6 lg:gap-10">
        <div className="flex justify-center sm:w-72 sm:shrink-0">
          <Scene service={service} bare />
        </div>

        <p className="font-opensans flex-1 text-sm leading-relaxed text-base-content/65">
          <span className="font-semibold text-base-content/80">{service.float.title}</span> — {service.float.copy}
        </p>

        <p className="flex flex-1 items-baseline gap-3 border-t border-base-300 pt-5 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8">
          <span className={`font-cinzel shrink-0 text-3xl font-extrabold ${ink.text}`}>{service.stat.value}</span>
          <span>
            <span className="font-opensans text-[10px] font-semibold tracking-widest text-base-content/45 uppercase">
              {service.stat.label}
            </span>
            <span className="font-opensans mt-1 block text-[13px] leading-relaxed text-base-content/60">
              {service.stat.copy}
            </span>
          </span>
        </p>
      </div>

      <div className="mt-8 max-w-5xl">
        <h4 className="font-opensans text-[10px] font-semibold tracking-widest text-base-content/40 uppercase">
          In practice
        </h4>
        <p className="font-opensans mt-3 text-sm leading-relaxed text-base-content/65 lg:columns-2 lg:gap-12">
          {service.description}
        </p>
      </div>

      <p className="font-opensans mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-base-200 pt-4">
        <span className="text-[10px] font-semibold tracking-widest text-base-content/40 uppercase">Includes</span>
        <span className="text-[12px] text-base-content/55">{service.chips.map((chip) => chip.label).join(' · ')}</span>
      </p>
    </article>
  )
}
