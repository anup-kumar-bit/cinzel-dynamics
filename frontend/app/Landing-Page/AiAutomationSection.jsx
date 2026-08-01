import React from 'react'

// One agent run, as it appears in the logs. `tone` picks the accent for the
// verb column; the last line carries the caret, so it reads as still writing.
const RUN_LOG = [
  { time: '14:02:31', verb: 'webhook', detail: 'zendesk.ticket.created #4821', tone: 'text-sky-300' },
  { time: '14:02:31', verb: 'classify', detail: 'intent=late_delivery urgency=high', tone: 'text-violet-300' },
  { time: '14:02:32', verb: 'retrieve', detail: 'orders · shipping · refund_policy', tone: 'text-violet-300' },
  { time: '14:02:33', verb: 'call', detail: 'stripe.refund(shipping) ✓', tone: 'text-emerald-300' },
  { time: '14:02:35', verb: 'call', detail: 'shipping.reship(overnight) ✓', tone: 'text-emerald-300' },
  { time: '14:02:37', verb: 'reply', detail: 'sent · ticket closed', tone: 'text-emerald-300' },
]

const EXTRACTED = [
  { field: 'Vendor', value: 'Northwind Ltd' },
  { field: 'Total', value: '£4,280.00' },
  { field: 'Due', value: '14 Aug 2026' },
]

const TRIAGE = [
  { initial: 'M', subject: 'Invoice looks wrong again', label: 'Billing', confidence: '0.97' },
  { initial: 'K', subject: 'App crashes on upload', label: 'Bug', confidence: '0.94' },
  { initial: 'R', subject: 'Can we add 20 seats?', label: 'Upsell', confidence: '0.91' },
]

const CAPABILITIES = [
  'LLM integrations',
  'RAG on your own data',
  'Workflow automation',
  'Chat & voice agents',
  'Document extraction',
  'Human-in-the-loop review',
]

// -------** AiAutomationSection **---------
export default function AiAutomationSection() {
  return (
    <section id="ai-automation" className="px-4 py-16 sm:px-8 sm:py-20 lg:px-16">
      <div className="container mx-auto flex flex-col items-center text-center">
        <p className="font-opensans text-xs font-semibold tracking-widest text-base-content/65 uppercase">
          AI &amp; automation
        </p>

        <h2 className="font-cinzel mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-base-content sm:text-5xl">
          Most of the busywork is a pattern. Patterns can run themselves.
        </h2>

        <p className="font-opensans mt-5 max-w-xl text-sm text-base-content/60 sm:text-base">
          We connect AI to the tools you already use—like your inbox, CRM, spreadsheets, and database—so it handles routine work automatically and your team only deals with the exceptions.
        </p>
      </div>

      <AutomationBoard />

      <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
        {CAPABILITIES.map((capability) => (
          <span
            key={capability}
            className="font-opensans rounded-full border border-base-200 bg-base-100 px-4 py-1.5 text-xs text-base-content/60 shadow-sm sm:text-sm"
          >
            {capability}
          </span>
        ))}
      </div>
    </section>
  )
}

// ---------- Bento board: five tiles, one job each ----------
// Deliberately not another full-bleed panel — the sections above already carry
// those. Row one is the run itself plus what it saves; row two is the three
// jobs the same plumbing does elsewhere.
function AutomationBoard() {
  return (
    <div className="container mx-auto mt-16 grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <RunLogTile />
      <HoursTile />
      <ExtractionTile />
      <TriageTile />
      <ResolutionTile />
    </div>
  )
}

// Shared shell so every light tile lines up on padding, radius and border.
function Tile({ icon, eyebrow, className = '', children }) {
  return (
    <div className={`rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm ${className}`}>
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className={`${icon} size-4 shrink-0 text-violet-600 dark:text-violet-400`} />
        <p className="font-opensans text-[10px] font-semibold tracking-widest text-base-content/70 uppercase">
          {eyebrow}
        </p>
      </div>
      {children}
    </div>
  )
}

// ---------- The dark anchor tile: an agent run, line by line ----------
function RunLogTile() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-5 shadow-lg ring-1 ring-violet-400/20 sm:col-span-2">
      <div aria-hidden="true" className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.07]" />

      <div className="relative flex items-center gap-2">
        <span aria-hidden="true" className="icon-[lucide--terminal] size-4 shrink-0 text-violet-300" />
        <p className="font-mono text-[11px] text-white/70">support/refund-flow</p>

        <span className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-400/10 px-2 py-0.5">
          <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
          <span className="font-opensans text-[9px] font-bold tracking-wide text-emerald-300 uppercase">Running</span>
        </span>
      </div>

      {/* Fixed columns keep the verbs aligned like a real log */}
      <div className="relative mt-4 flex flex-col gap-1.5">
        {RUN_LOG.map((line, index) => (
          <p key={line.time + line.verb} className="flex gap-2 font-mono text-[10px] leading-relaxed sm:text-[11px]">
            <span className="shrink-0 text-white/30">{line.time}</span>
            <span className={`w-14 shrink-0 ${line.tone}`}>{line.verb}</span>
            <span className="min-w-0 truncate text-white/65">
              {line.detail}
              {index === RUN_LOG.length - 1 && (
                <span
                  aria-hidden="true"
                  className="animate-ai-caret ml-1 inline-block h-3 w-1.5 translate-y-0.5 bg-violet-300 motion-reduce:animate-none"
                />
              )}
            </span>
          </p>
        ))}
      </div>

      <div className="relative mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-white/10 pt-3">
        <span className="font-opensans text-[10px] text-white/45">6.2s end to end</span>
        <span className="font-opensans text-[10px] text-white/45">4 tools called</span>
        <span className="font-opensans text-[10px] text-white/45">0 humans</span>
      </div>
    </div>
  )
}

