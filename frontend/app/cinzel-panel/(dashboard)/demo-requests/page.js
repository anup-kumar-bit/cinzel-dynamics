
'use client'

import { useCallback, useEffect, useState } from 'react'
import { deleteDemoRequest, listDemoRequests } from '@/lib/cinzelPanel/db'
import {
  EmptyState,
  ErrorBanner,
  Label,
  PageHeader,
  Panel,
  Spinner,
  useConfirm,
  useToast,
} from '../../_lib/PanelUI'

function formatDate(iso) {
  if (!iso) return '—'

  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function briefText(message) {
  if (!message?.trim()) return 'No project requirement provided'

  const text = message.trim()
  return text.length > 180 ? `${text.slice(0, 180)}…` : text
}

function ContactValue({ children, title }) {
  return (
    <span
      className="block min-w-0 truncate text-sm text-base-content/65"
      title={title || undefined}
    >
      {children || '—'}
    </span>
  )
}

function DeleteButton({ item, deleting, onDelete }) {
  return (
    <button
      type="button"
      onClick={() => onDelete(item)}
      disabled={deleting}
      aria-label={`Delete enquiry from ${item.name || 'Anonymous'}`}
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg
        text-base-content/45 transition-colors
        hover:bg-rose-500/10 hover:text-rose-600
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500
        disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting ? (
        <Spinner className="size-4" />
      ) : (
        <span aria-hidden="true" className="icon-[lucide--trash-2] size-4" />
      )}
    </button>
  )
}

function DeleteError({ message }) {
  if (!message) return null

  return (
    <p className="mt-3 flex items-start gap-2 text-xs text-rose-600 dark:text-rose-400">
      <span
        aria-hidden="true"
        className="icon-[lucide--circle-alert] mt-0.5 size-4 shrink-0"
      />
      <span>Couldn&apos;t delete: {message}</span>
    </p>
  )
}

