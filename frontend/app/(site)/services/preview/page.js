import Link from 'next/link'
import { SERVICE_TEMPLATES } from '@/app/_shared/service-templates/registry'

export const metadata = {
  title: 'Template previews',
  robots: { index: false, follow: false },
}

// Index of the three layout options. This is a review surface for choosing a
// template in the panel — the live service pages are the /services/[slug] ones.
export default function TemplatePreviewIndexPage() {
  return (
    <section className="px-4 py-16 sm:px-8 sm:py-20 lg:px-16">
      <div className="container mx-auto max-w-4xl">
        <p className="font-mono text-[11px] font-semibold tracking-widest text-base-content/45 uppercase">
          Template previews
        </p>

        <h1 className="font-cinzel mt-4 text-3xl font-extrabold tracking-tight text-base-content sm:text-4xl">
          Three ways a service page can look
        </h1>

        <p className="font-opensans mt-4 max-w-2xl text-base leading-relaxed text-base-content/60">
          Each one is filled with stand-in copy so the layout can be judged before anything is written. Pick one per
          page in the control panel, then replace the content.
        </p>

        <ul className="mt-10 flex list-none flex-col border-t border-base-200 p-0">
          {SERVICE_TEMPLATES.map((template, index) => (
            <li key={template.id} className="border-b border-base-200">
              <Link
                href={`/services/preview/${template.id}`}
                className="group flex items-baseline gap-4 py-6 sm:gap-6"
              >
                <span className="font-mono text-[11px] text-base-content/35">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="font-cinzel block text-xl font-extrabold tracking-tight text-base-content">
                    {template.label}
                  </span>
                  <span className="font-opensans mt-1.5 block text-sm leading-relaxed text-base-content/55">
                    {template.description}
                  </span>
                </span>

                <span
                  aria-hidden="true"
                  className="icon-[lucide--arrow-right] size-4 shrink-0 self-center text-base-content/30 transition-transform group-hover:translate-x-1 group-hover:text-base-content/60 motion-reduce:group-hover:translate-x-0"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
