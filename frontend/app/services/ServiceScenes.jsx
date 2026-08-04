import React from 'react'

// Stand-in product shots. No stock photography and no remote hosts: each scene
// is an abstract browser or handset built from the same primitives, tinted by
// the service's accent, so fifteen of them still read as one family.

export function Scene({ service }) {
  if (service.scene === 'chat') return <ChatScene service={service} />
  if (service.scene === 'agent') return <AgentScene service={service} />
  if (service.scene === 'phone') return <PhoneScene service={service} />
  return <DuoScene service={service} />
}

// ---------- Frames ----------
function BrowserFrame({ domain, tint, children, className = '' }) {
  return (
    <div className={`overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/10 ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-neutral-200 bg-neutral-50 px-2.5 py-1.5">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-red-400" />
        <span aria-hidden="true" className="size-1.5 rounded-full bg-yellow-400" />
        <span aria-hidden="true" className="size-1.5 rounded-full bg-green-500" />
        <span className="ml-1.5 flex min-w-0 flex-1 items-center gap-1 rounded-full bg-white px-2 py-0.5 ring-1 ring-neutral-200">
          <span aria-hidden="true" className="icon-[lucide--lock] size-2 shrink-0 text-neutral-400" />
          <span className="truncate font-mono text-[8px] text-neutral-500">{domain}</span>
        </span>
      </div>

      <div className="p-3">{children ?? <PageSkeleton tint={tint} />}</div>
    </div>
  )
}

function PhoneFrame({ tint, children, className = '' }) {
  return (
    <div className={`overflow-hidden rounded-2xl bg-neutral-900 p-1 shadow-2xl ring-1 ring-black/20 ${className}`}>
      <div className="relative overflow-hidden rounded-xl bg-white">
        <span aria-hidden="true" className="absolute top-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-neutral-800" />
        <div className="p-2 pt-3.5">{children ?? <AppSkeleton tint={tint} />}</div>
      </div>
    </div>
  )
}

// ---------- Skeletons ----------
function PageSkeleton({ tint }) {
  return (
    <>
      <div className={`h-10 w-full rounded-md bg-linear-to-br ${tint}`} />
      <div className="mt-2 h-1.5 w-1/2 rounded-full bg-neutral-300" />
      <div className="mt-1.5 h-1 w-3/4 rounded-full bg-neutral-200" />

      <div className="mt-2.5 grid grid-cols-3 gap-1.5">
        {[0, 1, 2].map((tile) => (
          <div key={tile} className="rounded-md border border-neutral-200 p-1.5">
            <div className={`h-4 rounded-sm bg-linear-to-br ${tint} opacity-70`} />
            <div className="mt-1 h-1 w-2/3 rounded-full bg-neutral-200" />
          </div>
        ))}
      </div>
    </>
  )
}

function AppSkeleton({ tint }) {
  return (
    <>
      <div className={`h-8 w-full rounded-md bg-linear-to-br ${tint}`} />
      <div className="mt-1.5 h-1 w-2/3 rounded-full bg-neutral-300" />

      <div className="mt-2 flex flex-col gap-1">
        {[0, 1, 2].map((row) => (
          <div key={row} className="flex items-center gap-1 rounded-md bg-neutral-100 p-1">
            <span className={`size-3 shrink-0 rounded-full bg-linear-to-br ${tint}`} />
            <span className="h-1 flex-1 rounded-full bg-neutral-300" />
          </div>
        ))}
      </div>
    </>
  )
}

// ---------- Scenes ----------
// The default: the web build behind, the app in front of it, both on screen at
// once — which is the point for every service that ships as a pair.
function DuoScene({ service }) {
  return (
    <div className="relative h-full min-h-64 w-full">
      <BrowserFrame
        domain={service.site ?? 'app.yourbrand.com'}
        tint={service.tint}
        className="absolute inset-x-4 top-6 sm:inset-x-10 sm:top-8"
      />

      <PhoneFrame tint={service.tint} className="absolute right-6 bottom-4 w-24 sm:right-12 sm:bottom-6 sm:w-28" />
    </div>
  )
}

function PhoneScene({ service }) {
  return (
    <div className="relative flex h-full min-h-64 w-full items-center justify-center">
      <PhoneFrame tint={service.tint} className="w-32 sm:w-36" />
    </div>
  )
}

function ChatScene({ service }) {
  return (
    <div className="relative flex h-full min-h-64 w-full items-center justify-center p-6">
      <div className="w-full max-w-72 rounded-2xl bg-white p-3 shadow-2xl ring-1 ring-black/10">
        <div className="flex items-center gap-1.5 border-b border-neutral-200 pb-2">
          <span aria-hidden="true" className="icon-[logos--whatsapp-icon] size-4" />
          <span className="font-opensans text-[10px] font-semibold text-neutral-700">Business · online</span>
        </div>

        <div className="mt-2.5 flex flex-col gap-1.5">
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
        </div>
      </div>
    </div>
  )
}

function AgentScene({ service }) {
  return (
    <div className="relative flex h-full min-h-64 w-full items-center justify-center p-6">
      <div className="w-full max-w-72 rounded-2xl bg-white p-3 shadow-2xl ring-1 ring-black/10">
        <p className="font-opensans text-[11px] font-medium text-neutral-700">“Do I pay return shipping?”</p>

        <div className="mt-2.5 flex items-start gap-1.5 border-t border-neutral-200 pt-2.5">
          <span aria-hidden="true" className={`${service.icon} size-4 shrink-0 text-violet-600`} />
          <p className="font-opensans text-[11px] text-neutral-600">
            No — damaged items ship back free. A label is on the way to your email.
          </p>
        </div>

        <div className="mt-2.5 flex items-center gap-1.5">
          <span className="font-opensans flex items-center gap-1 rounded-full bg-violet-500/10 px-2 py-0.5 text-[9px] font-medium text-violet-700">
            <span aria-hidden="true" className="icon-[lucide--file-text] size-2.5" />
            returns-policy.pdf · p4
          </span>
          <span className="font-mono text-[9px] text-neutral-400">0.96</span>
        </div>
      </div>
    </div>
  )
}
