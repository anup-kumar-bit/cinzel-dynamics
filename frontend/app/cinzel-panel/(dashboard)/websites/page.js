'use client'

import { useEffect, useState } from 'react'
import {
  deleteWebsite,
  getPortfolioStats,
  listWebsites,
  savePortfolioStats,
  saveWebsite,
} from '@/lib/cinzelPanel/db'
import { readFileAsDataUrl } from '../../_lib/fileToDataUrl'
import {
  EmptyState,
  ErrorBanner,
  Field,
  FileButton,
  Label,
  PageHeader,
  Panel,
  Spinner,
  inputClass,
  useConfirm,
  useToast,
} from '../../_lib/PanelUI'
import WebUi from '@/app/(site)/Global-Compoents/Mock-UI/Web-UI'

const BLANK_DRAFT = { id: null, name: '', domain: '', sections: [] }
const BLANK_STATS = { needsFulfilled: '', satisfaction: '', onTimeDelivery: '' }

function countShots(project) {
  return (project.sections ?? []).reduce((total, section) => total + section.images.length, 0)
}

function firstShot(project) {
  for (const section of project.sections ?? []) {
    if (section.images?.[0]) return section.images[0]
  }
  return null
}

function isBlank(draft) {
  return !draft.name.trim() && !draft.domain.trim() && draft.sections.length === 0
}

