'use client'

import React, { useEffect, useLayoutEffect, useState } from 'react'

import AndroidHomeScreen from './Android-Components/Android-HomeScreen'
import './Android-UI.css'

const AUTO_BOOT_MS = 5000
const BOOT_MS = 3200
const BOOTED_KEY = 'android-mock-booted'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function AndroidUi({ className = 'w-56' }) {
  const [phase, setPhase] = useState('off')

  useIsomorphicLayoutEffect(() => {
    try {
      if (localStorage.getItem(BOOTED_KEY)) setPhase('ready')
    } catch {
    }
  }, [])

  useEffect(() => {
    if (phase !== 'off') return

    const timer = setTimeout(() => setPhase('booting'), AUTO_BOOT_MS)
    return () => clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'booting') return

    const timer = setTimeout(() => setPhase('ready'), BOOT_MS)
    return () => clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'ready') return

    try {
      localStorage.setItem(BOOTED_KEY, '1')
    } catch {
    }
  }, [phase])

  const handlePowerOff = () => {
    setPhase('off')
    try {
      localStorage.removeItem(BOOTED_KEY)
    } catch {
    }
  }

  // Restart replays the boot animation — the one thing this shell offers that iOS doesn't.
  const handleRestart = () => setPhase('booting')

  return (
    <div className={`relative aspect-9/20 ${className}`}>
      {/* Volume rocker and power, both on the right the way Android ships */}
      <span className="absolute top-[17%] -right-px h-[7%] w-1 rounded-r-sm bg-neutral-600" />
      <span className="absolute top-[27%] -right-px h-[5%] w-1 rounded-r-sm bg-neutral-500" />

      <div className="relative h-full rounded-[11%/5%] bg-linear-to-b from-neutral-600 via-neutral-900 to-neutral-700 p-[2.2%] shadow-2xl">
        <div className="relative h-full overflow-hidden rounded-[10%/4.6%] bg-black">
          {phase === 'ready' ? (
            <AndroidHomeScreen className="android-wake-in" onPowerOff={handlePowerOff} onRestart={handleRestart} />
          ) : (
            <BootScreen booting={phase === 'booting'} onBoot={() => setPhase('booting')} />
          )}

          {/* Punch-hole camera — hardware, so it sits above both layers */}
          <span className="absolute top-[1.5%] left-1/2 w-[3.4%] -translate-x-1/2 aspect-square rounded-full bg-black ring-1 ring-neutral-700" />
        </div>
      </div>
    </div>
  )
}

function BootScreen({ booting, onBoot }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
      <div className="android-logo-in aspect-square w-[24%]">
        <span aria-hidden="true" className="icon-[simple-icons--android] size-full text-[#3ddc84]" />
      </div>

      {booting ? (
        <>
          <div className="absolute bottom-[15%] left-1/2 h-1 w-[38%] -translate-x-1/2 overflow-hidden rounded-full bg-white/20">
            <div
              className="android-fill h-full w-full origin-left rounded-full bg-[#3ddc84]"
              style={{ animationDuration: `${BOOT_MS}ms` }}
            />
          </div>

          <span
            role="status"
            className="font-opensans absolute bottom-[8%] text-[8px] font-medium tracking-wide text-white/70"
          >
            Starting Android…
          </span>
        </>
      ) : (
        <button
          type="button"
          onClick={onBoot}
          className="font-opensans mt-[7%] cursor-pointer rounded-full bg-[#3ddc84] px-3 py-1.5 text-[9px] font-semibold text-neutral-900 shadow-lg transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Boot Android
        </button>
      )}
    </div>
  )
}
