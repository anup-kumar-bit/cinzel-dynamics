import React from 'react'

const logos = ['Vertex Path', 'Nebula Cloud', 'SyncSystems', 'Mindshare', 'Quantas']

const stats = [
  { value: '50+', label: 'Apps Delivered' },
  { value: '100k+', label: 'Active Users' },
  { value: '99.9%', label: 'Backend Uptime' },
]

export default function TrustSection() {
  return (
    <section id="trust" className="px-4 py-16 sm:px-8 sm:py-20 lg:px-16">
      <div className="container mx-auto flex flex-col items-center text-center">
        <p className="font-opensans text-sm font-semibold tracking-widest uppercase">
          Trusted by innovative startups and enterprises
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {logos.map((logo) => (
            <span
              key={logo}
              className="font-cinzel text-sm font-bold tracking-wide uppercase sm:text-2xl"
            >
              {logo}
            </span>
          ))}
        </div>

        <a href="#contact" className="btn btn-neutral mt-10 rounded-full px-6">
          Book a Free Consultation
        </a>

        <div className="mt-14 grid w-full max-w-md grid-cols-3 divide-x divide-base-200">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center px-2">
              <span className="text-2xl font-extrabold text-base-content sm:text-3xl">{stat.value}</span>
              <span className="mt-1 text-xs text-base-content/50 sm:text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
