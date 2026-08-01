import React from 'react'
import IosUi from '../Global-Compoents/Mock-UI/IOS-UI'

export default function ProjectGrid() {
  return (
    <section id="work" className="px-4 py-16 sm:px-8 sm:py-20 lg:px-16">
      <div className="container mx-auto max-w-7xl">
        <div className="mt-12 grid auto-rows-[minmax(0,20rem)] gap-6 sm:grid-cols-7">
          <Cell label="Cell 1" gradient="from-sky-200 via-indigo-200 to-slate-300" className="sm:col-span-5" />

          <div className="flex items-center justify-end sm:col-span-2 sm:row-span-2">
            <IosUi className="h-full" />
          </div>

          <Cell label="Cell 3" gradient="from-amber-100 via-orange-100 to-rose-200" className="sm:col-span-5" />
        </div>
      </div>
    </section>
  )
}

function Cell({ label, gradient, className = '' }) {
  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-base-200 bg-base-100 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:hover:translate-y-0 ${className}`}
    >
      <div className={`relative flex-1 overflow-hidden bg-linear-to-br ${gradient} p-4 sm:p-5`}>
        <div aria-hidden="true" className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10" />

        <div className="relative flex h-full items-center justify-center transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100">
          <span className="font-opensans text-sm font-semibold text-base-content/60">{label}</span>
        </div>
      </div>
    </div>
  )
}
