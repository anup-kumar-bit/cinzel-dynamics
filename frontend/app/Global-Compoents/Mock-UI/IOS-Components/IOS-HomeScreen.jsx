'use client'

import Image from 'next/image'
import React, { useState } from 'react'

import IosDialer from './IOS-Dialer'
import IosPowerMenu from './IOS-PowerMenu'
import './IOS-HomeScreen.css'


const DOCK = [
  { icon: 'icon-[ion--call]', label: 'Phone', tone: 'ios-tile-phone', action: 'dialer' },
  { image: '/images/safari-ios.png', label: 'Safari' },
  { image: '/images/gallary-ios.png', label: 'Photos' },
  { image: '/images/setting.png', label: 'Settings', action: 'power-menu' },
]

export default function IosHomeScreen({ className = '', onPowerOff }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dialerOpen, setDialerOpen] = useState(false)

  const OPEN_HANDLERS = {
    'power-menu': () => setMenuOpen(true),
    dialer: () => setDialerOpen(true),
  }

  // Only 'power-off' does anything today — new rows added to IosPowerMenu's
  // ACTIONS list later just add cases here.
  const handleSelect = (key) => {
    if (key === 'power-off') onPowerOff?.()
    setMenuOpen(false)
  }

  if (dialerOpen) {
    return (
      <div className={`absolute inset-0 ${className}`}>
        <IosDialer onClose={() => setDialerOpen(false)} />
      </div>
    )
  }

  return (
    <div className={`ios-home-wallpaper absolute inset-0 flex flex-col ${className}`}>
      <StatusBar />

      <div className="grid grid-cols-2 gap-2.5 px-3 pt-1">
        <WeatherWidget />
        <MapWidget />
      </div>

      {/* Search pill */}
      <div className="mt-auto flex justify-center pb-2">
        <span className="flex items-center gap-1 rounded-full bg-black/25 px-2 py-0.5 backdrop-blur-sm">
          <span aria-hidden="true" className="icon-[lucide--search] size-1.5 text-white/90" />
          <span className="font-opensans text-[9px] leading-none text-white/90">Search</span>
        </span>
      </div>

      {/* Dock */}
      <div className="px-3 pb-[7%]">
        <div className="grid grid-cols-4 gap-2.5 rounded-2xl bg-white/15 p-2 backdrop-blur-md">
          {DOCK.map((app) => (
            <AppTile
              key={app.label}
              icon={app.icon}
              image={app.image}
              label={app.label}
              tone={app.tone}
              glyph={app.glyph}
              onClick={OPEN_HANDLERS[app.action]}
            />
          ))}
        </div>
      </div>

      {/* Gesture bar */}
      <span className="absolute bottom-[1%] left-1/2 h-[0.55%] w-[36%] -translate-x-1/2 rounded-full bg-white/80" />

      {menuOpen && <IosPowerMenu onSelect={handleSelect} onClose={() => setMenuOpen(false)} />}
    </div>
  )
}

function StatusBar() {
  return (
    <div className="flex h-[6%] shrink-0 items-center justify-between px-[9%] text-white">
      <span className="font-opensans text-[10px] leading-none font-bold">9:41</span>

      <span className="flex items-center gap-0.5">
        <span aria-hidden="true" className="icon-[lucide--signal] size-3" />
        <span aria-hidden="true" className="icon-[lucide--wifi] size-3" />
        <span aria-hidden="true" className="icon-[lucide--battery-full] size-2.5" />
      </span>
    </div>
  )
}

function WeatherWidget() {
  return (
    <div className="ios-home-weather flex aspect-square flex-col justify-between rounded-2xl p-2 text-white shadow-lg">
      <div>
        <p className="font-opensans text-[9px] leading-none font-semibold">Tiburon</p>
        <p className="font-opensans mt-1 text-[20px] leading-none font-light">59°</p>
      </div>

      <div>
        <span aria-hidden="true" className="icon-[lucide--sun] size-2 text-amber-300" />
        <p className="font-opensans mt-0.5 text-[9px] leading-none font-medium">Sunny</p>
        <p className="font-opensans mt-1 text-[8px] leading-none text-white/75">H:70° L:54°</p>
      </div>
    </div>
  )
}

function MapWidget() {
  return (
    <div className="ios-home-map relative aspect-square overflow-hidden rounded-2xl shadow-lg">
      <svg viewBox="0 0 100 100" className="size-full" aria-hidden="true">
        {/* Park block, then the road network over it */}
        <path d="M0,58 L44,52 L58,100 L0,100 Z" fill="#cfe3bd" />

        <g stroke="#ffffff" strokeLinecap="round" fill="none">
          <path d="M-4,44 L104,32" strokeWidth="9" />
          <path d="M-4,78 L104,70" strokeWidth="6" />
          <path d="M30,-4 L44,104" strokeWidth="6" />
          <path d="M76,-4 L84,104" strokeWidth="5" />
        </g>

        <g stroke="#dcd6c9" strokeWidth="1.5" fill="none">
          <path d="M0,20 L100,10" />
          <path d="M58,-4 L64,104" />
        </g>
      </svg>

      {/* Current-location avatar */}
      <span className="absolute left-[52%] top-[34%] size-5 -translate-x-1/2 rounded-full border-2 border-white bg-linear-to-br from-amber-200 to-rose-300 shadow-md" />

      <div className="absolute inset-x-0 bottom-0 bg-white/85 px-1.5 py-1 backdrop-blur-sm">
        <p className="font-opensans text-[8px] leading-none font-bold text-neutral-800">Paradise Dr</p>
        <p className="font-opensans mt-0.5 text-[7px] leading-none text-neutral-500">Tiburon</p>
      </div>
    </div>
  )
}

function AppTile({ icon, image, label, tone = '', glyph = 'text-white', onClick }) {
  const Tag = onClick ? 'button' : 'span'
  const tagProps = onClick ? { type: 'button', onClick } : {}
  const interactive = onClick ? 'cursor-pointer transition hover:brightness-110 active:scale-95' : ''

  if (image) {
    return (
      <Tag
        {...tagProps}
        className={`relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[28%] shadow-sm ${tone} ${interactive}`}
      >
        <Image src={image} alt={label} fill sizes="48px" className={tone ? 'object-contain p-[8%]' : 'object-contain'} />
      </Tag>
    )
  }

  return (
    <Tag
      {...tagProps}
      className={`flex aspect-square w-full items-center justify-center rounded-[28%] shadow-sm ${tone} ${interactive}`}
    >
      <span aria-hidden="true" className={`${icon} size-3/5 ${glyph}`} />
    </Tag>
  )
}
