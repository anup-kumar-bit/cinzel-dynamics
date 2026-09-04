'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { saveBlogPost } from '@/lib/cinzelPanel/db'
import { ErrorBanner, Spinner } from '../../../_lib/PanelUI'

export default function NewBlogPostPage() {
  const router = useRouter()
  const started = useRef(false)
  const [error, setError] = useState('')

  const createDraft = useCallback(() => {
    setError('')

    const slug = `new-post-${Date.now().toString(36)}`

    saveBlogPost({
      slug,
      title: 'New post',
      excerpt: '',
      author: '',
      categoryId: null,
      tags: [],
      coverImage: null,
      content: [],
      status: 'draft',
    })
      .then((post) => {
        router.replace(`/cinzel-panel/blog/${post.id}`)
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
            href="/cinzel-panel/blog"
            className="btn btn-ghost btn-sm rounded-lg px-3 font-medium text-base-content/55"
          >
            Back to posts
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
