'use client'

// Runs once from the server HTML; inert (text/plain) when React renders it on the client.
export default function InlineScript({ html }) {
  return (
    <script
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
