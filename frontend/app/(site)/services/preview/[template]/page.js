import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SERVICE_TEMPLATES, getTemplate } from '@/app/_shared/service-templates/registry'

// Standing preview of each template, rendered from its mock content so the
// three options can be compared before anything is published from the panel.
export function generateStaticParams() {
  return SERVICE_TEMPLATES.map((template) => ({ template: template.id }))
}

export async function generateMetadata({ params }) {
  const { template } = await params
  const found = SERVICE_TEMPLATES.find((t) => t.id === template)
  return { title: found ? `${found.label} preview` : 'Template preview' }
}

export default async function TemplatePreviewPage({ params }) {
  const { template } = await params
  const found = SERVICE_TEMPLATES.find((t) => t.id === template)
  if (!found) notFound()

  const { Component, defaultContent } = getTemplate(found.id)

  return (
    <>
      <PreviewBar current={found} />
      <Component content={defaultContent} />
    </>
  )
}

// Deliberately looks like tooling, not page design, so it is never mistaken
// for part of the template being reviewed.
function PreviewBar({ current }) {
  return (
    <div className="bg-neutral text-neutral-content">
      <div className="container mx-auto flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-8 lg:px-16">
        <p className="font-mono text-[10px] font-semibold tracking-widest text-neutral-content/50 uppercase">
          Template preview
        </p>

        <div className="flex flex-wrap items-center gap-1.5">
          {SERVICE_TEMPLATES.map((template) => {
            const active = template.id === current.id
            return (
              <Link
                key={template.id}
                href={`/services/preview/${template.id}`}
                className={`font-opensans rounded-full px-3 py-1 text-xs font-semibold transition ${
                  active
                    ? 'bg-neutral-content text-neutral'
                    : 'text-neutral-content/60 hover:bg-white/10 hover:text-neutral-content'
                }`}
              >
                {template.label}
              </Link>
            )
          })}
        </div>

        <p className="font-opensans ml-auto hidden text-[11px] text-neutral-content/45 lg:block">
          {current.description}
        </p>
      </div>
    </div>
  )
}
