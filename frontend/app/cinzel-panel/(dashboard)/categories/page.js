'use client'

import { useEffect, useState } from 'react'
import { archiveCategory, createCategory, listCategories, restoreCategory, updateCategory } from '@/lib/cinzelPanel/db'
import {
  EmptyState,
  ErrorBanner,
  Field,
  Label,
  PageHeader,
  Panel,
  Spinner,
  inputClass,
  selectClass,
  useConfirm,
  useToast,
} from '../../_lib/PanelUI'

function slugify(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-')
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState(null)
  const [loadError, setLoadError] = useState('')

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [parentId, setParentId] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [savingId, setSavingId] = useState(null)
  const [archivingIds, setArchivingIds] = useState({})
  const [rowErrors, setRowErrors] = useState({})

  const { confirm, confirmDialog } = useConfirm()
  const { showToast, toastNode } = useToast()

  function refresh() {
    return listCategories()
      .then((data) => {
        setLoadError('')
        setCategories(data)
      })
      .catch((err) => setLoadError(err.message || 'Something went wrong'))
  }

  useEffect(() => {
    refresh()
  }, [])

  // Only active top-level categories can take on a new subcategory — a
  // subcategory can't itself have a subcategory, and an archived parent
  // can't grow new ones either.
  const activeParents = (categories ?? []).filter((c) => !c.parentId && c.status === 'active')

  const parents = (categories ?? []).filter((c) => !c.parentId)
  const childrenByParent = {}
  for (const c of categories ?? []) {
    if (!c.parentId) continue
    childrenByParent[c.parentId] = childrenByParent[c.parentId] ?? []
    childrenByParent[c.parentId].push(c)
  }

  function clearRowError(id) {
    setRowErrors((prev) => {
      const { [id]: _drop, ...rest } = prev
      return rest
    })
  }

  async function handleCreate(event) {
    event.preventDefault()
    if (!name.trim()) return

    setCreating(true)
    setCreateError('')
    try {
      const saved = await createCategory({ name: name.trim(), slug: slug.trim(), parentId: parentId || null })
      await refresh()
      setName('')
      setSlug('')
      setParentId('')
      showToast(`“${saved.name}” added`)
    } catch (err) {
      setCreateError(err.message || 'Could not create this category')
    } finally {
      setCreating(false)
    }
  }

  function startEdit(category) {
    setEditingId(category.id)
    setEditName(category.name)
    setEditSlug(category.slug)
    clearRowError(category.id)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function handleRename(category) {
    if (!editName.trim()) return
    setSavingId(category.id)
    clearRowError(category.id)
    try {
      await updateCategory(category.id, { name: editName.trim(), slug: editSlug.trim() })
      await refresh()
      setEditingId(null)
      showToast(`“${editName.trim()}” saved`)
    } catch (err) {
      setRowErrors((prev) => ({ ...prev, [category.id]: err.message || 'Could not save this category' }))
    } finally {
      setSavingId(null)
    }
  }

  async function handleArchive(category) {
    const activeChildren = (childrenByParent[category.id] ?? []).filter((c) => c.status === 'active')
    const ok = await confirm({
      title: `Archive “${category.name}”?`,
      description:
        activeChildren.length > 0
          ? `This also archives its ${activeChildren.length} active subcategor${activeChildren.length === 1 ? 'y' : 'ies'}. Posts already using any of them keep showing it — only new posts lose the option.`
          : "Posts already using it keep showing it — only new posts lose the option. You can restore it later.",
      confirmLabel: 'Archive',
      tone: 'danger',
    })
    if (!ok) return

    clearRowError(category.id)
    setArchivingIds((prev) => ({ ...prev, [category.id]: true }))
    try {
      await archiveCategory(category.id)
      await refresh()
      showToast(`“${category.name}” archived`)
    } catch (err) {
      setRowErrors((prev) => ({ ...prev, [category.id]: err.message || 'Could not archive this category' }))
    } finally {
      setArchivingIds((prev) => {
        const { [category.id]: _drop, ...rest } = prev
        return rest
      })
    }
  }

  async function handleRestore(category) {
    clearRowError(category.id)
    setArchivingIds((prev) => ({ ...prev, [category.id]: true }))
    try {
      await restoreCategory(category.id)
      await refresh()
      showToast(`“${category.name}” restored`)
    } catch (err) {
      setRowErrors((prev) => ({ ...prev, [category.id]: err.message || 'Could not restore this category' }))
    } finally {
      setArchivingIds((prev) => {
        const { [category.id]: _drop, ...rest } = prev
        return rest
      })
    }
  }

  const rows = []
  for (const parent of parents) {
    rows.push({ category: parent, depth: 0, parent: null })
    for (const child of childrenByParent[parent.id] ?? []) {
      rows.push({ category: child, depth: 1, parent })
    }
  }

  return (
    <>
      <PageHeader
        icon="icon-[lucide--tags]"
        title="Blog categories"
        description="Parent and subcategories used to file posts and to filter the public blog list."
      />

      {loadError ? (
        <ErrorBanner className="mb-6" onRetry={refresh}>
          Couldn&apos;t load your categories: {loadError}
        </ErrorBanner>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <Panel icon="icon-[lucide--folder-plus]" title="New category" bodyClassName="flex flex-col gap-5 p-6">
          {createError ? <ErrorBanner>{createError}</ErrorBanner> : null}

          <form onSubmit={handleCreate} className="flex flex-col gap-5">
            <Field label="Name" hint="Shown in the picker and on the site.">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Engineering"
                required
                className={inputClass}
              />
            </Field>

            <Field label="Slug" hint="Optional — auto-generated from the name if left blank.">
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="engineering"
                className={`${inputClass} font-mono`}
              />
            </Field>

            <Field
              label="Parent category"
              hint="Leave as “None” for a top-level category. Once set, a subcategory's parent can't be changed later."
            >
              <select value={parentId} onChange={(e) => setParentId(e.target.value)} className={selectClass}>
                <option value="">None — top-level category</option>
                {activeParents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>

            <button type="submit" disabled={creating} className="btn btn-neutral btn-sm gap-1.5 self-start rounded-lg px-5">
              {creating ? (
                <>
                  <Spinner className="size-3.5" />
                  Creating…
                </>
              ) : (
                <>
                  <span aria-hidden="true" className="icon-[lucide--plus] size-3.5" />
                  Add category
                </>
              )}
            </button>
          </form>
        </Panel>

        <Panel
          icon="icon-[lucide--list-tree]"
          title="All categories"
          meta={categories === null ? '—' : `${categories.length} total`}
          bodyClassName={categories === null || categories.length === 0 ? 'p-6' : ''}
        >
          {categories === null ? (
            loadError ? null : (
              <p className="flex items-center justify-center gap-2 py-6 text-sm text-base-content/45">
                <Spinner className="size-4" />
                Loading…
              </p>
            )
          ) : categories.length === 0 ? (
            <EmptyState icon="icon-[lucide--tags]" title="No categories yet">
              Add one on the left — it&apos;ll show up here and in the blog editor&apos;s picker.
            </EmptyState>
          ) : (
            <ul className="flex list-none flex-col p-0">
              {rows.map(({ category, depth, parent }) => (
                <CategoryRow
                  key={category.id}
                  category={category}
                  depth={depth}
                  parentArchived={parent ? parent.status === 'archived' : false}
                  isEditing={editingId === category.id}
                  editName={editName}
                  editSlug={editSlug}
                  onEditNameChange={setEditName}
                  onEditSlugChange={(v) => setEditSlug(slugify(v))}
                  onStartEdit={() => startEdit(category)}
                  onCancelEdit={cancelEdit}
                  onSaveEdit={() => handleRename(category)}
                  saving={savingId === category.id}
                  archiving={!!archivingIds[category.id]}
                  error={rowErrors[category.id]}
                  onArchive={() => handleArchive(category)}
                  onRestore={() => handleRestore(category)}
                />
              ))}
            </ul>
          )}
        </Panel>
      </div>

      {confirmDialog}
      {toastNode}
    </>
  )
}

function CategoryRow({
  category,
  depth,
  parentArchived,
  isEditing,
  editName,
  editSlug,
  onEditNameChange,
  onEditSlugChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  saving,
  archiving,
  error,
  onArchive,
  onRestore,
}) {
  const archived = category.status === 'archived'

  return (
    <li
      className={`flex flex-wrap items-center gap-3 border-b border-base-200 py-3.5 pr-6 transition last:border-b-0 hover:bg-base-200/40 ${
        depth > 0 ? 'bg-base-200/20 pl-12' : 'pl-6'
      }`}
    >
      {depth > 0 ? (
        <span aria-hidden="true" className="icon-[lucide--corner-down-right] size-3.5 shrink-0 text-base-content/25" />
      ) : (
        <span aria-hidden="true" className="icon-[lucide--folder] size-4 shrink-0 text-base-content/40" />
      )}

      {isEditing ? (
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <input
            type="text"
            value={editName}
            onChange={(e) => onEditNameChange(e.target.value)}
            className={`${inputClass} mt-0 w-48`}
            placeholder="Name"
          />
          <input
            type="text"
            value={editSlug}
            onChange={(e) => onEditSlugChange(e.target.value)}
            className={`${inputClass} mt-0 w-40 font-mono`}
            placeholder="slug"
          />
        </div>
      ) : (
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className={`truncate text-sm font-semibold ${archived ? 'text-base-content/45' : 'text-base-content'}`}>
              {category.name}
            </span>
            {archived ? (
              <span className="font-mono shrink-0 rounded-full bg-base-200 px-2 py-0.5 text-[9px] font-semibold tracking-widest text-base-content/50 uppercase">
                Archived
              </span>
            ) : null}
          </span>
          <span className="font-mono mt-0.5 block truncate text-[11px] text-base-content/40">{category.slug}</span>
        </span>
      )}

      <span className="ml-auto flex shrink-0 items-center gap-2">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={onSaveEdit}
              disabled={saving}
              className="btn btn-neutral btn-sm gap-1.5 rounded-lg px-3"
            >
              {saving ? <Spinner className="size-3.5" /> : 'Save'}
            </button>
            <button
              type="button"
              onClick={onCancelEdit}
              className="btn btn-ghost btn-sm rounded-lg px-3 font-medium text-base-content/55"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onStartEdit}
              className="btn btn-outline btn-sm gap-1.5 rounded-lg border-base-300 px-3 font-medium text-base-content/70 hover:border-base-content/40 hover:bg-base-200"
            >
              <span aria-hidden="true" className="icon-[lucide--pencil] size-3.5" />
              Rename
            </button>

            {archived ? (
              <button
                type="button"
                onClick={onRestore}
                disabled={archiving || parentArchived}
                title={parentArchived ? 'Restore its parent category first' : undefined}
                className="btn btn-outline btn-sm gap-1.5 rounded-lg border-base-300 px-3 font-medium text-base-content/70 hover:border-base-content/40 hover:bg-base-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {archiving ? <Spinner className="size-3.5" /> : <span aria-hidden="true" className="icon-[lucide--rotate-ccw] size-3.5" />}
                Restore
              </button>
            ) : (
              <button
                type="button"
                onClick={onArchive}
                disabled={archiving}
                aria-label={`Archive ${category.name}`}
                className="cursor-pointer p-1.5 text-base-content/35 transition hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {archiving ? <Spinner className="size-4" /> : <span aria-hidden="true" className="icon-[lucide--archive] size-4" />}
              </button>
            )}
          </>
        )}
      </span>

      {error ? (
        <p className="flex w-full items-center gap-1.5 text-[11px] font-medium text-rose-600 dark:text-rose-400">
          <span aria-hidden="true" className="icon-[lucide--circle-alert] size-3.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </li>
  )
}
