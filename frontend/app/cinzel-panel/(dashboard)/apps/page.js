'use client'

import { useEffect, useState } from 'react'
import { deleteApp, listApps, saveApp } from '@/lib/cinzelPanel/db'
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
import IosUi from '@/app/(site)/Global-Compoents/Mock-UI/IOS-UI'
import AndroidUi from '@/app/(site)/Global-Compoents/Mock-UI/Android-UI'

const BLANK_DRAFT = { id: null, platform: 'ios', name: '', icon: null, screenGroups: [] }

const PLATFORMS = [
  { id: 'ios', label: 'iOS', icon: 'icon-[simple-icons--apple]' },
  { id: 'android', label: 'Android', icon: 'icon-[simple-icons--android]' },
]

function toTile(app) {
  return {
    label: app.name || 'Untitled',
    iconSrc: app.icon?.url,
    tone: '',
    screens: Object.fromEntries(
      (app.screenGroups ?? []).map((group) => [group.name || 'Screens', group.images.map((image) => image.url)]),
    ),
  }
}

function countShots(app) {
  return (app.screenGroups ?? []).reduce((total, group) => total + group.images.length, 0)
}

function isBlank(draft) {
  return !draft.name.trim() && !draft.icon && draft.screenGroups.length === 0
}

export default function AppsManagerPage() {
  const [apps, setApps] = useState([])
  const [draft, setDraft] = useState(BLANK_DRAFT)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [iconError, setIconError] = useState(false)
  // Checked by default — most apps ship on both stores, so mirroring is the common case.
  const [mirrorToOtherPlatform, setMirrorToOtherPlatform] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [deletingIds, setDeletingIds] = useState({})
  const [deleteErrors, setDeleteErrors] = useState({})
  const { confirm, confirmDialog } = useConfirm()
  const { showToast, toastNode } = useToast()

  // Without a .catch() here, a failed load left `apps` at its initial value
  // forever with no sign anything was wrong — looked identical to "0 apps".
  function refresh() {
    return listApps()
      .then((data) => {
        setLoadError('')
        setApps(data)
      })
      .catch((err) => setLoadError(err.message || 'Something went wrong'))
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleIconChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const dataUrl = await readFileAsDataUrl(file)
    // publicId is null until saveApp() actually uploads it — the `data:`
    // prefix on url is what tells the API client this image is still pending.
    setDraft((d) => ({ ...d, icon: { url: dataUrl, publicId: null } }))
    setIconError(false)
  }

  function addScreenGroup() {
    setDraft((d) => ({ ...d, screenGroups: [...d.screenGroups, { name: '', images: [] }] }))
  }

  function updateGroupName(index, name) {
    setDraft((d) => ({
      ...d,
      screenGroups: d.screenGroups.map((g, i) => (i === index ? { ...g, name } : g)),
    }))
  }

  async function removeGroup(index) {
    const group = draft.screenGroups[index]
    if (group.images.length > 0) {
      const ok = await confirm({
        title: `Remove “${group.name || `screen ${index + 1}`}”?`,
        description: `This screen has ${group.images.length} image${group.images.length === 1 ? '' : 's'}. They'll be removed from the draft.`,
        confirmLabel: 'Remove screen',
        tone: 'danger',
      })
      if (!ok) return
    }
    setDraft((d) => ({ ...d, screenGroups: d.screenGroups.filter((_, i) => i !== index) }))
  }

  async function addGroupImages(index, fileList) {
    const files = Array.from(fileList ?? [])
    if (files.length === 0) return
    const dataUrls = await Promise.all(files.map(readFileAsDataUrl))
    const pendingImages = dataUrls.map((url) => ({ url, publicId: null }))
    setDraft((d) => ({
      ...d,
      screenGroups: d.screenGroups.map((g, i) =>
        i === index ? { ...g, images: [...g.images, ...pendingImages] } : g,
      ),
    }))
  }

  function removeGroupImage(groupIndex, imageIndex) {
    setDraft((d) => ({
      ...d,
      screenGroups: d.screenGroups.map((g, i) =>
        i === groupIndex ? { ...g, images: g.images.filter((_, j) => j !== imageIndex) } : g,
      ),
    }))
  }

  async function handleSave(event) {
    event.preventDefault()
    if (!draft.name.trim()) return

    // The home-screen tile is nothing without an icon, so block the save here.
    if (!draft.icon) {
      setIconError(true)
      showToast('Add an app icon before saving', 'error')
      return
    }

    setIconError(false)
    setSaveError('')
    setSaving(true)
    try {
      const wasNew = !draft.id
      const saved = await saveApp(draft)

      // Mirroring re-saves under the other platform. It reuses `saved`'s
      // icon/screens (already-uploaded Cloudinary URLs by this point) rather
      // than the original draft, so the same image isn't uploaded twice. If a
      // same-named app already exists on that platform, this updates it
      // instead of creating a duplicate — so re-saving with the box checked
      // keeps both sides in sync rather than piling up copies.
      let mirrored = null
      let mirrorError = null
      if (mirrorToOtherPlatform) {
        const otherPlatform = draft.platform === 'ios' ? 'android' : 'ios'
        const twin = apps.find(
          (a) => a.platform === otherPlatform && a.name.trim().toLowerCase() === saved.name.trim().toLowerCase(),
        )
        try {
          mirrored = await saveApp({
            id: twin ? twin.id : null,
            platform: otherPlatform,
            name: saved.name,
            icon: saved.icon,
            screenGroups: saved.screenGroups,
          })
        } catch (err) {
          mirrorError = err
        }
      }

      await refresh()
      // Reset to a blank form so the next app can be added straight away,
      // keeping the platform so several in a row don't need re-picking.
      setDraft({ ...BLANK_DRAFT, platform: draft.platform })

      // Single showToast call — the hook holds one toast at a time, so two
      // back-to-back calls would just have the second silently win.
      if (mirrorError) {
        showToast(`“${saved.name}” saved, but mirroring to the other platform failed: ${mirrorError.message}`, 'error')
      } else if (mirrored) {
        showToast(`“${saved.name}” saved for iOS and Android`)
      } else {
        showToast(wasNew ? `“${saved.name}” added` : `“${saved.name}” updated`)
      }
    } catch (err) {
      setSaveError(err.message || 'Could not save this app')
    } finally {
      setSaving(false)
    }
  }

  // Only interrupts when the open draft actually holds unsaved work.
  async function handleEdit(app) {
    if (!isBlank(draft) && draft.id !== app.id) {
      const ok = await confirm({
        title: 'Discard the open draft?',
        description: `You have unsaved changes${draft.name ? ` on “${draft.name}”` : ''}. Editing “${app.name}” will discard them.`,
        confirmLabel: 'Discard and edit',
        tone: 'neutral',
      })
      if (!ok) return
    }
    setIconError(false)
    setSaveError('')
    setDraft(app)
  }

  async function handleDelete(app) {
    const ok = await confirm({
      title: `Delete “${app.name}”?`,
      description: 'This removes the app and all of its screens from the portfolio mockups. It cannot be undone.',
      confirmLabel: 'Delete app',
      tone: 'danger',
    })
    if (!ok) return

    setDeleteErrors((prev) => {
      const { [app.id]: _drop, ...rest } = prev
      return rest
    })
    setDeletingIds((prev) => ({ ...prev, [app.id]: true }))
    try {
      await deleteApp(app.id)
      if (draft.id === app.id) setDraft(BLANK_DRAFT)
      await refresh()
      showToast(`“${app.name}” deleted`)
    } catch (err) {
      setDeleteErrors((prev) => ({ ...prev, [app.id]: err.message || 'Could not delete this app' }))
    } finally {
      setDeletingIds((prev) => {
        const { [app.id]: _drop, ...rest } = prev
        return rest
      })
    }
  }

  async function handleNew() {
    if (!isBlank(draft) && !draft.id) {
      const ok = await confirm({
        title: 'Discard the open draft?',
        description: 'The app you started has not been saved yet.',
        confirmLabel: 'Discard',
        tone: 'neutral',
      })
      if (!ok) return
    }
    setIconError(false)
    setSaveError('')
    setDraft(BLANK_DRAFT)
  }

  const previewApps = [
    ...(draft.name.trim() ? [toTile(draft)] : []),
    ...apps.filter((a) => a.platform === draft.platform && a.id !== draft.id).map(toTile),
  ]

  return (
    <>
      <PageHeader
        icon="icon-[lucide--smartphone]"
        title="Portfolio apps"
        description="Apps shown inside the iOS and Android mockups on the portfolio page."
        actions={
          draft.id || !isBlank(draft) ? (
            <button type="button" onClick={handleNew} className="btn btn-neutral btn-sm gap-1.5 rounded-lg px-4">
              <span aria-hidden="true" className="icon-[lucide--plus] size-3.5" />
              New app
            </button>
          ) : null
        }
      />

      {loadError ? (
        <ErrorBanner className="mb-6" onRetry={refresh}>
          Couldn&apos;t load your apps: {loadError}
        </ErrorBanner>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_25rem]">
        <div className="flex min-w-0 flex-col gap-6">
          <form onSubmit={handleSave}>
            <Panel
              icon={draft.id ? 'icon-[lucide--pencil]' : 'icon-[lucide--plus]'}
              title={draft.id ? `Edit ${draft.name || 'app'}` : 'New app'}
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
                        {draft.id ? 'Save changes' : 'Add app'}
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

              <div className="grid gap-6 sm:grid-cols-[auto_minmax(0,1fr)]">
                <div>
                  <Label className="block">Platform</Label>
                  <div className="mt-1.5 inline-flex rounded-lg border border-base-300 bg-base-200/50 p-1">
                    {PLATFORMS.map((platform) => (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => setDraft((d) => ({ ...d, platform: platform.id }))}
                        className={`flex cursor-pointer items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
                          draft.platform === platform.id
                            ? 'bg-base-100 text-base-content shadow-sm'
                            : 'text-base-content/50 hover:text-base-content'
                        }`}
                      >
                        <span aria-hidden="true" className={`${platform.icon} size-3.5`} />
                        {platform.label}
                      </button>
                    ))}
                  </div>

                  <label className="mt-2.5 flex cursor-pointer items-center gap-2 text-[11px] text-base-content/60">
                    <input
                      type="checkbox"
                      checked={mirrorToOtherPlatform}
                      onChange={(event) => setMirrorToOtherPlatform(event.target.checked)}
                      className="checkbox checkbox-xs rounded"
                    />
                    Also add for {draft.platform === 'ios' ? 'Android' : 'iOS'}
                  </label>
                </div>

                <Field label="App name" hint="Shown under the icon on the home screen.">
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(event) => setDraft((d) => ({ ...d, name: event.target.value }))}
                    placeholder="e.g. Fieldwork"
                    required
                    className={inputClass}
                  />
                </Field>
              </div>

              <div>
                <Label className="block">
                  App icon <span className="text-rose-500">*</span>
                </Label>
                <div
                  className={`mt-1.5 flex items-center gap-4 rounded-lg border p-4 ${
                    iconError ? 'border-rose-500/60 bg-rose-500/5' : 'border-base-300 bg-base-200/30'
                  }`}
                >
                  {draft.icon ? (
                    <img
                      src={draft.icon.url}
                      alt=""
                      className="size-14 shrink-0 rounded-2xl border border-base-300 object-cover"
                    />
                  ) : (
                    <span
                      className={`flex size-14 shrink-0 items-center justify-center rounded-2xl border border-dashed bg-base-100 ${
                        iconError ? 'border-rose-500/50' : 'border-base-300'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`icon-[lucide--image] size-5 ${iconError ? 'text-rose-500/60' : 'text-base-content/25'}`}
                      />
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-base-content">
                      {draft.icon ? 'Icon set' : 'No icon yet'}
                    </p>
                    <p className="mt-0.5 text-[11px] text-base-content/45">
                      Required · square image works best — PNG or JPG.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <FileButton label={draft.icon ? 'Replace' : 'Upload'} onChange={handleIconChange} />
                    {draft.icon ? (
                      <button
                        type="button"
                        onClick={() => setDraft((d) => ({ ...d, icon: null }))}
                        aria-label="Remove icon"
                        className="cursor-pointer p-1 text-base-content/35 transition hover:text-rose-600"
                      >
                        <span aria-hidden="true" className="icon-[lucide--x] size-4" />
                      </button>
                    ) : null}
                  </div>
                </div>

                {iconError ? (
                  <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-rose-600 dark:text-rose-400">
                    <span aria-hidden="true" className="icon-[lucide--circle-alert] size-3.5 shrink-0" />
                    An app icon is required — the home-screen tile has nothing to show without one.
                  </p>
                ) : null}
              </div>

              <div className="border-t border-base-300 pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label>Screens</Label>
                    <p className="mt-1.5 text-[11px] text-base-content/45">
                      Each screen is one step of the walkthrough; its images stack as scroll shots.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addScreenGroup}
                    className="btn btn-outline btn-sm shrink-0 gap-1.5 rounded-lg border-base-300 px-3 font-medium text-base-content/70 hover:border-base-content/40 hover:bg-base-200"
                  >
                    <span aria-hidden="true" className="icon-[lucide--plus] size-3.5" />
                    Add screen
                  </button>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  {draft.screenGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="overflow-hidden rounded-lg border border-base-300">
                      <div className="flex items-center gap-2.5 border-b border-base-300 bg-base-200/50 px-4 py-2.5">
                        <span className="font-mono text-[10px] text-base-content/35">
                          {String(groupIndex + 1).padStart(2, '0')}
                        </span>
                        <input
                          type="text"
                          value={group.name}
                          onChange={(event) => updateGroupName(groupIndex, event.target.value)}
                          placeholder="Screen name (e.g. Feed)"
                          className="input input-ghost input-sm w-full max-w-72 rounded-md bg-transparent px-2 text-sm font-semibold focus:outline-none"
                        />
                        <span className="font-mono ml-auto shrink-0 text-[10px] text-base-content/35">
                          {group.images.length} shot{group.images.length === 1 ? '' : 's'}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeGroup(groupIndex)}
                          aria-label="Remove screen"
                          className="cursor-pointer p-1 text-base-content/35 transition hover:text-rose-600"
                        >
                          <span aria-hidden="true" className="icon-[lucide--trash-2] size-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 p-4">
                        {group.images.map((image, imageIndex) => (
                          <div key={imageIndex} className="relative">
                            <img
                              src={image.url}
                              alt=""
                              className="h-20 w-auto rounded-lg border border-base-300 bg-base-100 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeGroupImage(groupIndex, imageIndex)}
                              aria-label="Remove image"
                              className="absolute -top-2 -right-2 flex size-5 cursor-pointer items-center justify-center rounded-full border border-base-100 bg-base-content text-[11px] leading-none text-base-100 shadow-sm"
                            >
                              ×
                            </button>
                          </div>
                        ))}

                        <FileButton
                          label="Add images"
                          multiple
                          onChange={(event) => addGroupImages(groupIndex, event.target.files)}
                        />
                      </div>
                    </div>
                  ))}

                  {draft.screenGroups.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-base-300 px-4 py-6 text-center text-xs text-base-content/45">
                      No screens yet — the mockup falls back to placeholder shots.
                    </p>
                  ) : null}
                </div>
              </div>
            </Panel>
          </form>

          <Panel
            icon="icon-[lucide--list]"
            title="All apps"
            meta={`${apps.length} total`}
            bodyClassName={apps.length === 0 ? 'p-6' : ''}
          >
            {apps.length === 0 ? (
              <EmptyState icon="icon-[lucide--smartphone]" title="No apps yet">
                Add one above and it will appear in the portfolio mockups.
              </EmptyState>
            ) : (
              <ul className="flex list-none flex-col p-0">
                {apps.map((app) => {
                  const platform = PLATFORMS.find((p) => p.id === app.platform)
                  const editing = draft.id === app.id

                  return (
                    <li
                      key={app.id}
                      className={`flex flex-wrap items-center gap-4 border-b border-base-200 px-6 py-4 transition last:border-b-0 hover:bg-base-200/40 ${
                        editing ? 'bg-base-200/60' : ''
                      }`}
                    >
                      {app.icon ? (
                        <img
                          src={app.icon.url}
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
                          <span className="truncate text-sm font-semibold text-base-content">{app.name}</span>
                          {editing ? (
                            <span className="font-mono rounded-full bg-base-content px-2 py-0.5 text-[9px] tracking-widest text-base-100 uppercase">
                              Editing
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-1 flex items-center gap-1.5 text-[11px] text-base-content/45">
                          <span aria-hidden="true" className={`${platform?.icon} size-3`} />
                          {platform?.label} · {app.screenGroups?.length ?? 0} screens · {countShots(app)} shots
                        </span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handleEdit(app)}
                        className="btn btn-outline btn-sm gap-1.5 rounded-lg border-base-300 px-3 font-medium text-base-content/70 hover:border-base-content/40 hover:bg-base-200"
                      >
                        <span aria-hidden="true" className="icon-[lucide--pencil] size-3.5" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(app)}
                        disabled={!!deletingIds[app.id]}
                        aria-label={`Delete ${app.name}`}
                        className="cursor-pointer p-1.5 text-base-content/35 transition hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingIds[app.id] ? (
                          <Spinner className="size-4" />
                        ) : (
                          <span aria-hidden="true" className="icon-[lucide--trash-2] size-4" />
                        )}
                      </button>

                      {deleteErrors[app.id] ? (
                        <p className="flex w-full items-center gap-1.5 text-[11px] font-medium text-rose-600 dark:text-rose-400">
                          <span aria-hidden="true" className="icon-[lucide--circle-alert] size-3.5 shrink-0" />
                          Couldn&apos;t delete: {deleteErrors[app.id]}
                        </p>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            )}
          </Panel>
        </div>

        <div className="xl:sticky xl:top-8 xl:self-start">
          <Panel
            icon="icon-[lucide--eye]"
            title="Live preview"
            meta={draft.platform === 'ios' ? 'iOS' : 'Android'}
            bodyClassName="flex justify-center bg-neutral px-6 py-8"
          >
            {draft.platform === 'ios' ? (
              <IosUi className="w-64" apps={previewApps} />
            ) : (
              <AndroidUi className="w-64" apps={previewApps} />
            )}
          </Panel>

          <p className="mt-3 px-1 text-[11px] leading-relaxed text-base-content/45">
            Tap an app in the mockup to open its walkthrough, exactly as it behaves on the portfolio page.
          </p>
        </div>
      </div>

      {confirmDialog}
      {toastNode}
    </>
  )
}
