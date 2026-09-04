// Only reached when a URL matches neither the (site) nor the cinzel-panel
// root layout — genuinely unrouted paths. Bypasses both, so (like
// global-error.js) it gets none of the app's usual chrome for free: own
// <html>/<body>, own stylesheet import, system font stack.
import "./globals.css";

export const metadata = {
  title: "Page not found",
  description: "The page you were looking for doesn't exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center antialiased dark:bg-neutral-950">
        <span className="flex size-16 items-center justify-center rounded-full bg-amber-500/10">
          <span aria-hidden="true" className="icon-[lucide--map-pinned] size-7 text-amber-600" />
        </span>

        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          This page took a wrong turn.
        </h1>

        <p className="max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
          The link is broken or the page has moved.
        </p>

        <a
          href="/"
          className="mt-2 rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Back to home
        </a>
      </body>
    </html>
  );
}
