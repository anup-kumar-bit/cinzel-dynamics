import React from 'react'

// Same calmer backdrop technique as the Products/Services page heroes
// (products/ProductsHero.jsx, _shared/service-templates/ServiceHeroBackdrop.jsx)
// — two large, static, softly blurred blobs plus small dot-grid accents.
// Palette supplied for the blog: soft pink and light teal-gray for the
// blobs (already pale, so they can sit at higher opacity and still read as
// light), the deep slate as a quieter accent on the dot-grid. The bottom
// fade (same technique as Landing-Page/HeroSection.jsx's backdrop) blends
// it into the plain page background instead of cutting off.
export default function BlogHeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute top-[-10%] left-[8%] size-96 rounded-full bg-[#F7CBCA]/40 blur-3xl dark:bg-[#F7CBCA]/20" />
      <div className="absolute top-[-6%] right-[6%] size-88 rounded-full bg-[#D5E5E5]/45 blur-3xl dark:bg-[#D5E5E5]/22" />
      <div className="dot-grid absolute top-[42%] left-[4%] hidden size-28 text-[#5D6B6B]/25 sm:block dark:text-[#5D6B6B]/18" />
      <div className="dot-grid absolute top-[46%] right-[4%] hidden size-28 text-[#5D6B6B]/25 sm:block dark:text-[#5D6B6B]/18" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent to-base-100" />
    </div>
  )
}
