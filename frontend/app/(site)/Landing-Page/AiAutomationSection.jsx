import React from 'react'

// Five stages of one automated flow; `tint`/`ink` are spelled out for Tailwind to see them.
const PIPELINE = [
  {
    title: 'Data Received',
    detail: 'Data arrives by email or upload',
    icon: 'icon-[lucide--file-text]',
    tint: 'bg-violet-500/10 ring-violet-500/20',
    ink: 'text-violet-600 dark:text-violet-400',
  },
  {
    title: 'AI Extracts Data',
    detail: 'Reads the document and pulls the fields',
    icon: 'icon-[lucide--cpu]',
    tint: 'bg-emerald-500/10 ring-emerald-500/20',
    ink: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    title: 'Validates & Checks',
    detail: 'Totals, PO match, duplicates, your rules',
    icon: 'icon-[lucide--clipboard-check]',
    tint: 'bg-sky-500/10 ring-sky-500/20',
    ink: 'text-sky-600 dark:text-sky-400',
  },
  {
    title: 'Routes Automatically',
    detail: 'Sent to the right person or system',
    icon: 'icon-[lucide--user-round]',
    tint: 'bg-amber-500/10 ring-amber-500/20',
    ink: 'text-amber-600 dark:text-amber-500',
  },
  {
    title: 'Completed',
    detail: 'Filed, posted and logged for the audit',
    icon: 'icon-[lucide--circle-check]',
    tint: 'bg-teal-500/10 ring-teal-500/20',
    ink: 'text-teal-600 dark:text-teal-400',
  },
]

// One pass through the pipeline; `text` is segmented so the model's values stand out.
const EXECUTION = [
  {
    time: '10:42 AM',
    text: [{ t: 'Data ' }, { t: 'INV-1054', strong: true }, { t: ' received from ' }, { t: 'vendor@northwind.com', strong: true }],
    status: 'Received',
    dot: 'bg-violet-500',
    pill: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
  },
  {
    time: '10:42 AM',
    text: [{ t: 'AI extracted ' }, { t: '12 fields', strong: true }, { t: ' from Data' }],
    status: 'Success',
    dot: 'bg-emerald-500',
    pill: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  },
  {
    time: '10:42 AM',
    text: [{ t: 'Duplicate check passed' }],
    status: 'Success',
    dot: 'bg-emerald-500',
    pill: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  },
  {
    time: '10:43 AM',
    text: [{ t: 'Routed to ' }, { t: 'Accounts Payable', strong: true }, { t: ' team' }],
    status: 'Routed',
    dot: 'bg-sky-500',
    pill: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
  },
  {
    time: '10:43 AM',
    text: [{ t: 'Notification sent to approver' }],
    status: 'Notified',
    dot: 'bg-amber-500',
    pill: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  },
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

// ---------- One board: the flow across the top, what it did underneath ----------
function AutomationBoard() {
  return (
    <div className="container mx-auto mt-16 max-w-7xl rounded-3xl border border-base-200 bg-base-200/25 p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-opensans text-sm font-semibold text-base-content">
          AI reads, understands and routes Datas automatically
        </p>

        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1">
          <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
          <span className="font-opensans text-[10px] font-bold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
            Automation on
          </span>
        </span>
      </div>

      <Pipeline />

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <LiveExecution />
        <WorkingCard />
      </div>

      {/* What the flow is worth, as a line of type rather than another tile */}
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-base-200 pt-4">
        <p className="font-opensans text-xs text-base-content/55">
          <span className="font-mono text-base-content/80">340 hrs</span> handed back each month
        </p>
        <p className="font-opensans text-xs text-base-content/55">
          <span className="font-mono text-base-content/80">82%</span> closed with nobody stepping in
        </p>
        <p className="font-opensans text-xs text-base-content/55">
          <span className="font-mono text-base-content/80">6.2s</span> from trigger to done
        </p>
      </div>
    </div>
  )
}

// The dashed connector runs from each step's centre to the next one's.
function Pipeline() {
  return (
    <ol className="mt-7 grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
      {PIPELINE.map((step, index) => (
        <li key={step.title} className="relative flex flex-col items-center px-2 text-center">
          {index < PIPELINE.length - 1 && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-7 left-1/2 hidden w-full -translate-y-1/2 items-center gap-1 pr-6 pl-10 lg:flex"
            >
              <span className="flex-1 border-t border-dashed border-base-content/25" />
              <span className="icon-[lucide--chevron-right] size-3.5 shrink-0 text-base-content/30" />
            </span>
          )}

          <span
            className={`relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-base-100 ring-1 ${step.tint}`}
          >
            <span aria-hidden="true" className={`${step.icon} size-6 ${step.ink}`} />
          </span>

          <p className="font-opensans mt-4 text-sm font-semibold text-base-content">
            {index + 1}. {step.title}
          </p>
          <p className="font-opensans mt-1 max-w-60 text-xs leading-relaxed text-base-content/50">
            {step.detail}
          </p>
        </li>
      ))}
    </ol>
  )
}

