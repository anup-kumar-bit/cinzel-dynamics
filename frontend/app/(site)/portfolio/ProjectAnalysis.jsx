'use client'

import React, { useEffect, useState } from 'react'
import { getPublicPortfolioStats } from '@/lib/cinzelPanel/db'

// Single site-wide record set from the admin panel, not per project.
const METRICS = [
  {
    key: 'needsFulfilled',
    label: 'Client needs fulfilled',
    max: 100,
    bar: 'bg-sky-600',
    track: 'bg-sky-600/12',
    format: (value) => `${Math.round(value)}%`,
  },
  {
    key: 'satisfaction',
    label: 'Client satisfaction',
    max: 5,
    bar: 'bg-violet-600',
    track: 'bg-violet-600/12',
    format: (value) => `${value.toFixed(1)} / 5`,
  },
  {
    key: 'onTimeDelivery',
    label: 'On-time delivery',
    max: 100,
    bar: 'bg-emerald-600',
    track: 'bg-emerald-600/12',
    format: (value) => `${Math.round(value)}%`,
  },
]

export default function ProjectAnalysis() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getPublicPortfolioStats()
      .then(setStats)
      .catch(() => setStats({ needsFulfilled: null, satisfaction: null, onTimeDelivery: null }))
  }, [])

  if (stats === null) return null

  const anyTracked = METRICS.some((metric) => typeof stats[metric.key] === 'number')

  return (
    <section className="border-t border-base-200 px-4 py-14 sm:px-8 sm:py-16 lg:px-16">
      <div className="container mx-auto max-w-7xl">
        <p className="font-opensans text-xs font-semibold tracking-widest text-base-content/65 uppercase">
          Project analysis
        </p>

        {anyTracked ? (
          <div className="mt-7 grid gap-y-7 sm:grid-cols-3 sm:gap-x-10">
            {METRICS.map((metric) => (
              <MetricColumn key={metric.key} metric={metric} value={stats[metric.key]} />
            ))}
          </div>
        ) : (
          <p className="font-opensans mt-6 max-w-xl border-t border-base-200 pt-5 text-sm leading-relaxed text-base-content/50">
            Outcome scores appear here once they&apos;re set in the admin panel — nothing has been scored yet.
          </p>
        )}
      </div>
    </section>
  )
}

function MetricColumn({ metric, value }) {
  const tracked = typeof value === 'number'
  const fraction = tracked ? Math.min(value / metric.max, 1) : 0

  return (
    <div className="border-t border-base-200 pt-4">
      <p className="font-opensans text-[10px] font-semibold tracking-widest text-base-content/40 uppercase">
        {metric.label}
      </p>
      <p
        className={`font-opensans mt-1.5 text-2xl font-extrabold ${tracked ? 'text-base-content' : 'text-base-content/30'}`}
      >
        {tracked ? metric.format(value) : '—'}
      </p>

      <div className={`mt-3 h-1 w-full overflow-hidden rounded-full ${tracked ? metric.track : 'bg-base-200'}`}>
        {tracked ? <div className={`h-full rounded-full ${metric.bar}`} style={{ width: `${fraction * 100}%` }} /> : null}
      </div>

      {!tracked ? <p className="mt-2 text-[11px] text-base-content/40">Not tracked yet</p> : null}
    </div>
  )
}
