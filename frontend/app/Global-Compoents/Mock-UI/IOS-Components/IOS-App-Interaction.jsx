'use client'

import React, { useMemo, useState } from 'react'

import './IOS-App-Interaction.css'

// Which animation the incoming shot plays, keyed by how it was reached.
const ENTRANCE = {
  in: 'ios-app-shot-in',
  up: 'ios-app-shot-up',
  left: 'ios-app-shot-left',
}

// `images` is { 'Screen 1': [url, url], ... }; plain <img> since URLs arrive at runtime.
export default function IOSAppInteraction({ images = {}, title = 'App', onClose }) {
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
      <div className="ios-wake-in absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-900 px-6 text-center">
        <span aria-hidden="true" className="icon-[lucide--image-off] size-6 text-white/40" />
        <p className="font-opensans text-[10px] text-white/60">No screens passed to {title}.</p>
        <GestureBar onClose={onClose} />
      </div>
    )
  }

  return (
    <div className="ios-wake-in absolute inset-0 overflow-hidden bg-black">
      {/* Keyed on the pair so React swaps the element and replays the entrance. */}
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

      <div className="absolute inset-x-0 top-0 flex h-[6%] items-center justify-between px-[9%] text-white">
        <span className="font-opensans text-[10px] leading-none font-bold">9:41</span>

        <span className="flex items-center gap-0.5">
          <span aria-hidden="true" className="icon-[lucide--signal] size-3" />
          <span aria-hidden="true" className="icon-[lucide--wifi] size-3" />
          <span aria-hidden="true" className="icon-[lucide--battery-full] size-2.5" />
        </span>
      </div>

      <div className="absolute inset-x-0 top-[7%] flex items-center gap-1.5 px-[4%]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Back to Home Screen"
          className="flex cursor-pointer items-center gap-0.5 rounded-full bg-black/35 py-1 pr-2 pl-1 text-white backdrop-blur transition active:opacity-60"
        >
          <span aria-hidden="true" className="icon-[lucide--chevron-left] size-3" />
          <span className="font-opensans text-[9px] leading-none font-medium">{title}</span>
        </button>

        <span className="font-opensans ml-auto rounded-full bg-black/35 px-2 py-1 text-[8px] leading-none text-white/85 backdrop-blur">
          {screenName} · {screenIndex + 1}/{screens.length}
        </span>
      </div>

      {/* Kept on the left so it never collides with the next-screen control opposite it. */}
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

      {hasNextShot && (
        <RoundButton
          onClick={showNextShot}
          label="Scroll down"
          icon="icon-[lucide--chevron-down]"
          iconClassName="ios-app-nudge"
          className="bottom-[7%] left-1/2 -translate-x-1/2"
        />
      )}

      {/* Nothing left to show — offer the way back rather than parking on the last frame. */}
      {!hasNextShot && !hasNextScreen && (
        <RoundButton
          onClick={restart}
          label="Start over"
          icon="icon-[lucide--rotate-ccw]"
          className="bottom-[7%] left-1/2 -translate-x-1/2"
        />
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[14%] bg-linear-to-t from-black/55 to-transparent"
      />

      <GestureBar onClose={onClose} />
    </div>
  )
}

function RoundButton({ onClick, label, icon, className = '', iconClassName = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute flex aspect-square w-[13%] cursor-pointer items-center justify-center rounded-full bg-white/85 text-neutral-900 shadow-lg backdrop-blur transition hover:bg-white active:scale-95 ${className}`}
    >
      <span aria-hidden="true" className={`${icon} size-1/2 ${iconClassName}`} />
    </button>
  )
}

// Tap to go home, standing in for swipe-up — same as the dialer.
function GestureBar({ onClose }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Back to Home Screen"
      className="absolute bottom-[1%] left-1/2 h-[0.55%] w-[36%] -translate-x-1/2 cursor-pointer rounded-full bg-white/80"
    />
  )
}
