import React from 'react'

// Information visuals with real content, not placeholder mocks — one card shell, tinted per service.

const INK = {
  emerald: { text: 'text-emerald-600', bg: 'bg-emerald-500', soft: 'bg-emerald-500/10 text-emerald-700' },
  rose: { text: 'text-rose-600', bg: 'bg-rose-500', soft: 'bg-rose-500/10 text-rose-700' },
  indigo: { text: 'text-indigo-600', bg: 'bg-indigo-500', soft: 'bg-indigo-500/10 text-indigo-700' },
  amber: { text: 'text-amber-600', bg: 'bg-amber-500', soft: 'bg-amber-500/10 text-amber-700' },
  orange: { text: 'text-orange-600', bg: 'bg-orange-500', soft: 'bg-orange-500/10 text-orange-700' },
  violet: { text: 'text-violet-600', bg: 'bg-violet-500', soft: 'bg-violet-500/10 text-violet-700' },
  sky: { text: 'text-sky-600', bg: 'bg-sky-500', soft: 'bg-sky-500/10 text-sky-700' },
  teal: { text: 'text-teal-600', bg: 'bg-teal-500', soft: 'bg-teal-500/10 text-teal-700' },
  fuchsia: { text: 'text-fuchsia-600', bg: 'bg-fuchsia-500', soft: 'bg-fuchsia-500/10 text-fuchsia-700' },
  blue: { text: 'text-blue-600', bg: 'bg-blue-500', soft: 'bg-blue-500/10 text-blue-700' },
  cyan: { text: 'text-cyan-600', bg: 'bg-cyan-500', soft: 'bg-cyan-500/10 text-cyan-700' },
  slate: { text: 'text-slate-600', bg: 'bg-slate-500', soft: 'bg-slate-500/10 text-slate-700' },
}

const SCENES = {
  chat: ChatScene,
  vitals: VitalsScene,
  course: CourseScene,
  day: DayScene,
  kitchen: KitchenScene,
  agent: AgentScene,
  route: RouteScene,
  member: MemberScene,
  stock: StockScene,
  job: JobScene,
  points: PointsScene,
  listing: ListingScene,
  payout: PayoutScene,
  ticket: TicketScene,
  quote: QuoteScene,
}

export function inkOf(service) {
  return INK[service.ink] ?? INK.indigo
}

