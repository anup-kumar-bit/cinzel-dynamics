'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getBlogPost, listCategories, publishBlogPost, saveBlogPost, unpublishBlogPost } from '@/lib/cinzelPanel/db'
import { readFileAsDataUrl } from '../../../_lib/fileToDataUrl'
import {
  ErrorBanner,
  Field,
  FileButton,
  Label,
  Panel,
  Spinner,
  StatusChip,
  inputClass,
  selectClass,
  textareaClass,
  useConfirm,
  useToast,
} from '../../../_lib/PanelUI'

const BLOCK_TYPES = [
  { id: 'paragraph', label: 'Paragraph', icon: 'icon-[lucide--pilcrow]' },
  { id: 'heading', label: 'Heading', icon: 'icon-[lucide--heading]' },
  { id: 'quote', label: 'Quote', icon: 'icon-[lucide--quote]' },
  { id: 'image', label: 'Image', icon: 'icon-[lucide--image]' },
]

function updateField(setPost, field, value) {
  setPost((p) => ({ ...p, [field]: value }))
}

function updateBlock(setPost, index, patch) {
  setPost((p) => ({ ...p, content: p.content.map((b, i) => (i === index ? { ...b, ...patch } : b)) }))
}

function addBlock(setPost, type) {
  setPost((p) => ({
    ...p,
    content: [...p.content, { type, text: '', image: null, caption: '' }],
  }))
}

function removeBlock(setPost, index) {
  setPost((p) => ({ ...p, content: p.content.filter((_, i) => i !== index) }))
}

function moveBlock(setPost, index, delta) {
  setPost((p) => {
    const target = index + delta
    if (target < 0 || target >= p.content.length) return p
    const next = [...p.content]
    ;[next[index], next[target]] = [next[target], next[index]]
    return { ...p, content: next }
  })
}

