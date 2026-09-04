"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";

// Catches uncaught render errors anywhere under the root layout (but not the
// layout itself — see global-error.js for that). Next 16.2's `unstable_retry`
// re-fetches and re-renders the failed segment in place; falls back to
// `reset` if it's ever unavailable.
export default function ErrorPage({ error, unstable_retry, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const retry = unstable_retry ?? reset;

  return (
    <section className="relative isolate overflow-hidden px-4 py-24 sm:px-8 sm:py-32 lg:px-16">
      <HeroBackdrop />

      <div className="container relative mx-auto flex flex-col items-center text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-rose-500/10 sm:size-20">
          <span aria-hidden="true" className="icon-[lucide--triangle-alert] size-7 text-rose-600 sm:size-8" />
        </span>

        <p className="font-opensans mt-6 text-xs font-semibold tracking-widest text-base-content/45 uppercase">
          Something went wrong
        </p>

        <h1 className="font-cinzel mt-4 max-w-2xl text-4xl leading-tight font-extrabold tracking-tight text-base-content uppercase sm:text-5xl">
          That one is on us.
        </h1>

        <p className="font-opensans mt-5 max-w-md text-sm text-base-content/60 sm:text-base">
          The page hit an error while loading. Trying again usually clears it.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => retry()} className="btn btn-neutral rounded-full px-6">
            Try again
          </button>
          <Link href="/" className="btn btn-ghost rounded-full px-6">
            Back to home
          </Link>
        </div>

        {error?.digest ? (
          <p className="font-mono mt-8 text-[11px] text-base-content/35">Reference: {error.digest}</p>
        ) : null}
      </div>
    </section>
  );
}

function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-[10%] left-[8%] size-96 rounded-full bg-rose-400/18 blur-3xl dark:bg-rose-500/12" />
      <div className="absolute -top-[6%] right-[6%] size-88 rounded-full bg-neutral-400/15 blur-3xl dark:bg-neutral-500/10" />
      <div className="dot-grid absolute top-[42%] left-[4%] hidden size-28 text-rose-500/40 sm:block dark:text-rose-400/25" />
      <div className="dot-grid absolute top-[46%] right-[4%] hidden size-28 text-neutral-500/30 sm:block dark:text-neutral-400/20" />
    </div>
  );
}
