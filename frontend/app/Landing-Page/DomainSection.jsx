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
function DomainGraphic() {
  return (
    <div className="relative mt-16 flex justify-center">
      {/* Green Background */}
      <div className="relative h-140 w-full max-w-7xl overflow-hidden rounded-3xl bg-linear-to-br from-emerald-300 via-green-500 to-green-900">

        {/* Noise */}
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10" />

        {/* Browser */}
        <div className="absolute right-0 bottom-0 w-[78%] overflow-hidden rounded-t-3xl bg-white shadow-2xl">

          {/* Browser Header */}
          <div className="flex h-16 items-center justify-between border-b bg-white px-6">
            <div className="flex items-center gap-6">
              <div className="flex gap-3">
                <span className="h-4 w-4 rounded-full bg-red-400"></span>
                <span className="h-4 w-4 rounded-full bg-yellow-400"></span>
                <span className="h-4 w-4 rounded-full bg-green-500"></span>
              </div>

              <svg className="h-5 w-5 text-neutral-500" />
              <svg className="h-5 w-5 text-neutral-500" />
              <svg className="h-5 w-5 text-neutral-500" />
            </div>

            <div className="flex h-11 w-85 items-center rounded-xl border bg-neutral-50 px-3">
              <Image
                src="/svgs/avatar.svg"
                alt=""
                width={28}
                height={28}
                className="mr-3 h-7 w-7 rounded-md object-cover"
              />
              <span className="text-xl text-neutral-600">
                www.oliviaperry.com
              </span>
            </div>
          </div>

          {/* Website */}
          <div className="relative h-117.5 overflow-hidden bg-[#d7cffc]">

            <div
              aria-hidden="true"
              className="animate-domain-load absolute inset-x-0 top-0 z-20 h-0.5 origin-left scale-x-0 rounded-r-full bg-linear-to-r from-purple-600/0 via-purple-500/70 to-purple-400 opacity-0 motion-reduce:animate-none"
            />

            {/* Top */}
            <div className="flex justify-between px-12 pt-8">
              <div>
                <p className="text-4xl font-bold">
                  Olivia Perry
                </p>
                <p className="text-2xl font-semibold">
                  Photographer, Art-Director
                </p>
              </div>

              <p className="text-3xl font-bold">
                NYC · VIENNA
              </p>
            </div>

            {/* Portrait */}
            <div className="absolute top-36 left-12 h-40 w-32 rounded-md bg-black/10 grayscale" />

            {/* Huge Text */}
            <p
              aria-hidden="true"
              className="absolute -bottom-24 left-1/2 -translate-x-1/2 text-[260px] font-black leading-none tracking-tight"
            >
              olivia
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
