import React from 'react'

// Wraps one repeatable content block (a feature row, a story section, a
// card) so the admin's live preview can select and delete it in place. When
// neither callback is supplied — always true on the real /services pages —
// this renders as a plain passthrough with none of the interactive markup,
// so the public template output is untouched.
export default function EditableBlock({ as: Tag = 'div', id, index, label, active, onSelect, onDelete, className = '', children }) {
  if (!onSelect && !onDelete) {
    return (
      <Tag id={id} className={className}>
        {children}
      </Tag>
    )
  }

  function handleKeyDown(event) {
    if (!onSelect || (event.key !== 'Enter' && event.key !== ' ')) return
    event.preventDefault()
    onSelect(index)
  }

  return (
    <Tag
      id={id}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect ? () => onSelect(index) : undefined}
      onKeyDown={handleKeyDown}
      className={`group relative ${onSelect ? 'cursor-pointer' : ''} ${className} ${
        active ? 'outline outline-2 outline-offset-2 outline-base-content/50' : ''
      }`}
    >
      {onDelete ? (
        // Sits fully inside the block's own box (not hanging off the corner)
        // so it can never be sliced off by an ancestor's `overflow-hidden` —
        // the card-grid template's outer grid needs that for its rounded
        // corners, and a first-row card's badge was getting clipped by it.
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onDelete(index)
          }}
          aria-label={`Delete ${label ?? `item ${index + 1}`}`}
          className={`absolute top-2 right-2 z-10 flex size-6 cursor-pointer items-center justify-center rounded-full bg-base-content text-base-100 shadow-sm transition hover:bg-rose-600 focus-visible:opacity-100 group-hover:opacity-100 ${
            active ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span aria-hidden="true" className="icon-[lucide--x] size-3.5" />
        </button>
      ) : null}

      {children}
    </Tag>
  )
}