// ---------- The feed: the run above, line by line ----------
function LiveExecution() {
  return (
    <div className="rounded-2xl border border-base-200 bg-base-100 p-5 lg:col-span-2">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="size-2 shrink-0 animate-pulse rounded-full bg-emerald-500" />
        <p className="font-opensans text-sm font-semibold text-base-content">Live Execution</p>
        <span className="font-opensans ml-auto text-xs font-medium text-violet-600 dark:text-violet-400">View all</span>
      </div>

      <ol className="mt-4 flex flex-col">
        {EXECUTION.map((row, index) => (
          <li key={row.time + row.status + index} className="flex items-stretch gap-3">
            <span className="font-mono hidden w-16 shrink-0 pt-2 text-[11px] tabular-nums text-base-content/45 sm:block">
              {row.time}
            </span>

            {/* Dot plus the rule that joins it to the next line */}
            <span className="flex w-2 shrink-0 flex-col items-center pt-2.5">
              <span className={`size-2 shrink-0 rounded-full ${row.dot}`} />
              {index < EXECUTION.length - 1 && <span className="mt-1 w-px flex-1 bg-base-200" />}
            </span>

            <p className="font-opensans min-w-0 flex-1 py-2 text-xs leading-relaxed text-base-content/60">
              {row.text.map((part, partIndex) =>
                part.strong ? (
                  <span key={partIndex} className="font-medium text-base-content">
                    {part.t}
                  </span>
                ) : (
                  <React.Fragment key={partIndex}>{part.t}</React.Fragment>
                ),
              )}
            </p>

            <span
              className={`font-opensans mt-1.5 h-fit shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${row.pill}`}
            >
              {row.status}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

// ---------- Who is minding it ----------
function WorkingCard() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-violet-500/15 bg-violet-500/5 p-6 text-center">
      <RobotMark />

      <p className="font-opensans mt-4 text-sm font-semibold text-base-content">AI is working for you</p>
      <p className="font-opensans mt-1.5 max-w-64 text-xs leading-relaxed text-base-content/55">
        No manual effort required. Exceptions come to you — everything else is already filed.
      </p>

      <p className="font-mono mt-4 text-[11px] text-base-content/45">
        watching inbox
        <span
          aria-hidden="true"
          className="animate-ai-caret ml-1 inline-block h-3 w-1.5 translate-y-0.5 bg-violet-500 motion-reduce:animate-none"
        />
      </p>
    </div>
  )
}

// Flat two-tone robot — no render, so it stays crisp and weighs nothing.
function RobotMark() {
  return (
    <svg viewBox="0 0 120 120" className="size-24" role="img" aria-label="">
      <circle cx="60" cy="62" r="46" className="fill-violet-500/10" />

      {/* Antenna */}
      <path d="M60 22v10" className="stroke-violet-400" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="19" r="4" className="fill-violet-500" />

      {/* Side pods */}
      <rect x="24" y="52" width="7" height="18" rx="3.5" className="fill-violet-300" />
      <rect x="89" y="52" width="7" height="18" rx="3.5" className="fill-violet-300" />

      {/* Head */}
      <rect x="32" y="33" width="56" height="46" rx="16" className="fill-violet-100" />
      <rect x="40" y="43" width="40" height="26" rx="12" className="fill-slate-900" />
      <circle cx="52" cy="56" r="4.5" className="fill-violet-300" />
      <circle cx="68" cy="56" r="4.5" className="fill-violet-300" />

      {/* Body */}
      <path d="M44 83h32a10 10 0 0 1 10 10v6H34v-6a10 10 0 0 1 10-10Z" className="fill-violet-200" />
      <rect x="52" y="88" width="16" height="4" rx="2" className="fill-violet-400" />
    </svg>
  )
}