// ---------- Hours given back, with the workflows that gave them ----------
const WORKFLOWS = [
  { name: 'Support triage', width: 'w-[84%]' },
  { name: 'Invoice intake', width: 'w-[61%]' },
  { name: 'Weekly reporting', width: 'w-[38%]' },
]

function HoursTile() {
  return (
    <Tile icon="icon-[lucide--clock]" eyebrow="Time returned">
      <p className="font-opensans mt-3 text-4xl font-extrabold tracking-tight text-base-content">340 hrs</p>
      <p className="font-opensans mt-1 text-xs text-base-content/50">
        handed back to the team every month, across six live workflows
      </p>

      <div className="mt-4 flex flex-col gap-2.5">
        {WORKFLOWS.map((workflow) => (
          <div key={workflow.name}>
            <p className="font-opensans text-[10px] text-base-content/65">{workflow.name}</p>
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-base-200">
              <div className={`h-full ${workflow.width} rounded-full bg-linear-to-r from-violet-500 to-fuchsia-400`} />
            </div>
          </div>
        ))}
      </div>
    </Tile>
  )
}

// ---------- Document in, structured fields out ----------
function ExtractionTile() {
  return (
    <Tile icon="icon-[lucide--file-text]" eyebrow="Paperwork">
      <div className="mt-4 flex items-center gap-3">
        {/* Stand-in invoice: two lines highlighted as the ones that got read */}
        <div className="w-14 shrink-0 rounded-md border border-base-200 bg-base-200/40 p-1.5">
          <div className="h-1 w-7 rounded-full bg-base-content/25" />
          <div className="mt-1 h-1 w-9 rounded-full bg-base-content/10" />
          <div className="mt-2 h-1.5 w-full rounded-full bg-violet-500/30" />
          <div className="mt-1 h-1 w-8 rounded-full bg-base-content/10" />
          <div className="mt-1.5 h-1.5 w-3/4 rounded-full bg-violet-500/30" />
        </div>

        <span aria-hidden="true" className="icon-[lucide--arrow-right] size-4 shrink-0 text-base-content/25" />

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          {EXTRACTED.map((row) => (
            <div key={row.field} className="flex items-baseline justify-between gap-2 border-b border-base-200 pb-1">
              <span className="font-opensans text-[10px] text-base-content/65">{row.field}</span>
              <span className="truncate font-mono text-[11px] font-medium text-base-content">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="font-opensans mt-4 text-xs text-base-content/50">
        Invoices, contracts and forms parsed into your schema — not a summary you have to re-read.
      </p>
    </Tile>
  )
}

// ---------- Inbox triage with the label the model applied ----------
function TriageTile() {
  return (
    <Tile icon="icon-[lucide--inbox]" eyebrow="Inbox triage">
      <div className="mt-4 flex flex-col gap-2">
        {TRIAGE.map((row) => (
          <div key={row.subject} className="flex items-center gap-2.5 rounded-xl bg-base-200/40 px-2.5 py-2">
            <span className="font-opensans flex size-6 shrink-0 items-center justify-center rounded-full bg-base-100 text-[10px] font-bold text-base-content/60 ring-1 ring-base-200">
              {row.initial}
            </span>

            <p className="font-opensans min-w-0 flex-1 truncate text-[11px] text-base-content/70">{row.subject}</p>

            <span className="font-opensans shrink-0 rounded-full bg-violet-500/10 px-2 py-0.5 text-[9px] font-bold tracking-wide text-violet-700 uppercase dark:text-violet-300">
              {row.label}
            </span>
            <span className="shrink-0 font-mono text-[9px] text-base-content/60">{row.confidence}</span>
          </div>
        ))}
      </div>

      <p className="font-opensans mt-4 text-xs text-base-content/50">
        Routed, tagged and assigned the second it arrives — no morning triage meeting.
      </p>
    </Tile>
  )
}

// ---------- Split between what closes itself and what a person sees ----------
function ResolutionTile() {
  return (
    <Tile icon="icon-[lucide--check-check]" eyebrow="Resolution split">
      <p className="font-opensans mt-3 text-4xl font-extrabold tracking-tight text-base-content">82%</p>
      <p className="font-opensans mt-1 text-xs text-base-content/50">closed without anyone stepping in</p>

      <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-base-200">
        <div className="w-[82%] bg-linear-to-r from-violet-500 to-fuchsia-400" />
        <div className="flex-1 bg-amber-400/70" />
      </div>

      <div className="mt-3 flex flex-col gap-1.5">
        <p className="font-opensans flex items-center gap-2 text-[11px] text-base-content/55">
          <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-violet-500" />
          Handled end to end
        </p>
        <p className="font-opensans flex items-center gap-2 text-[11px] text-base-content/55">
          <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-amber-400" />
          Held for review — low confidence, refunds over £500, anything legal
        </p>
      </div>
    </Tile>
  )
}
