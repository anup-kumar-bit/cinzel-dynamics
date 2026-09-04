'use client'

// Shared chrome for the panel screens. Surfaces are flat and bordered; the
// hierarchy comes from tone, radius and type weight rather than decoration.

import { useCallback, useEffect, useState } from 'react'

export const inputClass =
  'input input-bordered mt-1.5 h-10 w-full rounded-lg text-sm focus:outline-none focus:border-base-content/40'
export const textareaClass =
  'textarea textarea-bordered mt-1.5 w-full rounded-lg text-sm leading-relaxed focus:outline-none focus:border-base-content/40'
export const selectClass =
  'select select-bordered mt-1.5 h-10 w-full rounded-lg text-sm focus:outline-none focus:border-base-content/40'

export function Label({ children, className = '' }) {
  return (
    <span
      className={`font-mono text-[10px] font-semibold tracking-widest text-base-content/45 uppercase ${className}`}
    >
      {children}
    </span>
  )
}

export function PageHeader({ icon, title, description, actions }) {
  return (
    <header className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-3.5">
        {icon ? (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-base-300 bg-base-100 shadow-sm">
            <span aria-hidden="true" className={`${icon} size-5 text-base-content/70`} />
          </span>
        ) : null}

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-base-content">{title}</h1>
          {description ? <p className="mt-1 text-sm text-base-content/55">{description}</p> : null}
        </div>
      </div>

      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  )
}

export function Panel({ icon, title, meta, actions, footer, bodyClassName = 'p-6', className = '', children }) {
  return (
    <section className={`overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm ${className}`}>
      {title ? (
        <header className="flex items-center justify-between gap-3 border-b border-base-300 px-6 py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            {icon ? <span aria-hidden="true" className={`${icon} size-4 shrink-0 text-base-content/45`} /> : null}
            <h2 className="truncate text-sm font-semibold text-base-content">{title}</h2>
            {meta ? (
              <span className="font-mono shrink-0 rounded-full bg-base-200 px-2 py-0.5 text-[10px] tracking-wide text-base-content/50">
                {meta}
              </span>
            ) : null}
          </div>

          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}

      <div className={bodyClassName}>{children}</div>

      {footer ? (
        <footer className="flex items-center gap-3 border-t border-base-300 bg-base-200/40 px-6 py-4">{footer}</footer>
      ) : null}
    </section>
  )
}

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <Label>{label}</Label>
      {children}
      {hint ? <span className="mt-1.5 block text-[11px] text-base-content/45">{hint}</span> : null}
    </label>
  )
}

export function Spinner({ className = 'size-4' }) {
  return <span aria-hidden="true" className={`icon-[lucide--loader-circle] animate-spin ${className}`} />
}

// Boxed banner for page/section-level errors — a failed load, a failed save.
// Row-level errors (e.g. one failed delete in a list) should stay as plain
// inline text instead; this is too heavy for that.
export function ErrorBanner({ children, onRetry, retryLabel = 'Retry', className = '' }) {
  return (
    <p
      className={`flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/8 px-4 py-3 text-sm text-rose-700 dark:text-rose-400 ${className}`}
    >
      <span aria-hidden="true" className="icon-[lucide--triangle-alert] size-4 shrink-0" />
      {children}
      {onRetry ? (
        <button type="button" onClick={onRetry} className="ml-auto shrink-0 underline underline-offset-2">
          {retryLabel}
        </button>
      ) : null}
    </p>
  )
}