// `bare` drops the padded stage, for layouts that supply their own surface.
export function Scene({ service, className = '', bare = false }) {
  const Visual = SCENES[service.scene] ?? ChatScene
  const isApp = service.platforms?.some((platform) => platform === 'ios' || platform === 'android')
  const Frame = isApp ? PhoneFrame : BrowserFrame

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center ${bare ? '' : 'min-h-80 p-6'} ${className}`}
    >
      <Frame>
        <Visual service={service} ink={inkOf(service)} />
      </Frame>
    </div>
  )
}

// The thinnest possible device frame — just enough line-work to say phone or website.
function PhoneFrame({ children }) {
  return (
    <div className="flex w-full max-w-76 flex-col items-center gap-2 rounded-[1.75rem] border border-neutral-300 p-2.5">
      <span aria-hidden="true" className="h-1 w-7 shrink-0 rounded-full bg-neutral-300" />
      {children}
      <span aria-hidden="true" className="h-1 w-9 shrink-0 rounded-full bg-neutral-300" />
    </div>
  )
}

function BrowserFrame({ children }) {
  return (
    <div className="flex w-full max-w-76 flex-col overflow-hidden rounded-lg border border-neutral-300">
      <div className="flex shrink-0 items-center gap-1 border-b border-neutral-200 bg-neutral-50 px-2.5 py-1.5">
        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-neutral-300" />
        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-neutral-300" />
        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-neutral-300" />
        <span aria-hidden="true" className="ml-1.5 h-2.5 flex-1 rounded-sm bg-neutral-100" />
      </div>
      <div className="flex justify-center p-2.5">{children}</div>
    </div>
  )
}

// Flat enough to read as a pasted screenshot, not a product shot over a gradient.
function Card({ children, className = '' }) {
  return (
    <div className={`w-full max-w-72 overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-black/10 ${className}`}>
      {children}
    </div>
  )
}

function CardHead({ icon, title, meta, ink }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-neutral-200 px-3 py-2">
      <span aria-hidden="true" className={`${icon} size-3.5 shrink-0 ${ink.text}`} />
      <span className="font-opensans truncate text-[10px] font-semibold text-neutral-700">{title}</span>
      {meta ? <span className="ml-auto shrink-0 font-mono text-[9px] text-neutral-400">{meta}</span> : null}
    </div>
  )
}

function Row({ children, className = '' }) {
  return <div className={`flex items-center gap-2 py-1.5 ${className}`}>{children}</div>
}

function Label({ children, className = '' }) {
  return <span className={`font-opensans text-[10px] text-neutral-700 ${className}`}>{children}</span>
}

function Tag({ icon, children, className = '' }) {
  return (
    <span
      className={`font-opensans inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-medium ${className}`}
    >
      {icon ? <span aria-hidden="true" className={`${icon} size-2.5 shrink-0`} /> : null}
      {children}
    </span>
  )
}

function Meter({ value, ink }) {
  return (
    <span className="block h-1 w-full overflow-hidden rounded-full bg-neutral-200">
      <span className={`block h-full rounded-full ${ink.bg}`} style={{ width: `${value}%` }} />
    </span>
  )
}

function Foot({ children }) {
  return (
    <p className="font-opensans border-t border-neutral-200 bg-neutral-50 px-3 py-2 text-[9px] text-neutral-500">
      {children}
    </p>
  )
}

// Pairs one specific instance (a booking, a job) with its aggregate, carrying story and scale.
function Stat({ icon, label, value, ink, className = 'mx-3 my-2' }) {
  return (
    <div className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${ink.soft} ${className}`}>
      <span aria-hidden="true" className={`${icon} size-3 shrink-0`} />
      <span className="font-opensans text-[10px] font-semibold">{label}</span>
      <span className="ml-auto font-mono text-[10px] font-bold">{value}</span>
    </div>
  )
}

// WhatsApp: the thread doing the whole job, ask to paid, in three bubbles.
function ChatScene({ ink }) {
  return (
    <Card className="p-3">
      <div className="flex items-center gap-1.5 border-b border-neutral-200 pb-2">
        <span aria-hidden="true" className="icon-[logos--whatsapp-icon] size-4" />
        <span className="font-opensans text-[10px] font-semibold text-neutral-700">Business · online</span>
      </div>

      <div className="mt-2.5 flex flex-col gap-1.5">
        <span className="font-opensans max-w-[85%] rounded-2xl rounded-tl-sm bg-neutral-100 px-2.5 py-1.5 text-[10px] text-neutral-700">
          Hi, do you do bridal packages?
        </span>
        <span className="font-opensans max-w-[85%] self-end rounded-2xl rounded-tr-sm bg-neutral-100 px-2.5 py-1.5 text-[10px] text-neutral-700">
          Yes — ₹8,500, full day. Want to see the slots?
        </span>
        <span className="font-opensans max-w-[85%] rounded-2xl rounded-tl-sm bg-neutral-100 px-2.5 py-1.5 text-[10px] text-neutral-700">
          Do you have the 6:30 slot on Saturday?
        </span>
        <span className="font-opensans max-w-[85%] self-end rounded-2xl rounded-tr-sm bg-emerald-500 px-2.5 py-1.5 text-[10px] text-white">
          Held it for you. Tap to pay →
        </span>
        <span className="font-opensans flex max-w-[85%] items-center gap-1.5 self-end rounded-2xl rounded-tr-sm bg-neutral-100 px-2.5 py-1.5 text-[10px] text-neutral-700">
          <span aria-hidden="true" className="icon-[lucide--check] size-3 shrink-0 text-emerald-600" />
          Paid · booking confirmed
        </span>
        <span className="font-opensans flex max-w-[85%] items-center gap-1.5 rounded-2xl rounded-tl-sm bg-neutral-100 px-2.5 py-1.5 text-[10px] text-neutral-500">
          <span aria-hidden="true" className="icon-[lucide--bell-ring] size-3 shrink-0 text-emerald-600" />
          Reminder goes out Friday, 6 PM
        </span>
      </div>

      <Stat icon="icon-[lucide--zap]" label="Avg reply time" value="12s" ink={ink} className="mt-2.5" />
    </Card>
  )
}