export default function BlogEditorPage({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const [post, setPost] = useState(undefined)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedAt, setSavedAt] = useState(null)
  const [categories, setCategories] = useState(null)
  const [categoriesError, setCategoriesError] = useState('')
  const { confirm, confirmDialog } = useConfirm()
  const { showToast, toastNode } = useToast()

  useEffect(() => {
    getBlogPost(id).then((found) => {
      if (!found) {
        router.replace('/cinzel-panel/blog')
        return
      }
      // The API returns the assigned category as a nested object; the form
      // edits a plain categoryId instead, same as every other field.
      setPost({ ...found, categoryId: found.category?.id ?? null })
    })
  }, [id, router])

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch((err) => setCategoriesError(err.message || 'Could not load categories'))
  }, [])

  if (post === undefined)
    return (
      <p className="flex items-center gap-2 text-sm text-base-content/50">
        <Spinner className="size-4" />
        Loading…
      </p>
    )

  async function persist(next) {
    setSaving(true)
    setError('')
    try {
      const saved = await saveBlogPost(next)
      setPost({ ...saved, categoryId: saved.category?.id ?? null })
      setSavedAt(Date.now())
      return saved
    } catch (err) {
      setError(err.message || 'Something went wrong')
      return null
    } finally {
      setSaving(false)
    }
  }

  async function handleSave(event) {
    event.preventDefault()
    const saved = await persist(post)
    if (saved) showToast('Changes saved')
  }

  async function handlePublishToggle() {
    const publishing = post.status !== 'published'

    const ok = await confirm({
      title: publishing ? `Publish “${post.title}”?` : `Unpublish “${post.title}”?`,
      description: publishing
        ? `This saves your changes and puts the post live at /blog/${post.slug}.`
        : 'The post comes off the site immediately and its URL will return a 404.',
      confirmLabel: publishing ? 'Publish post' : 'Unpublish',
      tone: publishing ? 'publish' : 'danger',
    })
    if (!ok) return

    const saved = await persist(post)
    if (!saved) return

    setSaving(true)
    try {
      const updated = await (publishing ? publishBlogPost(saved.id) : unpublishBlogPost(saved.id))
      setPost(updated)
      showToast(publishing ? 'Post is live' : 'Post unpublished')
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  async function handleCoverImage(event) {
    const file = event.target.files?.[0]
    if (!file) return
    updateField(setPost, 'coverImage', { url: await readFileAsDataUrl(file), publicId: null })
  }

  async function handleBlockImage(index, file) {
    if (!file) return
    updateBlock(setPost, index, { image: { url: await readFileAsDataUrl(file), publicId: null } })
  }

  return (
    <form onSubmit={handleSave}>
      <div className="sticky top-0 z-20 -mx-6 mb-6 border-b border-base-300 bg-base-200/95 px-6 py-3.5 backdrop-blur lg:-mx-10 lg:px-10">
        <div className="mx-auto flex max-w-[110rem] flex-wrap items-center gap-x-4 gap-y-2">
          <Link
            href="/cinzel-panel/blog"
            aria-label="Back to blog"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-base-300 bg-base-100 text-base-content/55 transition hover:text-base-content"
          >
            <span aria-hidden="true" className="icon-[lucide--arrow-left] size-4" />
          </Link>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-base-content">{post.title || 'Untitled post'}</p>
            <p className="font-mono truncate text-[11px] text-base-content/45">/blog/{post.slug}</p>
          </div>

          <StatusChip status={post.status} />

          {savedAt && !saving ? (
            <span className="hidden items-center gap-1.5 text-[11px] text-base-content/45 sm:flex">
              <span aria-hidden="true" className="icon-[lucide--check] size-3.5 text-emerald-600" />
              Saved
            </span>
          ) : null}

          <button
            type="button"
            onClick={handlePublishToggle}
            disabled={saving}
            className="btn btn-outline btn-sm rounded-lg border-base-300 px-4 font-medium text-base-content/70 hover:border-base-content/40 hover:bg-base-200"
          >
            {post.status === 'published' ? 'Unpublish' : 'Publish'}
          </button>

          <button type="submit" disabled={saving} className="btn btn-neutral btn-sm gap-1.5 rounded-lg px-5">
            {saving ? (
              <>
                <Spinner className="size-3.5" />
                Saving…
              </>
            ) : (
              <>
                <span aria-hidden="true" className="icon-[lucide--check] size-3.5" />
                Save
              </>
            )}
          </button>
        </div>
      </div>

      {error ? <ErrorBanner className="mb-6">{error}</ErrorBanner> : null}

      <div className="grid gap-6 xl:grid-cols-[23rem_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          <Panel icon="icon-[lucide--settings-2]" title="Post details" bodyClassName="flex flex-col gap-5 p-6">
            <Field label="Title">
              <input
                type="text"
                value={post.title}
                onChange={(e) => updateField(setPost, 'title', e.target.value)}
                required
                className={inputClass}
              />
            </Field>

            <Field label="Slug" hint={`Lives at /blog/${post.slug || '…'}`}>
              <input
                type="text"
                value={post.slug}
                onChange={(e) =>
                  updateField(setPost, 'slug', e.target.value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-'))
                }
                required
                className={`${inputClass} font-mono`}
              />
            </Field>

            <Field label="Excerpt" hint="Shown on the blog listing and used for previews.">
              <textarea
                value={post.excerpt}
                onChange={(e) => updateField(setPost, 'excerpt', e.target.value)}
                rows={3}
                className={textareaClass}
              />
            </Field>

            <Field label="Author">
              <input
                type="text"
                value={post.author}
                onChange={(e) => updateField(setPost, 'author', e.target.value)}
                className={inputClass}
              />
            </Field>

            <CategoryPicker
              categories={categories}
              categoriesError={categoriesError}
              categoryId={post.categoryId}
              onChange={(categoryId) => updateField(setPost, 'categoryId', categoryId)}
            />

            <Field label="Tags" hint="Comma-separated.">
              <input
                type="text"
                value={post.tags.join(', ')}
                onChange={(e) =>
                  updateField(
                    setPost,
                    'tags',
                    e.target.value
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean),
                  )
                }
                className={inputClass}
              />
            </Field>
          </Panel>

          <Panel icon="icon-[lucide--image]" title="Cover image" bodyClassName="p-6">
            <div className="flex items-center gap-3 rounded-lg border border-base-300 bg-base-200/30 p-3">
              {post.coverImage ? (
                <img
                  src={post.coverImage.url}
                  alt=""
                  className="h-16 w-24 shrink-0 rounded-md border border-base-300 object-cover"
                />
              ) : (
                <span className="flex h-16 w-24 shrink-0 items-center justify-center rounded-md border border-dashed border-base-300 bg-base-100">
                  <span aria-hidden="true" className="icon-[lucide--image] size-4 text-base-content/25" />
                </span>
              )}

              <div className="flex flex-1 items-center justify-end gap-2">
                <FileButton label={post.coverImage ? 'Replace' : 'Upload'} onChange={handleCoverImage} />
                {post.coverImage ? (
                  <button
                    type="button"
                    onClick={() => updateField(setPost, 'coverImage', null)}
                    aria-label="Remove cover image"
                    className="cursor-pointer p-1 text-base-content/35 transition hover:text-rose-600"
                  >
                    <span aria-hidden="true" className="icon-[lucide--x] size-4" />
                  </button>
                ) : null}
              </div>
            </div>
          </Panel>
        </div>

        <div className="min-w-0">
          <Panel icon="icon-[lucide--text]" title="Content" meta={`${post.content.length} blocks`} bodyClassName="flex flex-col gap-4 p-6">
            <div className="flex flex-wrap gap-2 border-b border-base-300 pb-4">
              {BLOCK_TYPES.map((bt) => (
                <button
                  key={bt.id}
                  type="button"
                  onClick={() => addBlock(setPost, bt.id)}
                  className="btn btn-outline btn-sm gap-1.5 rounded-lg border-base-300 px-3 font-medium text-base-content/70 hover:border-base-content/40 hover:bg-base-200"
                >
                  <span aria-hidden="true" className={`${bt.icon} size-3.5`} />
                  Add {bt.label}
                </button>
              ))}
            </div>

            {post.content.length === 0 ? (
              <p className="rounded-lg border border-dashed border-base-300 px-4 py-8 text-center text-xs text-base-content/45">
                Nothing here yet. Add a block above to start writing.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {post.content.map((block, i) => (
                  <BlockEditor
                    key={i}
                    block={block}
                    index={i}
                    total={post.content.length}
                    onChange={(patch) => updateBlock(setPost, i, patch)}
                    onRemove={() => removeBlock(setPost, i)}
                    onMove={(delta) => moveBlock(setPost, i, delta)}
                    onImage={(file) => handleBlockImage(i, file)}
                  />
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>

      {confirmDialog}
      {toastNode}
    </form>
  )
}

// Two-step picker: a top-level "Category" select narrows down which
// subcategories show in the second select. The stored value (categoryId) is
// whichever is more specific — the subcategory if one's chosen, otherwise
// the parent itself. `parentChoice` is local UI state only, re-derived from
// categoryId whenever either changes, so it never drifts out of sync.
function CategoryPicker({ categories, categoriesError, categoryId, onChange }) {
  const [parentChoice, setParentChoice] = useState('')

  useEffect(() => {
    if (!categories) return
    const current = categories.find((c) => c.id === categoryId)
    setParentChoice(current ? current.parentId || current.id : '')
  }, [categories, categoryId])

  if (categoriesError) {
    return (
      <p className="flex items-center gap-1.5 text-[11px] font-medium text-rose-600 dark:text-rose-400">
        <span aria-hidden="true" className="icon-[lucide--circle-alert] size-3.5 shrink-0" />
        Couldn&apos;t load categories: {categoriesError}
      </p>
    )
  }

  if (!categories) {
    return (
      <p className="flex items-center gap-1.5 text-[11px] text-base-content/45">
        <Spinner className="size-3.5" />
        Loading categories…
      </p>
    )
  }

  const current = categories.find((c) => c.id === categoryId) ?? null

  // Archived categories drop out of the picker — except whichever one this
  // post is already carrying, so a post assigned before an archive still
  // shows (and keeps) what it has instead of silently losing it.
  const parentOptions = categories.filter((c) => !c.parentId && c.status === 'active')
  const currentTopLevel = current ? categories.find((c) => c.id === (current.parentId || current.id)) : null
  if (currentTopLevel && currentTopLevel.status === 'archived' && !parentOptions.some((p) => p.id === currentTopLevel.id)) {
    parentOptions.push(currentTopLevel)
  }
  parentOptions.sort((a, b) => a.name.localeCompare(b.name))

  const subcategoryOptions = categories.filter((c) => c.parentId === parentChoice && c.status === 'active')
  if (
    current &&
    current.parentId === parentChoice &&
    current.status === 'archived' &&
    !subcategoryOptions.some((c) => c.id === current.id)
  ) {
    subcategoryOptions.push(current)
  }
  subcategoryOptions.sort((a, b) => a.name.localeCompare(b.name))

  function handleParentChange(value) {
    setParentChoice(value)
    // Picking a parent directly assigns the post to it; the subcategory
    // resets until narrowed further.
    onChange(value || null)
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <Label className="block">Category</Label>
          <select value={parentChoice} onChange={(e) => handleParentChange(e.target.value)} className={selectClass}>
            <option value="">None</option>
            {parentOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
                {p.status === 'archived' ? ' (archived)' : ''}
              </option>
            ))}
          </select>
        </div>

        {parentChoice ? (
          <div className="flex-1">
            <Label className="block">Subcategory</Label>
            <select
              value={current && current.parentId === parentChoice ? current.id : ''}
              onChange={(e) => onChange(e.target.value || parentChoice)}
              className={selectClass}
            >
              <option value="">None 
                {/* — use “{categories.find((c) => c.id === parentChoice)?.name}” directly */}
              </option>
              {subcategoryOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.status === 'archived' ? ' (archived)' : ''}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {current?.status === 'archived' ? (
        <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
          <span aria-hidden="true" className="icon-[lucide--triangle-alert] size-3.5 shrink-0" />“
          {current.name}” is archived — it stays on this post, but can&apos;t be picked for another one.
        </p>
      ) : null}
    </div>
  )
}

function BlockEditor({ block, index, total, onChange, onRemove, onMove, onImage }) {
  const meta = BLOCK_TYPES.find((bt) => bt.id === block.type) ?? BLOCK_TYPES[0]

  return (
    <div className="rounded-lg border border-base-300 bg-base-200/30 p-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-base-content/50">
          <span aria-hidden="true" className={`${meta.icon} size-3.5`} />
          {meta.label}
          <span className="font-mono text-base-content/30">· {String(index + 1).padStart(2, '0')}</span>
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            aria-label="Move up"
            className="cursor-pointer p-1 text-base-content/35 transition hover:text-base-content disabled:opacity-30"
          >
            <span aria-hidden="true" className="icon-[lucide--chevron-up] size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            aria-label="Move down"
            className="cursor-pointer p-1 text-base-content/35 transition hover:text-base-content disabled:opacity-30"
          >
            <span aria-hidden="true" className="icon-[lucide--chevron-down] size-3.5" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove block ${index + 1}`}
            className="cursor-pointer p-1 text-base-content/35 transition hover:text-rose-600"
          >
            <span aria-hidden="true" className="icon-[lucide--trash-2] size-3.5" />
          </button>
        </div>
      </div>

      {block.type === 'heading' ? (
        <input
          type="text"
          value={block.text}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Heading text"
          className={`${inputClass} mt-0 font-semibold`}
        />
      ) : block.type === 'image' ? (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-3">
            {block.image ? (
              <img src={block.image.url} alt="" className="h-16 w-24 shrink-0 rounded-md border border-base-300 object-cover" />
            ) : (
              <span className="flex h-16 w-24 shrink-0 items-center justify-center rounded-md border border-dashed border-base-300 bg-base-100">
                <span aria-hidden="true" className="icon-[lucide--image] size-4 text-base-content/25" />
              </span>
            )}
            <FileButton label={block.image ? 'Replace' : 'Upload'} onChange={(e) => onImage(e.target.files?.[0])} />
          </div>
          <input
            type="text"
            value={block.caption}
            onChange={(e) => onChange({ caption: e.target.value })}
            placeholder="Caption (optional)"
            className={`${inputClass} mt-0`}
          />
        </div>
      ) : (
        <textarea
          value={block.text}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder={block.type === 'quote' ? 'Quote text' : 'Paragraph text'}
          rows={block.type === 'quote' ? 2 : 4}
          className={`${textareaClass} mt-0`}
        />
      )}
    </div>
  )
}
