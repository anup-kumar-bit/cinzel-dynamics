import React from 'react'
import EditableBlock from './EditableBlock'
import ServiceHeroBackdrop from './ServiceHeroBackdrop'

// Option 1 — catalogue page: lede and figure side by side, then numbered
// feature rows. Mirrors ProductsCatalog.jsx's FigureBlock: flat panels,
// hairline rules, type carrying the hierarchy.
//
// `onSelectItem`/`onDeleteItem`/`activeIndex` (repeatable features) and
// `onSelectField`/`activeField` (singular fields) are admin-preview-only —
// the public /services pages never pass them, so this renders as plain
// static markup there.
export default function FeatureSplitTemplate({
  content,
  onSelectItem,
  onDeleteItem,
  activeIndex,
  onSelectField,
  activeField,
}) {
  const { eyebrow, heading, subheading, heroImage, intro, features = [], cta } = content ?? {}
  const fieldClass = onSelectField ? 'rounded px-1 -mx-1 transition hover:bg-base-200/50' : ''

  return (
    <article>
      <header className="relative isolate overflow-hidden px-4 pt-14 pb-10 sm:px-8 sm:pt-20 sm:pb-14 lg:px-16">
        <ServiceHeroBackdrop />
        <div className="container mx-auto max-w-6xl">
          {eyebrow ? (
            <EditableBlock index="eyebrow" label="eyebrow" active={activeField === 'eyebrow'} onSelect={onSelectField} className={fieldClass}>
              <p className="font-mono text-[11px] font-semibold tracking-widest text-violet-600 uppercase dark:text-violet-400">
                {eyebrow}
              </p>
            </EditableBlock>
          ) : null}

          <EditableBlock index="heading" label="heading" active={activeField === 'heading'} onSelect={onSelectField} className={fieldClass}>
            <h1 className="font-cinzel mt-4 max-w-3xl text-3xl leading-tight font-extrabold tracking-tight text-base-content sm:text-5xl">
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
              <p className="font-opensans mt-5 max-w-2xl text-base leading-relaxed text-base-content/65 sm:text-lg">
                {subheading}
              </p>
            </EditableBlock>
          ) : null}
        </div>
      </header>

      <div className="px-4 pb-14 sm:px-8 sm:pb-20 lg:px-16">
        <div className="container mx-auto max-w-6xl">
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
          <div>
            {intro ? (
              <EditableBlock index="intro" label="intro" active={activeField === 'intro'} onSelect={onSelectField} className={fieldClass}>
                <p className="font-opensans text-sm leading-relaxed text-base-content/70 sm:text-base">{intro}</p>
              </EditableBlock>
            ) : null}

            {features.length > 0 ? (
              <ol className="mt-10 flex list-none flex-col border-t border-base-200 p-0">
                {features.map((feature, index) => (
                  <EditableBlock
                    key={index}
                    as="li"
                    index={index}
                    label={feature.title || `feature ${index + 1}`}
                    active={activeIndex === index}
                    onSelect={onSelectItem}
                    onDelete={onDeleteItem}
                    className={`grid gap-x-6 gap-y-2 border-b border-base-200 py-6 sm:grid-cols-[3rem_minmax(0,1fr)] ${
                      onSelectItem ? 'rounded-lg px-3 -mx-3 transition hover:bg-base-200/40' : ''
                    }`}
                  >
                    <span className="font-mono text-[11px] text-violet-500 dark:text-violet-400">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div>
                      <h2 className="font-opensans text-sm font-bold text-base-content sm:text-base">
                        {feature.title}
                      </h2>
                      <p className="font-opensans mt-2 max-w-2xl text-sm leading-relaxed text-base-content/60">
                        {feature.body}
                      </p>
                    </div>
                  </EditableBlock>
                ))}
              </ol>
            ) : null}
          </div>

          {/* Figure when there's an upload; otherwise a contents card built from
              the real feature titles, rather than a grey placeholder block. */}
          <aside className="lg:pt-1">
            {heroImage ? (
              <EditableBlock
                index="heroImage"
                label="hero image"
                active={activeField === 'heroImage'}
                onSelect={onSelectField}
                className={onSelectField ? 'block rounded-lg transition hover:bg-base-200/50' : ''}
              >
                <figure className="m-0">
                  <div className="flex justify-center rounded-lg border border-base-200 bg-base-200/40 p-4">
                    <img src={heroImage.url} alt="" className="w-full rounded object-cover" />
                  </div>
                  <figcaption className="font-opensans mt-3 text-[11px] leading-relaxed text-base-content/45">
                    {heading}
                  </figcaption>
                </figure>
              </EditableBlock>
            ) : features.length > 0 ? (
              <div className="rounded-lg border border-base-200 bg-base-200/40 p-5">
                <p className="font-opensans text-[10px] font-semibold tracking-widest text-base-content/40 uppercase">
                  On this page
                </p>

                <ul className="mt-4 flex list-none flex-col gap-3 p-0">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-baseline gap-3">
                      <span className="font-mono text-[10px] text-violet-500 dark:text-violet-400">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="font-opensans text-[13px] leading-snug text-base-content/70">
                        {feature.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>

        {cta?.label && cta?.href ? (
          <EditableBlock
            index="cta"
            label="call to action"
            active={activeField === 'cta'}
            onSelect={onSelectField}
            className={onSelectField ? 'block rounded-lg transition hover:bg-base-200/50' : ''}
          >
            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-base-200 pt-8">
              <p className="font-opensans text-sm text-base-content/55">Want this for your product?</p>
              <a href={cta.href} className="btn btn-neutral rounded-full px-6">
                {cta.label}
              </a>
            </div>
          </EditableBlock>
        ) : null}
        </div>
      </div>
    </article>
  )
}