// Healthcare: today's numbers and the plan moving because of them.
function VitalsScene({ ink }) {
  return (
    <Card>
      <CardHead icon="icon-[lucide--heart-pulse]" title="Today · R. Menon" meta="Tue" ink={ink} />

      <div className="divide-y divide-neutral-100 px-3">
        <Row>
          <Label>Blood pressure</Label>
          <span className="ml-auto font-mono text-[10px] font-semibold text-neutral-800">128/82</span>
          <Tag className={ink.soft}>in range</Tag>
        </Row>

        <div className="py-2">
          <span className="flex items-center gap-2">
            <Label>Steps</Label>
            <span className="ml-auto font-mono text-[10px] text-neutral-500">4,120 / 6,000</span>
          </span>
          <span className="mt-1.5 block">
            <Meter value={68} ink={ink} />
          </span>
        </div>

        <Row>
          <span aria-hidden="true" className={`icon-[lucide--pill] size-3 shrink-0 ${ink.text}`} />
          <Label>Evening tablet</Label>
          <Tag className={`ml-auto ${ink.soft}`}>taken 8:02 PM</Tag>
        </Row>

        <Row>
          <span aria-hidden="true" className={`icon-[lucide--watch] size-3 shrink-0 ${ink.text}`} />
          <Label className="text-neutral-500">Cuff and watch synced · nothing typed</Label>
        </Row>
      </div>

      <Stat icon="icon-[lucide--flame]" label="Check-in streak" value="7 days" ink={ink} />

      <Foot>Plan raised to 6,000 steps after three steady days.</Foot>
    </Card>
  )
}

// Education: one student's progress through your course, on your app.
function CourseScene({ ink }) {
  return (
    <Card>
      <CardHead icon="icon-[lucide--graduation-cap]" title="Physics · Batch 10A" meta="68%" ink={ink} />

      <div className="px-3 pt-2.5 pb-1">
        <span className="flex items-center gap-2">
          <Label className="font-semibold">Module 4 of 6</Label>
          <span className="ml-auto font-mono text-[9px] text-neutral-400">resumes at 12:04</span>
        </span>
        <span className="mt-1.5 block">
          <Meter value={68} ink={ink} />
        </span>
      </div>

      <div className="divide-y divide-neutral-100 px-3">
        <Row>
          <span aria-hidden="true" className={`icon-[lucide--video] size-3 shrink-0 ${ink.text}`} />
          <Label>Live class · 6:00 PM</Label>
          <Tag className={`ml-auto ${ink.soft}`}>reminder sent</Tag>
        </Row>
        <Row>
          <span aria-hidden="true" className={`icon-[lucide--award] size-3 shrink-0 ${ink.text}`} />
          <Label>Quiz 3 marked</Label>
          <span className="ml-auto font-mono text-[10px] font-semibold text-neutral-800">18/20</span>
        </Row>
        <Row>
          <span aria-hidden="true" className={`icon-[lucide--message-circle] size-3 shrink-0 ${ink.text}`} />
          <Label>Doubt answered in thread</Label>
          <Tag className={`ml-auto ${ink.soft}`}>4 min</Tag>
        </Row>
      </div>

      <Stat icon="icon-[lucide--users]" label="Batch size" value="42 students" ink={ink} />

      <Foot>Fees collected in-app. No marketplace logo, no cut.</Foot>
    </Card>
  )
}

