// Real API client for the FastAPI backend (see backend/app) — no more
// IndexedDB. Function names/shapes match what they were as an IndexedDB
// client on purpose, so call sites barely changed; only the image fields
// (icon, screen images, heroImage, section images) changed shape, from a
// plain data-URL string to `{ url, publicId }`, since a saved image is now a
// real Cloudinary URL that needs its publicId remembered for later deletes.
// A `url` starting with `data:` means "not uploaded yet" — that's what
// save() looks for to know which images to attach as files.
//
// No 'use client' — `fetch`/`FormData`/`Blob` are all available in Next's
// server runtime too, so this file is isomorphic on purpose: the read
// functions run in real Server Components on the public site (see
// app/(site)/services/), and the same module also works from the admin
// panel's client components.

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, { credentials: 'include', ...options })

  if (!res.ok) {
    let detail = res.statusText
    try {
      const body = await res.json()
      if (body?.detail) detail = body.detail
    } catch {
      // no JSON body — keep statusText
    }
    throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail))
  }

  if (res.status === 204) return null
  return res.json()
}

async function dataUrlToBlob(dataUrl) {
  const res = await fetch(dataUrl)
  return res.blob()
}

function isPending(image) {
  return typeof image?.url === 'string' && image.url.startsWith('data:')
}

// ---------- Apps ----------

function normalizeApp(a) {
  return {
    id: a.id,
    platform: a.platform,
    name: a.name,
    icon: a.icon_url ? { url: a.icon_url, publicId: a.icon_public_id } : null,
    screenGroups: (a.screen_groups ?? []).map((group) => ({
      name: group.name,
      images: (group.images ?? []).map((image) => ({ url: image.url, publicId: image.public_id })),
    })),
    order: a.sort_order,
    createdAt: a.created_at,
    updatedAt: a.updated_at,
  }
}

export async function listApps() {
  const apps = await apiFetch('/apps')
  return apps.map(normalizeApp)
}

// No-auth read for the public portfolio page — listApps() above hits the
// admin-only /apps and 401s for a logged-out visitor.
export async function listPublicApps(platform) {
  const query = platform ? `?platform=${encodeURIComponent(platform)}` : ''
  const apps = await apiFetch(`/public/apps${query}`)
  return apps.map(normalizeApp)
}

export async function saveApp(app) {
  const formData = new FormData()

  if (isPending(app.icon)) {
    formData.append('icon', await dataUrlToBlob(app.icon.url), 'icon')
  }

  const screenGroups = []
  for (const [groupIndex, group] of app.screenGroups.entries()) {
    const images = []
    for (const [imageIndex, image] of group.images.entries()) {
      if (isPending(image)) {
        formData.append(`screen_${groupIndex}_${imageIndex}`, await dataUrlToBlob(image.url), 'screen')
        images.push({ url: '', public_id: null })
      } else {
        images.push({ url: image.url, public_id: image.publicId })
      }
    }
    screenGroups.push({ name: group.name, images })
  }

  formData.append(
    'data',
    JSON.stringify({
      platform: app.platform,
      name: app.name,
      sort_order: app.order ?? 0,
      // A pending icon uploads as a file above; an already-uploaded one (e.g.
      // reused when mirroring to the other platform) is passed by reference
      // so the API doesn't need a fresh file to persist it on a new row.
      icon: app.icon && !isPending(app.icon) ? { url: app.icon.url, public_id: app.icon.publicId } : null,
      screen_groups: screenGroups,
    }),
  )

  const saved = app.id
    ? await apiFetch(`/apps/${app.id}`, { method: 'PUT', body: formData })
    : await apiFetch('/apps', { method: 'POST', body: formData })
  return normalizeApp(saved)
}

export async function deleteApp(id) {
  await apiFetch(`/apps/${id}`, { method: 'DELETE' })
}

// ---------- Websites ----------

