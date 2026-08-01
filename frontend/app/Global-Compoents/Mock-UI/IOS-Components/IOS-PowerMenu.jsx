import React from 'react'
import './IOS-PowerMenu.css'

// Rows shown in the sheet. Power Off is the only one today — new rows (Wi-Fi,
// Airplane Mode, ...) slot in here later without touching the layout below.
const ACTIONS = [{ key: 'power-off', label: 'Power Off', icon: 'icon-[lucide--power]' }]

export default function IosPowerMenu({ onSelect, onClose }) {
  return (
    <div
      role="presentation"
      onClick={onClose}
      className="ios-sheet-backdrop-in absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-black/50 px-4 backdrop-blur-sm"
    >
      <div
        role="menu"
        onClick={(event) => event.stopPropagation()}
        className="ios-sheet-panel-in w-full overflow-hidden rounded-2xl bg-white/20 backdrop-blur-xl"
      >
        {ACTIONS.map((action) => (
          <button
            key={action.key}
            type="button"
            role="menuitem"
            onClick={() => onSelect(action.key)}
            className="flex w-full items-center justify-center gap-1.5 border-b border-white/15 py-2 last:border-b-0"
          >
            <span aria-hidden="true" className={`${action.icon} size-2 text-white`} />
            <span className="font-opensans text-[9px] font-medium text-white">{action.label}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="font-opensans ios-sheet-panel-in w-full rounded-2xl bg-white/20 py-2 text-[9px] font-semibold text-white backdrop-blur-xl"
      >
        Cancel
      </button>
    </div>
  )
}
