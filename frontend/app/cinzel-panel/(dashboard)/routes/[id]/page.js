'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getRoute, publishRoute, saveRoute, unpublishRoute } from '@/lib/cinzelPanel/db'
import { SERVICE_TEMPLATES, getTemplate } from '@/app/_shared/service-templates/registry'
import { readFileAsDataUrl } from '../../../_lib/fileToDataUrl'
import ScaledPreview from '../../../_lib/ScaledPreview'
import {
  ErrorBanner,
  Field,
  FileButton,
  Label,
  Panel,
  Spinner,
  StatusChip,
  inputClass,
  textareaClass,
  useConfirm,
  useToast,
} from '../../../_lib/PanelUI'

function updateField(setRoute, field, value) {
  setRoute((r) => ({ ...r, [field]: value }))
}

function updateContentField(setRoute, field, value) {
  setRoute((r) => ({ ...r, content: { ...r.content, [field]: value } }))
}

function updateArrayItem(setRoute, field, index, patch) {
  setRoute((r) => ({
    ...r,
    content: { ...r.content, [field]: r.content[field].map((item, i) => (i === index ? { ...item, ...patch } : item)) },
  }))
}

function addArrayItem(setRoute, field, blank) {
  setRoute((r) => ({ ...r, content: { ...r.content, [field]: [...(r.content[field] ?? []), blank] } }))
}

function removeArrayItem(setRoute, field, index) {
  setRoute((r) => ({
    ...r,
    content: { ...r.content, [field]: r.content[field].filter((_, i) => i !== index) },
  }))
}

// Every template exposes exactly one repeatable field — this is what lets a
// plain item index, clicked in the preview, be resolved back to a field name.
const ARRAY_FIELD_BY_TEMPLATE = {
  'feature-split': 'features',
  story: 'sections',
  'card-grid': 'cards',
}

