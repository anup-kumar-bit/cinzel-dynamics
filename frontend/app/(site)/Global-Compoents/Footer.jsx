import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Rooted at `/` so these links also resolve from the portfolio route, not just the landing page.
const linkColumns = [
  {
    title: 'Services',
    links: [
      { label: 'Backend & APIs', href: '/#services' },
      { label: 'Web Applications', href: '/#services' },
      { label: 'Mobile Apps', href: '/#services' },
      { label: 'SEO & Visibility', href: '/#seo' },
      { label: 'Domains & Hosting', href: '/#domain' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Our Work', href: '/portfolio' },
      { label: 'Live Demo', href: '/#demo' },
      { label: 'How We Work', href: '/trust' },
      { label: 'FAQ', href: '/#faq' },
      { label: 'Careers', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Engineering Blog', href: '/blog' },
      { label: 'Case Studies', href: '/portfolio' },
      { label: 'Support', href: '#' },
      { label: 'Status', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
]

const socials = [
  { label: 'GitHub', href: '#', icon: 'icon-[simple-icons--github]' },
  { label: 'LinkedIn', href: '#', icon: 'icon-[simple-icons--linkedin]' },
  { label: 'X', href: '#', icon: 'icon-[simple-icons--x]' },
  { label: 'Dribbble', href: '#', icon: 'icon-[simple-icons--dribbble]' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Cookies', href: '#' },
]

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-base-200 bg-base-200/40">
      <div className="container mx-auto px-4 py-14 sm:px-8 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.95fr)]">
          <BrandBlock />

          <div className="footer sm:footer-horizontal text-base-content/60">
            {linkColumns.map((column) => (
              <nav key={column.title}>
                <h3 className="footer-title font-opensans text-xs tracking-widest text-base-content">
                  {column.title}
                </h3>
                {column.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="font-opensans link link-hover text-sm hover:text-base-content"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            ))}
          </div>
        </div>
      </div>

      <BottomBar />
    </footer>
  )
}

// ---------- Left column: identity, availability, contact, socials ----------
function BrandBlock() {
  return (
    <div className="max-w-sm">
      <Link href="/" className="inline-block overflow-hidden rounded-xl">
        <Image src="/images/LogoF.png" alt="Cinzel Dynamics" width={1536} height={1024} className="h-auto w-75" />
      </Link>

      <p className="font-opensans mt-4 text-sm text-base-content/55">
        We architect and build the backends, web apps and mobile products startups scale on — then keep them running
        long after launch.
      </p>

      <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500/70 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        <span className="font-opensans text-xs font-medium text-emerald-700 dark:text-emerald-400">
          Taking on new projects
        </span>
      </span>

      <div className="mt-6 flex flex-col gap-2">
        <a
          href="mailto:hello@cinzeldynamics.com"
          className="font-opensans group flex items-center gap-2 text-sm text-base-content/60 hover:text-base-content"
        >
          <span
            aria-hidden="true"
            className="icon-[lucide--mail] size-4 text-base-content/40 group-hover:text-base-content/70"
          />
          hello@cinzeldynamics.com
        </a>
        <p className="font-opensans flex items-center gap-2 text-sm text-base-content/60">
          <span aria-hidden="true" className="icon-[lucide--map-pin] size-4 text-base-content/40" />
          Remote-first · working across EU &amp; US time zones
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            aria-label={social.label}
            className="btn btn-ghost btn-circle btn-sm text-base-content/55 hover:text-base-content"
          >
            <span aria-hidden="true" className={`${social.icon} size-4`} />
          </a>
        ))}
      </div>
    </div>
  )
}

// ---------- Bottom strip: copyright, legal, back to top ----------
function BottomBar() {
  const year = new Date().getFullYear()

  return (
    <div className="border-t border-base-200">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:justify-between sm:px-8 lg:px-16">
        <p className="font-opensans text-xs text-base-content/65">
          © {year} Cinzel Dynamics. All rights reserved.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {legalLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-opensans link link-hover text-xs text-base-content/65 hover:text-base-content"
            >
              {link.label}
            </a>
          ))}

          <a
            href="#top"
            className="font-opensans flex items-center gap-1.5 text-xs font-medium text-base-content/60 hover:text-base-content"
          >
            Back to top
            <span aria-hidden="true" className="icon-[lucide--arrow-up] size-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
