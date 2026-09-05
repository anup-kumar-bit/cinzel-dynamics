'use client'

import React, { useEffect, useState } from 'react'
import AndroidUi from '../Global-Compoents/Mock-UI/Android-UI'
import IosUi from '../Global-Compoents/Mock-UI/IOS-UI'
import WebUi from '../Global-Compoents/Mock-UI/Web-UI'
import { listPublicApps, listPublicWebsites } from '@/lib/cinzelPanel/db'

// Admin app record -> home-screen tile shape the Mock-UI components expect.
function toTile(app) {
  return {
    label: app.name,
    iconSrc: app.icon?.url,
    tone: '',
    screens: Object.fromEntries(
      (app.screenGroups ?? []).map((group) => [group.name, group.images.map((image) => image.url)]),
    ),
  }
}

const SERVICES = [
  {
    name: 'Server',
    icon: 'icon-[lucide--server]',
    tint: 'text-sky-600',
    gradient: 'from-sky-200 via-indigo-200 to-slate-300',
    copy: 'APIs, background jobs and cron on infrastructure we provision and watch.',
    stack: ['icon-[logos--nodejs-icon]', 'icon-[logos--docker-icon]', 'icon-[logos--nginx]'],
    status: 'In every build',
  },
  {
    name: 'Database',
    icon: 'icon-[lucide--database]',
    tint: 'text-emerald-600',
    gradient: 'from-emerald-200 via-teal-200 to-cyan-200',
    copy: 'Schema, migrations, backups and the indexes that keep queries honest.',
    stack: ['icon-[logos--postgresql]', 'icon-[logos--redis]', 'icon-[logos--mongodb-icon]'],
    status: 'In every build',
  },
  {
    name: 'Storage',
    icon: 'icon-[lucide--hard-drive]',
    tint: 'text-amber-600',
    gradient: 'from-amber-100 via-orange-200 to-rose-200',
    copy: 'Uploads, media and documents on object storage, served from the edge.',
    stack: ['icon-[logos--aws-s3]', 'icon-[logos--cloudflare-icon]', 'icon-[logos--supabase-icon]'],
    status: 'Add on',
  },
  {
    name: 'Security',
    icon: 'icon-[lucide--shield-check]',
    tint: 'text-violet-600',
    gradient: 'from-violet-200 via-fuchsia-200 to-pink-200',
    copy: 'Auth, roles, secrets and TLS — reviewed before anything reaches production.',
    stack: ['icon-[logos--auth0-icon]', 'icon-[logos--jwt-icon]', 'icon-[logos--vercel-icon]'],
    status: 'Add on',
  },
]

export default function ProjectGrid() {
  const [iosApps, setIosApps] = useState(undefined)
  const [androidApps, setAndroidApps] = useState(undefined)
  // Two browser frames on this page; website projects alternate between them
  // in the order they were created (1st/3rd/5th… vs 2nd/4th/6th…) — same rule
  // the admin preview uses — and each frame stacks the ones it holds as tabs.
  const [websiteBoxes, setWebsiteBoxes] = useState([undefined, undefined])
  const [websitesLoading, setWebsitesLoading] = useState(true)

  useEffect(() => {
    // Pass the real (possibly empty) array through, same as the admin preview —
    // `undefined` would fall back to IosUi/AndroidUi's baked-in demo apps and
    // the portfolio page would show apps that don't exist in the admin panel.
    listPublicApps('ios')
      .then((apps) => setIosApps(apps.map(toTile)))
      .catch(() => setIosApps([]))

    listPublicApps('android')
      .then((apps) => setAndroidApps(apps.map(toTile)))
      .catch(() => setAndroidApps([]))

    listPublicWebsites()
      .then((projects) => {
        setWebsiteBoxes([projects.filter((_, i) => i % 2 === 0), projects.filter((_, i) => i % 2 === 1)])
      })
      .catch(() => setWebsiteBoxes([[], []]))
      .finally(() => setWebsitesLoading(false))
  }, [])

  return (
    <section id="work" className="px-4 py-16 sm:px-8 sm:py-20 lg:px-16">
      <div className="container mx-auto max-w-360">

        <div className="mt-12 grid grid-rows-[24rem_30rem] gap-x-7 gap-y-6 sm:grid-cols-7 sm:grid-rows-[34rem_10rem]">
          <WebUi className="sm:col-span-5" projects={websiteBoxes[0]} loading={websitesLoading} />

          <div className="flex items-stretch gap-2 sm:col-span-2 sm:row-span-2 sm:items-center sm:justify-center">
            <IosUi className="h-auto w-56 shrink-0 sm:w-full sm:max-w-84" apps={iosApps} />

            <div className="flex min-w-0 flex-1 flex-col justify-center gap-4 pl-2 sm:hidden">
              <PhoneCallout icon="icon-[lucide--zap]" tint="text-amber-500" label="Smooth Performance" />
              <PhoneCallout icon="icon-[lucide--sparkles]" tint="text-violet-500" label="Modern UI" />
              <PhoneCallout icon="icon-[lucide--trending-up]" tint="text-emerald-500" label="Built for Scale" />
            </div>
          </div>

          <Cell gradient="from-amber-100 via-orange-100 to-rose-200" className="hidden sm:col-span-5 sm:flex">
            <div className="flex flex-col items-center text-center">
              <span className="font-cinzel text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                50+
              </span>
              <span className="font-opensans mt-1.5 max-w-64 text-xs leading-snug whitespace-nowrap text-slate-900/60 sm:text-sm">
                Apps and sites shipped — like the ones previewed here.
              </span>
            </div>
          </Cell>
        </div>

        <div className="mt-14 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="font-opensans text-xs font-semibold tracking-widest text-base-content/65 uppercase">
            Under every build
          </p>
          <p className="font-opensans text-xs text-base-content/50 sm:text-sm">
            Already running behind the work above — or bolted on to yours.
          </p>
        </div>

        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => (
            <ServiceCard key={service.name} service={service} />
          ))}
        </div>

        <div className="mt-14 grid grid-rows-[30rem_30rem] gap-x-7 gap-y-6 sm:grid-cols-7 sm:grid-rows-[34rem_10rem]">
          <div className="row-start-2 flex items-stretch gap-2 sm:row-start-auto sm:col-span-2 sm:row-span-2 sm:items-center sm:justify-center">
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-4 pr-2 text-right sm:hidden">
              <PhoneCallout reverse icon="icon-[lucide--zap]" tint="text-amber-500" label="Smooth Performance" />
              <PhoneCallout reverse icon="icon-[lucide--sparkles]" tint="text-violet-500" label="Modern UI" />
              <PhoneCallout reverse icon="icon-[lucide--trending-up]" tint="text-emerald-500" label="Built for Scale" />
            </div>

            <AndroidUi className="h-auto w-56 shrink-0 sm:w-full sm:max-w-81" apps={androidApps} />
          </div>

          <WebUi className="sm:col-span-5" projects={websiteBoxes[1]} loading={websitesLoading} />

          <Cell gradient="from-amber-100 via-orange-100 to-rose-200" className="hidden sm:col-span-5 sm:flex">
            <div className="flex flex-col items-center text-center">
              <span className="font-cinzel text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                24/7
              </span>
              <span className="font-opensans mt-1.5 max-w-64 text-xs leading-snug whitespace-nowrap text-slate-900/60 sm:text-sm">
                Support after launch — same team, always on.
              </span>
            </div>
          </Cell>
        </div>
      </div>
    </section>
  )
}

