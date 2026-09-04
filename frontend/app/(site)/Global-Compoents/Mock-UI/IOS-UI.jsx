'use client'

import React, { useEffect, useLayoutEffect, useState } from 'react'

import IosHomeScreen from './IOS-Components/IOS-HomeScreen'
import './IOS-UI.css'


const AUTO_BOOT_MS = 5000
const BOOT_MS = 3200
const BOOTED_KEY = 'ios-mock-booted'


const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function IosUi({ className = 'w-56', apps }) {
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

  // Forgets the boot flag too, so a refresh shows the boot screen again, not 'ready'.
  const handlePowerOff = () => {
    setPhase('off')
    try {
      localStorage.removeItem(BOOTED_KEY)
    } catch {
    }
  }

  return (
    <div className={`relative aspect-9/19.5 ${className}`}>
      {/* Action button and volume rocker (left), power (right) */}
      <span className="absolute -left-px top-[14%] h-[3%] w-1 rounded-l-sm bg-neutral-600" />
      <span className="absolute -left-px top-[20%] h-[6%] w-1 rounded-l-sm bg-neutral-600" />
      <span className="absolute -left-px top-[28%] h-[6%] w-1 rounded-l-sm bg-neutral-600" />
      <span className="absolute -right-px top-[24%] h-[9%] w-1 rounded-r-sm bg-neutral-600" />

      <div className="relative h-full rounded-[14%/6.5%] bg-linear-to-b from-neutral-500 via-neutral-800 to-neutral-600 p-[2.6%] shadow-2xl">
        <div className="relative h-full overflow-hidden rounded-[12%/5.6%] bg-black">
          {phase === 'ready' ? (
            <IosHomeScreen className="ios-wake-in" onPowerOff={handlePowerOff} apps={apps} />
          ) : (
            <BootScreen booting={phase === 'booting'} onBoot={() => setPhase('booting')} />
          )}

          {/* Dynamic Island sits above both layers — it is hardware, not UI */}
          <span className="absolute left-1/2 top-[1.4%] h-[4.2%] w-[32%] -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>
    </div>
  )
}

// ---------- Powered off / booting ----------
function BootScreen({ booting, onBoot }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
      <div className="ios-logo-in aspect-square w-[22%]">
        <span aria-hidden="true" className="icon-[simple-icons--apple] size-full text-white" />
      </div>

      {booting ? (
        <>
          <div className="absolute bottom-[15%] left-1/2 h-1 w-[38%] -translate-x-1/2 overflow-hidden rounded-full bg-white/20">
            {/* Duration matches the phase-change constant so the bar fills exactly on time. */}
            <div
              className="ios-fill h-full w-full origin-left rounded-full bg-white"
              style={{ animationDuration: `${BOOT_MS}ms` }}
            />
          </div>

          <span
            role="status"
            className="font-opensans absolute bottom-[8%] text-[8px] font-medium tracking-wide text-white/70"
          >
            Booting…
          </span>
        </>
      ) : (
        <button
          type="button"
          onClick={onBoot}
          className="font-opensans mt-[7%] cursor-pointer rounded-full bg-white px-3 py-1.5 text-[9px] font-semibold text-neutral-900 shadow-lg transition hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Boot iOS
        </button>
      )}
    </div>
  )
}
