'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { saveRoute } from '@/lib/cinzelPanel/db'
import { SERVICE_TEMPLATES } from '@/app/_shared/service-templates/registry'
import { ErrorBanner, Spinner } from '../../../_lib/PanelUI'

export default function NewRoutePage() {
  const router = useRouter()
  const started = useRef(false)
  const [error, setError] = useState('')

  const createDraft = useCallback(() => {
    setError('')

    const template = SERVICE_TEMPLATES[0]
    const slug = `new-page-${Date.now().toString(36)}`

    saveRoute({
      slug,
      navName: 'New page',
      title: 'New page',
      template: template.id,
      content: template.defaultContent,
      status: 'draft',
    })
      .then((route) => {
        router.replace(`/cinzel-panel/routes/${route.id}`)
      })
      .catch((err) => {
        setError(err.message || 'Could not create the draft')
      })
  }, [router])

  useEffect(() => {
    if (started.current) return
    started.current = true
    createDraft()
  }, [createDraft])

  if (error) {
    return (
      <div className="flex flex-col gap-3">
        <ErrorBanner>Couldn&apos;t create the draft: {error}</ErrorBanner>
        <div className="flex items-center gap-2">
          <button type="button" onClick={createDraft} className="btn btn-neutral btn-sm gap-1.5 rounded-lg px-4">
            Try again
          </button>
          <Link
            href="/cinzel-panel/routes"
            className="btn btn-ghost btn-sm rounded-lg px-3 font-medium text-base-content/55"
          >
            Back to routes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <p className="flex items-center gap-2 text-sm text-base-content/50">
      <Spinner className="size-4" />
      Creating draft…
    </p>
  )
}