function PhoneCallout({ icon, tint, label, reverse = false }) {
  return (
    <div className={`flex items-center gap-1.5 ${reverse ? 'flex-row-reverse' : ''}`}>
      <span aria-hidden="true" className={`${icon} size-3.5 shrink-0 ${tint}`} />
      <span className={`font-opensans text-[10px] leading-tight font-semibold ${tint}`}>{label}</span>
    </div>
  )
}

function Cell({ label, gradient, className = '', children }) {
  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-base-200 bg-base-100 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:hover:translate-y-0 ${className}`}
    >
      <div className={`relative flex-1 overflow-hidden bg-linear-to-br ${gradient} p-4 sm:p-5`}>
        <div aria-hidden="true" className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10" />

        {children ? (
          <div className="relative flex h-full w-full items-center justify-center transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:group-hover:scale-100">
            {children}
          </div>
        ) : (
          <div className="relative flex h-full items-center justify-center transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100">
            <span className="font-opensans text-sm font-semibold text-base-content/60">{label}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function ServiceCard({ service }) {
  const included = service.status === 'In every build'
  const compact = !included

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-base-200 bg-base-100 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:hover:translate-y-0 ${compact ? 'self-start sm:self-auto' : ''}`}
    >
      <div
        className={`relative flex items-center gap-3 overflow-hidden bg-linear-to-br ${service.gradient} ${compact ? 'p-2.5 sm:p-4' : 'p-4'}`}
      >
        <div aria-hidden="true" className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10" />

        <span
          className={`relative flex shrink-0 items-center justify-center rounded-xl bg-white/85 shadow-sm backdrop-blur transition-transform duration-500 group-hover:scale-110 motion-reduce:group-hover:scale-100 ${compact ? 'size-7 sm:size-10' : 'size-10'}`}
        >
          <span aria-hidden="true" className={`${service.icon} ${compact ? 'size-3.5 sm:size-5' : 'size-5'} ${service.tint}`} />
        </span>

        <div className="relative min-w-0">
          <p className={`font-cinzel font-extrabold tracking-tight text-slate-900 ${compact ? 'text-sm sm:text-base' : 'text-base'}`}>
            {service.name}
          </p>
          <p
            className={`font-opensans text-[10px] tracking-wide text-slate-900/55 uppercase ${compact ? 'hidden sm:block' : ''}`}
          >
            {service.status}
          </p>
        </div>
      </div>

      <div className={`flex flex-1 flex-col ${compact ? 'p-2.5 sm:p-4' : 'p-4'}`}>
        <p className={`font-opensans text-base-content/60 ${compact ? 'text-[11px] sm:text-xs' : 'text-xs'}`}>{service.copy}</p>

        <div className={`flex items-center gap-2 border-t border-base-200 ${compact ? 'mt-2.5 pt-2 sm:mt-4 sm:pt-3' : 'mt-4 pt-3'}`}>
          {service.stack.map((logo) => (
            <span
              key={logo}
              aria-hidden="true"
              className={`${logo} ${compact ? 'size-3 sm:size-4' : 'size-4'} opacity-70 transition-opacity duration-300 group-hover:opacity-100`}
            />
          ))}

          <span className="font-opensans ml-auto flex items-center gap-1 text-[10px] text-base-content/45">
            <span
              aria-hidden="true"
              className={
                included ? 'icon-[lucide--check] size-3 text-emerald-500' : 'icon-[lucide--plus] size-3 text-base-content/40'
              }
            />
            {included ? 'Wired in' : 'On request'}
          </span>
        </div>
      </div>
    </div>
  )
}

