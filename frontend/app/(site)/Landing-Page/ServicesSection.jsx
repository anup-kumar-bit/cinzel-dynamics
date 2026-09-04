import React from 'react'
import Image from 'next/image'

// -------** ServicesSection **---------
export default function ServicesSection() {
  return (
    <section id="services" className="relative isolate overflow-hidden px-4 py-16 sm:px-8 sm:py-20 lg:px-16">
      <ServicesBackdrop />

      <div className="container relative mx-auto flex flex-col items-center text-center">
        <p className="font-opensans text-xs font-semibold tracking-widest text-base-content/65 uppercase">
          Custom app development
        </p>

        <h2 className="font-cinzel mt-4 max-w-5xl text-4xl font-extrabold tracking-tight text-base-content sm:text-5xl">
          Customize your app, your way.
        </h2>

        <p className="font-opensans mt-5 max-w-xl text-sm text-base-content/60 sm:text-base">
          The stack, integrations and workflows your business runs on are chosen first — your app is built around
          them, then published to the App Store and Google Play under your own developer accounts.
        </p>
      </div>

      <div className="relative mt-16 flex flex-col items-center overflow-hidden">
        <Image
          src="/images/apps.png"
          alt="Cinzel Dynamics app UI shown side by side on an iPhone and an Android handset"
          width={1536}
          height={1024}
          sizes="(min-width: 896px) 896px, 100vw"
          className="h-auto w-full max-w-4xl drop-shadow-2xl"
        />
      </div>

      <StorePublishing />
    </section>
  )
}

// ---------- Store badges + the platforms each one covers ----------
const PLATFORMS = [
  { label: 'Built for iOS 15 and later', icon: 'icon-[simple-icons--apple]', tint: 'text-base-content' },
  { label: 'Built for Android 10 and later', icon: 'icon-[simple-icons--android]', tint: 'text-[#3ddc84]' },
]

function StorePublishing() {
  return (
    <div className="container relative mx-auto mt-12 flex flex-col items-center">
      <p className="font-opensans text-xs font-semibold tracking-widest text-base-content/65 uppercase">
        Publish & Make available
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
        <StoreBadge caption="Released on the" name="App Store">
          {/* Monochrome set: picks up the badge's white text colour */}
          <span aria-hidden="true" className="icon-[simple-icons--apple] size-7 shrink-0" />
        </StoreBadge>

        <StoreBadge caption="Released on" name="Google Play">
          {/* Multi-colour set: keeps the official Play palette */}
          <span aria-hidden="true" className="icon-[logos--google-play-icon] size-6 shrink-0" />
        </StoreBadge>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {PLATFORMS.map(({ label, icon, tint }) => (
          <span key={label} className="font-opensans flex items-center gap-2 text-xs text-base-content/55 sm:text-sm">
            <span aria-hidden="true" className={`${icon} size-4 ${tint}`} />
            {label}
          </span>
        ))}
      </div>

      <p className="font-opensans mt-6 max-w-md text-center text-xs text-base-content/65 sm:text-sm">
        Store accounts, signing, review submissions and every update after launch are handled end to end — one build,
        both stores.
      </p>
    </div>
  )
}

// Statement, not a download link — the store artwork here says where we ship, not what to install.
function StoreBadge({ caption, name, children }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-black px-5 py-2.5 text-white shadow-lg dark:bg-neutral-900 dark:ring-1 dark:ring-white/15">
      {children}
      <span className="flex flex-col items-start text-left leading-none">
        <span className="font-opensans text-[10px] tracking-wide text-white/70 uppercase">{caption}</span>
        <span className="font-opensans mt-1 text-base font-semibold">{name}</span>
      </span>
    </div>
  )
}

// ---------- Decorative backdrop: pastel discs, dot grids, concentric rings ----------
function ServicesBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Soft pastel discs sitting behind the phones */}
      <div className="absolute top-[18%] left-[2%] size-88 rounded-full bg-blue-400/20 blur-2xl dark:bg-blue-500/12 sm:size-120" />
      <div className="absolute top-[26%] right-[1%] size-80 rounded-full bg-violet-400/20 blur-2xl dark:bg-violet-500/12 sm:size-112" />

      {/* Dot matrices — colour comes from the text-* class via currentColor */}
      <div className="dot-grid absolute top-[26%] left-[3%] hidden size-28 text-blue-500/50 dark:text-blue-400/30 sm:block" />
      <div className="dot-grid absolute right-[3%] bottom-[20%] hidden size-28 text-violet-500/50 dark:text-violet-400/30 sm:block" />
    </div>
  )
}


