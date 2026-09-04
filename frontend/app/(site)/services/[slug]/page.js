import { notFound } from 'next/navigation'
import { getRouteBySlug } from '@/lib/cinzelPanel/db'
import { getTemplate } from '@/app/_shared/service-templates/registry'

// Real Server Component now that db.js is isomorphic — this is a genuine SSR
// win over the old client-fetch-from-IndexedDB version: real <title>, real
// content in the initial HTML, no loading flash.
export async function generateMetadata({ params }) {
  const { slug } = await params
  const route = await getRouteBySlug(slug)
  return route ? { title: route.title } : {}
}

export default async function ServiceSlugPage({ params }) {
  const { slug } = await params
  // getRouteBySlug only ever returns published routes (the backend's
  // /public/routes/{slug} filters on status itself) — draft or missing both
  // come back null here, and either way that's a 404.
  const route = await getRouteBySlug(slug)
  if (!route) notFound()

  const { Component } = getTemplate(route.template)
  return <Component content={route.content} />
}
