import { listPublishedRoutes, listPublishedBlogPosts } from '@/lib/cinzelPanel/db'

const baseUrl = 'https://cinzeldynamics.com'

// Regenerate hourly so newly published routes/posts appear without a redeploy.
export const revalidate = 3600

export default async function sitemap() {
  const [routes, posts] = await Promise.all([listPublishedRoutes(), listPublishedBlogPosts()])

  const staticPages = [
    { url: baseUrl, changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/products`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/portfolio`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/trust`, changeFrequency: 'yearly', priority: 0.7 },
  ].map((page) => ({ lastModified: new Date(), ...page }))

  const servicePages = routes.map((route) => ({
    url: `${baseUrl}/services/${route.slug}`,
    lastModified: route.updatedAt ? new Date(route.updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticPages, ...servicePages, ...blogPages]
}