export default function DemoRequestsPage() {
  const [items, setItems] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [deletingIds, setDeletingIds] = useState({})
  const [deleteErrors, setDeleteErrors] = useState({})

  const { confirm, confirmDialog } = useConfirm()
  const { showToast, toastNode } = useToast()

  const refresh = useCallback(async () => {
    try {
      const data = await listDemoRequests()
      setItems(Array.isArray(data) ? data : [])
      setLoadError('')
    } catch (err) {
      setLoadError(err.message || 'Something went wrong')
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function handleDelete(item) {
    const ok = await confirm({
      title: `Delete enquiry from "${item.name || 'Anonymous'}"?`,
      description:
        'This permanently removes the enquiry and its details. It cannot be undone.',
      confirmLabel: 'Delete enquiry',
      tone: 'danger',
    })

    if (!ok) return

    setDeleteErrors((prev) => {
      const { [item.id]: _drop, ...rest } = prev
      return rest
    })

    setDeletingIds((prev) => ({ ...prev, [item.id]: true }))

    try {
      await deleteDemoRequest(item.id)
      await refresh()
      showToast(`Enquiry from "${item.name || 'Anonymous'}" deleted`)
    } catch (err) {
      setDeleteErrors((prev) => ({
        ...prev,
        [item.id]: err.message || 'Could not delete this enquiry',
      }))
    } finally {
      setDeletingIds((prev) => {
        const { [item.id]: _drop, ...rest } = prev
        return rest
      })
    }
  }

  return (
    <>
      <PageHeader
        icon="icon-[lucide--mail]"
        title="Demo requests"
        description="Enquiries submitted through Book a Demo on our website. Sir !!!"
      />

      {loadError && (
        <ErrorBanner className="mb-5" onRetry={refresh}>
          Couldn&apos;t load enquiries: {loadError}
        </ErrorBanner>
      )}

      <Panel
        icon="icon-[lucide--mail]"
        title="Enquiries"
        meta={items === null ? '—' : `${items.length} total`}
        bodyClassName="p-0"
      >
        {/* Loading state */}
        {items === null && !loadError && (
          <div className="flex items-center justify-center gap-2 px-5 py-12 text-sm text-base-content/50">
            <Spinner className="size-4" />
            Loading enquiries…
          </div>
        )}

        {/* Empty state */}
        {items !== null && items.length === 0 && !loadError && (
          <div className="p-5 sm:p-8">
            <EmptyState
              icon="icon-[lucide--mail]"
              title="No enquiries yet"
              description="When someone submits your Book a Demo form, their enquiry will appear here."
            />
          </div>
        )}

        {items !== null && items.length > 0 && (
          <>
            {/* MOBILE: responsive enquiry cards */}
            <div className="divide-y divide-base-300 md:hidden">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="min-w-0 p-4 sm:p-5"
                >
                  {/* Client and delete action */}
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3
                        className={`truncate text-sm font-semibold ${item.name ? 'text-base-content' : 'text-slate-500'
                          }`}
                        title={item.name || 'Anonymous'}
                      >
                        {item.name || 'Anonymous'}
                      </h3>

                      <p className="mt-1 break-all text-xs text-base-content/55">
                        {item.email || 'No email provided'}
                      </p>
                    </div>

                    <DeleteButton
                      item={item}
                      deleting={!!deletingIds[item.id]}
                      onDelete={handleDelete}
                    />
                  </div>

                  {/* Phone and submission date */}
                  <div className="mt-4 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                    <div className="min-w-0">
                      <Label>Phone</Label>
                      <div className="mt-1">
                        <ContactValue title={item.phone}>
                          {item.phone}
                        </ContactValue>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <Label>Submitted</Label>
                      <p className="mt-1 text-xs leading-5 text-base-content/60">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Divider and project requirement */}
                  <div className="mt-4 min-w-0 border-t border-base-200 pt-4">
                    <Label>Project requirement</Label>
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-base-content/70">
                      {briefText(item.message)}
                    </p>
                  </div>

                  <DeleteError message={deleteErrors[item.id]} />
                </article>
              ))}
            </div>

            {/* DESKTOP: structured table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] table-fixed text-left">
                <colgroup>
                  <col className="w-[16%]" />
                  <col className="w-[19%]" />
                  <col className="w-[14%]" />
                  <col className="w-[29%]" />
                  <col className="w-[16%]" />
                  <col className="w-[6%]" />
                </colgroup>

                <thead className="bg-base-200/50">
                  <tr className="border-b border-base-300">
                    {[
                      'Client',
                      'Email',
                      'Phone',
                      'Requirement',
                      'Submitted',
                      '',
                    ].map((heading, index) => (
                      <th
                        key={heading || `actions-${index}`}
                        className="px-4 py-3 text-xs font-medium text-base-content/55"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-base-300">
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-base-200/30"
                    >
                      <td className="px-4 py-4 align-top">
                        <p
                          className={`truncate text-sm font-normal ${item.name ? 'text-base-content' : 'text-slate-600'}`}
                          title={item.name || 'Anonymous'}
                        >
                          {item.name || 'Anonymous'}
                        </p>
                      </td>

                      <td className="px-4 py-4 align-top">
                        <ContactValue title={item.email}>
                          {item.email}
                        </ContactValue>
                      </td>

                      <td className="px-4 py-4 align-top">
                        <ContactValue title={item.phone}>
                          {item.phone}
                        </ContactValue>
                      </td>

                      <td className="px-4 py-4 align-top">
                        <p
                          className="break-words text-xs leading-5 text-base-content/60"
                          title={item.message || ''}
                        >
                          {briefText(item.message)}
                        </p>
                      </td>

                      <td className="px-4 py-4 align-top">
                        <p className="text-xs leading-5 text-base-content/55">
                          {formatDate(item.createdAt)}
                        </p>
                      </td>

                      <td className="px-3 py-3 align-top">
                        <DeleteButton
                          item={item}
                          deleting={!!deletingIds[item.id]}
                          onDelete={handleDelete}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Desktop delete errors */}
              {items.some((item) => deleteErrors[item.id]) && (
                <div className="space-y-1 border-t border-base-300 px-4 py-3">
                  {items.map((item) => (
                    <DeleteError
                      key={item.id}
                      message={deleteErrors[item.id]}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </Panel>

      {confirmDialog}
      {toastNode}
    </>
  )
}
