import React from 'react'
import EditableBlock from './EditableBlock'
import ServiceHeroBackdrop from './ServiceHeroBackdrop'

// Option 3 — capability grid: the heading occupies the first cell of the grid
// rather than sitting above it, so the page opens differently to the other two.
// Flat bordered cards, no gradients or glass.
//
// `onSelectItem`/`onDeleteItem`/`activeIndex` (repeatable cards) and
// `onSelectField`/`activeField` (singular fields) are admin-preview-only —
// the public /services pages never pass them, so this renders as plain
// static markup there.
export default function CardGridTemplate({
  content,
  onSelectItem,
  onDeleteItem,
  activeIndex,
  onSelectField,
  activeField,
}) {
  const { eyebrow, heading, subheading, cards = [], cta } = content ?? {}
  const fieldClass = onSelectField ? 'rounded px-1 -mx-1 transition hover:bg-base-200/70' : ''

  return (
    <article className="px-4 py-14 sm:px-8 sm:py-20 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-px overflow-hidden rounded-lg border border-base-200 bg-base-200 sm:grid-cols-2 lg:grid-cols-3">
          <header className="relative isolate flex flex-col justify-center overflow-hidden bg-base-100 p-6 sm:col-span-2 sm:p-8 lg:col-span-1">
            <ServiceHeroBackdrop />
            {eyebrow ? (
              <EditableBlock index="eyebrow" label="eyebrow" active={activeField === 'eyebrow'} onSelect={onSelectField} className={fieldClass}>
                <p className="font-mono text-[11px] font-semibold tracking-widest text-violet-600 uppercase dark:text-violet-400">
                  {eyebrow}
                </p>
              </EditableBlock>
            ) : null}

            <EditableBlock index="heading" label="heading" active={activeField === 'heading'} onSelect={onSelectField} className={fieldClass}>
              <h1 className="font-cinzel mt-4 text-3xl leading-tight font-extrabold tracking-tight text-base-content sm:text-4xl">
                {heading}
              </h1>
            </EditableBlock>

            {subheading ? (
              <EditableBlock
                index="subheading"
                label="subheading"
                active={activeField === 'subheading'}
                onSelect={onSelectField}
                className={fieldClass}
              >
                <p className="font-opensans mt-4 text-sm leading-relaxed text-base-content/60">{subheading}</p>
              </EditableBlock>
            ) : null}

            {cards.length > 0 ? (
              <p className="font-mono mt-6 text-[10px] tracking-widest text-violet-500 uppercase dark:text-violet-400">
                {String(cards.length).padStart(2, '0')} capabilities
              </p>
            ) : null}
          </header>

          {cards.map((card, index) => (
            <EditableBlock
              key={index}
              index={index}
              label={card.title || `card ${index + 1}`}
              active={activeIndex === index}
              onSelect={onSelectItem}
              onDelete={onDeleteItem}
              className={`flex flex-col bg-base-100 p-6 ${onSelectItem ? 'transition hover:bg-base-200/40' : ''}`}
            >
              <div className="flex items-center gap-3">
                {card.icon ? (
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-violet-200 bg-violet-50 dark:border-violet-500/30 dark:bg-violet-500/10">
                    <span aria-hidden="true" className={`${card.icon} size-4.5 text-violet-600 dark:text-violet-400`} />
                  </span>
                ) : null}

                <span className="font-mono text-[10px] text-violet-500 dark:text-violet-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <h2 className="font-opensans mt-4 text-sm font-bold text-base-content">{card.title}</h2>
              <p className="font-opensans mt-2 text-sm leading-relaxed text-base-content/60">{card.body}</p>
            </EditableBlock>
          ))}
        </div>

        {cta?.label && cta?.href ? (
          <EditableBlock
            index="cta"
            label="call to action"
            active={activeField === 'cta'}
            onSelect={onSelectField}
            className={onSelectField ? 'block rounded-lg transition hover:bg-base-200/50' : ''}
          >
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href={cta.href} className="btn btn-neutral rounded-full px-6">
                {cta.label}
              </a>
              <p className="font-opensans text-sm text-base-content/50">
                Or tell us what you need and we&apos;ll say whether we can build it.
              </p>
            </div>
          </EditableBlock>
        ) : null}
      </div>
    </article>
  )
}
