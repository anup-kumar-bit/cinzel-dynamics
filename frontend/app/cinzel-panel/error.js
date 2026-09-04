"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function CinzelPanelError({ error, unstable_retry, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const retry = unstable_retry ?? reset;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="font-mono text-xs tracking-widest text-base-content/45 uppercase">Error</p>
      <h1 className="text-xl font-bold text-base-content">Something broke in the panel.</h1>
      <button type="button" onClick={() => retry()} className="btn btn-neutral btn-sm rounded-full px-5">
        Try again
      </button>
    </div>
  );
}
