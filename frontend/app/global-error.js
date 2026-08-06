"use client"; // Error boundaries must be Client Components

// Catches errors thrown by the root layout itself — the one place error.js
// can't reach. This replaces the entire document, so it gets none of the
// app's usual chrome for free: own <html>/<body>, own stylesheet import,
// system font stack instead of the Google fonts loaded in layout.js. Kept
// deliberately plain — if the root layout is broken, this page needs to
// render regardless.
import "./globals.css";

export default function GlobalError({ error, unstable_retry, reset }) {
  const retry = unstable_retry ?? reset;

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center antialiased dark:bg-neutral-950">
        <title>Something went wrong</title>

        <span className="flex size-16 items-center justify-center rounded-full bg-rose-500/10">
          <span aria-hidden="true" className="icon-[lucide--triangle-alert] size-7 text-rose-600" />
        </span>

        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          The site hit a snag.
        </h1>

        <p className="max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
          Something broke while loading the page itself, not just this section. Reloading almost always fixes it.
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => retry()}
            className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full border border-neutral-200 px-6 py-2.5 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-600"
          >
            Back to home
          </a>
        </div>

        {error?.digest ? (
          <p className="mt-2 font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
            Reference: {error.digest}
          </p>
        ) : null}
      </body>
    </html>
  );
}
