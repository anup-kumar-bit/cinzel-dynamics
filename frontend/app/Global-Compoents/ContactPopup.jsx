'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

const ENDPOINT = '/api/contact'
const FALLBACK_EMAIL = 'hello@cinzeldynamics.com'

// Any link on the site can open this — `<a href="#contact">` works from server
// components, and client code can fire `openContactPopup()`.
export const CONTACT_HASH = '#contact'
export const CONTACT_EVENT = 'contact:open'

export function openContactPopup() {
  window.dispatchEvent(new CustomEvent(CONTACT_EVENT))
}

const looksLikeEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
const looksLikePhone = (value) => value.replace(/[^\d]/g, '').length >= 7

export default function ContactPopup() {
  const dialogRef = useRef(null)
  const quickRef = useRef(null)

  const [expanded, setExpanded] = useState(false)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const open = useCallback(() => {
    const dialog = dialogRef.current
    if (!dialog || dialog.open) return

    dialog.showModal()
    // The compact field is the whole point of the default state, so it takes
    // focus rather than the close button the browser would pick.
    requestAnimationFrame(() => quickRef.current?.focus())
  }, [])

  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === CONTACT_HASH) open()
    }

    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    window.addEventListener(CONTACT_EVENT, open)

    return () => {
      window.removeEventListener('hashchange', openFromHash)
      window.removeEventListener(CONTACT_EVENT, open)
    }
  }, [open])

  // Drop the hash on close, otherwise clicking the same CTA again does nothing.
  const handleClose = () => {
    if (window.location.hash === CONTACT_HASH) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }

    setStatus((current) => (current === 'sent' ? 'idle' : current))
    setError('')
  }

  const send = async (payload) => {
    setStatus('sending')
    setError('')

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, page: window.location.pathname }),
      })

      if (!response.ok) throw new Error(String(response.status))

      setStatus('sent')
    } catch {
      setStatus('idle')
      setError(`That did not send. Email us at ${FALLBACK_EMAIL} and we will pick it up from there.`)
    }
  }

  const handleQuickSubmit = (event) => {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    if (data.get('company')) return // honeypot

    const contact = String(data.get('contact') ?? '').trim()
    const isEmail = looksLikeEmail(contact)

    if (!isEmail && !looksLikePhone(contact)) {
      setError('Give us a phone number or an email address we can actually reach.')
      return
    }

    send({
      mode: 'quick',
      email: isEmail ? contact : '',
      phone: isEmail ? '' : contact,
    })
  }

  const handleFullSubmit = (event) => {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    if (data.get('company')) return // honeypot

    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const phone = String(data.get('phone') ?? '').trim()
    const requirement = String(data.get('requirement') ?? '').trim()

    if (!name) {
      setError('We need a name to put on the reply.')
      return
    }

    if (!looksLikeEmail(email) && !looksLikePhone(phone)) {
      setError('Leave either an email address or a phone number so we can answer.')
      return
    }

    if (requirement.length < 10) {
      setError('A line or two about what you need is enough — just not blank.')
      return
    }

    send({ mode: 'full', name, email, phone, requirement })
  }

  const sending = status === 'sending'

  return (
    <dialog ref={dialogRef} onClose={handleClose} className="modal" aria-labelledby="contact-popup-title">
      <div className="modal-box max-w-lg overflow-hidden rounded-2xl border border-base-200 bg-base-100 p-0 shadow-2xl">
        <Header />

        <div className="p-6">
          {status === 'sent' ? <SentState /> : (
            <>
              <QuickForm inputRef={quickRef} onSubmit={handleQuickSubmit} sending={sending} />

              <div className="my-5 flex items-center gap-3">
                <span aria-hidden="true" className="h-px flex-1 bg-base-200" />
                <span className="font-opensans text-[10px] tracking-widest text-base-content/40 uppercase">or</span>
                <span aria-hidden="true" className="h-px flex-1 bg-base-200" />
              </div>

              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                aria-expanded={expanded}
                aria-controls="contact-full-form"
                className="font-opensans group flex w-full cursor-pointer items-center justify-between rounded-xl border border-base-200 px-4 py-3 text-left transition hover:border-emerald-300 hover:bg-emerald-50/70 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30"
              >
                <span>
                  <span className="block text-sm font-semibold text-base-content">Tell us what you need</span>
                  <span className="block text-xs text-base-content/50">
                    Takes a minute, and the first reply is a real answer instead of a call to ask.
                  </span>
                </span>

                <span
                  aria-hidden="true"
                  className={`icon-[lucide--chevron-down] size-4 shrink-0 transition-all duration-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 ${
                    expanded ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : 'text-base-content/50'
                  }`}
                />
              </button>

              {expanded && <FullForm onSubmit={handleFullSubmit} sending={sending} />}

              {error && (
                <p role="alert" className="font-opensans mt-4 text-xs text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}

              <p className="font-opensans mt-4 text-center text-[11px] text-base-content/40">
                No newsletter, no CRM drip. We answer within one working day.
              </p>
            </>
          )}
        </div>

        <form method="dialog">
          <button
            aria-label="Close"
            className="absolute top-3 right-3 flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
          >
            <span aria-hidden="true" className="icon-[lucide--x] size-4" />
          </button>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>Close</button>
      </form>
    </dialog>
  )
}

function Header() {
  return (
    <div className="relative overflow-hidden bg-linear-to-br from-emerald-600 via-emerald-800 to-green-950 px-6 py-5">
      <div aria-hidden="true" className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.07]" />

      <p className="font-opensans relative text-[10px] font-semibold tracking-widest text-white/50 uppercase">
        Book an appointment
      </p>

      <h2 id="contact-popup-title" className="font-cinzel relative mt-1.5 text-2xl font-extrabold text-white">
        Let us reach out to you.
      </h2>

      <p className="font-opensans relative mt-1.5 max-w-sm text-xs text-white/60">
        Leave a number or an email and we will come back with a time. Nothing else needed.
      </p>
    </div>
  )
}

