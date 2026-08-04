import React from 'react'

// Same placeholder convention as the iOS dialer — 555 numbers are reserved for
// fictional use. Swap in the real business number here.
const DISPLAY_NUMBER = '(555) 010-2026'
const TEL_HREF = 'tel:+15550102026'

const KEYS = [
  { digit: '1', sub: '' },
  { digit: '2', sub: 'ABC' },
  { digit: '3', sub: 'DEF' },
  { digit: '4', sub: 'GHI' },
  { digit: '5', sub: 'JKL' },
  { digit: '6', sub: 'MNO' },
  { digit: '7', sub: 'PQRS' },
  { digit: '8', sub: 'TUV' },
  { digit: '9', sub: 'WXYZ' },
  { digit: '*', sub: '' },
  { digit: '0', sub: '+' },
  { digit: '#', sub: '' },
]

export default function AndroidDialer({ onClose }) {
  return (
    <div className="android-wake-in absolute inset-0 flex flex-col bg-[#f8f9fa]">
      <div className="flex h-[5%] shrink-0 items-center justify-between px-[7%] text-neutral-800">
        <span className="font-opensans text-[10px] leading-none font-bold">9:41</span>

        <span className="flex items-center gap-0.5">
          <span aria-hidden="true" className="icon-[lucide--signal] size-3" />
          <span aria-hidden="true" className="icon-[lucide--wifi] size-3" />
          <span aria-hidden="true" className="icon-[lucide--battery-full] size-2.5" />
        </span>
      </div>

      <div className="px-[4%] pt-[2%]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Back to Home Screen"
          className="flex size-7 cursor-pointer items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-200 active:opacity-60"
        >
          <span aria-hidden="true" className="icon-[lucide--arrow-left] size-4" />
        </button>
      </div>

      <p className="font-opensans mt-[5%] text-center text-[16px] font-normal tracking-wide text-neutral-900">
        {DISPLAY_NUMBER}
      </p>

      {/* Decorative, like the iOS keypad: this dialer only ever calls the one
          number above, so the keys carry no handlers. */}
      <div className="mt-auto grid grid-cols-3 gap-y-2 px-[10%] pb-3">
        {KEYS.map((key) => (
          <span
            key={key.digit}
            className="mx-auto flex aspect-square w-[70%] cursor-default flex-col items-center justify-center rounded-full text-neutral-900 transition hover:bg-neutral-200/70"
          >
            <span className="font-opensans text-[14px] leading-none">{key.digit}</span>
            {key.sub && (
              <span className="font-opensans mt-0.5 text-[8px] leading-none tracking-[0.12em] text-neutral-500">
                {key.sub}
              </span>
            )}
          </span>
        ))}
      </div>

      <a
        href={TEL_HREF}
        aria-label={`Call ${DISPLAY_NUMBER}`}
        className="mx-auto flex aspect-square w-[16%] cursor-pointer items-center justify-center rounded-full bg-[#34a853] text-white shadow-lg transition hover:brightness-110 active:scale-95"
      >
        <span aria-hidden="true" className="icon-[lucide--phone] size-1/2" />
      </a>

      <div className="mt-[4%] flex h-7 shrink-0 items-center justify-center gap-[18%] py-[3%] text-neutral-500">
        <button
          type="button"
          onClick={onClose}
          aria-label="Back to Home Screen"
          className="cursor-pointer transition active:opacity-60"
        >
          <span aria-hidden="true" className="icon-[lucide--chevron-left] size-3" />
        </button>

        <button
          type="button"
          onClick={onClose}
          aria-label="Home"
          className="cursor-pointer transition active:opacity-60"
        >
          <span aria-hidden="true" className="icon-[lucide--circle] size-3" />
        </button>

        <span aria-hidden="true" className="icon-[lucide--square] size-2.5" />
      </div>
    </div>
  )
}
