import React from 'react'

import { Scene } from './ServiceScenes'

// Fifteen jobs stated as the result the customer wants. Every entry carries the
// plain-language write-up, the platforms it ships on, and the web address a
// customer would land on — null where the thing is an internal tool.
const SERVICES = [
  {
    id: 'whatsapp',
    eyebrow: 'WhatsApp automation',
    title: 'Run the whole shop from one WhatsApp thread',
    icon: 'icon-[logos--whatsapp-icon]',
    intro: 'Your customers already have WhatsApp open. This puts the shop inside it.',
    platforms: ['web'],
    scene: 'chat',
    site: 'order.yourshop.com',
    accent: 'from-emerald-100 via-teal-100 to-green-50',
    tint: 'from-emerald-400 to-teal-500',
    float: { title: 'One thread, start to finish', copy: 'Ask, order, pay and get confirmed without leaving the chat.' },
    stat: { value: '24/7', label: 'Always answering', copy: 'Replies land in seconds at 2am, on a Sunday, and in your busiest hour.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'People message the same number you already give out. The moment they do, they get an answer — what you sell, what is in stock, what it costs. If they want something, it takes the order in the chat, sends a payment link, and confirms the second the money lands. It remembers what someone bought last time, so a repeat order takes one line from them. Appointment reminders and follow-ups go out on their own. Nothing important is left to a machine: if a question is unusual, a refund is large, or someone sounds upset, the chat moves to your team with the whole history attached, so nobody has to ask the customer to explain again.',
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
    title: 'A health app that knows the person holding it',
    icon: 'icon-[lucide--heart-pulse]',
    intro: 'Readings go in, a plan that actually changes comes out.',
    platforms: ['ios', 'android', 'web'],
    scene: 'duo',
    site: 'care.yourclinic.com',
    accent: 'from-rose-100 via-pink-100 to-orange-50',
    tint: 'from-rose-400 to-pink-500',
    float: { title: 'Built around one patient', copy: 'The plan moves when their numbers move, not at the next appointment.' },
    stat: { value: '3×', label: 'More check-ins', copy: 'People log more when logging takes one tap instead of a paper diary.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'The patient opens the app and sees what to do today — take this reading, walk this far, drink this much. Their watch or blood-pressure cuff sends numbers straight in, so there is nothing to type. When the numbers drift, the plan adjusts and they get told why in language they understand, not a chart they have to decode. Anything that looks wrong raises a flag with the clinic instead of sitting in the app unread. Your doctors get a web dashboard on the other side with a one-page summary per patient: what changed, what was missed, what needs a call. Records go in and out in the formats hospitals already use, so nobody retypes anything.',
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
    title: 'Teach on your own app, not somebody else’s platform',
    icon: 'icon-[lucide--graduation-cap]',
    intro: 'You keep the students, the data and the money.',
    platforms: ['ios', 'android', 'web'],
    scene: 'duo',
    site: 'learn.youracademy.com',
    accent: 'from-indigo-100 via-violet-100 to-sky-50',
    tint: 'from-indigo-400 to-violet-500',
    float: { title: 'Your name on the door', copy: 'No marketplace logo, no cut taken, no competitor advertised beside you.' },
    stat: { value: '0%', label: 'Platform cut', copy: 'Course fees land in your account. The only fee is the payment processor.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'Students download your app, not a marketplace where three other teachers are advertised beside you. Inside, they get the course, the live class, the notes and the quiz in one place, and it remembers where they stopped. Live batches run on a schedule with reminders, so attendance stops depending on who checked their email. Quizzes mark themselves and certificates issue automatically when someone finishes. On your side there is a web panel showing who is falling behind, which lesson people quit on, and who is due to renew. Fees are collected in the app, and the website that comes with it has a public page per course, so search engines can send you students you did not pay for.',
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
    intro: 'The slot gets filled at midnight without anyone answering the phone.',
    platforms: ['web', 'ios', 'android'],
    scene: 'duo',
    site: 'book.yoursalon.com',
    accent: 'from-amber-50 via-orange-100 to-rose-50',
    tint: 'from-amber-400 to-orange-500',
    float: { title: 'Held, paid, confirmed', copy: 'A deposit turns a maybe into a booking you can plan staff around.' },
    stat: { value: '−62%', label: 'No-shows', copy: 'A deposit and two reminders remove most of the empty chairs.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'Customers open a page — no download, no account — pick a person, pick a time, and pay a deposit to hold it. The calendar only offers slots you can actually staff, because it knows who works when, how long each service takes and how much gap to leave between them. Reminders go out the day before and an hour before, which is where most no-shows disappear. If someone cancels late, the slot goes back on sale automatically and anyone on the waiting list is told. Your team sees the day on their phone, and you see the week. It syncs with the calendar you already use, so nothing gets double-booked while somebody was writing it down.',
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
    title: 'Sell food without handing over a commission',
    icon: 'icon-[lucide--utensils-crossed]',
    intro: 'The order lands in your kitchen, and the customer stays yours.',
    platforms: ['ios', 'android', 'web'],
    scene: 'duo',
    site: 'menu.yourkitchen.com',
    accent: 'from-orange-100 via-amber-100 to-yellow-50',
    tint: 'from-orange-400 to-amber-500',
    float: { title: 'Scan, order, done', copy: 'The table QR opens your menu — not an aggregator with your rivals on it.' },
    stat: { value: '0%', label: 'Marketplace fee', copy: 'On a ₹500 order, the 25% an aggregator takes stays in the till.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'Every table gets a QR code. Scanning it opens your menu with today’s prices and whatever has actually run out already hidden. The order goes straight to the kitchen screen, so nobody is walking dockets around, and payment happens on the phone if you want it to. The same menu works for takeaway and delivery, and because customers order from you rather than an aggregator, you keep their number and can tell them about a Friday special without paying to reach them. Photographs, prices and sold-out items are changed by you in a minute, from a phone, standing in the kitchen. Nothing needs a developer and nothing waits for an app store review.',
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
    title: 'Support that answers from your documents, not a script',
    icon: 'icon-[lucide--bot]',
    intro: 'It reads your policies so your customers do not have to.',
    platforms: ['web'],
    scene: 'agent',
    site: 'help.yourbrand.com',
    accent: 'from-violet-100 via-fuchsia-100 to-indigo-50',
    tint: 'from-violet-400 to-fuchsia-500',
    float: { title: 'Shows its working', copy: 'Every answer names the document and page it came from.' },
    stat: { value: '82%', label: 'Never reach a human', copy: 'The rest arrive at your team already summarised and sorted.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'We feed it what you already have — your policy documents, price list, delivery terms and the last year of support tickets. After that it answers customers in seconds, in your tone, using only what is in those files. It does not invent an answer to look helpful: every reply names the document and page it came from, so you can check it, and so can the customer. You set the lines it must not cross. Anything about refunds over a limit, anything legal, anything it is less than sure about goes to a person, with a summary of what was already asked. When you change a policy, you upload the new file and the answers change with it the same day.',
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
    title: 'Let customers watch the order come to them',
    icon: 'icon-[lucide--truck]',
    intro: 'The "where is my order" call stops coming.',
    platforms: ['ios', 'android', 'web'],
    scene: 'duo',
    site: 'track.yourbrand.com',
    accent: 'from-sky-100 via-cyan-100 to-blue-50',
    tint: 'from-sky-400 to-cyan-500',
    float: { title: 'A map, not a promise', copy: 'An ETA that moves with the traffic the driver is actually in.' },
    stat: { value: '−40%', label: 'Support calls', copy: 'People stop phoning when they can see the van on a map.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'Your driver gets an app with the day’s stops in a sensible order, turn-by-turn directions, and a place to capture a signature or a photo at the door. Your customer gets a link — no app to install — showing where their order is and an arrival time that updates as the driver moves, not a four-hour window invented in the morning. If a delivery fails, the reason and the photo are on the record before the driver leaves the street, which settles most disputes before they start. You see the whole fleet on one screen: who is running late, who has finished, and what tomorrow should look like based on what actually happened today.',
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
    title: 'A membership that renews itself',
    icon: 'icon-[lucide--dumbbell]',
    intro: 'A failed card should not quietly cost you a member.',
    platforms: ['ios', 'android', 'web'],
    scene: 'duo',
    site: 'join.yourgym.com',
    accent: 'from-lime-100 via-emerald-100 to-teal-50',
    tint: 'from-lime-400 to-emerald-500',
    float: { title: 'Check in, book, pay', copy: 'One app for the door, the class list and the monthly fee.' },
    stat: { value: '+18%', label: 'Renewals kept', copy: 'Retrying a declined card politely recovers most lapsed months.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'Members join on their phone, pick a plan, and get a code that opens the door. Classes are booked in the app, with a waiting list that fills a cancelled spot automatically instead of leaving it empty. The monthly fee collects itself, and when a card is declined the system retries on the days cards usually clear and messages the member before their access lapses — that alone recovers memberships you would otherwise lose without ever knowing why. Freezing a membership for a holiday takes one tap rather than a conversation at the desk. You get to see who has not been in for three weeks, which is the moment a friendly message still works.',
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
    title: 'Stock that reorders before you notice it is low',
    icon: 'icon-[lucide--boxes]',
    intro: 'One count that the counter, the website and the app all agree on.',
    platforms: ['web', 'android'],
    scene: 'phone',
    site: null,
    accent: 'from-slate-100 via-sky-100 to-indigo-50',
    tint: 'from-slate-400 to-sky-500',
    float: { title: 'Scan it, it is counted', copy: 'A phone camera does the job a handheld scanner used to.' },
    stat: { value: '1 count', label: 'Across every channel', copy: 'Selling the last one twice stops being possible.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'Everything you sell lives in one list. When something sells — at the counter, on the website, in the app — the count drops everywhere at once, so you cannot sell the last one twice and then apologise. Staff scan barcodes with a phone to receive stock or run a count, which takes minutes rather than a Sunday. You set a floor per item, and when stock reaches it the system either warns you or raises the purchase order to the supplier itself, with the quantity you usually buy. It also tells you the boring but expensive things: what has not moved in ninety days, what sells out every weekend, and what you are buying too often in small amounts.',
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
    title: 'Send the crew out with the paperwork already done',
    icon: 'icon-[lucide--clipboard-list]',
    intro: 'It has to work in a basement with no signal.',
    platforms: ['ios', 'android'],
    scene: 'phone',
    site: null,
    accent: 'from-teal-100 via-cyan-100 to-slate-50',
    tint: 'from-teal-400 to-cyan-500',
    float: { title: 'Offline is the normal case', copy: 'Everything saves on the phone and syncs when the bars come back.' },
    stat: { value: '0 bars', label: 'Still works', copy: 'Jobs, forms and photos are captured with no connection at all.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'Each engineer opens the app in the morning and sees their jobs in the order that makes sense for the driving, with the address, the history of that site, and the checklist for the work. They tick things off, take photos, and get the customer to sign on the screen. None of that needs a signal — it is stored on the phone and uploaded the moment they are back in coverage, so nobody loses an afternoon of work in a plant room. The office sees jobs turn green as they finish, and the report the customer receives is built from what was actually captured on site instead of a form somebody types up from memory two days later.',
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
    title: 'Loyalty and referrals that run themselves',
    icon: 'icon-[lucide--gift]',
    intro: 'No paper cards, no stamps, no arguments at the till.',
    platforms: ['ios', 'android', 'web'],
    scene: 'duo',
    site: 'rewards.yourbrand.com',
    accent: 'from-fuchsia-100 via-purple-100 to-rose-50',
    tint: 'from-fuchsia-400 to-purple-500',
    float: { title: 'Points people can see', copy: 'A balance in the app beats a card nobody can find.' },
    stat: { value: '2.4×', label: 'Repeat rate', copy: 'Members come back more often than the same customer did before.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'Customers earn points for buying, and they can see the balance on their phone rather than hunting for a card with six stamps on it. Rewards unlock on their own and get applied at checkout, so your staff never have to judge whether somebody qualifies. Tiers give regulars something to aim at, and the app tells them how close they are. Referrals work the same way: a customer shares a link, and when their friend buys, both sides are credited automatically with no code to remember or claim to verify. You choose what earns points and what they are worth, and you can see plainly whether the whole scheme is bringing back enough repeat business to pay for itself.',
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
    title: 'Let buyers walk the property before they drive to it',
    icon: 'icon-[lucide--building-2]',
    intro: 'Fewer wasted viewings, better ones.',
    platforms: ['web', 'ios', 'android'],
    scene: 'duo',
    site: 'listings.youragency.com',
    accent: 'from-stone-100 via-amber-50 to-yellow-50',
    tint: 'from-stone-400 to-amber-500',
    float: { title: 'Tour it from the sofa', copy: 'A walkthrough answers the questions a photo gallery cannot.' },
    stat: { value: '−35%', label: 'Wasted viewings', copy: 'People who tour online arrive already interested.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'Each property gets a page with proper photographs, a floor plan and a virtual walkthrough, so somebody can decide from the sofa whether it is worth the drive. Buyers save searches and get told the moment something matching appears, which is usually before it reaches the big portals. Booking a viewing is a button, and it lands in your agents’ calendars with the buyer’s details attached. Your team updates a listing once and it changes on the website, the app and the portal feeds together. Because the listing pages are built to be found in search, the enquiries that come from them are yours rather than leads you have to buy back from a portal every month.',
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
    title: 'Let other people sell for you and take your cut automatically',
    icon: 'icon-[lucide--store]',
    intro: 'The hard part is the money. That is the part we automate.',
    platforms: ['web', 'ios', 'android'],
    scene: 'duo',
    site: 'shop.yourmarket.com',
    accent: 'from-blue-100 via-indigo-100 to-violet-50',
    tint: 'from-blue-400 to-indigo-500',
    float: { title: 'Split at the moment of sale', copy: 'Your commission and their share separate before anyone asks.' },
    stat: { value: 'T+1', label: 'Vendor payouts', copy: 'Sellers are paid on schedule without you touching a spreadsheet.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'Sellers sign themselves up, upload what they sell, and manage their own orders and stock in a dashboard, so your team is not typing in other people’s catalogues. When a customer buys, the payment splits automatically: your commission to you, the rest held for the seller, with the tax handled correctly on both sides. Payouts run on a schedule, and every seller can see exactly what they are owed and why, which removes most of the emails you would otherwise be answering. You control who is allowed to list, what quality of photograph is acceptable, and what happens on a refund. Buyers see one shop, one basket and one checkout, however many sellers are behind it.',
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
    title: 'Sell the tickets and get the door moving',
    icon: 'icon-[lucide--ticket]',
    intro: 'The queue outside is a scanning problem, not a staffing one.',
    platforms: ['web', 'ios', 'android'],
    scene: 'duo',
    site: 'tickets.yourevent.com',
    accent: 'from-cyan-100 via-sky-100 to-emerald-50',
    tint: 'from-cyan-400 to-sky-500',
    float: { title: 'Scans without wi-fi', copy: 'The door keeps working when the venue’s network does not.' },
    stat: { value: '3s', label: 'Per guest at the door', copy: 'Scanning beats finding a name on a printed list.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'You put up a page with your tiers — early bird, general, VIP, whatever you sell — and it takes the money and issues a QR ticket to each buyer’s phone and email. At the door, your staff scan with their own phones. It works with no venue wi-fi, because the guest list is already on the device, and a ticket that has been used once will not pass again even on a different phone. You watch the headcount climb live, which tells you when to open a second door or stop selling. Afterwards you keep the attendee list, so the next event starts with people who already came, not an empty mailing list.',
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
    intro: 'The quote, the signature, the invoice and the reminder are one flow.',
    platforms: ['web', 'ios'],
    scene: 'duo',
    site: 'quote.yourstudio.com',
    accent: 'from-neutral-100 via-slate-100 to-zinc-50',
    tint: 'from-neutral-400 to-slate-500',
    float: { title: 'Signed on a phone', copy: 'Approval happens on the spot, not after a printer is found.' },
    stat: { value: '11 days', label: 'Faster payment', copy: 'Automatic reminders collect what a busy week would forget.' },
    summaryTitle: 'How it works in plain terms',
    description:
      'You build a quote from the prices you already use and send it as a link. Your client opens it on a phone, sees what is included, and approves it with a signature there and then instead of printing and scanning something. The moment it is approved it becomes a job, and when the work is done it becomes an invoice with the same numbers on it, so nothing is retyped and nothing is missed. If it is not paid, reminders go out on their own on a schedule you choose, politely, which is the part everybody hates doing. You can see at a glance what has been quoted, what has been approved, what has been invoiced and what is genuinely overdue.',
    chips: [
      { icon: 'icon-[lucide--file-text]', label: 'Quick quotes' },
      { icon: 'icon-[lucide--signature]', label: 'E-signature' },
      { icon: 'icon-[lucide--receipt]', label: 'Auto invoicing' },
      { icon: 'icon-[lucide--banknote]', label: 'Payment chasing' },
    ],
  },
]

const PLATFORM_META = {
  ios: { label: 'iOS app', icon: 'icon-[simple-icons--apple]' },
  android: { label: 'Android app', icon: 'icon-[simple-icons--android]' },
  web: { label: 'Website', icon: 'icon-[lucide--globe]' },
}

export default function ServiceCatalog() {
  return (
    <section id="catalog" className="px-4 py-16 sm:px-8 sm:py-20 lg:px-16">
      <div className="container mx-auto flex max-w-7xl flex-col gap-20 sm:gap-28">
        {SERVICES.map((service, index) => (
          <ServiceBlock key={service.id} service={service} index={index} />
        ))}
      </div>

      <p className="font-opensans mt-16 text-center text-sm text-base-content/50">
        Not on the list? It is the same team and the same stack —{' '}
        <a href="#contact" className="font-semibold text-base-content underline underline-offset-4">
          tell us the outcome
        </a>{' '}
        and we will tell you what it takes.
      </p>
    </section>
  )
}

function ServiceBlock({ service, index }) {
  return (
    <article id={service.id} className="scroll-mt-24">
      <header className="flex flex-col items-center text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 to-violet-600 shadow-lg">
          <span aria-hidden="true" className={`${service.icon} size-5 text-white`} />
        </span>

        <p className="font-opensans mt-4 text-[10px] font-semibold tracking-widest text-base-content/45 uppercase">
          {String(index + 1).padStart(2, '0')} · {service.eyebrow}
        </p>

        <h3 className="font-cinzel mt-2 max-w-3xl text-3xl font-extrabold tracking-tight text-base-content sm:text-4xl">
          {service.title}
        </h3>

        <p className="font-opensans mt-4 max-w-2xl text-sm text-base-content/60 sm:text-base">{service.intro}</p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {service.platforms.map((platform) => (
            <span
              key={platform}
              className="font-opensans flex items-center gap-1.5 rounded-full border border-base-200 bg-base-100 px-3 py-1 text-[11px] font-medium text-base-content/60 shadow-sm"
            >
              <span aria-hidden="true" className={`${PLATFORM_META[platform].icon} size-3`} />
              {PLATFORM_META[platform].label}
            </span>
          ))}
        </div>
      </header>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div
          className={`relative overflow-hidden rounded-2xl border border-base-200 bg-linear-to-br ${service.accent} shadow-sm lg:col-span-2`}
        >
          <div aria-hidden="true" className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10" />
          <Scene service={service} />

          {/* Glass card sitting over the shot, as on the reference block */}
          <div className="absolute bottom-4 left-4 max-w-56 rounded-xl border border-white/60 bg-white/70 p-3 shadow-lg backdrop-blur-md sm:max-w-64">
            <p className="font-opensans text-[11px] font-bold text-slate-800">{service.float.title}</p>
            <p className="font-opensans mt-1 text-[11px] leading-relaxed text-slate-600">{service.float.copy}</p>
          </div>
        </div>

        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-linear-to-br from-indigo-800 via-indigo-900 to-violet-950 p-6 shadow-lg">
          <div aria-hidden="true" className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.07]" />

          <p className="font-cinzel relative text-4xl font-extrabold tracking-tight text-white">{service.stat.value}</p>

          <div className="relative mt-6">
            <p className="font-opensans text-[10px] font-semibold tracking-widest text-white/50 uppercase">
              {service.stat.label}
            </p>
            <p className="font-opensans mt-2 text-sm text-white/85">{service.stat.copy}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-6 rounded-2xl border border-base-200 bg-base-100 p-6 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
        <div className="max-w-2xl">
          <h4 className="font-opensans text-sm font-bold text-base-content">{service.summaryTitle}</h4>
          <p className="font-opensans mt-2 text-sm leading-relaxed text-base-content/60">{service.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-96">
          {service.chips.map((chip) => (
            <div
              key={chip.label}
              className="flex flex-col items-center gap-2 rounded-xl border border-base-200 px-2 py-3 text-center"
            >
              <span aria-hidden="true" className={`${chip.icon} size-4 text-indigo-600 dark:text-indigo-400`} />
              <span className="font-opensans text-[10px] leading-tight text-base-content/60">{chip.label}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}