function normalizeWebsite(w) {
  return {
    id: w.id,
    name: w.name,
    domain: w.domain,
    sections: (w.sections ?? []).map((section) => ({
      name: section.name,
      images: (section.images ?? []).map((image) => ({ url: image.url, publicId: image.public_id })),
    })),
    createdAt: w.created_at,
    updatedAt: w.updated_at,
  }
}

export async function listWebsites() {
  const websites = await apiFetch('/websites')
  return websites.map(normalizeWebsite)
}

// No-auth read for the public portfolio page — listWebsites() above hits the
// admin-only /websites and 401s for a logged-out visitor. Ordered by
// creation, same as listWebsites() — the two portfolio frames alternate
// projects by this exact order (1st/3rd/5th… vs 2nd/4th/6th…).
export async function listPublicWebsites() {
  const websites = await apiFetch('/public/websites')
  return websites.map(normalizeWebsite)
}

export async function saveWebsite(website) {
  const formData = new FormData()

  const sections = []
  for (const [sectionIndex, section] of website.sections.entries()) {
    const images = []
    for (const [imageIndex, image] of section.images.entries()) {
      if (isPending(image)) {
        formData.append(`section_${sectionIndex}_${imageIndex}`, await dataUrlToBlob(image.url), 'section')
        images.push({ url: '', public_id: null })
      } else {
        images.push({ url: image.url, public_id: image.publicId })
      }
    }
    sections.push({ name: section.name, images })
  }

  formData.append(
    'data',
    JSON.stringify({
      name: website.name,
      domain: website.domain,
      sections,
    }),
  )

  const saved = website.id
    ? await apiFetch(`/websites/${website.id}`, { method: 'PUT', body: formData })
    : await apiFetch('/websites', { method: 'POST', body: formData })
  return normalizeWebsite(saved)
}

export async function deleteWebsite(id) {
  await apiFetch(`/websites/${id}`, { method: 'DELETE' })
}

// ---------- Portfolio stats ----------
// Single site-wide record, not per website.

function normalizePortfolioStats(s) {
  return {
    needsFulfilled: typeof s?.needs_fulfilled === 'number' ? String(s.needs_fulfilled) : '',
    satisfaction: typeof s?.satisfaction === 'number' ? String(s.satisfaction) : '',
    onTimeDelivery: typeof s?.on_time_delivery === 'number' ? String(s.on_time_delivery) : '',
  }
}

function draftStringToNumber(value) {
  return value.trim() === '' ? null : Number(value)
}

export async function getPortfolioStats() {
  const stats = await apiFetch('/portfolio-stats')
  return normalizePortfolioStats(stats)
}

// No-auth read for the public portfolio page.
export async function getPublicPortfolioStats() {
  const stats = await apiFetch('/public/portfolio-stats')
  return {
    needsFulfilled: stats?.needs_fulfilled ?? null,
    satisfaction: stats?.satisfaction ?? null,
    onTimeDelivery: stats?.on_time_delivery ?? null,
  }
}

export async function savePortfolioStats(stats) {
  const saved = await apiFetch('/portfolio-stats', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      needs_fulfilled: draftStringToNumber(stats.needsFulfilled),
      satisfaction: draftStringToNumber(stats.satisfaction),
      on_time_delivery: draftStringToNumber(stats.onTimeDelivery),
    }),
  })
  return normalizePortfolioStats(saved)
}

// ---------- Routes ----------

function normalizeImage(image) {
  if (!image) return null
  return { url: image.url, publicId: image.public_id }
}

function normalizeRouteContent(template, content) {
  if (!content) return content
  const next = { ...content }
  if (template === 'feature-split' && next.heroImage) {
    next.heroImage = normalizeImage(next.heroImage)
  }
  if (template === 'story' && Array.isArray(next.sections)) {
    next.sections = next.sections.map((section) => ({ ...section, image: normalizeImage(section.image) }))
  }
  return next
}

function normalizeRoute(r) {
  return {
    id: r.id,
    slug: r.slug,
    navName: r.nav_name,
    title: r.title,
    template: r.template,
    content: normalizeRouteContent(r.template, r.content),
    status: r.status,
    order: r.sort_order,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    publishedAt: r.published_at,
  }
}

