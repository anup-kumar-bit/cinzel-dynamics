import React from 'react'

// Same calmer backdrop technique as the Products page hero
// (products/ProductsHero.jsx's HeroBackdrop) — two large, static, softly
// blurred blobs plus small dot-grid accents, rather than the busier
// animated aurora wash used on the landing page. Recolored coral/teal for
// the service pages. Tailwind has no "coral" in its default palette, so
// that side uses the actual CSS coral hex as an arbitrary value.
export default function ServiceHeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute top-[-10%] left-[8%] size-96 rounded-full bg-[#FF7F50]/18 blur-3xl dark:bg-[#FF7F50]/12" />
      <div className="absolute top-[-6%] right-[6%] size-88 rounded-full bg-teal-400/18 blur-3xl dark:bg-teal-500/12" />
      <div className="dot-grid absolute top-[42%] left-[4%] hidden size-28 text-[#FF7F50]/40 sm:block dark:text-[#FF7F50]/25" />
      <div className="dot-grid absolute top-[46%] right-[4%] hidden size-28 text-teal-500/40 sm:block dark:text-teal-400/25" />
    </div>
  )
}
