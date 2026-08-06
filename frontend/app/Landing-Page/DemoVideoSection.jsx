'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

const VIDEO_SRC = '/video/Demostation.mp4'

const HIGHLIGHTS = [
  { title: 'Ships in weeks', copy: 'Production-ready builds, not endless prototypes.' },
  { title: 'Built to scale', copy: 'Typed APIs, queues and caching from day one.' },
  { title: 'Fully observable', copy: 'Logs, metrics and alerts wired in before launch.' },
]

// -------** DemoVideoSection **---------
export default function DemoVideoSection() {
  return (
    <section id="demo" className="relative isolate overflow-hidden px-4 py-16 sm:px-8 sm:py-20 lg:px-16">
      <DemoBackdrop />

      <div className="container relative mx-auto flex flex-col items-center text-center">

        <h2 className="font-cinzel mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-base-content sm:text-5xl">
          See the whole thing in action.
        </h2>

        <p className="font-opensans mt-5 max-w-xl text-sm text-base-content/60 sm:text-base">
          A two-minute walkthrough of a platform we designed, built and shipped — from the dashboard down to the APIs
          powering it.
        </p>
      </div>

      <LaptopPlayer />

      <div className="container relative mx-auto mt-5 grid max-w-5xl gap-6 sm:grid-cols-3">
        {HIGHLIGHTS.map((item) => (
          <HighlightCard key={item.title} title={item.title} copy={item.copy} />
        ))}
      </div>
    </section>
  )
}

// `hover-3d` wants the tilting face first, then eight empty hover-zone children for the tilt grid.
const TILT_ZONES = [0, 1, 2, 3, 4, 5, 6, 7]

function HighlightCard({ title, copy }) {
  return (
    <div className="hover-3d group w-full">
      <div className="overflow-hidden rounded-2xl shadow-sm">
        <div className="h-full bg-white p-6 text-center transition-colors duration-300 group-hover:bg-gray-50 sm:text-left dark:bg-base-200 dark:group-hover:bg-base-300">
          <h3 className="font-opensans text-sm font-bold tracking-wide text-base-content uppercase">{title}</h3>
          <p className="font-opensans mt-2 text-sm text-base-content/55">{copy}</p>
        </div>
      </div>

      {TILT_ZONES.map((zone) => (
        <div key={zone} aria-hidden="true" />
      ))}
    </div>
  )
}

// ---------- Decorative backdrop: green discs + dot matrices ----------
function DemoBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute top-[8%] left-[4%] size-88 rounded-full bg-emerald-400/22 blur-3xl sm:size-120 dark:bg-emerald-500/14" />
      <div className="absolute right-[3%] bottom-[10%] size-88 rounded-full bg-green-400/20 blur-3xl sm:size-120 dark:bg-green-500/12" />
      <div className="absolute top-[34%] left-1/2 size-112 -translate-x-1/2 rounded-full bg-teal-300/18 blur-3xl dark:bg-teal-500/10" />
      <div className="absolute top-[6%] right-[24%] size-72 rounded-full bg-lime-300/18 blur-3xl dark:bg-lime-500/8" />

      <div className="dot-grid absolute top-[14%] right-[5%] hidden size-28 text-emerald-500/45 sm:block dark:text-emerald-400/25" />
      <div className="dot-grid absolute bottom-[14%] left-[4%] hidden size-28 text-green-600/40 sm:block dark:text-green-400/25" />
    </div>
  )
}

