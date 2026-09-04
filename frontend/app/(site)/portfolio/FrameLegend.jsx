import React from 'react'

const FRAMES = [
  {
    icon: 'icon-[lucide--app-window]',
    tint: 'text-sky-600',
    rule: 'bg-sky-500',
    title: 'The browser frames',
    note: 'Every tab is a different client site, with its own domain in the address bar.',
    hint: 'Switch tabs · page the sections',
    logos: ['icon-[logos--chrome]', 'icon-[logos--safari]', 'icon-[logos--firefox]', 'icon-[logos--microsoft-edge]'],
  },
  {
    icon: 'icon-[simple-icons--apple]',
    tint: 'text-violet-600',
    rule: 'bg-violet-500',
    title: 'The iPhone',
    note: 'Tap an icon and the screens we shipped to the App Store open behind it.',
    hint: 'Power on · open an app · swipe through',
    logos: ['icon-[logos--apple-app-store]', 'icon-[logos--swift]', 'icon-[logos--react]'],
  },
  {
    icon: 'icon-[simple-icons--android]',
    tint: 'text-emerald-600',
    rule: 'bg-emerald-500',
    title: 'The Android',
    note: 'The same builds on the other store, in a shell that boots the way the phone does.',
    hint: 'Power on · restart · open an app',
    logos: ['icon-[logos--google-play-icon]', 'icon-[logos--kotlin-icon]', 'icon-[logos--react]'],
  },
]

export default function FrameLegend() {
  return (
    <section className="border-t border-base-200 px-4 py-14 sm:px-8 sm:py-16 lg:px-16">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="font-opensans text-xs font-semibold tracking-widest text-base-content/65 uppercase">
            What you are looking at
          </p>

          <p className="font-opensans text-xs text-base-content/50 sm:text-sm">
            All three frames work. None of them are pictures of a product.
          </p>
        </div>

        <div className="mt-7 grid gap-y-7 sm:grid-cols-3 sm:gap-x-10">
          {FRAMES.map((frame) => (
            <div key={frame.title} className="relative border-t border-base-200 pt-4">
              <span aria-hidden="true" className={`absolute -top-px left-0 h-0.5 w-10 ${frame.rule}`} />

              <div className="flex items-center gap-2.5">
                <span aria-hidden="true" className={`${frame.icon} size-4 shrink-0 ${frame.tint}`} />
                <p className="font-opensans text-sm font-bold text-base-content">{frame.title}</p>
              </div>

              <p className="font-opensans mt-2 text-[13px] leading-relaxed text-base-content/55">{frame.note}</p>

              <p className="font-mono mt-3 text-[11px] text-base-content/40">{frame.hint}</p>

              <div className="mt-4 flex items-center gap-2.5 border-t border-base-200 pt-3">
                {frame.logos.map((logo) => (
                  <span key={logo} aria-hidden="true" className={`${logo} size-4 opacity-75`} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="font-opensans mt-9 max-w-3xl border-t border-base-200 pt-5 text-[13px] leading-relaxed text-base-content/50">
          Nothing above is a stock mockup. Each icon, screenshot and domain is loaded live from the same admin panel
          your own project is handed at launch — when the work changes, this page changes with it.
        </p>
      </div>
    </section>
  )
}