export default function RouteEditorPage({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const [route, setRoute] = useState(undefined)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedAt, setSavedAt] = useState(null)
  // Which piece of content is highlighted — a number for a repeatable item
  // (feature/section/card), a field name (e.g. "heading") for a singular one.
  // Set by clicking either its spot in the form or in the live preview, so
  // the two stay in sync.
  const [activeTarget, setActiveTarget] = useState(null)
  const { confirm, confirmDialog } = useConfirm()
  const { showToast, toastNode } = useToast()

  useEffect(() => {
    getRoute(id).then((found) => {
      if (!found) {
        router.replace('/cinzel-panel/routes')
        return
      }
      setRoute(found)
    })
  }, [id, router])

  useEffect(() => {
    if (activeTarget == null) return
    const domId = typeof activeTarget === 'number' ? `content-item-${activeTarget}` : `content-field-${activeTarget}`
    document.getElementById(domId)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [activeTarget])

  if (route === undefined)
    return (
      <p className="flex items-center gap-2 text-sm text-base-content/50">
        <Spinner className="size-4" />
        Loading…
      </p>
    )

  const template = getTemplate(route.template)

  async function handleTemplateChange(templateId) {
    if (templateId === route.template) return

    const hasContent = Object.values(route.content ?? {}).some((v) => (Array.isArray(v) ? v.length : v))
    if (hasContent) {
      const ok = await confirm({
        title: `Switch to “${getTemplate(templateId).label}”?`,
        description: 'Templates hold different fields, so the content you have written below will be cleared.',
        confirmLabel: 'Switch template',
        tone: 'neutral',
      })
      if (!ok) return
    }

    const next = getTemplate(templateId)
    setRoute((r) => ({ ...r, template: templateId, content: next.defaultContent }))
    setActiveTarget(null)
  }

  const arrayField = ARRAY_FIELD_BY_TEMPLATE[route.template]

  async function persist(next) {
    setSaving(true)
    setError('')
    try {
      const saved = await saveRoute(next)
      setRoute(saved)
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
    const saved = await persist(route)
    if (saved) showToast('Changes saved')
  }

  // Publishing saves everything on screen first — no separate "don't forget
  // to save" step — then flips status via the dedicated endpoint, which also
  // stamps published_at.
  async function handlePublishToggle() {
    const publishing = route.status !== 'published'

    const ok = await confirm({
      title: publishing ? `Publish “${route.navName}”?` : `Unpublish “${route.navName}”?`,
      description: publishing
        ? `This saves your changes and puts the page live at /services/${route.slug}.`
        : 'The page comes off the site immediately and its URL will return a 404.',
      confirmLabel: publishing ? 'Publish page' : 'Unpublish',
      tone: publishing ? 'publish' : 'danger',
    })
    if (!ok) return

    const saved = await persist(route)
    if (!saved) return

    setSaving(true)
    try {
      const updated = await (publishing ? publishRoute(saved.id) : unpublishRoute(saved.id))
      setRoute(updated)
      showToast(publishing ? 'Page is live' : 'Page unpublished')
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave}>
      <div className="sticky top-0 z-20 -mx-6 mb-6 border-b border-base-300 bg-base-200/95 px-6 py-3.5 backdrop-blur lg:-mx-10 lg:px-10">
        <div className="mx-auto flex max-w-[110rem] flex-wrap items-center gap-x-4 gap-y-2">
          <Link
            href="/cinzel-panel/routes"
            aria-label="Back to routes"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-base-300 bg-base-100 text-base-content/55 transition hover:text-base-content"
          >
            <span aria-hidden="true" className="icon-[lucide--arrow-left] size-4" />
          </Link>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-base-content">{route.navName || 'Untitled route'}</p>
            <p className="font-mono truncate text-[11px] text-base-content/45">/services/{route.slug}</p>
          </div>

          <StatusChip status={route.status} />

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
            {route.status === 'published' ? 'Unpublish' : 'Publish'}
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
          <Panel icon="icon-[lucide--layers]" title="Template" bodyClassName="flex flex-col gap-2 p-4">
            {SERVICE_TEMPLATES.map((t) => {
              const selected = route.template === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTemplateChange(t.id)}
                  className={`cursor-pointer rounded-lg border p-3.5 text-left transition ${
                    selected
                      ? 'border-base-content bg-base-200/60'
                      : 'border-base-300 hover:border-base-content/35 hover:bg-base-200/30'
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-base-content">{t.label}</span>
                    <span
                      className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
                        selected ? 'border-base-content bg-base-content' : 'border-base-300'
                      }`}
                    >
                      {selected ? (
                        <span aria-hidden="true" className="icon-[lucide--check] size-2.5 text-base-100" />
                      ) : null}
                    </span>
                  </span>
                  <span className="mt-1 block text-[11px] leading-relaxed text-base-content/50">{t.description}</span>
                </button>
              )
            })}
          </Panel>

          <Panel icon="icon-[lucide--settings-2]" title="Page details" bodyClassName="flex flex-col gap-5 p-6">
            <Field label="Nav name" hint="Shown in the services list.">
              <input
                type="text"
                value={route.navName}
                onChange={(e) => updateField(setRoute, 'navName', e.target.value)}
                required
                className={inputClass}
              />
            </Field>

            <Field label="Page title" hint="Used as the browser tab title.">
              <input
                type="text"
                value={route.title}
                onChange={(e) => updateField(setRoute, 'title', e.target.value)}
                required
                className={inputClass}
              />
            </Field>

            <Field label="Slug" hint={`Lives at /services/${route.slug || '…'}`}>
              <input
                type="text"
                value={route.slug}
                onChange={(e) =>
                  updateField(setRoute, 'slug', e.target.value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-'))
                }
                required
                className={`${inputClass} font-mono`}
              />
            </Field>
          </Panel>

          <Panel
            icon="icon-[lucide--text]"
            title="Content"
            meta={template.label}
            bodyClassName="flex flex-col gap-5 p-6"
          >
            <TemplateContentForm
              route={route}
              setRoute={setRoute}
              activeTarget={activeTarget}
              setActiveTarget={setActiveTarget}
            />
          </Panel>

          <Panel icon="icon-[lucide--mouse-pointer-click]" title="Call to action" bodyClassName="p-6">
            <CtaFields
              content={route.content ?? {}}
              setRoute={setRoute}
              activeTarget={activeTarget}
              setActiveTarget={setActiveTarget}
            />
          </Panel>
        </div>

        <div className="min-w-0 xl:sticky xl:top-28 xl:self-start">
          <Panel
            icon="icon-[lucide--eye]"
            title="Live preview"
            actions={
              route.status === 'published' ? (
                <a
                  href={`/services/${route.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-base-content/60 hover:text-base-content"
                >
                  Open live
                  <span aria-hidden="true" className="icon-[lucide--external-link] size-3" />
                </a>
              ) : null
            }
            bodyClassName=""
          >
            <div className="flex items-center gap-2 border-b border-base-300 bg-base-200/40 px-4 py-2.5">
              <span className="flex gap-1.5">
                <span aria-hidden="true" className="size-2.5 rounded-full bg-base-300" />
                <span aria-hidden="true" className="size-2.5 rounded-full bg-base-300" />
                <span aria-hidden="true" className="size-2.5 rounded-full bg-base-300" />
              </span>
              <span className="font-mono ml-2 truncate rounded-md bg-base-100 px-3 py-1 text-[11px] text-base-content/50">
                cinzeldynamics.com/services/{route.slug}
              </span>
            </div>

            <div className="max-h-[calc(100vh-12rem)] overflow-auto bg-base-100 p-2">
              <ScaledPreview>
                <template.Component
                  content={route.content}
                  activeIndex={typeof activeTarget === 'number' ? activeTarget : null}
                  onSelectItem={setActiveTarget}
                  onDeleteItem={(i) => {
                    removeArrayItem(setRoute, arrayField, i)
                    setActiveTarget(null)
                  }}
                  activeField={typeof activeTarget === 'string' ? activeTarget : null}
                  onSelectField={setActiveTarget}
                />
              </ScaledPreview>
            </div>
          </Panel>
        </div>
      </div>

      {confirmDialog}
      {toastNode}
    </form>
  )
}

function TemplateContentForm({ route, setRoute, activeTarget, setActiveTarget }) {
  const content = route.content ?? {}
  const activeIndex = typeof activeTarget === 'number' ? activeTarget : null

  return (
    <>
      <TargetWrapper target="eyebrow" activeTarget={activeTarget} onSelectTarget={setActiveTarget}>
        <Field label="Eyebrow">
          <input
            type="text"
            value={content.eyebrow ?? ''}
            onChange={(e) => updateContentField(setRoute, 'eyebrow', e.target.value)}
            className={inputClass}
          />
        </Field>
      </TargetWrapper>

      <TargetWrapper target="heading" activeTarget={activeTarget} onSelectTarget={setActiveTarget}>
        <Field label="Heading">
          <input
            type="text"
            value={content.heading ?? ''}
            onChange={(e) => updateContentField(setRoute, 'heading', e.target.value)}
            className={inputClass}
          />
        </Field>
      </TargetWrapper>

      <TargetWrapper target="subheading" activeTarget={activeTarget} onSelectTarget={setActiveTarget}>
        <Field label="Subheading">
          <textarea
            value={content.subheading ?? ''}
            onChange={(e) => updateContentField(setRoute, 'subheading', e.target.value)}
            rows={2}
            className={textareaClass}
          />
        </Field>
      </TargetWrapper>

      {route.template === 'feature-split' ? (
        <FeatureSplitFields
          content={content}
          setRoute={setRoute}
          activeIndex={activeIndex}
          onActivate={setActiveTarget}
          activeTarget={activeTarget}
          setActiveTarget={setActiveTarget}
        />
      ) : route.template === 'story' ? (
        <StoryFields content={content} setRoute={setRoute} activeIndex={activeIndex} onActivate={setActiveTarget} />
      ) : (
        <CardGridFields content={content} setRoute={setRoute} activeIndex={activeIndex} onActivate={setActiveTarget} />
      )}
    </>
  )
}

// Wraps one piece of preview-clickable content so it can be scrolled to and
// highlighted, whichever side (form or preview) it was selected from.
function TargetWrapper({ target, activeTarget, onSelectTarget, children }) {
  return (
    <div
      id={`content-field-${target}`}
      onFocusCapture={() => onSelectTarget(target)}
      className={`rounded-lg p-2 -m-2 transition ${
        activeTarget === target ? 'bg-base-200/60 ring-2 ring-base-content/15' : ''
      }`}
    >
      {children}
    </div>
  )
}

function FeatureSplitFields({ content, setRoute, activeIndex, onActivate, activeTarget, setActiveTarget }) {
  async function handleHeroImage(event) {
    const file = event.target.files?.[0]
    if (!file) return
    // publicId is null until saveRoute() actually uploads it — the `data:`
    // prefix on url is what tells the API client this image is still pending.
    updateContentField(setRoute, 'heroImage', { url: await readFileAsDataUrl(file), publicId: null })
  }

  return (
    <>
      <TargetWrapper target="heroImage" activeTarget={activeTarget} onSelectTarget={setActiveTarget}>
        <Label>Hero image</Label>
        <div className="mt-1.5 flex items-center gap-3 rounded-lg border border-base-300 bg-base-200/30 p-3">
          {content.heroImage ? (
            <img
              src={content.heroImage.url}
              alt=""
              className="h-14 w-20 shrink-0 rounded-md border border-base-300 object-cover"
            />
          ) : (
            <span className="flex h-14 w-20 shrink-0 items-center justify-center rounded-md border border-dashed border-base-300 bg-base-100">
              <span aria-hidden="true" className="icon-[lucide--image] size-4 text-base-content/25" />
            </span>
          )}

          <div className="flex flex-1 items-center justify-end gap-2">
            <FileButton label={content.heroImage ? 'Replace' : 'Upload'} onChange={handleHeroImage} />
            {content.heroImage ? (
              <button
                type="button"
                onClick={() => updateContentField(setRoute, 'heroImage', null)}
                aria-label="Remove hero image"
                className="cursor-pointer p-1 text-base-content/35 transition hover:text-rose-600"
              >
                <span aria-hidden="true" className="icon-[lucide--x] size-4" />
              </button>
            ) : null}
          </div>
        </div>
      </TargetWrapper>

      <TargetWrapper target="intro" activeTarget={activeTarget} onSelectTarget={setActiveTarget}>
        <Field label="Intro">
          <textarea
            value={content.intro ?? ''}
            onChange={(e) => updateContentField(setRoute, 'intro', e.target.value)}
            rows={3}
            className={textareaClass}
          />
        </Field>
      </TargetWrapper>

      <ArrayFieldSection
        label="Features"
        items={content.features ?? []}
        activeIndex={activeIndex}
        onActivate={onActivate}
        onAdd={() => addArrayItem(setRoute, 'features', { title: '', body: '' })}
        onRemove={(i) => removeArrayItem(setRoute, 'features', i)}
        renderItem={(item, i) => (
          <>
            <input
              type="text"
              value={item.title}
              onChange={(e) => updateArrayItem(setRoute, 'features', i, { title: e.target.value })}
              placeholder="Title"
              className="input input-bordered h-9 w-full rounded-lg text-sm"
            />
            <textarea
              value={item.body}
              onChange={(e) => updateArrayItem(setRoute, 'features', i, { body: e.target.value })}
              placeholder="Body"
              rows={2}
              className={textareaClass}
            />
          </>
        )}
      />
    </>
  )
}

function StoryFields({ content, setRoute, activeIndex, onActivate }) {
  async function handleSectionImage(index, file) {
    if (!file) return
    updateArrayItem(setRoute, 'sections', index, { image: { url: await readFileAsDataUrl(file), publicId: null } })
  }

  return (
    <ArrayFieldSection
      label="Sections"
      items={content.sections ?? []}
      activeIndex={activeIndex}
      onActivate={onActivate}
      onAdd={() => addArrayItem(setRoute, 'sections', { heading: '', body: '', image: null })}
      onRemove={(i) => removeArrayItem(setRoute, 'sections', i)}
      renderItem={(item, i) => (
        <>
          <input
            type="text"
            value={item.heading}
            onChange={(e) => updateArrayItem(setRoute, 'sections', i, { heading: e.target.value })}
            placeholder="Section heading"
            className="input input-bordered h-9 w-full rounded-lg text-sm"
          />
          <textarea
            value={item.body}
            onChange={(e) => updateArrayItem(setRoute, 'sections', i, { body: e.target.value })}
            placeholder="Body"
            rows={3}
            className={textareaClass}
          />
          <div className="mt-2 flex items-center gap-2">
            {item.image ? (
              <img src={item.image.url} alt="" className="h-12 w-16 rounded-md border border-base-300 object-cover" />
            ) : null}
            <FileButton
              label={item.image ? 'Replace' : 'Add image'}
              onChange={(e) => handleSectionImage(i, e.target.files?.[0])}
            />
          </div>
        </>
      )}
    />
  )
}

function CardGridFields({ content, setRoute, activeIndex, onActivate }) {
  return (
    <ArrayFieldSection
      label="Cards"
      items={content.cards ?? []}
      activeIndex={activeIndex}
      onActivate={onActivate}
      onAdd={() => addArrayItem(setRoute, 'cards', { icon: 'icon-[lucide--sparkles]', title: '', body: '' })}
      onRemove={(i) => removeArrayItem(setRoute, 'cards', i)}
      renderItem={(item, i) => (
        <>
          <div className="flex items-center gap-2">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-base-300 bg-base-100">
              <span aria-hidden="true" className={`${item.icon} size-4 text-base-content/70`} />
            </span>
            <input
              type="text"
              value={item.icon}
              onChange={(e) => updateArrayItem(setRoute, 'cards', i, { icon: e.target.value })}
              placeholder="icon-[lucide--sparkles]"
              className="input input-bordered h-9 w-full rounded-lg font-mono text-xs"
            />
          </div>
          <input
            type="text"
            value={item.title}
            onChange={(e) => updateArrayItem(setRoute, 'cards', i, { title: e.target.value })}
            placeholder="Title"
            className="input input-bordered mt-2 h-9 w-full rounded-lg text-sm"
          />
          <textarea
            value={item.body}
            onChange={(e) => updateArrayItem(setRoute, 'cards', i, { body: e.target.value })}
            placeholder="Body"
            rows={2}
            className={textareaClass}
          />
        </>
      )}
    />
  )
}

function CtaFields({ content, setRoute, activeTarget, setActiveTarget }) {
  const cta = content.cta ?? { label: '', href: '' }

  return (
    <TargetWrapper target="cta" activeTarget={activeTarget} onSelectTarget={setActiveTarget}>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Field label="Label">
          <input
            type="text"
            value={cta.label}
            onChange={(e) => updateContentField(setRoute, 'cta', { ...cta, label: e.target.value })}
            placeholder="Book a demo"
            className={inputClass}
          />
        </Field>

        <Field label="Link">
          <input
            type="text"
            value={cta.href}
            onChange={(e) => updateContentField(setRoute, 'cta', { ...cta, href: e.target.value })}
            placeholder="#contact"
            className={`${inputClass} font-mono`}
          />
        </Field>
      </div>
    </TargetWrapper>
  )
}

function ArrayFieldSection({ label, items, onAdd, onRemove, renderItem, activeIndex, onActivate }) {
  function handleAdd() {
    onAdd()
    onActivate?.(items.length)
  }

  function handleRemove(i) {
    onRemove(i)
    onActivate?.(null)
  }

  return (
    <div className="border-t border-base-300 pt-5">
      <div className="flex items-center justify-between">
        <Label>
          {label} <span className="text-base-content/30">({items.length})</span>
        </Label>
        <button
          type="button"
          onClick={handleAdd}
          className="btn btn-outline btn-sm gap-1.5 rounded-lg border-base-300 px-3 font-medium text-base-content/70 hover:border-base-content/40 hover:bg-base-200"
        >
          <span aria-hidden="true" className="icon-[lucide--plus] size-3.5" />
          Add
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {items.map((item, i) => (
          <div
            key={i}
            id={`content-item-${i}`}
            onFocusCapture={() => onActivate?.(i)}
            className={`rounded-lg border bg-base-200/30 p-3.5 transition ${
              activeIndex === i ? 'border-base-content ring-2 ring-base-content/15' : 'border-base-300'
            }`}
          >
            <div className="mb-2.5 flex items-center justify-between">
              <span className="font-mono text-[10px] text-base-content/35">{String(i + 1).padStart(2, '0')}</span>
              <button
                type="button"
                onClick={() => handleRemove(i)}
                aria-label={`Remove ${label} ${i + 1}`}
                className="cursor-pointer p-1 text-base-content/35 transition hover:text-rose-600"
              >
                <span aria-hidden="true" className="icon-[lucide--trash-2] size-3.5" />
              </button>
            </div>
            {renderItem(item, i)}
          </div>
        ))}

        {items.length === 0 ? (
          <p className="rounded-lg border border-dashed border-base-300 px-4 py-5 text-center text-xs text-base-content/45">
            Nothing here yet.
          </p>
        ) : null}
      </div>
    </div>
  )
}
