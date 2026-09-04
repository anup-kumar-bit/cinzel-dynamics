import React from 'react'
import EditableBlock from './EditableBlock'
import ServiceHeroBackdrop from './ServiceHeroBackdrop'

// Option 2 — long-form document: a contents list, then numbered sections
// against a sticky rail. Mirrors TrustCharter.jsx; deliberately narrower
// measure and quieter than the other two so it reads as prose.
//
// `onSelectItem`/`onDeleteItem`/`activeIndex` (repeatable sections) and
// `onSelectField`/`activeField` (singular fields) are admin-preview-only —
// the public /services pages never pass them, so this renders as plain
// static markup there.
export default function StoryTemplate({
  content,
  onSelectItem,
  onDeleteItem,
  activeIndex,
  onSelectField,
  activeField,
}) {
  const { eyebrow, heading, subheading, sections = [], cta } = content ?? {}
  const fieldClass = onSelectField ? 'rounded px-1 -mx-1 transition hover:bg-base-200/50' : ''

  return (
    <article>
      <header className="relative isolate overflow-hidden px-4 pt-14 pb-10 sm:px-8 sm:pt-20 sm:pb-14 lg:px-16">
        <ServiceHeroBackdrop />
        <div className="container mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-14">
          <div>
            {eyebrow ? (
              <EditableBlock index="eyebrow" label="eyebrow" active={activeField === 'eyebrow'} onSelect={onSelectField} className={fieldClass}>
                <p className="font-mono text-[11px] font-semibold tracking-widest text-violet-600 uppercase dark:text-violet-400">
                  {eyebrow}
                </p>
              </EditableBlock>
            ) : null}

            <EditableBlock index="heading" label="heading" active={activeField === 'heading'} onSelect={onSelectField} className={fieldClass}>
              <h1 className="font-cinzel mt-4 max-w-2xl text-3xl leading-tight font-extrabold tracking-tight text-base-content sm:text-5xl">
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
                <p className="font-opensans mt-5 max-w-xl text-base leading-relaxed text-base-content/65 sm:text-lg">
                  {subheading}
                </p>
              </EditableBlock>
            ) : null}
          </div>

          {sections.length > 1 ? (
            <nav className="lg:pt-2">
              <p className="font-opensans text-[10px] font-semibold tracking-widest text-base-content/40 uppercase">
                Contents
              </p>

              <ol className="mt-3 flex list-none flex-col gap-2 border-t border-base-200 p-0 pt-3">
                {sections.map((section, index) => (
                  <li key={index} className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] text-violet-500 dark:text-violet-400">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <a
                      href={`#section-${index + 1}`}
                      className="font-opensans text-[13px] leading-snug text-base-content/60 hover:text-base-content hover:underline"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
        </div>
      </header>

      <div className="px-4 pb-14 sm:px-8 sm:pb-20 lg:px-16">
        <div className="container mx-auto max-w-5xl">
        <div className="mt-14 flex flex-col gap-14">
          {sections.map((section, index) => (
            <EditableBlock
              key={index}
              as="section"
              id={`section-${index + 1}`}
              index={index}
              label={section.heading || `section ${index + 1}`}
              active={activeIndex === index}
              onSelect={onSelectItem}
              onDelete={onDeleteItem}
              className={`scroll-mt-24 ${onSelectItem ? 'rounded-lg p-3 -m-3 transition hover:bg-base-200/40' : ''}`}
            >
              <div className="grid gap-6 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-14">
                <div className="lg:sticky lg:top-24 lg:self-start">
                  <span aria-hidden="true" className="block h-0.5 w-10 bg-violet-500" />
                  <p className="font-mono mt-4 text-[11px] text-violet-500 dark:text-violet-400">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h2 className="font-cinzel mt-1 text-xl font-extrabold tracking-tight text-base-content sm:text-2xl">
                    {section.heading}
                  </h2>
                </div>

                <div className="lg:pt-1">
                  <p className="font-opensans max-w-2xl text-sm leading-relaxed text-base-content/70 sm:text-base">
                    {section.body}
                  </p>

                  {section.image ? (
                    <figure className="m-0 mt-6">
                      <div className="rounded-lg border border-base-200 bg-base-200/40 p-4">
                        <img src={section.image.url} alt="" className="w-full rounded object-cover" />
                      </div>
                      <figcaption className="font-opensans mt-3 text-[11px] leading-relaxed text-base-content/45">
                        <span className="font-mono text-base-content/35">
                          Fig. {String(index + 1).padStart(2, '0')}
                        </span>{' '}
                        — {section.heading}
                      </figcaption>
                    </figure>
                  ) : null}
                </div>
              </div>
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
            <div className="mt-16 border-t border-base-200 pt-8">
              <a
                href={cta.href}
                className="font-opensans group inline-flex items-baseline gap-2 text-base font-semibold text-base-content"
              >
                {cta.label}
                <span
                  aria-hidden="true"
                  className="icon-[lucide--arrow-right] size-4 self-center transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
                />
              </a>
            </div>
          </EditableBlock>
        ) : null}
        </div>
      </div>
    </article>
  )
}