// ---------- Default state: one field, one button ----------
function QuickForm({ inputRef, onSubmit, sending }) {
  return (
    <form onSubmit={onSubmit} noValidate>
      <Honeypot />

      <label htmlFor="contact-quick" className="font-opensans text-xs font-semibold text-base-content">
        Phone or email
      </label>

      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          ref={inputRef}
          id="contact-quick"
          name="contact"
          type="text"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com or +91 98765 43210"
          className="font-opensans input w-full rounded-full text-sm focus:border-emerald-500 focus:outline-emerald-500"
        />

        <button
          type="submit"
          disabled={sending}
          className="btn shrink-0 rounded-full border-none bg-emerald-600 px-6 text-white shadow-sm transition hover:bg-emerald-700 disabled:bg-emerald-600/50 disabled:text-white/70"
        >
          {sending ? 'Sending…' : 'Send'}
          {!sending && <span aria-hidden="true" className="icon-[lucide--arrow-right] size-4" />}
        </button>
      </div>
    </form>
  )
}

// ---------- Expanded state: the whole brief ----------
function FullForm({ onSubmit, sending }) {
  return (
    <form id="contact-full-form" onSubmit={onSubmit} noValidate className="mt-4 flex flex-col gap-3">
      <Honeypot />

      <div className="grid gap-3 sm:grid-cols-2">
        <Field id="contact-name" name="name" label="Name" placeholder="Anup Kumar" autoComplete="name" />
        <Field
          id="contact-phone"
          name="phone"
          label="Phone"
          type="tel"
          placeholder="+91 98765 43210"
          autoComplete="tel"
        />
      </div>

      <Field
        id="contact-email"
        name="email"
        label="Email"
        type="email"
        placeholder="you@company.com"
        autoComplete="email"
      />

      <div>
        <label htmlFor="contact-requirement" className="font-opensans text-xs font-semibold text-base-content">
          What do you need built?
        </label>
        <textarea
          id="contact-requirement"
          name="requirement"
          rows={4}
          placeholder="A booking app for three salons, and the website that takes the deposits."
          className="font-opensans textarea mt-1.5 w-full rounded-xl text-sm focus:border-emerald-500 focus:outline-emerald-500"
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="btn mt-1 rounded-full border-none bg-emerald-600 text-white shadow-sm transition hover:bg-emerald-700 disabled:bg-emerald-600/50 disabled:text-white/70"
      >
        {sending ? 'Sending…' : 'Send the brief'}
        {!sending && <span aria-hidden="true" className="icon-[lucide--send] size-4" />}
      </button>
    </form>
  )
}

function Field({ id, name, label, type = 'text', placeholder, autoComplete }) {
  return (
    <div>
      <label htmlFor={id} className="font-opensans text-xs font-semibold text-base-content">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="font-opensans input mt-1.5 w-full rounded-xl text-sm focus:border-emerald-500 focus:outline-emerald-500"
      />
    </div>
  )
}

// Bots fill every field they can see; people never see this one.
function Honeypot() {
  return (
    <input
      type="text"
      name="company"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="pointer-events-none absolute left-[-9999px] size-0 opacity-0"
    />
  )
}

function SentState() {
  return (
    <div role="status" className="flex flex-col items-center py-6 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10">
        <span aria-hidden="true" className="icon-[lucide--check] size-6 text-emerald-500" />
      </span>

      <p className="font-cinzel mt-4 text-xl font-extrabold text-base-content">That is with us.</p>
      <p className="font-opensans mt-2 max-w-xs text-sm text-base-content/60">
        We will come back within one working day with a time that suits you.
      </p>

      <form method="dialog" className="mt-5">
        <button className="btn btn-ghost rounded-full px-6">Close</button>
      </form>
    </div>
  )
}
