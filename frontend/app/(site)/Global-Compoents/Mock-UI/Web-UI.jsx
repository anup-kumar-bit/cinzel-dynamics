'use client'

import React, { useEffect, useMemo, useState } from 'react'

import './Web-UI.css'

// A browser window that scrolls inside the frame — the desktop counterpart to the iOS mock.
// Pass `projects` (admin records: { name, domain, path, sections }) to show real
// screenshots instead of the baked-in demo site. More than one gets a tab strip,
// so a single frame can hold several projects the way a browser holds several tabs.
// Within a project, its sections page one at a time via a round edge button —
// the same next-screen control the app mockups use for screens. Multiple
// screenshots inside one section just stack and scroll, the way a single tall
// page capture naturally would.
export default function WebUi({ className = '', projects, minimalEmptyState = false, loading = false }) {
  const list = projects?.length ? projects : null
  const [activeIndex, setActiveIndex] = useState(0)
  const [sectionIndex, setSectionIndex] = useState(0)

  // Deleting the open tab (or switching to a shorter list) would otherwise leave
  // the index pointing past the end.
  useEffect(() => {
    if (list && activeIndex > list.length - 1) setActiveIndex(0)
  }, [list, activeIndex])

  // Switching tabs always lands back on that project's first section, rather
  // than wherever the previous tab's paging happened to leave off.
  useEffect(() => {
    setSectionIndex(0)
  }, [activeIndex])

  const active = list ? (list[activeIndex] ?? list[0]) : null
  const domain = loading ? '' : active?.domain || ''
  const path = loading || !active ? '' : (active.path ?? '/')

  const sections = useMemo(
    () => (active?.sections ?? []).filter((section) => (section.images ?? []).length > 0),
    [active],
  )
  const currentSection = sections[sectionIndex]
  const hasNextSection = sectionIndex < sections.length - 1
  const hasPrevSection = sectionIndex > 0
  const atEnd = sections.length > 0 && !hasNextSection

  function showNextSection() {
    setSectionIndex((index) => index + 1)
  }

  function showPrevSection() {
    setSectionIndex((index) => index - 1)
  }

  function restart() {
    setSectionIndex(0)
  }

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/10 ${className}`}
    >
      {!loading && list && list.length > 1 ? (
        <TabStrip
          projects={list}
          activeIndex={Math.min(activeIndex, list.length - 1)}
          onSelect={setActiveIndex}
        />
      ) : null}

      <BrowserChrome domain={domain} path={path} loading={loading} />

      {/* The scroll region — focusable so it can be reached from the keyboard too. */}
      <div
        tabIndex={0}
        role="group"
        aria-label={loading ? 'Loading preview' : domain ? `Scrollable preview of ${domain}` : 'Preview'}
        className="web-ui-scroll relative min-h-0 flex-1 overflow-y-auto focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-500"
      >
        {loading ? (
          <LoadingPane />
        ) : active && currentSection ? (
          // Remounting on tab change replays the page-in animation, so switching
          // tabs reads as a page load rather than a silent swap.
          <ProjectScreens
            key={activeIndex}
            section={currentSection}
            sectionIndex={sectionIndex}
            totalSections={sections.length}
          />
        ) : active ? (
          <NoScreens />
        ) : minimalEmptyState ? (
          <EmptyBox />
        ) : (
          <ComingSoon />
        )}
      </div>

      {/* Pinned to the frame, not the scroll region, so they stay put at the
          same spot regardless of how far the current shot is scrolled. */}
      {!loading && hasPrevSection ? (
        <RoundButton
          onClick={showPrevSection}
          label={`Previous section: ${sections[sectionIndex - 1].name || `Section ${sectionIndex}`}`}
          icon="icon-[lucide--chevron-left]"
          className="left-2 top-1/2 -translate-y-1/2"
        />
      ) : null}

      {!loading && hasNextSection ? (
        <RoundButton
          onClick={showNextSection}
          label={`Next section: ${sections[sectionIndex + 1].name || `Section ${sectionIndex + 2}`}`}
          icon="icon-[lucide--chevron-right]"
          className="right-2 top-1/2 -translate-y-1/2"
        />
      ) : null}

      {!loading && atEnd ? (
        <RoundButton
          onClick={restart}
          label="Start over"
          icon="icon-[lucide--rotate-ccw]"
          className="bottom-2.5 left-1/2 -translate-x-1/2"
        />
      ) : null}

      {/* Same bottom-center spot as the restart control above, so only one of
          the two ever shows at once — and neither shows while loading. */}
      {!loading && !atEnd ? <ScrollHint /> : null}
    </div>
  )
}

// Same edge-of-frame control the app walkthroughs use to move to the next
// screen — a translucent circle that stays put while the content behind it
// scrolls or swaps.
function RoundButton({ onClick, label, icon, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute z-20 flex size-7 cursor-pointer items-center justify-center rounded-full bg-white/85 text-neutral-900 shadow-lg backdrop-blur transition hover:bg-white active:scale-95 ${className}`}
    >
      <span aria-hidden="true" className={`${icon} size-3.5`} />
    </button>
  )
}

