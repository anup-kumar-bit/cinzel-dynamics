import Link from "next/link";

export default function CinzelPanelNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="font-mono text-xs tracking-widest text-base-content/45 uppercase">404</p>
      <h1 className="text-xl font-bold text-base-content">Not found in the panel.</h1>
      <Link href="/cinzel-panel" className="btn btn-neutral btn-sm rounded-full px-5">
        Back to dashboard
      </Link>
    </div>
  );
}