export default function WebsitesManagerPage() {
  const [websites, setWebsites] = useState([])
  const [draft, setDraft] = useState(BLANK_DRAFT)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [nameError, setNameError] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [deletingIds, setDeletingIds] = useState({})
  const [deleteErrors, setDeleteErrors] = useState({})
  const [stats, setStats] = useState(BLANK_STATS)
  const [statsSaving, setStatsSaving] = useState(false)
  const [statsError, setStatsError] = useState('')
  const [statsLoadError, setStatsLoadError] = useState('')
  const { confirm, confirmDialog } = useConfirm()
  const { showToast, toastNode } = useToast()

  function refresh() {
    return listWebsites()
      .then((data) => {
        setLoadError('')
        setWebsites(data)
      })
      .catch((err) => setLoadError(err.message || 'Something went wrong'))
  }

  function refreshStats() {
    return getPortfolioStats()
      .then((data) => {
        setStatsLoadError('')
        setStats(data)
      })
      .catch((err) => setStatsLoadError(err.message || 'Something went wrong'))
  }

  useEffect(() => {
    refresh()
    refreshStats()
  }, [])

  function updateStat(field, value) {
    setStats((s) => ({ ...s, [field]: value }))
  }

  async function handleSaveStats(event) {
    event.preventDefault()
    setStatsError('')
    setStatsSaving(true)
    try {
      const saved = await savePortfolioStats(stats)
      setStats(saved)
      showToast('Project analysis updated')
    } catch (err) {
      setStatsError(err.message || 'Could not save these numbers')
    } finally {
      setStatsSaving(false)
    }
  }

  function addSection() {
    setDraft((d) => ({ ...d, sections: [...d.sections, { name: '', images: [] }] }))
  }

  function updateSectionName(index, name) {
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s, i) => (i === index ? { ...s, name } : s)),
    }))
  }

  async function removeSection(index) {
    const section = draft.sections[index]
    if (section.images.length > 0) {
      const ok = await confirm({
        title: `Remove “${section.name || `section ${index + 1}`}”?`,
        description: `This section has ${section.images.length} image${section.images.length === 1 ? '' : 's'}. They'll be removed from the draft.`,
        confirmLabel: 'Remove section',
        tone: 'danger',
      })
      if (!ok) return
    }
    setDraft((d) => ({ ...d, sections: d.sections.filter((_, i) => i !== index) }))
  }

  async function addSectionImages(index, fileList) {
    const files = Array.from(fileList ?? [])
    if (files.length === 0) return
    const dataUrls = await Promise.all(files.map(readFileAsDataUrl))
    const pendingImages = dataUrls.map((url) => ({ url, publicId: null }))
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s, i) => (i === index ? { ...s, images: [...s.images, ...pendingImages] } : s)),
    }))
  }

  function removeSectionImage(sectionIndex, imageIndex) {
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s, i) =>
        i === sectionIndex ? { ...s, images: s.images.filter((_, j) => j !== imageIndex) } : s,
      ),
    }))
  }

  async function handleSave(event) {
    event.preventDefault()
    if (!draft.name.trim()) {
      setNameError(true)
      showToast('Add a project name before saving', 'error')
      return
    }
    setNameError(false)
    setSaveError('')
    setSaving(true)
    try {
      const wasNew = !draft.id
      const saved = await saveWebsite(draft)
      await refresh()
      setDraft(BLANK_DRAFT)
      showToast(wasNew ? `“${saved.name}” added` : `“${saved.name}” updated`)
    } catch (err) {
      setSaveError(err.message || 'Could not save this project')
    } finally {
      setSaving(false)
    }
  }

  async function handleEdit(project) {
    if (!isBlank(draft) && draft.id !== project.id) {
      const ok = await confirm({
        title: 'Discard the open draft?',
        description: `You have unsaved changes${draft.name ? ` on “${draft.name}”` : ''}. Editing “${project.name}” will discard them.`,
        confirmLabel: 'Discard and edit',
        tone: 'neutral',
      })
      if (!ok) return
    }
    setNameError(false)
    setSaveError('')
    setDraft(project)
  }

  async function handleDelete(project) {
    const ok = await confirm({
      title: `Delete “${project.name}”?`,
      description: 'This removes the project and all of its screenshots from the portfolio mockup. It cannot be undone.',
      confirmLabel: 'Delete project',
      tone: 'danger',
    })
    if (!ok) return

    setDeleteErrors((prev) => {
      const { [project.id]: _drop, ...rest } = prev
      return rest
    })
    setDeletingIds((prev) => ({ ...prev, [project.id]: true }))
    try {
      await deleteWebsite(project.id)
      if (draft.id === project.id) setDraft(BLANK_DRAFT)
      await refresh()
      showToast(`“${project.name}” deleted`)
    } catch (err) {
      setDeleteErrors((prev) => ({ ...prev, [project.id]: err.message || 'Could not delete this project' }))
    } finally {
      setDeletingIds((prev) => {
        const { [project.id]: _drop, ...rest } = prev
        return rest
      })
    }
  }

  async function handleNew() {
    if (!isBlank(draft) && !draft.id) {
      const ok = await confirm({
        title: 'Discard the open draft?',
        description: 'The project you started has not been saved yet.',
        confirmLabel: 'Discard',
        tone: 'neutral',
      })
      if (!ok) return
    }
    setNameError(false)
    setSaveError('')
    setDraft(BLANK_DRAFT)
  }

  // The portfolio page has two browser frames. Projects alternate between them
  // in the order they were created — 1st, 3rd, 5th… in box 1; 2nd, 4th, 6th…
  // in box 2 — and each frame stacks the ones it holds as tabs. That order is
  // just this list's position (already sorted by created_at by the API), so
  // deleting or re-saving one never shuffles where the others land.
  const openDraft = isBlank(draft) ? null : { ...draft, id: draft.id ?? '__draft__', unsaved: true }
  let preview = websites
  if (openDraft) {
    preview = draft.id ? websites.map((p) => (p.id === draft.id ? openDraft : p)) : [...websites, openDraft]
  }
  const boxes = [preview.filter((_, i) => i % 2 === 0), preview.filter((_, i) => i % 2 === 1)]

  return (
    <>
      <PageHeader
        icon="icon-[lucide--globe]"
        title="Portfolio websites"
        description="Website case studies shown inside the two browser mockups on the portfolio page. Projects alternate between the two frames and stack as tabs."
        actions={
          draft.id || !isBlank(draft) ? (
            <button type="button" onClick={handleNew} className="btn btn-neutral btn-sm gap-1.5 rounded-lg px-4">
              <span aria-hidden="true" className="icon-[lucide--plus] size-3.5" />
              New project
            </button>
          ) : null
        }
      />

      {loadError ? (
        <ErrorBanner className="mb-6" onRetry={refresh}>
          Couldn&apos;t load your websites: {loadError}
        </ErrorBanner>
      ) : null}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_25rem]">
        <div className="flex min-w-0 flex-col gap-6">
          <form onSubmit={handleSave}>
            <Panel
              icon={draft.id ? 'icon-[lucide--pencil]' : 'icon-[lucide--plus]'}
              title={draft.id ? `Edit ${draft.name || 'project'}` : 'New project'}
              meta={draft.id ? 'Saved' : 'Draft'}
              bodyClassName="flex flex-col gap-6 p-6"
              footer={
                <>
                  <button type="submit" disabled={saving} className="btn btn-neutral btn-sm gap-1.5 rounded-lg px-5">
                    {saving ? (
                      <>
                        <Spinner className="size-3.5" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <span aria-hidden="true" className="icon-[lucide--check] size-3.5" />
                        {draft.id ? 'Save changes' : 'Add project'}
                      </>
                    )}
                  </button>

                  {draft.id ? (
                    <button
                      type="button"
                      onClick={handleNew}
                      className="btn btn-ghost btn-sm rounded-lg px-3 font-medium text-base-content/55"
                    >
                      Cancel
                    </button>
                  ) : null}

                  <span className="ml-auto text-[11px] text-base-content/40">
                    New images upload to Cloudinary on save
                  </span>
                </>
              }
            >
              {saveError ? <ErrorBanner>{saveError}</ErrorBanner> : null}

              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Project name">
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(event) => {
                      setDraft((d) => ({ ...d, name: event.target.value }))
                      setNameError(false)
                    }}
                    placeholder="e.g. Meridian Studio"
                    required
                    className={`${inputClass} ${nameError ? 'input-error' : ''}`}
                  />
                </Field>

                <Field label="Domain" hint="Shown in the mock browser's address bar.">
                  <input
                    type="text"
                    value={draft.domain}
                    onChange={(event) => setDraft((d) => ({ ...d, domain: event.target.value }))}
                    placeholder="e.g. meridian.studio"
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="border-t border-base-300 pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label>Sections</Label>
                    <p className="mt-1.5 text-[11px] text-base-content/45">
                      Each section is one part of the site; its images stack as scroll shots, same as an app's screens.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addSection}
                    className="btn btn-outline btn-sm shrink-0 gap-1.5 rounded-lg border-base-300 px-3 font-medium text-base-content/70 hover:border-base-content/40 hover:bg-base-200"
                  >
                    <span aria-hidden="true" className="icon-[lucide--plus] size-3.5" />
                    Add section
                  </button>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  {draft.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="overflow-hidden rounded-lg border border-base-300">
                      <div className="flex items-center gap-2.5 border-b border-base-300 bg-base-200/50 px-4 py-2.5">
                        <span className="font-mono text-[10px] text-base-content/35">
                          {String(sectionIndex + 1).padStart(2, '0')}
                        </span>
                        <input
                          type="text"
                          value={section.name}
                          onChange={(event) => updateSectionName(sectionIndex, event.target.value)}
                          placeholder="Section name (e.g. Homepage)"
                          className="input input-ghost input-sm w-full max-w-72 rounded-md bg-transparent px-2 text-sm font-semibold focus:outline-none"
                        />
                        <span className="font-mono ml-auto shrink-0 text-[10px] text-base-content/35">
                          {section.images.length} shot{section.images.length === 1 ? '' : 's'}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeSection(sectionIndex)}
                          aria-label="Remove section"
                          className="cursor-pointer p-1 text-base-content/35 transition hover:text-rose-600"
                        >
                          <span aria-hidden="true" className="icon-[lucide--trash-2] size-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 p-4">
                        {section.images.map((image, imageIndex) => (
                          <div key={imageIndex} className="relative">
                            <img
                              src={image.url}
                              alt=""
                              className="h-20 w-auto rounded-lg border border-base-300 bg-base-100 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeSectionImage(sectionIndex, imageIndex)}
                              aria-label="Remove image"
                              className="absolute -top-2 -right-2 flex size-5 cursor-pointer items-center justify-center rounded-full border border-base-100 bg-base-content text-[11px] leading-none text-base-100 shadow-sm"
                            >
                              ×
                            </button>
                          </div>
                        ))}

                        <FileButton
                          label="Add screenshots"
                          multiple
                          onChange={(event) => addSectionImages(sectionIndex, event.target.files)}
                        />
                      </div>
                    </div>
                  ))}

                  {draft.sections.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-base-300 px-4 py-6 text-center text-xs text-base-content/45">
                      No sections yet — the mockup shows an empty page until one is added.
                    </p>
                  ) : null}
                </div>
              </div>

            </Panel>
          </form>

          <Panel
            icon="icon-[lucide--list]"
            title="All websites"
            meta={`${websites.length} total`}
            bodyClassName={websites.length === 0 ? 'p-6' : ''}
          >
            {websites.length === 0 ? (
              <EmptyState icon="icon-[lucide--globe]" title="No websites yet">
                Add one above and it will appear in the portfolio mockup.
              </EmptyState>
            ) : (
              <ul className="flex list-none flex-col p-0">
                {websites.map((project, index) => {
                  const editing = draft.id === project.id
                  const thumb = firstShot(project)

                  return (
                    <li
                      key={project.id}
                      className={`flex flex-wrap items-center gap-4 border-b border-base-200 px-6 py-4 transition last:border-b-0 hover:bg-base-200/40 ${
                        editing ? 'bg-base-200/60' : ''
                      }`}
                    >
                      {thumb ? (
                        <img
                          src={thumb.url}
                          alt=""
                          className="size-11 shrink-0 rounded-xl border border-base-300 object-cover"
                        />
                      ) : (
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-dashed border-base-300">
                          <span aria-hidden="true" className="icon-[lucide--image] size-4 text-base-content/25" />
                        </span>
                      )}

                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-sm font-semibold text-base-content">{project.name}</span>
                          {editing ? (
                            <span className="font-mono rounded-full bg-base-content px-2 py-0.5 text-[9px] tracking-widest text-base-100 uppercase">
                              Editing
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-1 flex items-center gap-2 text-[11px] text-base-content/45">
                          <span className="font-mono rounded bg-base-200 px-1.5 py-0.5 text-[10px] text-base-content/55">
                            Box {(index % 2) + 1}
                          </span>
                          {project.domain || 'no domain set'} · {project.sections?.length ?? 0} sections ·{' '}
                          {countShots(project)} shots
                        </span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handleEdit(project)}
                        className="btn btn-outline btn-sm gap-1.5 rounded-lg border-base-300 px-3 font-medium text-base-content/70 hover:border-base-content/40 hover:bg-base-200"
                      >
                        <span aria-hidden="true" className="icon-[lucide--pencil] size-3.5" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(project)}
                        disabled={!!deletingIds[project.id]}
                        aria-label={`Delete ${project.name}`}
                        className="cursor-pointer p-1.5 text-base-content/35 transition hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingIds[project.id] ? (
                          <Spinner className="size-4" />
                        ) : (
                          <span aria-hidden="true" className="icon-[lucide--trash-2] size-4" />
                        )}
                      </button>

                      {deleteErrors[project.id] ? (
                        <p className="flex w-full items-center gap-1.5 text-[11px] font-medium text-rose-600 dark:text-rose-400">
                          <span aria-hidden="true" className="icon-[lucide--circle-alert] size-3.5 shrink-0" />
                          Couldn&apos;t delete: {deleteErrors[project.id]}
                        </p>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            )}
          </Panel>
        </div>

        <div className="flex flex-col gap-6 xl:sticky xl:top-8 xl:self-start">
          {boxes.map((tabs, boxIndex) => (
            <Panel
              key={boxIndex}
              icon="icon-[lucide--eye]"
              title={`Website box ${boxIndex + 1}`}
              meta={tabs.length ? `${tabs.length} tab${tabs.length === 1 ? '' : 's'}` : 'empty · demo site'}
              bodyClassName="flex justify-center bg-neutral px-5 py-6"
              footer={
                <span className="text-[11px] text-base-content/45">
                  {boxIndex === 0 ? '1st, 3rd, 5th…' : '2nd, 4th, 6th…'} project added lands here
                </span>
              }
            >
              <WebUi className="aspect-4/3 w-full" projects={tabs} minimalEmptyState />
            </Panel>
          ))}
        </div>
      </div>

      <form onSubmit={handleSaveStats} className="mt-6">
        <Panel
          icon="icon-[lucide--bar-chart-3]"
          title="Project analysis"
          meta="Site-wide"
          bodyClassName="flex flex-col gap-5 p-6"
          footer={
            <>
              <button type="submit" disabled={statsSaving} className="btn btn-neutral btn-sm gap-1.5 rounded-lg px-5">
                {statsSaving ? (
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

              <span className="ml-auto text-[11px] text-base-content/40">
                Shown as gauges below the browser/phone frames on the public portfolio page
              </span>
            </>
          }
        >
          {statsError ? <ErrorBanner>{statsError}</ErrorBanner> : null}
          {statsLoadError ? (
            <ErrorBanner onRetry={refreshStats}>Couldn&apos;t load this: {statsLoadError}</ErrorBanner>
          ) : null}

          <p className="-mt-1 text-[11px] text-base-content/45">
            One set of numbers for the whole portfolio — not tied to any single project above. Leave a field blank to
            show it as “not tracked” rather than a made-up score.
          </p>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Client needs fulfilled" hint="0–100.">
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={stats.needsFulfilled}
                onChange={(event) => updateStat('needsFulfilled', event.target.value)}
                placeholder="e.g. 92"
                className={inputClass}
              />
            </Field>

            <Field label="Client satisfaction" hint="0–5.">
              <input
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={stats.satisfaction}
                onChange={(event) => updateStat('satisfaction', event.target.value)}
                placeholder="e.g. 4.8"
                className={inputClass}
              />
            </Field>

            <Field label="On-time delivery" hint="0–100.">
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={stats.onTimeDelivery}
                onChange={(event) => updateStat('onTimeDelivery', event.target.value)}
                placeholder="e.g. 88"
                className={inputClass}
              />
            </Field>
          </div>
        </Panel>
      </form>

      {confirmDialog}
      {toastNode}
    </>
  )
}