function denormalizeImage(image) {
  if (!image) return null
  return { url: image.url, public_id: image.publicId ?? null }
}

export async function listRoutes() {
  const routes = await apiFetch('/routes')
  return routes.map(normalizeRoute)
}

export async function getRoute(id) {
  try {
    const route = await apiFetch(`/routes/${id}`)
    return normalizeRoute(route)
  } catch {
    return null
  }
}

export async function listPublishedRoutes() {
  try {
    const routes = await apiFetch('/public/routes')
    return routes.map(normalizeRoute)
  } catch {
    return []
  }
}

export async function getRouteBySlug(slug) {
  try {
    const route = await apiFetch(`/public/routes/${encodeURIComponent(slug)}`)
    return normalizeRoute(route)
  } catch {
    return null
  }
}

export async function saveRoute(route) {
  const formData = new FormData()

  if (route.template === 'feature-split' && isPending(route.content?.heroImage)) {
    formData.append('hero_image', await dataUrlToBlob(route.content.heroImage.url), 'hero-image')
  }
  if (route.template === 'story' && Array.isArray(route.content?.sections)) {
    for (const [index, section] of route.content.sections.entries()) {
      if (isPending(section.image)) {
        formData.append(`section_${index}`, await dataUrlToBlob(section.image.url), 'section')
      }
    }
  }

  const content = prepareRouteContentForSave(route.template, route.content)

  formData.append(
    'data',
    JSON.stringify({
      slug: route.slug,
      nav_name: route.navName,
      title: route.title,
      template: route.template,
      status: route.status,
      sort_order: route.order ?? 0,
      content,
    }),
  )

  const saved = route.id
    ? await apiFetch(`/routes/${route.id}`, { method: 'PUT', body: formData })
    : await apiFetch('/routes', { method: 'POST', body: formData })
  return normalizeRoute(saved)
}

function prepareRouteContentForSave(template, content) {
  const next = { ...(content ?? {}) }

  if (template === 'feature-split') {
    next.heroImage = isPending(next.heroImage) ? null : denormalizeImage(next.heroImage)
  }
  if (template === 'story' && Array.isArray(next.sections)) {
    next.sections = next.sections.map((section) => ({
      ...section,
      image: isPending(section.image) ? null : denormalizeImage(section.image),
    }))
  }

  return next
}

export async function deleteRoute(id) {
  await apiFetch(`/routes/${id}`, { method: 'DELETE' })
}

export async function publishRoute(id) {
  const saved = await apiFetch(`/routes/${id}/publish`, { method: 'PATCH' })
  return normalizeRoute(saved)
}

export async function unpublishRoute(id) {
  const saved = await apiFetch(`/routes/${id}/unpublish`, { method: 'PATCH' })
  return normalizeRoute(saved)
}

// ---------- Categories ----------

function normalizeCategory(c) {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    parentId: c.parent_id,
    status: c.status,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
    archivedAt: c.archived_at,
  }
}

// The compact shape embedded in a blog post's `category` field (see
// CategorySummary on the backend) — enough to display and to know whether
// it's archived, without a second request.
function normalizeCategorySummary(c) {
  if (!c) return null
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    status: c.status,
    parent: c.parent ? { id: c.parent.id, name: c.parent.name, slug: c.parent.slug } : null,
  }
}

export async function listCategories() {
  const categories = await apiFetch('/categories')
  return categories.map(normalizeCategory)
}

// No-auth read for the public blog's category filter — listCategories()
// above hits the admin-only /categories and 401s for a logged-out visitor.
// Only ever returns active categories.
export async function listPublicCategories() {
  const categories = await apiFetch('/public/categories')
  return categories.map(normalizeCategory)
}

// Create only — a category's parent can't change after creation, so there's
// no updateCategory() counterpart for parentId; only name/slug are editable.
export async function createCategory({ name, slug, parentId }) {
  const saved = await apiFetch('/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, slug: slug || null, parent_id: parentId || null }),
  })
  return normalizeCategory(saved)
}