// ---------- Tabs ----------
function TabStrip({ projects, activeIndex, onSelect }) {
  return (
    <div
      role="tablist"
      aria-label="Projects in this frame"
      className="web-ui-tabs flex shrink-0 items-end gap-1 overflow-x-auto border-b border-neutral-200 bg-neutral-200/80 px-2 pt-1.5"
    >
      {projects.map((project, index) => {
        const selected = index === activeIndex

        return (
          <button
            key={project.id ?? index}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onSelect(index)}
            className={`flex max-w-32 shrink-0 cursor-pointer items-center gap-1.5 rounded-t-md px-2.5 py-1.5 transition ${
              selected
                ? 'bg-neutral-50 text-neutral-900'
                : 'text-neutral-600 hover:bg-white/70 hover:text-neutral-900'
            }`}
          >
            <span
              aria-hidden="true"
              className={`size-1.5 shrink-0 rounded-full ${
                project.unsaved ? 'bg-amber-500' : selected ? 'bg-indigo-500' : 'bg-neutral-400'
              }`}
            />
            <span
              className={`font-opensans truncate text-[10px] ${selected ? 'font-bold' : 'font-semibold'}`}
            >
              {project.name || 'Untitled'}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ---------- Real project screenshots ----------
// One section at a time — paged forward by the round edge button. Its
// screenshots stack top to bottom and scroll normally within that section,
// same as a single tall page capture would.
function ProjectScreens({ section, sectionIndex, totalSections }) {
  return (
    <div className="web-ui-page-in">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-neutral-900/75 px-3 py-1.5 backdrop-blur">
        <p className="font-opensans truncate text-[9px] font-semibold tracking-wide text-white uppercase">
          {section.name || `Section ${sectionIndex + 1}`}
        </p>
        {totalSections > 1 ? (
          <span className="font-opensans shrink-0 text-[9px] text-white/70">
            {sectionIndex + 1}/{totalSections}
          </span>
        ) : null}
      </div>

      {section.images.map((image, imageIndex) => (
        <img key={imageIndex} src={image.url} alt="" className="block w-full" />
      ))}
    </div>
  )
}

// Shown while the real project list is still being fetched, instead of
// flashing the baked-in demo site and then swapping it out once data arrives.
function LoadingPane() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-2 px-8 py-16 text-center">
      <span aria-hidden="true" className="icon-[lucide--loader-circle] size-5 animate-spin text-neutral-300" />
      <p className="font-opensans text-[11px] text-neutral-400">Loading…</p>
    </div>
  )
}

function NoScreens() {
  return (
    <div className="web-ui-page-in flex min-h-full flex-col items-center justify-center gap-2 px-8 py-16 text-center">
      <span aria-hidden="true" className="icon-[lucide--image] size-6 text-neutral-300" />
      <p className="font-opensans text-[11px] text-neutral-400">No screenshots yet</p>
    </div>
  )
}

// No project published into this box yet.
function ComingSoon() {
  return (
    <div className="web-ui-page-in flex min-h-full flex-col items-center justify-center gap-3 px-8 py-16 text-center">
      <span aria-hidden="true" className="icon-[lucide--hammer] size-7 text-neutral-300" />
      <p className="font-cinzel text-sm font-extrabold tracking-tight text-neutral-700">More work, coming soon</p>
      <p className="font-opensans max-w-64 text-[11px] leading-relaxed text-neutral-400">
        This frame is reserved for the next site we ship. Check back after launch.
      </p>
    </div>
  )
}

// Swapped in for the baked-in demo site when the caller (the admin preview
// boxes) would rather show a plain prompt than a fake homepage rendered at
// admin-panel size — the demo's desktop-oriented layout reads as oversized
// and cramped at the smaller width those boxes render at.
function EmptyBox() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-2 px-8 py-16 text-center">
      <span aria-hidden="true" className="icon-[lucide--image] size-6 text-neutral-300" />
      <p className="font-opensans text-[11px] text-neutral-400">Nothing in this box yet</p>
      <p className="font-opensans text-[10px] text-neutral-300">
        Add a project above — its screenshots will preview here.
      </p>
    </div>
  )
}

// ---------- Browser chrome ----------
function BrowserChrome({ domain, path, loading = false }) {
  return (
    <div className="relative z-10 shrink-0 border-b border-neutral-200 bg-neutral-50">
      <div className="flex items-center gap-2 px-3 py-2">
        <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-red-400" />
        <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-yellow-400" />
        <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-green-500" />

        <span aria-hidden="true" className="ml-2 hidden items-center gap-1.5 text-neutral-400 sm:flex">
          <span className="icon-[lucide--chevron-left] size-3.5" />
          <span className="icon-[lucide--chevron-right] size-3.5" />
          <span className="icon-[lucide--rotate-cw] size-3" />
        </span>

        <span className="ml-1 flex min-w-0 flex-1 items-center gap-1.5 rounded-full bg-white px-2.5 py-1 ring-1 ring-neutral-200">
          {loading ? (
            <span aria-hidden="true" className="h-2.5 w-24 animate-pulse rounded-full bg-neutral-200" />
          ) : domain ? (
            <>
              <span aria-hidden="true" className="icon-[lucide--lock] size-2.5 shrink-0 text-neutral-400" />
              <span className="font-opensans truncate text-[10px] text-neutral-500">
                {domain}
                <span className="text-neutral-800">{path}</span>
              </span>
            </>
          ) : (
            <span className="font-opensans truncate text-[10px] text-neutral-400 italic">Nothing published yet</span>
          )}
        </span>

        <span aria-hidden="true" className="hidden shrink-0 items-center gap-1.5 text-neutral-400 sm:flex">
          <span className="icon-[lucide--share] size-3" />
          <span className="icon-[lucide--plus] size-3" />
        </span>
      </div>

      {/* Page-load bar, one sweep on first paint — skipped while actually
          loading, so it doesn't look finished before the data has arrived. */}
      {loading ? null : (
        <span
          aria-hidden="true"
          className="web-ui-progress absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-blue-500 to-violet-500"
        />
      )}
    </div>
  )
}

// Hints that the frame scrolls on its own; steps aside on hover so it never covers the page.
function ScrollHint() {
  return (
    <span
      aria-hidden="true"
      className="font-opensans pointer-events-none absolute bottom-2.5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-neutral-900/70 px-2 py-1 text-[8px] font-medium text-white opacity-100 backdrop-blur transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0"
    >
      <span className="icon-[lucide--chevrons-down] size-2.5 animate-bounce motion-reduce:animate-none" />
      Scroll the site
    </span>
  )
}
