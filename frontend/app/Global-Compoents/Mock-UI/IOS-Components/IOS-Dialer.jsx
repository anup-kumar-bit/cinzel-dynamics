import React from 'react'

// Swap in the real business number here — this is a placeholder (555 numbers
// are reserved for fictional use, same convention movies use).
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

export default function IosDialer({ onClose }) {
  return (
    <div className="ios-wake-in absolute inset-0 flex flex-col bg-white">
      <div className="flex h-[6%] shrink-0 items-center justify-between px-[9%] text-neutral-900">
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
          className="flex cursor-pointer mt-2 items-center gap-0.5 text-[#007aff] transition active:opacity-60"
        >
          <span aria-hidden="true" className="icon-[lucide--chevron-left] size-3" />
          <span className="font-opensans text-[14px] leading-none">Back</span>
        </button>
      </div>

      <p className="font-opensans mt-[6%] text-center text-[16px] font-light tracking-wide text-neutral-900">
        {DISPLAY_NUMBER}
      </p>

      {/* Decorative only — real iOS lets you edit the number here, but this
          dialer always calls the one number above, so the keys don't need to
          do anything. */}
      <div className="mt-auto grid grid-cols-3 gap-3 px-[8%] pb-3">
        {KEYS.map((key) => (
          <span
            key={key.digit}
            className="flex aspect-square cursor-default flex-col items-center justify-center rounded-full bg-neutral-100 text-neutral-900"
          >
            <span className="font-opensans text-[13px] leading-none">{key.digit}</span>
            {key.sub && (
              <span className="font-opensans mt-0.5 text-[8px] leading-none tracking-widest text-neutral-500">{key.sub}</span>
            )}
          </span>
        ))}
      </div>

      <a
        href={TEL_HREF}
        aria-label={`Call ${DISPLAY_NUMBER}`}
        className="mx-auto flex aspect-square w-[15%] cursor-pointer items-center justify-center rounded-full bg-[#30d158] text-white shadow-lg transition hover:brightness-110 active:scale-95"
      >
        <span aria-hidden="true" className="icon-[lucide--phone] size-1/2" />
      </a>

      {/* Gesture bar — tap to go back home, standing in for swipe-up-to-home */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Back to Home Screen"
        className="mx-auto mt-[4%] mb-[1%] h-[0.55%] w-[36%] shrink-0 cursor-pointer rounded-full bg-neutral-900/80"
      />
    </div>
  )
}