export async function updateCategory(id, { name, slug }) {
  const saved = await apiFetch(`/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, slug: slug || null }),
  })
  return normalizeCategory(saved)
}

// Soft delete — the category row stays (posts already using it keep
// displaying it) but it drops out of the picker for new assignments.
// Archiving a parent archives its subcategories too.
export async function archiveCategory(id) {
  const saved = await apiFetch(`/categories/${id}/archive`, { method: 'PATCH' })
  return normalizeCategory(saved)
}

export async function restoreCategory(id) {
  const saved = await apiFetch(`/categories/${id}/restore`, { method: 'PATCH' })
  return normalizeCategory(saved)
}

// ---------- Blog ----------

function normalizeBlogPost(p) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    author: p.author,
    category: normalizeCategorySummary(p.category),
    // Derived from category.id since BlogPostOut only embeds the summary,
    // not a raw category_id — keeps the admin editor's picker in sync
    // across save round-trips.
    categoryId: p.category?.id ?? null,
    tags: p.tags ?? [],
    coverImage: p.cover_image_url ? { url: p.cover_image_url, publicId: p.cover_image_public_id } : null,
    content: (p.content ?? []).map((block) => ({ ...block, image: normalizeImage(block.image) })),
    status: p.status,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    publishedAt: p.published_at,
  }
}

export async function listBlogPosts() {
  const posts = await apiFetch('/blog-posts')
  return posts.map(normalizeBlogPost)
}

export async function getBlogPost(id) {
  try {
    const post = await apiFetch(`/blog-posts/${id}`)
    return normalizeBlogPost(post)
  } catch {
    return null
  }
}

// No-auth read for the public blog pages — listBlogPosts()/getBlogPost()
// above hit admin-only endpoints and 401 for a logged-out visitor.
export async function listPublishedBlogPosts() {
  const posts = await apiFetch('/public/blog-posts')
  return posts.map(normalizeBlogPost)
}

export async function getBlogPostBySlug(slug) {
  try {
    const post = await apiFetch(`/public/blog-posts/${encodeURIComponent(slug)}`)
    return normalizeBlogPost(post)
  } catch {
    return null
  }
}

export async function saveBlogPost(post) {
  const formData = new FormData()

  if (isPending(post.coverImage)) {
    formData.append('cover_image', await dataUrlToBlob(post.coverImage.url), 'cover')
  }

  const content = []
  for (const [index, block] of post.content.entries()) {
    if (block.type === 'image' && isPending(block.image)) {
      formData.append(`block_${index}`, await dataUrlToBlob(block.image.url), 'block')
      content.push({ ...block, image: null })
    } else {
      content.push({ ...block, image: block.type === 'image' ? denormalizeImage(block.image) : null })
    }
  }

  formData.append(
    'data',
    JSON.stringify({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      author: post.author,
      category_id: post.categoryId || null,
      tags: post.tags ?? [],
      // A pending cover uploads as a file above; an already-uploaded one is
      // passed by reference so the API doesn't need a fresh file to persist it.
      cover_image: post.coverImage && !isPending(post.coverImage) ? denormalizeImage(post.coverImage) : null,
      content,
      status: post.status,
    }),
  )

  const saved = post.id
    ? await apiFetch(`/blog-posts/${post.id}`, { method: 'PUT', body: formData })
    : await apiFetch('/blog-posts', { method: 'POST', body: formData })
  return normalizeBlogPost(saved)
}

export async function deleteBlogPost(id) {
  await apiFetch(`/blog-posts/${id}`, { method: 'DELETE' })
}

export async function publishBlogPost(id) {
  const saved = await apiFetch(`/blog-posts/${id}/publish`, { method: 'PATCH' })
  return normalizeBlogPost(saved)
}

export async function unpublishBlogPost(id) {
  const saved = await apiFetch(`/blog-posts/${id}/unpublish`, { method: 'PATCH' })
  return normalizeBlogPost(saved)
}
