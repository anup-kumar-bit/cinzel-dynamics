import React from 'react'
import './Android-PowerMenu.css'

// Restart (iOS lacks this row) replays the boot animation; Emergency is display only.
const ACTIONS = [
  { key: 'power-off', label: 'Power off', icon: 'icon-[lucide--power]' },
  { key: 'restart', label: 'Restart', icon: 'icon-[lucide--rotate-ccw]' },
  // { key: 'emergency', label: 'Emergency', icon: 'icon-[lucide--siren]', muted: true },
]

export default function AndroidPowerMenu({ onSelect, onClose }) {
  return (
    <div
      role="presentation"
      onClick={onClose}
      className="android-menu-backdrop-in absolute inset-0 z-20 flex items-center justify-end bg-black/55 px-3 backdrop-blur-sm"
    >
      <div
        role="menu"
        onClick={(event) => event.stopPropagation()}
        className="android-menu-panel-in w-[62%] overflow-hidden rounded-2xl bg-[#1f1f23]/95 py-1 shadow-2xl ring-1 ring-white/10"
      >
        {ACTIONS.map((action) => (
          <button
            key={action.key}
            type="button"
            role="menuitem"
            onClick={() => onSelect(action.key)}
            className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 transition hover:bg-white/10"
          >
            <span
              aria-hidden="true"
              className={`${action.icon} size-2.5 shrink-0 ${action.muted ? 'text-red-400' : 'text-[#a8c7fa]'}`}
            />
            <span className="font-opensans text-[9px] font-medium text-white">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
