'use client'

import React, { useState } from 'react'

import AndroidAppInteraction from './Android-App-Interaction'
import AndroidDialer from './Android-Dialer'
import AndroidPowerMenu from './Android-PowerMenu'
import './Android-HomeScreen.css'

// Stand-in shots until real captures land — swap this for the object you receive.
const DEMO_APP_SCREENS = {
}

// Android fills the grid top down, so this array reads in the order it renders.
const HOME_APPS = [
]

const DOCK = [
  { icon: 'icon-[lucide--phone]', label: 'Phone', tone: 'android-tile-phone', action: 'dialer' },
  { icon: 'icon-[lucide--message-square]', label: 'Messages', tone: 'android-tile-messages' },
  { icon: 'icon-[logos--chrome]', label: 'Chrome', tone: 'android-tile-brand' },
  { icon: 'icon-[lucide--settings]', label: 'Settings', tone: 'android-tile-settings', action: 'power-menu' },
]

export default function AndroidHomeScreen({ className = '', onPowerOff, onRestart, apps = HOME_APPS }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dialerOpen, setDialerOpen] = useState(false)
  const [openApp, setOpenApp] = useState(null)

  const OPEN_HANDLERS = {
    'power-menu': () => setMenuOpen(true),
    dialer: () => setDialerOpen(true),
  }

  // Restart is the extra row this menu has over the iOS one — it replays the boot animation.
  const handleSelect = (key) => {
    if (key === 'power-off') onPowerOff?.()
    if (key === 'restart') onRestart?.()
    setMenuOpen(false)
  }

  const openFromTile = (app) => {
    const handler = OPEN_HANDLERS[app.action]
    if (handler) {
      handler()
      return
    }
    setOpenApp(app)
  }

  if (dialerOpen) {
    return (
      <div className={`absolute inset-0 ${className}`}>
        <AndroidDialer onClose={() => setDialerOpen(false)} />
      </div>
    )
  }

  if (openApp) {
    return (
      <div className={`absolute inset-0 ${className} `}>
        <AndroidAppInteraction
          title={openApp.label}
          images={openApp.screens ?? DEMO_APP_SCREENS}
          onClose={() => setOpenApp(null)}
        />
      </div>
    )
  }

  return (
    <div className={`android-home-wallpaper absolute inset-0 flex flex-col ${className}`}>
      <StatusBar />
      <Glance />

      <div className="mt-3 grid grid-cols-4 gap-x-2 gap-y-3 px-2.5">
        {apps.map((app) => (
          <AppTile key={app.label} app={app} onClick={() => openFromTile(app)} />
        ))}
      </div>

      <div className="mt-auto grid grid-cols-4 gap-x-2 px-2.5">
        {DOCK.map((app) => (
          <AppTile key={app.label} app={app} onClick={() => openFromTile(app)} showLabel={false} />
        ))}
      </div>

      <SearchBar />
      <NavBar />

      {menuOpen && <AndroidPowerMenu onSelect={handleSelect} onClose={() => setMenuOpen(false)} />}
    </div>
  )
}

// Android puts the clock on the left, the opposite of iOS.
function StatusBar() {
  return (
    <div className="flex h-[5%] shrink-0 items-center justify-between px-[7%] text-white">
      <span className="font-opensans text-[10px] leading-none font-bold">9:41</span>

      <span className="flex items-center gap-0.5">
        <span aria-hidden="true" className="icon-[lucide--signal] size-3" />
        <span aria-hidden="true" className="icon-[lucide--wifi] size-3" />
        <span aria-hidden="true" className="icon-[lucide--battery-full] size-2.5" />
      </span>
    </div>
  )
}

// The At a Glance line: type straight on the wallpaper, no card behind it.
function Glance() {
  return (
    <div className="px-4 pt-2 mb-2">
      <p className="font-opensans text-[15px] leading-none font-medium text-white drop-shadow">Tue, Aug 3</p>
      <p className="font-opensans mt-1.5 flex items-center gap-1 text-[9px] leading-none text-white/80 drop-shadow">
        <span aria-hidden="true" className="icon-[lucide--sun] size-2.5 text-amber-300" />
        Sunny · 24°
      </p>
    </div>
  )
}

function AppTile({ app, onClick, showLabel = true }) {
  return (
    <button type="button" onClick={onClick} className="flex cursor-pointer flex-col items-center gap-1">
      <span
        className={`flex aspect-square w-[90%] items-center justify-center overflow-hidden rounded-full shadow-sm transition active:scale-95 ${app.tone}`}
      >
        {/* Admin-uploaded icons arrive as data URLs at runtime, so this uses
            plain `<img>` rather than next/image — same precedent as *-App-Interaction.jsx. */}
        {app.iconSrc ? (
          <img src={app.iconSrc} alt="" className="size-full object-cover" />
        ) : (
          <span aria-hidden="true" className={`${app.icon} size-1/2 ${app.glyph ?? 'text-white'}`} />
        )}
      </span>

      {showLabel && (
        <span className="font-opensans max-w-full truncate text-[8px] leading-none text-white/90 drop-shadow">
          {app.label}
        </span>
      )}
    </button>
  )
}

// Pixel keeps the search bar under the favourites row, above the nav.
function SearchBar() {
  return (
    <div className="px-2.5 pt-2.5 mt-2">
      <div className="flex h-8 items-center gap-1.5 rounded-full bg-white/90 px-3 shadow-md backdrop-blur">
        <span aria-hidden="true" className="icon-[logos--google-icon] size-3 shrink-0" />
        <span className="font-opensans flex-1 text-[9px] leading-none text-neutral-500">Search</span>
        <span aria-hidden="true" className="icon-[lucide--mic] size-3 shrink-0 text-neutral-500" />
      </div>
    </div>
  )
}

function NavBar() {
  return (
    <div aria-hidden="true" className="flex h-7 mt-2 shrink-0 items-center justify-center gap-[18%] py-[3%] text-white/85">
      <span className="icon-[lucide--chevron-left] size-4" />
      <span className="icon-[lucide--circle] size-3" />
      <span className="icon-[lucide--square] size-3" />
    </div>
  )
}
