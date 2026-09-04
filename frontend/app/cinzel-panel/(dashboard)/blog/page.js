'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { deleteBlogPost, listBlogPosts, publishBlogPost, unpublishBlogPost } from '@/lib/cinzelPanel/db'
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

function categoryLabel(category) {
  if (!category) return '—'
  const label = category.parent ? `${category.parent.name} / ${category.name}` : category.name
  return category.status === 'archived' ? `${label} (archived)` : label
}

export default function BlogListPage() {
  const [posts, setPosts] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [deletingIds, setDeletingIds] = useState({})
  const [deleteErrors, setDeleteErrors] = useState({})
  const { confirm, confirmDialog } = useConfirm()
  const { showToast, toastNode } = useToast()

  function refresh() {
    return listBlogPosts()
      .then((data) => {
        setLoadError('')
        setPosts(data)
      })
      .catch((err) => setLoadError(err.message || 'Something went wrong'))
  }

  useEffect(() => {
    refresh()
  }, [])

  async function togglePublish(post) {
    const publishing = post.status !== 'published'

    const ok = await confirm({
      title: publishing ? `Publish “${post.title}”?` : `Unpublish “${post.title}”?`,
      description: publishing
        ? `The post goes live at /blog/${post.slug} and shows up in the blog list.`
        : 'The post comes off the site immediately and its URL will return a 404.',
      confirmLabel: publishing ? 'Publish post' : 'Unpublish',
      tone: publishing ? 'publish' : 'danger',
    })
    if (!ok) return

    try {
      if (publishing) {
        await publishBlogPost(post.id)
      } else {
        await unpublishBlogPost(post.id)
      }
      await refresh()
      showToast(publishing ? `“${post.title}” is live` : `“${post.title}” unpublished`)
    } catch (err) {
      showToast(err.message || 'Could not update this post', 'error')
    }
  }

  async function handleDelete(post) {
    const ok = await confirm({
      title: `Delete “${post.title}”?`,
      description: `This permanently removes the post and its content from /blog/${post.slug}. It cannot be undone.`,
      confirmLabel: 'Delete post',
      tone: 'danger',
    })
    if (!ok) return

    setDeleteErrors((prev) => {
      const { [post.id]: _drop, ...rest } = prev
      return rest
    })
    setDeletingIds((prev) => ({ ...prev, [post.id]: true }))
    try {
      await deleteBlogPost(post.id)
      await refresh()
      showToast(`“${post.title}” deleted`)
    } catch (err) {
      setDeleteErrors((prev) => ({ ...prev, [post.id]: err.message || 'Could not delete this post' }))
    } finally {
      setDeletingIds((prev) => {
        const { [post.id]: _drop, ...rest } = prev
        return rest
      })
    }
  }

  const published = posts?.filter((post) => post.status === 'published').length ?? 0

  return (
    <>
      <PageHeader
        icon="icon-[lucide--newspaper]"
        title="Blog posts"
        description="Long-form articles. They go live under /blog once published."
        actions={
          <Link href="/cinzel-panel/blog/new" className="btn btn-neutral btn-sm gap-1.5 rounded-lg px-4">
            <span aria-hidden="true" className="icon-[lucide--plus] size-3.5" />
            New post
          </Link>
        }
      />

      {loadError ? (
        <ErrorBanner className="mb-6" onRetry={refresh}>
          Couldn&apos;t load your posts: {loadError}
        </ErrorBanner>
      ) : null}

      <Panel
        icon="icon-[lucide--files]"
        title="Posts"
        meta={posts === null ? '—' : `${posts.length} total · ${published} live`}
        bodyClassName={posts === null || posts.length === 0 ? 'p-6' : ''}
      >
        {posts === null ? (
          loadError ? null : (
            <p className="flex items-center justify-center gap-2 py-6 text-sm text-base-content/45">
              <Spinner className="size-4" />
              Loading…
            </p>
          )
        ) : posts.length === 0 ? (
          <EmptyState
            icon="icon-[lucide--newspaper]"
            title="No posts yet"
            action={
              <Link href="/cinzel-panel/blog/new" className="btn btn-neutral btn-sm gap-1.5 rounded-lg px-4">
                <span aria-hidden="true" className="icon-[lucide--plus] size-3.5" />
                Write the first one
              </Link>
            }
          >
            Create one, write it, then publish it to see it on the site.
          </EmptyState>
        ) : (
          <>
            <div className="hidden items-center gap-4 border-b border-base-300 bg-base-200/40 px-6 py-2.5 sm:flex">
              <Label className="flex-1">Post</Label>
              <Label className="w-32">Category</Label>
              <Label className="w-24">Status</Label>
              <span className="w-48" />
            </div>

            <ul className="flex list-none flex-col p-0">
              {posts.map((post) => (
                <li
                  key={post.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-base-200 px-6 py-4 transition last:border-b-0 hover:bg-base-200/40"
                >
                  <span className="min-w-0 flex-1">
                    <Link
                      href={`/cinzel-panel/blog/${post.id}`}
                      className="block truncate text-sm font-semibold text-base-content hover:underline"
                    >
                      {post.title || 'Untitled'}
                    </Link>
                    <span className="font-mono mt-1 block truncate text-[11px] text-base-content/45">
                      /blog/{post.slug}
                    </span>
                  </span>

                  <span className="w-32 truncate text-xs text-base-content/55">{categoryLabel(post.category)}</span>

                  <span className="w-24">
                    <StatusChip status={post.status} />
                  </span>

                  <span className="flex w-48 items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => togglePublish(post)}
                      className="btn btn-outline btn-sm rounded-lg border-base-300 px-3 font-medium text-base-content/70 hover:border-base-content/40 hover:bg-base-200"
                    >
                      {post.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>

                    <Link
                      href={`/cinzel-panel/blog/${post.id}`}
                      className="btn btn-outline btn-sm gap-1.5 rounded-lg border-base-300 px-3 font-medium text-base-content/70 hover:border-base-content/40 hover:bg-base-200"
                    >
                      <span aria-hidden="true" className="icon-[lucide--pencil] size-3.5" />
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(post)}
                      disabled={!!deletingIds[post.id]}
                      aria-label={`Delete ${post.title}`}
                      className="cursor-pointer p-1.5 text-base-content/35 transition hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingIds[post.id] ? (
                        <Spinner className="size-4" />
                      ) : (
                        <span aria-hidden="true" className="icon-[lucide--trash-2] size-4" />
                      )}
                    </button>
                  </span>

                  {deleteErrors[post.id] ? (
                    <p className="flex w-full items-center gap-1.5 text-[11px] font-medium text-rose-600 dark:text-rose-400">
                      <span aria-hidden="true" className="icon-[lucide--circle-alert] size-3.5 shrink-0" />
                      Couldn&apos;t delete: {deleteErrors[post.id]}
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