export function StatusChip({ status }) {
  const published = status === 'published'

  return (
    <span
      className={`font-mono inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase ${
        published
          ? 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400'
          : 'bg-base-200 text-base-content/55'
      }`}
    >
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${published ? 'bg-emerald-500' : 'bg-base-content/35'}`}
      />
      {status}
    </span>
  )
}

// Styled replacement for the browser's native file picker.
export function FileButton({ label = 'Upload', multiple = false, onChange }) {
  return (
    <label className="btn btn-outline btn-sm cursor-pointer gap-1.5 rounded-lg border-base-300 px-3 font-medium text-base-content/70 hover:border-base-content/40 hover:bg-base-200">
      <span aria-hidden="true" className="icon-[lucide--upload] size-3.5" />
      {label}
      <input type="file" accept="image/*" multiple={multiple} onChange={onChange} className="hidden" />
    </label>
  )
}

export function EmptyState({ icon = 'icon-[lucide--inbox]', title, children, action }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-base-300 px-6 py-12 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-base-200">
        <span aria-hidden="true" className={`${icon} size-5 text-base-content/35`} />
      </span>
      <div>
        <p className="text-sm font-semibold text-base-content/80">{title}</p>
        {children ? <p className="mt-1 text-sm text-base-content/45">{children}</p> : null}
      </div>
      {action}
    </div>
  )
}

// ---------- Confirmation dialog ----------

const TONES = {
  danger: {
    icon: 'icon-[lucide--trash-2]',
    badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    button: 'bg-rose-600 text-white hover:bg-rose-700 border-rose-600 hover:border-rose-700',
  },
  publish: {
    icon: 'icon-[lucide--globe]',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    button: 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700',
  },
  neutral: {
    icon: 'icon-[lucide--circle-alert]',
    badge: 'bg-base-200 text-base-content/60',
    button: 'bg-base-content text-base-100 hover:opacity-90 border-base-content',
  },
}

function ConfirmDialog({ options, onResolve }) {
  const { title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', tone = 'neutral' } = options
  const toneStyle = TONES[tone] ?? TONES.neutral

  useEffect(() => {
    function handleKey(event) {
      if (event.key === 'Escape') onResolve(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onResolve])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cancel"
        onClick={() => onResolve(false)}
        className="absolute inset-0 cursor-default bg-neutral/50"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-md rounded-xl border border-base-300 bg-base-100 p-6 shadow-2xl"
      >
        <div className="flex gap-4">
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${toneStyle.badge}`}>
            <span aria-hidden="true" className={`${toneStyle.icon} size-5`} />
          </span>

          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-base-content">{title}</h2>
            {description ? <p className="mt-1.5 text-sm leading-relaxed text-base-content/60">{description}</p> : null}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onResolve(false)}
            className="btn btn-ghost btn-sm rounded-lg px-4 font-medium text-base-content/60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            autoFocus
            onClick={() => onResolve(true)}
            className={`btn btn-sm rounded-lg border px-4 font-semibold ${toneStyle.button}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// `const { confirm, confirmDialog } = useConfirm()` — await confirm({...}) for a
// boolean, then render {confirmDialog} once anywhere in the tree.
export function useConfirm() {
  const [request, setRequest] = useState(null)

  const confirm = useCallback((options) => new Promise((resolve) => setRequest({ options, resolve })), [])

  const handleResolve = useCallback(
    (result) => {
      setRequest((current) => {
        current?.resolve(result)
        return null
      })
    },
    [],
  )

  const confirmDialog = request ? <ConfirmDialog options={request.options} onResolve={handleResolve} /> : null

  return { confirm, confirmDialog }
}

// ---------- Toast ----------

export function useToast() {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, tone = 'success') => {
    setToast({ message, tone, key: Date.now() })
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(timer)
  }, [toast])

  const toastNode = toast ? (
    <div
      role="status"
      className="fixed right-6 bottom-6 z-50 flex items-center gap-2.5 rounded-xl border border-base-300 bg-base-100 px-4 py-3 shadow-2xl"
    >
      <span
        aria-hidden="true"
        className={
          toast.tone === 'error'
            ? 'icon-[lucide--circle-alert] size-4 text-rose-600'
            : 'icon-[lucide--circle-check] size-4 text-emerald-600'
        }
      />
      <span className="text-sm font-medium text-base-content">{toast.message}</span>
    </div>
  ) : null

  return { showToast, toastNode }
}
