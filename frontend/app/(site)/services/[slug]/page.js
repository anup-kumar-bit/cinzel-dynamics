import { notFound } from 'next/navigation'
import { getRouteBySlug } from '@/lib/cinzelPanel/db'
import { getTemplate } from '@/app/_shared/service-templates/registry'


export async function generateMetadata({ params }) {
  const { slug } = await params
  const route = await getRouteBySlug(slug)
  return route ? { title: route.title } : {}
}

export default async function ServiceSlugPage({ params }) {
  const { slug } = await params

  const route = await getRouteBySlug(slug)
  if (!route) notFound()

  const { Component } = getTemplate(route.template)
  return <Component content={route.content} />
}
