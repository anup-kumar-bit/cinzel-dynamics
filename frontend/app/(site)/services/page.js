import Link from 'next/link'
import { listPublishedRoutes } from '@/lib/cinzelPanel/db'

export const metadata = {
  title: 'Services',
}

// Real index of the published service pages — a server component like
// /services/[slug], so it lists whatever is actually live rather than the
// template gallery under /services/preview.
export default async function ServicesIndexPage() {
  const services = await listPublishedRoutes()

  return (
    <section className="px-4 py-16 sm:px-8 sm:py-20 lg:px-16">
      <div className="container mx-auto max-w-4xl">
        <p className="font-mono text-[11px] font-semibold tracking-widest text-base-content/45 uppercase">
          Services
        </p>

        <h1 className="font-cinzel mt-4 text-3xl font-extrabold tracking-tight text-base-content sm:text-4xl">
          What we build
        </h1>

        <p className="font-opensans mt-4 max-w-2xl text-base leading-relaxed text-base-content/60">
          Each one is a page of its own — what we build, how it runs, and what it costs to keep running.
        </p>

        {services.length > 0 ? (
          <ul className="mt-10 flex list-none flex-col border-t border-base-200 p-0">
            {services.map((service, index) => (
              <li key={service.id} className="border-b border-base-200">
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex items-baseline gap-4 py-6 sm:gap-6"
                >
                  <span className="font-mono text-[11px] text-base-content/35">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="font-cinzel block text-xl font-extrabold tracking-tight text-base-content">
                      {service.navName}
                    </span>
                    <span className="font-opensans mt-1.5 block text-sm leading-relaxed text-base-content/55">
                      {service.title}
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
        ) : (
          <p className="font-opensans mt-10 text-sm text-base-content/45">No service pages published yet.</p>
        )}
      </div>
    </section>
  )
}
