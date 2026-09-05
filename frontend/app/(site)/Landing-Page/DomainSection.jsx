import React from 'react'
import Image from 'next/image'

// -------** DomainSection **---------
export default function DomainSection() {
  return (
    <section id="domain" className="px-4 py-16 sm:px-8 sm:py-20 lg:px-16">
      <div className="container mx-auto flex flex-col items-center text-center">
        <p className="font-opensans text-xs font-semibold tracking-widest text-base-content/65 uppercase">
          Domain &amp; delivery
        </p>

        <h2 className="font-cinzel mt-4 max-w-5xl text-4xl font-extrabold tracking-tight text-base-content sm:text-5xl">
          Connect your domain and share your website with the 🌍.
        </h2>

        <p className="font-opensans mt-5 max-w-xl text-sm text-base-content/60 sm:text-base">
          Your domain is connected, DNS and SSL are configured, and your site is delivered globally — so it&apos;s
          loaded quickly, wherever it&apos;s opened.
        </p>
      </div>

      <DomainGraphic />
    </section>
  )
}

// ---------- Browser mockup graphic of Domain Section ----------
// Every size below is either a fraction of the panel or a responsive step —
// nothing fixed-pixel, so the mockup scales instead of overflowing on phones.
function DomainGraphic() {
  return (
    <div className="relative mt-16 flex justify-center">
      {/* Green background */}
      <div className="relative aspect-4/5 w-full max-w-7xl overflow-hidden rounded-2xl bg-linear-to-br from-emerald-300 via-green-500 to-green-900 sm:aspect-16/11 sm:rounded-3xl lg:aspect-[2.3/1]">
        {/* Noise */}
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10" />

        {/* Browser */}
        <div className="absolute inset-x-3 top-[8%] bottom-0 flex flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:inset-x-auto sm:right-0 sm:w-[78%] sm:rounded-t-3xl">
          {/* Browser Header */}
          <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b bg-white px-3 sm:h-16 sm:px-6">
            <div className="flex shrink-0 items-center gap-2 sm:gap-6">
              <div className="flex gap-1.5 sm:gap-3">
                <span className="size-2.5 rounded-full bg-red-400 sm:size-4" />
                <span className="size-2.5 rounded-full bg-yellow-400 sm:size-4" />
                <span className="size-2.5 rounded-full bg-green-500 sm:size-4" />
              </div>

              <span className="hidden items-center gap-2 text-neutral-500 sm:flex">
                <span aria-hidden="true" className="icon-[lucide--chevron-left] size-5" />
                <span aria-hidden="true" className="icon-[lucide--chevron-right] size-5" />
                <span aria-hidden="true" className="icon-[lucide--rotate-cw] size-4" />
              </span>
            </div>

            <div className="flex h-7 min-w-0 flex-1 items-center rounded-lg border bg-neutral-50 px-2 sm:h-11 sm:max-w-85 sm:flex-none sm:rounded-xl sm:px-3">
              {/* <Image
                src="/svgs/avatar.svg"
                alt=""
                width={28}
                height={28}
                className="mr-1.5 size-4 shrink-0 rounded object-cover sm:mr-3 sm:size-7 sm:rounded-md"
              /> */}
              <span className="truncate text-[11px] text-neutral-600 sm:text-lg">
                www.oliviaperry.com
              </span>
            </div>
          </div>

          {/* Website */}
          <div className="relative min-h-0 flex-1 overflow-hidden bg-[#d7cffc]">
            <div
              aria-hidden="true"
              className="animate-domain-load absolute inset-x-0 top-0 z-20 h-0.5 origin-left scale-x-0 rounded-r-full bg-linear-to-r from-purple-600/0 via-purple-500/70 to-purple-400 opacity-0 motion-reduce:animate-none"
            />

            {/* Top */}
            <div className="flex flex-col gap-2 px-4 pt-4 sm:flex-row sm:justify-between sm:px-12 sm:pt-8">
              <div>
                <p className="text-base font-bold sm:text-4xl">
                  Olivia Perry
                </p>
                <p className="text-xs font-semibold sm:text-2xl">
                  Photographer, Art-Director
                </p>
              </div>

              <p className="text-xs font-bold sm:text-3xl">
                NYC · VIENNA
              </p>

              {/* Portrait */}
              <div className="h-14 w-11 rounded bg-black/10 grayscale sm:absolute sm:top-36 sm:left-12 sm:h-40 sm:w-32 sm:rounded-md" />
            </div>

            {/* Huge Text */}
            <p
              aria-hidden="true"
              className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 text-[18vw] leading-none font-black tracking-tight sm:text-[16vw] lg:-bottom-24 lg:text-[260px]"
            >
              olivia
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
