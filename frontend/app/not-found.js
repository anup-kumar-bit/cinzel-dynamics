import Link from "next/link";

// Root-level 404. Renders inside the root layout (NavBar, CtaSection, Footer
// and ContactPopup all still wrap it), so this only owns the one section —
// same hero shape as TrustHero / ServicesHero, so it reads as a page of the
// site rather than a framework default.
export const metadata = {
  title: "Page not found",
  description: "The page you were looking for doesn't exist. Head back to the homepage, or browse our services and portfolio.",
};

const QUICK_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/trust", label: "Trust" },
];

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden px-4 py-24 sm:px-8 sm:py-32 lg:px-16">
      <HeroBackdrop />

      <div className="container relative mx-auto flex flex-col items-center text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-amber-500/10 sm:size-20">
          <span aria-hidden="true" className="icon-[lucide--map-pinned] size-7 text-amber-600 sm:size-8" />
        </span>

        <p className="font-opensans mt-6 text-xs font-semibold tracking-widest text-base-content/45 uppercase">404</p>

        <h1 className="font-cinzel mt-4 max-w-2xl text-4xl leading-tight font-extrabold tracking-tight text-base-content uppercase sm:text-5xl">
          This page took a wrong turn.
        </h1>

        <p className="font-opensans mt-5 max-w-md text-sm text-base-content/60 sm:text-base">
          The link is broken or the page has moved. Everything else on the site still works.
        </p>

        <Link href="/" className="btn btn-neutral mt-10 rounded-full px-6">
          Back to home
        </Link>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5 border-t border-base-200 pt-8">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-opensans rounded-full border border-base-200 bg-base-100 px-4 py-1.5 text-xs text-base-content/60 shadow-sm transition hover:border-base-300 hover:text-base-content sm:text-sm"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-[10%] left-[8%] size-96 rounded-full bg-amber-400/18 blur-3xl dark:bg-amber-500/12" />
      <div className="absolute -top-[6%] right-[6%] size-88 rounded-full bg-violet-400/18 blur-3xl dark:bg-violet-500/12" />
      <div className="dot-grid absolute top-[42%] left-[4%] hidden size-28 text-amber-500/40 sm:block dark:text-amber-400/25" />
      <div className="dot-grid absolute top-[46%] right-[4%] hidden size-28 text-violet-500/40 sm:block dark:text-violet-400/25" />
    </div>
  );
}
