'use client'

import React, { useMemo, useState } from 'react'

import './Android-App-Interaction.css'

const ENTRANCE = {
  in: 'android-app-shot-in',
  up: 'android-app-shot-up',
  left: 'android-app-shot-left',
}

// Same shape as the iOS walkthrough: { 'Screen 1': [url, url], ... }; plain <img> since URLs arrive at runtime.
export default function AndroidAppInteraction({ images = {}, title = 'App', onClose }) {
  const screens = useMemo(
    () => Object.entries(images).filter(([, shots]) => Array.isArray(shots) && shots.length > 0),
    [images],
  )

  const [screenIndex, setScreenIndex] = useState(0)
  const [shotIndex, setShotIndex] = useState(0)
  const [entrance, setEntrance] = useState('in')

  const [screenName, shots] = screens[screenIndex] ?? ['', []]
  const hasNextShot = shotIndex < shots.length - 1
  const hasNextScreen = screenIndex < screens.length - 1

  const showNextShot = () => {
    setEntrance('up')
    setShotIndex((index) => index + 1)
  }

  const showNextScreen = () => {
    setEntrance('left')
    setScreenIndex((index) => index + 1)
    setShotIndex(0)
  }

  const restart = () => {
    setEntrance('in')
    setScreenIndex(0)
    setShotIndex(0)
  }

  if (screens.length === 0) {
    return (
      <div className="android-wake-in absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#1f1f23] px-6 text-center">
        <span aria-hidden="true" className="icon-[lucide--image-off] size-6 text-white/40" />
        <p className="font-opensans text-[10px] text-white/60">No screens passed to {title}.</p>
        <NavBar onClose={onClose} />
      </div>
    )
  }

  return (
    <div className="android-wake-in absolute inset-0 overflow-hidden bg-black">
      {/* Keyed on the pair so React swaps the element and replays the entrance */}
      <img
        key={`${screenIndex}-${shotIndex}`}
        src={shots[shotIndex]}
        alt={`${title} — ${screenName}, view ${shotIndex + 1} of ${shots.length}`}
        decoding="async"
        className={`absolute inset-0 size-full object-cover object-top ${ENTRANCE[entrance]}`}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[18%] bg-linear-to-b from-black/65 via-black/25 to-transparent"
      />

      <div className="absolute inset-x-0 top-0 flex h-[5%] items-center justify-between px-[7%] text-white">
        <span className="font-opensans text-[10px] leading-none font-bold">9:41</span>

        <span className="flex items-center gap-0.5">
          <span aria-hidden="true" className="icon-[lucide--signal] size-3" />
          <span aria-hidden="true" className="icon-[lucide--wifi] size-3" />
          <span aria-hidden="true" className="icon-[lucide--battery-full] size-2.5" />
        </span>
      </div>

      {/* Material top app bar: back arrow, then the title beside it */}
      <div className="absolute inset-x-0 top-[6%] flex items-center gap-1.5 px-[4%]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Back to Home Screen"
          className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition active:opacity-60"
        >
          <span aria-hidden="true" className="icon-[lucide--arrow-left] size-4" />
        </button>

        <span className="font-opensans truncate text-[11px] font-medium text-white drop-shadow">{title}</span>

        <span className="font-opensans ml-auto flex h-7 items-center rounded-full bg-black/40 px-2.5 text-[9px] leading-none text-white/85 backdrop-blur">
          {screenName} · {screenIndex + 1}/{screens.length}
        </span>
      </div>

      {shots.length > 1 && (
        <div aria-hidden="true" className="absolute top-1/2 left-[3%] flex -translate-y-1/2 flex-col gap-1">
          {shots.map((shot, index) => (
            <span
              key={`${shot}-${index}`}
              className={`size-1 rounded-full transition-colors ${index === shotIndex ? 'bg-white' : 'bg-white/40'}`}
            />
          ))}
        </div>
      )}

      {hasNextScreen && (
        <RoundButton
          onClick={showNextScreen}
          label={`Next screen: ${screens[screenIndex + 1][0]}`}
          icon="icon-[lucide--chevron-right]"
          className="top-1/2 right-[4%] -translate-y-1/2"
        />
      )}

      {/* Lifted clear of the nav bar rather than centred on the frame */}
      {hasNextShot && (
        <RoundButton
          onClick={showNextShot}
          label="Scroll down"
          icon="icon-[lucide--chevron-down]"
          iconClassName="android-app-nudge"
          className="bottom-[13%] left-1/2 -translate-x-1/2"
        />
      )}

      {!hasNextShot && !hasNextScreen && (
        <RoundButton
          onClick={restart}
          label="Start over"
          icon="icon-[lucide--rotate-ccw]"
          className="bottom-[13%] left-1/2 -translate-x-1/2"
        />
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[16%] bg-linear-to-t from-black/70 to-transparent"
      />

      <NavBar onClose={onClose} />
    </div>
  )
}

// Material's FAB shape rather than iOS's translucent disc.
function RoundButton({ onClick, label, icon, className = '', iconClassName = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute flex aspect-square w-[13%] cursor-pointer items-center justify-center rounded-2xl bg-[#a8c7fa] text-[#0b2b62] shadow-lg transition hover:brightness-105 active:scale-95 ${className}`}
    >
      <span aria-hidden="true" className={`${icon} size-1/2 ${iconClassName}`} />
    </button>
  )
}

// Back and home both leave the app, which is what they do on a real handset.
function NavBar({ onClose }) {
  return (
    <div className="absolute inset-x-0 bottom-0 flex h-7 items-center justify-center gap-[18%] py-[3%] text-white/85">
      <button
        type="button"
        onClick={onClose}
        aria-label="Back to Home Screen"
        className="cursor-pointer transition active:opacity-60"
      >
        <span aria-hidden="true" className="icon-[lucide--chevron-left] size-3" />
      </button>

      <button type="button" onClick={onClose} aria-label="Home" className="cursor-pointer transition active:opacity-60">
        <span aria-hidden="true" className="icon-[lucide--circle] size-3" />
      </button>

      <span aria-hidden="true" className="icon-[lucide--square] size-2.5" />
    </div>
  )
}
