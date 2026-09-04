'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { deleteRoute, listRoutes, publishRoute, unpublishRoute } from '@/lib/cinzelPanel/db'
import { getTemplate } from '@/app/_shared/service-templates/registry'
import {
  EmptyState,
  ErrorBanner,
  Label,
  PageHeader,
  Panel,
  Spinner,
  StatusChip,
  useConfirm,
  useToast,
} from '../../_lib/PanelUI'

export default function RoutesListPage() {
  const [routes, setRoutes] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [deletingIds, setDeletingIds] = useState({})
  const [deleteErrors, setDeleteErrors] = useState({})
  const { confirm, confirmDialog } = useConfirm()
  const { showToast, toastNode } = useToast()

  // Without a .catch() here, a failed load left `routes` at `null` forever —
  // stuck on "Loading…" with no sign anything was actually wrong.
  function refresh() {
    return listRoutes()
      .then((data) => {
        setLoadError('')
        setRoutes(data)
      })
      .catch((err) => setLoadError(err.message || 'Something went wrong'))
  }

  useEffect(() => {
    refresh()
  }, [])

  async function togglePublish(route) {
    const publishing = route.status !== 'published'

    const ok = await confirm({
      title: publishing ? `Publish “${route.navName}”?` : `Unpublish “${route.navName}”?`,
      description: publishing
        ? `The page goes live at /services/${route.slug} and shows up in the services list.`
        : 'The page comes off the site immediately and its URL will return a 404.',
      confirmLabel: publishing ? 'Publish page' : 'Unpublish',
      tone: publishing ? 'publish' : 'danger',
    })
    if (!ok) return

    try {
      if (publishing) {
        await publishRoute(route.id)
      } else {
        await unpublishRoute(route.id)
      }
      await refresh()
      showToast(publishing ? `“${route.navName}” is live` : `“${route.navName}” unpublished`)
    } catch (err) {
      showToast(err.message || 'Could not update this page', 'error')
    }
  }

  async function handleDelete(route) {
    const ok = await confirm({
      title: `Delete “${route.navName}”?`,
      description: `This permanently removes the page and its content from /services/${route.slug}. It cannot be undone.`,
      confirmLabel: 'Delete page',
      tone: 'danger',
    })
    if (!ok) return

    setDeleteErrors((prev) => {
      const { [route.id]: _drop, ...rest } = prev
      return rest
    })
    setDeletingIds((prev) => ({ ...prev, [route.id]: true }))
    try {
      await deleteRoute(route.id)
      await refresh()
      showToast(`“${route.navName}” deleted`)
    } catch (err) {
      setDeleteErrors((prev) => ({ ...prev, [route.id]: err.message || 'Could not delete this page' }))
    } finally {
      setDeletingIds((prev) => {
        const { [route.id]: _drop, ...rest } = prev
        return rest
      })
    }
  }

  const published = routes?.filter((route) => route.status === 'published').length ?? 0

  return (
    <>
      <PageHeader
        icon="icon-[lucide--layout-template]"
        title="Service routes"
        description="Dynamic pages built from a template. They go live under /services once published."
        actions={
          <Link href="/cinzel-panel/routes/new" className="btn btn-neutral btn-sm gap-1.5 rounded-lg px-4">
            <span aria-hidden="true" className="icon-[lucide--plus] size-3.5" />
            New route
          </Link>
        }
      />

      {loadError ? (
        <ErrorBanner className="mb-6" onRetry={refresh}>
          Couldn&apos;t load your pages: {loadError}
        </ErrorBanner>
      ) : null}

      <Panel
        icon="icon-[lucide--files]"
        title="Pages"
        meta={routes === null ? '—' : `${routes.length} total · ${published} live`}
        bodyClassName={routes === null || routes.length === 0 ? 'p-6' : ''}
      >
        {routes === null ? (
          loadError ? null : (
            <p className="flex items-center justify-center gap-2 py-6 text-sm text-base-content/45">
              <Spinner className="size-4" />
              Loading…
            </p>
          )
        ) : routes.length === 0 ? (
          <EmptyState
            icon="icon-[lucide--layout-template]"
            title="No routes yet"
            action={
              <Link href="/cinzel-panel/routes/new" className="btn btn-neutral btn-sm gap-1.5 rounded-lg px-4">
                <span aria-hidden="true" className="icon-[lucide--plus] size-3.5" />
                Create the first one
              </Link>
            }
          >
            Create one, pick a template, then publish it to see it on the site.
          </EmptyState>
        ) : (
          <>
            <div className="hidden items-center gap-4 border-b border-base-300 bg-base-200/40 px-6 py-2.5 sm:flex">
              <Label className="flex-1">Page</Label>
              <Label className="w-32">Template</Label>
              <Label className="w-24">Status</Label>
              <span className="w-48" />
            </div>

            <ul className="flex list-none flex-col p-0">
              {routes.map((route) => (
                <li
                  key={route.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-base-200 px-6 py-4 transition last:border-b-0 hover:bg-base-200/40"
                >
                  <span className="min-w-0 flex-1">
                    <Link
                      href={`/cinzel-panel/routes/${route.id}`}
                      className="block truncate text-sm font-semibold text-base-content hover:underline"
                    >
                      {route.navName || 'Untitled'}
                    </Link>
                    <span className="font-mono mt-1 block truncate text-[11px] text-base-content/45">
                      /services/{route.slug}
                    </span>
                  </span>

                  <span className="w-32 text-xs text-base-content/55">{getTemplate(route.template).label}</span>

                  <span className="w-24">
                    <StatusChip status={route.status} />
                  </span>

                  <span className="flex w-48 items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => togglePublish(route)}
                      className="btn btn-outline btn-sm rounded-lg border-base-300 px-3 font-medium text-base-content/70 hover:border-base-content/40 hover:bg-base-200"
                    >
                      {route.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>

                    <Link
                      href={`/cinzel-panel/routes/${route.id}`}
                      className="btn btn-outline btn-sm gap-1.5 rounded-lg border-base-300 px-3 font-medium text-base-content/70 hover:border-base-content/40 hover:bg-base-200"
                    >
                      <span aria-hidden="true" className="icon-[lucide--pencil] size-3.5" />
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(route)}
                      disabled={!!deletingIds[route.id]}
                      aria-label={`Delete ${route.navName}`}
                      className="cursor-pointer p-1.5 text-base-content/35 transition hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingIds[route.id] ? (
                        <Spinner className="size-4" />
                      ) : (
                        <span aria-hidden="true" className="icon-[lucide--trash-2] size-4" />
                      )}
                    </button>
                  </span>

                  {deleteErrors[route.id] ? (
                    <p className="flex w-full items-center gap-1.5 text-[11px] font-medium text-rose-600 dark:text-rose-400">
                      <span aria-hidden="true" className="icon-[lucide--circle-alert] size-3.5 shrink-0" />
                      Couldn&apos;t delete: {deleteErrors[route.id]}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </>
        )}
      </Panel>

      {confirmDialog}
      {toastNode}
    </>
  )
}
