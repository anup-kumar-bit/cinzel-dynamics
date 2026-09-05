'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function CinzelPanelLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      // Same-origin (proxied to FastAPI by next.config.mjs) so the session
      // cookie it sets is first-party — proxy.js then reads it on every
      // /cinzel-panel navigation.
      const res = await fetch('/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        setError('Wrong email or password.')
        return
      }

      router.push(searchParams.get('next') || '/cinzel-panel')
      router.refresh()
    } catch {
      setError('Could not reach the server.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm overflow-hidden rounded-lg border border-base-300 bg-base-100"
      >
        <div className="border-b border-white/10 bg-neutral px-6 py-5 text-neutral-content">
          <p className="font-mono text-[10px] font-semibold tracking-[0.2em] text-neutral-content/50 uppercase">
            Cinzel
          </p>
          <p className="mt-1 text-sm font-bold">Control panel</p>
        </div>

        <div className="p-6">
          <h1 className="text-lg font-bold text-base-content">Sign in</h1>
          <p className="mt-1 text-sm text-base-content/55">This area is not linked from the public site.</p>

          <label className="mt-5 block">
            <span className="font-mono text-[10px] font-semibold tracking-widest text-base-content/45 uppercase">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoFocus
              required
              className="input input-bordered mt-1.5 w-full rounded-md"
            />
          </label>

          <label className="mt-4 block">
            <span className="font-mono text-[10px] font-semibold tracking-widest text-base-content/45 uppercase">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="input input-bordered mt-1.5 w-full rounded-md"
            />
          </label>

          {error ? (
            <p className="mt-3 flex items-center gap-2 text-sm text-rose-600">
              <span aria-hidden="true" className="icon-[lucide--triangle-alert] size-4 shrink-0" />
              {error}
            </p>
          ) : null}

          <button type="submit" disabled={submitting} className="btn btn-neutral mt-5 w-full rounded-md">
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  )
}