// Appointments: a real Saturday, including the gap that refilled itself.
function DayScene({ ink }) {
  const slots = [
    { time: '10:00', name: 'Priya S. · colour', tag: 'deposit paid' },
    { time: '11:30', name: 'Cancelled · back on sale', tag: 'waitlist told', open: true },
    { time: '13:00', name: 'Aman K. · cut', tag: 'reminder sent' },
    { time: '15:30', name: 'Riya B. · trial', tag: 'first visit' },
  ]

  return (
    <Card>
      <CardHead icon="icon-[lucide--calendar-check]" title="Saturday · Chair 2" meta="9 Aug" ink={ink} />

      <div className="flex flex-col gap-1 p-3">
        {slots.map((slot) => (
          <div
            key={slot.time}
            className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${
              slot.open ? 'border border-dashed border-neutral-300' : 'bg-neutral-50'
            }`}
          >
            <span className="w-9 shrink-0 font-mono text-[9px] text-neutral-400">{slot.time}</span>
            <Label className="truncate">{slot.name}</Label>
            <Tag className={`ml-auto ${slot.open ? 'bg-neutral-200 text-neutral-600' : ink.soft}`}>{slot.tag}</Tag>
          </div>
        ))}
      </div>

      <Stat icon="icon-[lucide--bar-chart-3]" label="Booked today" value="6 of 8 chairs" ink={ink} />

      <Foot>Only slots you can actually staff are ever offered.</Foot>
    </Card>
  )
}

// Restaurants: the docket the kitchen sees, with nobody's commission on it.
function KitchenScene({ ink }) {
  const items = [
    { qty: '2 ×', name: 'Paneer tikka' },
    { qty: '1 ×', name: 'Butter naan' },
    { qty: '1 ×', name: 'Masala chai' },
    { qty: '1 ×', name: 'Gulab jamun' },
  ]

  return (
    <Card>
      <CardHead icon="icon-[lucide--utensils-crossed]" title="Order #A-42 · Table 6" meta="4 min" ink={ink} />

      <div className="divide-y divide-neutral-100 px-3">
        {items.map((item) => (
          <Row key={item.name}>
            <span className="w-6 shrink-0 font-mono text-[9px] text-neutral-400">{item.qty}</span>
            <Label>{item.name}</Label>
          </Row>
        ))}
      </div>

      <div className="flex items-start gap-1.5 border-t border-neutral-200 px-3 py-2">
        <span aria-hidden="true" className={`icon-[lucide--message-square] mt-0.5 size-3 shrink-0 ${ink.text}`} />
        <Label className="text-neutral-500">“Paneer tikka — less spicy, no onion”</Label>
      </div>

      <div className="flex items-center gap-2 border-t border-neutral-200 px-3 py-2">
        <span className="font-opensans text-[10px] font-bold text-neutral-800">Paid ₹740</span>
        <Tag icon="icon-[lucide--scan-qr-code]" className={`ml-auto ${ink.soft}`}>
          scanned at table
        </Tag>
      </div>

      <Stat icon="icon-[lucide--trending-up]" label="Today so far" value="38 orders · ₹18,400" ink={ink} />

      <Foot>Straight to the kitchen screen. No aggregator, no 25%.</Foot>
    </Card>
  )
}

// AI support: the answer plus the page it came from.
function AgentScene({ service, ink }) {
  return (
    <Card className="p-3">
      <p className="font-opensans text-[11px] font-medium text-neutral-700">“Do I pay return shipping?”</p>

      <div className="mt-2.5 flex items-start gap-1.5 border-t border-neutral-200 pt-2.5">
        <span aria-hidden="true" className={`${service.icon} size-4 shrink-0 ${ink.text}`} />
        <p className="font-opensans text-[11px] text-neutral-600">
          No — damaged items ship back free. A label is on the way to your email.
        </p>
      </div>

      <div className="mt-2.5 flex items-center gap-1.5">
        <Tag icon="icon-[lucide--file-text]" className={ink.soft}>
          returns-policy.pdf · p4
        </Tag>
        <span className="font-mono text-[9px] text-neutral-400">0.96</span>
      </div>

      <p className="font-opensans mt-3 text-[11px] font-medium text-neutral-700 border-t border-neutral-200 pt-2.5">
        “And how long does the refund take?”
      </p>

      <div className="mt-2.5 flex items-start gap-1.5">
        <span aria-hidden="true" className={`${service.icon} size-4 shrink-0 ${ink.text}`} />
        <p className="font-opensans text-[11px] text-neutral-600">
          3–5 working days after the item scans in at our warehouse.
        </p>
      </div>

      <div className="mt-2.5 flex items-center gap-1.5">
        <Tag icon="icon-[lucide--file-text]" className={ink.soft}>
          refund-policy.pdf · p1
        </Tag>
        <span className="font-mono text-[9px] text-neutral-400">0.91</span>
      </div>

      <Stat icon="icon-[lucide--bar-chart-3]" label="This week" value="312 answered · 84% solo" ink={ink} className="mt-2.5" />
    </Card>
  )
}

// Logistics: the van on the line, and an ETA that moves with it.
function RouteScene({ ink }) {
  return (
    <Card>
      <CardHead icon="icon-[lucide--truck]" title="Order #7781 · Nikhil" meta="ETA 4:12 pm" ink={ink} />

      <div className="flex items-center gap-1.5 px-3 pt-4 pb-1" role="img" aria-label="Delivery route with three stops">
        <span aria-hidden="true" className="icon-[lucide--circle-dot] size-3 shrink-0 text-neutral-300" />
        <span aria-hidden="true" className={`h-px min-w-4 flex-1 border-t border-dashed opacity-40 ${ink.text}`} />
        <span aria-hidden="true" className={`icon-[lucide--truck] size-4 shrink-0 ${ink.text}`} />
        <span aria-hidden="true" className={`h-px min-w-4 flex-1 border-t border-dashed opacity-40 ${ink.text}`} />
        <span aria-hidden="true" className={`icon-[lucide--flag] size-3.5 shrink-0 ${ink.text}`} />
      </div>

      <div className="divide-y divide-neutral-100 px-3">
        <Row>
          <span aria-hidden="true" className={`icon-[lucide--user] size-3 shrink-0 ${ink.text}`} />
          <Label>Ravi K. · bike</Label>
          <Tag className={`ml-auto ${ink.soft}`}>4.9★ · 1,204 drops</Tag>
        </Row>
        <Row>
          <span aria-hidden="true" className={`icon-[lucide--map-pin] size-3 shrink-0 ${ink.text}`} />
          <Label>Stop 12 of 18</Label>
          <Tag className={`ml-auto ${ink.soft}`}>3 stops away</Tag>
        </Row>
        <Row>
          <span aria-hidden="true" className={`icon-[lucide--image] size-3 shrink-0 ${ink.text}`} />
          <Label className="text-neutral-500">Photo at the door on delivery</Label>
        </Row>
      </div>

      <Stat icon="icon-[lucide--route]" label="Fleet on-time today" value="94%" ink={ink} />

      <Foot>The customer opens a link. Nothing to install.</Foot>
    </Card>
  )
}

// Fitness: the month that collected itself after a declined card.
function MemberScene({ ink }) {
  return (
    <Card>
      <CardHead icon="icon-[lucide--dumbbell]" title="Aarav · Monthly" meta="#4471" ink={ink} />

      <div className="divide-y divide-neutral-100 px-3">
        <Row>
          <span aria-hidden="true" className={`icon-[lucide--user-check] size-3 shrink-0 ${ink.text}`} />
          <Label>Door code</Label>
          <span className="ml-auto font-mono text-[10px] font-semibold tracking-wider text-neutral-800">8842</span>
        </Row>
        <Row>
          <span aria-hidden="true" className={`icon-[lucide--calendar-check] size-3 shrink-0 ${ink.text}`} />
          <Label>HIIT · 7:00 AM</Label>
          <Tag className={`ml-auto ${ink.soft}`}>waitlist filled</Tag>
        </Row>
        <Row>
          <span aria-hidden="true" className={`icon-[lucide--banknote] size-3 shrink-0 ${ink.text}`} />
          <Label>Card declined Mon</Label>
          <Tag className={`ml-auto ${ink.soft}`}>retried Tue · paid</Tag>
        </Row>
        <Row>
          <span aria-hidden="true" className={`icon-[lucide--gift] size-3 shrink-0 ${ink.text}`} />
          <Label>Brought a friend, Sat</Label>
          <Tag className={`ml-auto ${ink.soft}`}>₹500 credit applied</Tag>
        </Row>
      </div>

      <Stat icon="icon-[lucide--calendar]" label="Visits this month" value="14 check-ins" ink={ink} />

      <Foot>A membership you would have lost without ever knowing why.</Foot>
    </Card>
  )
}

// Retail: one count, and the order that raised itself.
function StockScene({ ink }) {
  const lines = [
    { sku: 'Blue tee · M', qty: '42', tone: 'text-neutral-800' },
    { sku: 'Steel bottle 1L', qty: '6', tone: 'text-amber-600', tag: 'PO raised · 48' },
    { sku: 'Cap · black', qty: '0', tone: 'text-rose-600', tag: 'hidden online' },
    { sku: 'Tote bag · canvas', qty: '118', tone: 'text-neutral-800' },
  ]

  return (
    <Card>
      <CardHead icon="icon-[lucide--boxes]" title="Stock · every channel" meta="1 count" ink={ink} />

      <div className="divide-y divide-neutral-100 px-3">
        {lines.map((line) => (
          <Row key={line.sku}>
            <span aria-hidden="true" className={`icon-[lucide--scan-line] size-3 shrink-0 ${ink.text}`} />
            <Label className="truncate">{line.sku}</Label>
            {line.tag ? <Tag className={`ml-auto ${ink.soft}`}>{line.tag}</Tag> : null}
            <span className={`${line.tag ? '' : 'ml-auto'} w-6 shrink-0 text-right font-mono text-[10px] font-semibold ${line.tone}`}>
              {line.qty}
            </span>
          </Row>
        ))}
      </div>

      <Stat icon="icon-[lucide--refresh-cw]" label="Channels synced" value="3 · 2s ago" ink={ink} />

      <Foot>Counter, website and app cannot disagree.</Foot>
    </Card>
  )
}

// Field teams: a job finished in a basement with no signal.
function JobScene({ ink }) {
  const steps = ['Flue test — passed', 'Pressure reset — done', 'Parts replaced — valve', 'Photos added (3)']

  return (
    <Card>
      <CardHead icon="icon-[lucide--clipboard-list]" title="Job 118 · Boiler service" meta="0 bars" ink={ink} />

      <div className="px-3 pt-2 pb-1">
        {steps.map((step) => (
          <Row key={step}>
            <span aria-hidden="true" className={`icon-[lucide--check] size-3 shrink-0 ${ink.text}`} />
            <Label>{step}</Label>
          </Row>
        ))}
      </div>

      <div className="mx-3 mb-3 flex items-center gap-2 rounded-lg border border-dashed border-neutral-300 px-2.5 py-2">
        <span aria-hidden="true" className="icon-[lucide--signature] size-5 shrink-0 text-neutral-700" />
        <span className="font-opensans block text-[9px] text-neutral-400">Signed on site · 15:41</span>
      </div>

      <Stat icon="icon-[lucide--user]" label="Engineer today" value="Deepak R. · 6 jobs" ink={ink} />

      <Foot>Held on the phone, uploaded when the bars come back.</Foot>
    </Card>
  )
}

// Retention: a balance people can see, and a referral that paid itself out.
function PointsScene({ ink }) {
  return (
    <Card>
      <CardHead icon="icon-[lucide--gift]" title="Neha · Gold" meta="1,240 pts" ink={ink} />

      <div className="px-3 pt-2.5 pb-1">
        <span className="flex items-center gap-2">
          <Label className="font-semibold">260 pts to Platinum</Label>
          <span className="ml-auto font-mono text-[9px] text-neutral-400">76%</span>
        </span>
        <span className="mt-1.5 block">
          <Meter value={76} ink={ink} />
        </span>
      </div>

      <div className="divide-y divide-neutral-100 px-3">
        <Row>
          <span aria-hidden="true" className={`icon-[lucide--star] size-3 shrink-0 ${ink.text}`} />
          <Label>Free coffee unlocked</Label>
          <Tag className={`ml-auto ${ink.soft}`}>applied at till</Tag>
        </Row>
        <Row>
          <span aria-hidden="true" className={`icon-[lucide--handshake] size-3 shrink-0 ${ink.text}`} />
          <Label>Sana joined via link</Label>
          <Tag className={`ml-auto ${ink.soft}`}>both credited</Tag>
        </Row>
        <Row>
          <span aria-hidden="true" className={`icon-[lucide--cake] size-3 shrink-0 ${ink.text}`} />
          <Label>Birthday bonus, 12 Aug</Label>
          <Tag className={`ml-auto ${ink.soft}`}>+150 pts auto</Tag>
        </Row>
      </div>

      <Stat icon="icon-[lucide--award]" label="Member since" value="Mar 2023" ink={ink} />

      <Foot>No stamps, no codes, nothing for staff to judge.</Foot>
    </Card>
  )
}

// Real estate: the listing that answers the questions before the drive.
function ListingScene({ ink }) {
  return (
    <Card>
      <CardHead icon="icon-[lucide--building-2]" title="3 BHK · Indiranagar" meta="₹1.4 Cr" ink={ink} />

      <div className="flex flex-wrap gap-1 px-3 pt-2.5">
        {['1,480 sq ft', '3 bed', '2 bath', 'North facing'].map((fact) => (
          <Tag key={fact} className="bg-neutral-100 text-neutral-600">
            {fact}
          </Tag>
        ))}
      </div>

      <div className="mt-1 divide-y divide-neutral-100 px-3">
        <Row>
          <span aria-hidden="true" className={`icon-[lucide--video] size-3 shrink-0 ${ink.text}`} />
          <Label>Virtual walkthrough</Label>
          <span className="ml-auto font-mono text-[9px] text-neutral-400">4 min</span>
        </Row>
        <Row>
          <span aria-hidden="true" className={`icon-[lucide--bell-ring] size-3 shrink-0 ${ink.text}`} />
          <Label>2 matches for a saved search</Label>
        </Row>
        <Row>
          <span aria-hidden="true" className={`icon-[lucide--calendar-check] size-3 shrink-0 ${ink.text}`} />
          <Label>Viewing booked</Label>
          <Tag className={`ml-auto ${ink.soft}`}>Sat 11:00</Tag>
        </Row>
        <Row>
          <span aria-hidden="true" className={`icon-[lucide--calculator] size-3 shrink-0 ${ink.text}`} />
          <Label className="text-neutral-500">EMI calculator used</Label>
          <span className="ml-auto font-mono text-[9px] text-neutral-400">₹1.1L/mo</span>
        </Row>
      </div>

      <Stat icon="icon-[lucide--eye]" label="This listing" value="312 views · 9 saved" ink={ink} />

      <Foot>They arrive already interested, or not at all.</Foot>
    </Card>
  )
}

// Marketplace: the money splitting itself at the moment of sale.
function PayoutScene({ ink }) {
  const split = [
    { party: 'Kalam Crafts', amount: '₹2,610' },
    { party: 'Nord Home', amount: '₹1,470' },
    { party: 'Verve Studio', amount: '₹720' },
  ]

  return (
    <Card>
      <CardHead icon="icon-[lucide--store]" title="Order #2210 · 3 sellers" meta="₹5,520" ink={ink} />

      <div className="divide-y divide-neutral-100 px-3">
        {split.map((line) => (
          <Row key={line.party}>
            <span aria-hidden="true" className={`icon-[lucide--wallet] size-3 shrink-0 ${ink.text}`} />
            <Label>{line.party}</Label>
            <span className="ml-auto font-mono text-[10px] text-neutral-600">{line.amount}</span>
          </Row>
        ))}
      </div>

      <Stat icon="icon-[lucide--split]" label="Your commission · 15%" value="₹720" ink={ink} />

      <Foot>Payouts run T+1. Tax handled on both sides.</Foot>
    </Card>
  )
}

// Events: the pass on the phone and the door that keeps moving.
const QR = [
  [1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 1],
  [1, 1, 1, 0, 1, 1, 0],
  [0, 0, 1, 1, 1, 0, 1],
  [1, 1, 0, 1, 0, 1, 1],
  [1, 0, 1, 0, 1, 1, 0],
  [1, 1, 1, 0, 1, 0, 1],
]

function TicketScene({ ink }) {
  return (
    <Card>
      <CardHead icon="icon-[lucide--ticket]" title="Neon Nights · VIP" meta="Gate B" ink={ink} />

      <div className="flex items-center gap-3 px-3 py-3">
        <span aria-hidden="true" className="grid shrink-0 grid-cols-7 gap-px rounded-md bg-white p-1 ring-1 ring-neutral-200">
          {QR.flatMap((row, y) =>
            row.map((cell, x) => (
              <span key={`${y}-${x}`} className={`size-1 ${cell ? 'bg-neutral-800' : 'bg-transparent'}`} />
            )),
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block font-mono text-[10px] font-semibold text-neutral-800">TKT-88F2</span>
          <span className="font-opensans mt-0.5 block text-[9px] text-neutral-500">Scans once. Screenshots do not.</span>
          <span className="mt-1.5 block">
            <Meter value={86} ink={ink} />
          </span>
          <span className="mt-1 block font-mono text-[9px] text-neutral-400">1,284 / 1,500 in</span>
        </span>
      </div>

      <div className="flex items-center gap-2 border-t border-neutral-200 px-3 py-2">
        <span aria-hidden="true" className={`icon-[lucide--plus] size-3 shrink-0 ${ink.text}`} />
        <Label className="text-neutral-500">Parking add-on attached</Label>
        <span className="ml-auto font-mono text-[10px] text-neutral-600">+₹150</span>
      </div>

      <Stat icon="icon-[lucide--flame]" label="Sales pace" value="Sold out in 3 days" ink={ink} />

      <Foot>The guest list is on the phone. Venue wi-fi optional.</Foot>
    </Card>
  )
}

// Trades & studios: quote to signature to invoice as one line of travel.
function QuoteScene({ ink }) {
  const steps = [
    { label: 'Quote sent', when: 'Mon', done: true },
    { label: 'Signed on a phone', when: 'Tue', done: true },
    { label: 'Invoiced automatically', when: 'Fri', done: true },
    { label: 'First reminder sent', when: 'day 7', done: true },
    { label: 'Second reminder due', when: 'day 14', done: false },
  ]

  return (
    <Card>
      <CardHead icon="icon-[lucide--receipt]" title="Q-318 · Studio fit-out" meta="₹86,400" ink={ink} />

      <div className="px-3 py-2.5">
        {steps.map((step, index) => (
          <div key={step.label} className="flex gap-2">
            <span className="flex flex-col items-center">
              <span
                className={`mt-0.5 flex size-3 items-center justify-center rounded-full ${
                  step.done ? ink.bg : 'bg-white ring-1 ring-neutral-300'
                }`}
              >
                {step.done ? (
                  <span aria-hidden="true" className="icon-[lucide--check] size-2 text-white" />
                ) : null}
              </span>
              {index < steps.length - 1 ? <span className="w-px flex-1 bg-neutral-200" /> : null}
            </span>

            <span className="flex flex-1 items-center gap-2 pb-2">
              <Label className={step.done ? '' : 'text-neutral-400'}>{step.label}</Label>
              <span className="ml-auto font-mono text-[9px] text-neutral-400">{step.when}</span>
            </span>
          </div>
        ))}
      </div>

      <Stat icon="icon-[lucide--clock]" label="Studio average" value="Paid in 11 days" ink={ink} />

      <Foot>Nothing retyped between the quote and the invoice.</Foot>
    </Card>
  )
}