// ---------- Player framed as a laptop ----------
function LaptopPlayer() {
  const videoRef = useRef(null)
  const frameRef = useRef(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) video.play().catch(() => {})
    else video.pause()
  }, [])

  const seek = useCallback((event) => {
    const video = videoRef.current
    if (!video || !video.duration) return
    video.currentTime = (Number(event.target.value) / 100) * video.duration
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen()
    else frameRef.current?.requestFullscreen?.().catch(() => {})
  }, [])

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = true
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.4 },
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative mt-16 flex justify-center">
      <div className="w-full max-w-5xl xl:max-w-6xl">
        {/* Lid: dark bezel wrapping the screen */}
        <div className="relative rounded-t-2xl border border-slate-700/50 bg-slate-900 p-2.5 shadow-2xl shadow-emerald-900/20 sm:rounded-t-3xl sm:p-4">
          {/* Camera */}
          <div className="absolute inset-x-0 top-1.25 flex justify-center sm:top-1.5">
            <span className="size-1 rounded-full bg-slate-600 ring-2 ring-slate-800 sm:size-1.5" />
          </div>

          <div ref={frameRef} className="group relative overflow-hidden rounded-lg bg-black sm:rounded-xl">
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              className="aspect-video h-auto w-full object-cover"
              muted
              loop
              playsInline
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
              onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
            />

            {/* Click-anywhere play target; sits under the controls bar */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause demo video' : 'Play demo video'}
              className="absolute inset-0 z-10 flex items-center justify-center focus:outline-none"
            >
              <span
                className={`flex size-20 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white shadow-lg backdrop-blur-md transition duration-300 sm:size-24 ${
                  isPlaying ? 'scale-90 opacity-0' : 'scale-100 opacity-100 hover:scale-105 hover:bg-white/25'
                }`}
              >
                <PlayIcon className="size-8 sm:size-9" />
              </span>
            </button>

            {/* Controls bar — always visible while paused, on hover/focus while playing */}
            <div
              className={`absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-slate-950/85 via-slate-950/45 to-transparent px-4 pt-10 pb-4 transition-opacity duration-300 sm:px-6 ${
                isPlaying ? 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100' : 'opacity-100'
              }`}
            >
              {/* Native range on top of a painted track: keeps drag + keyboard seeking */}
              <div className="relative h-1.5 w-full rounded-full bg-white/25">
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-emerald-400"
                  style={{ width: `${progress}%` }}
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={0.1}
                  value={progress}
                  onChange={seek}
                  aria-label="Seek video"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </div>

              <div className="mt-3 flex items-center gap-3 text-white sm:gap-4">
                <ControlButton onClick={togglePlay} label={isPlaying ? 'Pause' : 'Play'}>
                  {isPlaying ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
                </ControlButton>

                <span className="font-opensans text-xs text-white/80 tabular-nums">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                <ControlButton onClick={toggleFullscreen} label="Fullscreen" className="ml-auto">
                  <ExpandIcon className="size-4" />
                </ControlButton>
              </div>
            </div>

            {/* Glass sheen across the panel */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-linear-to-tr from-transparent via-white/6 to-white/12"
            />
          </div>
        </div>

        {/* Base: a touch wider than the lid, with the notch */}
        <div className="relative left-1/2 w-[104%] -translate-x-1/2">
          <div className="flex h-4 items-start justify-center rounded-b-lg bg-linear-to-b from-slate-300 to-slate-400 shadow-lg shadow-emerald-900/15 sm:h-5 sm:rounded-b-xl dark:from-slate-600 dark:to-slate-700">
            <span className="h-1 w-20 rounded-b-full bg-slate-400/80 sm:w-28 dark:bg-slate-800/70" />
          </div>
          <div className="mx-auto h-1 w-[92%] rounded-b-full bg-slate-400/40 blur-[1px] dark:bg-slate-700/40" />
        </div>

        {/* Reflection under the machine */}
        <div
          aria-hidden="true"
          className="mx-auto mt-2 h-20 w-[78%] rounded-[50%] bg-emerald-900/12 blur-2xl dark:bg-emerald-500/12"
        />
      </div>
    </div>
  )
}

function ControlButton({ onClick, label, className = '', children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex size-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none ${className}`}
    >
      {children}
    </button>
  )
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00'
  const whole = Math.floor(seconds)
  const mins = Math.floor(whole / 60)
  const secs = String(whole % 60).padStart(2, '0')
  return `${mins}:${secs}`
}

// Nudged right of centre — a geometrically centred play triangle reads as too far left.
function PlayIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M6 5.14v13.72a1 1 0 0 0 1.52.85l11.14-6.86a1 1 0 0 0 0-1.7L7.52 4.29A1 1 0 0 0 6 5.14Z" />
    </svg>
  )
}

function PauseIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M7 4h3v16H7zM14 4h3v16h-3z" />
    </svg>
  )
}

function ExpandIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />
    </svg>
  )
}
