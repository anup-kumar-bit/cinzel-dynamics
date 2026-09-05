import Link from 'next/link'
import { listPublicCategories, listPublishedBlogPosts } from '@/lib/cinzelPanel/db'
import BlogClipping from './BlogCard'
import BlogHeroBackdrop from './BlogHeroBackdrop'
import { formatDate } from './blogUtils'

export const metadata = {
  title: 'Blog',
}

// Picking a parent category shows posts filed under it directly as well as
// under any of its subcategories — the public filter only offers parent
// chips, so this is what makes a chip actually cover its whole branch.
function matchesCategory(post, slug) {
  return post.category?.slug === slug || post.category?.parent?.slug === slug
}

// Server component, same pattern as /services — lists whatever is actually
// published rather than going through a client fetch.
export default async function BlogIndexPage({ searchParams }) {
  const { category: activeSlug } = await searchParams
  const [posts, categories] = await Promise.all([listPublishedBlogPosts(), listPublicCategories()])

  const parentCategories = categories.filter((c) => !c.parentId)
  const subcategoriesByParent = {}
  for (const c of categories) {
    if (!c.parentId) continue
    subcategoriesByParent[c.parentId] = subcategoriesByParent[c.parentId] ?? []
    subcategoriesByParent[c.parentId].push(c)
  }
  const filteredPosts = activeSlug ? posts.filter((post) => matchesCategory(post, activeSlug)) : posts
  const activeCategory = categories.find((c) => c.slug === activeSlug)
  // Which parent's subcategory row to show — the active category itself if
  // it's a parent, or whichever parent it's filed under if it's a
  // subcategory. Keeps the second row scoped to one branch at a time
  // instead of listing every subcategory of every parent at once.
  const selectedParentId = activeCategory ? activeCategory.parentId ?? activeCategory.id : null
  const selectedParentSubs = selectedParentId ? (subcategoriesByParent[selectedParentId] ?? []) : []

  // Posts come back sorted newest-published-first, so the first one's date
  // is the "latest edition" date — not today's date, which has nothing to
  // do with when anything was actually posted.
  const latestPost = filteredPosts[0]

  return (
    <>
      <section className="relative isolate overflow-hidden px-4 pt-16 pb-4 sm:px-8 sm:pt-20 lg:px-16">
        <BlogHeroBackdrop />
        <div className="container mx-auto max-w-6xl text-center">
          <p className="font-mono text-[11px] font-semibold tracking-widest text-base-content/45 uppercase">Blog</p>

          <h1 className="font-cinzel mt-4 text-3xl font-extrabold tracking-tight text-base-content sm:text-4xl">
            THE DYNAMIC JOURNAL
          </h1>

          <p className="font-opensans mx-auto mt-4 max-w-2xl text-base leading-relaxed text-base-content/60">
            {latestPost?.publishedAt ? `${formatDate(latestPost.publishedAt)} · ` : ''}
            {filteredPosts.length} dispatch{filteredPosts.length === 1 ? '' : 'es'}
          </p>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-8 sm:pb-20 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        {parentCategories.length > 0 ? (
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link
                href="/blog"
                className={`font-mono rounded-full px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase transition ${
                  !activeSlug
                    ? 'bg-base-content text-base-100'
                    : 'bg-base-200 text-base-content/55 hover:bg-base-300 hover:text-base-content'
                }`}
              >
                All
              </Link>

              {parentCategories.map((parent) => (
                <Link
                  key={parent.id}
                  href={`/blog?category=${encodeURIComponent(parent.slug)}`}
                  className={`font-mono rounded-full px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase transition ${
                    selectedParentId === parent.id
                      ? 'bg-base-content text-base-100'
                      : 'bg-base-200 text-base-content/55 hover:bg-base-300 hover:text-base-content'
                  }`}
                >
                  {parent.name}
                </Link>
              ))}
            </div>

            {/* Only the selected parent's subcategories show here — scales
                to any number of them without crowding the row above. */}
            {selectedParentSubs.length > 0 ? (
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {selectedParentSubs.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/blog?category=${encodeURIComponent(sub.slug)}`}
                    className={`font-mono rounded-full border px-3 py-1 text-[10px] font-semibold tracking-widest uppercase transition ${
                      activeSlug === sub.slug
                        ? 'border-base-content bg-base-content text-base-100'
                        : 'border-base-300 text-base-content/50 hover:border-base-content/40 hover:text-base-content'
                    }`}
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {filteredPosts.length > 0 ? (
          <div className="mt-10 overflow-x-auto pb-2">
            <div className="flex w-max gap-5 snap-x snap-mandatory">
              {filteredPosts.map((post) => (
                <BlogClipping key={post.id} post={post} />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center gap-3 px-6 py-16 text-center">
            <BlogEmptyArt className="w-40" />

            <p className="font-opensans text-sm font-semibold text-base-content/70">
              {activeCategory ? `Nothing filed under “${activeCategory.name}” yet.` : 'Nothing published yet.'}
            </p>
            <p className="font-opensans max-w-xs text-xs text-base-content/45">
              New dispatches land here the moment they go live.
            </p>

            {activeCategory ? (
              <Link
                href="/blog"
                className="font-mono mt-1 rounded-full bg-base-content px-4 py-1.5 text-[11px] font-bold tracking-widest text-base-100 uppercase transition hover:opacity-90"
              >
                View all posts
              </Link>
            ) : null}
          </div>
        )}
      </div>
      </section>
    </>
  )
}

// Blank article cards a reader is flipping through, with a few accent marks
// scattered around — the "nothing here" beat, in the same flat linework as
// the rest of the page rather than a stock illustration.
function BlogEmptyArt({ className = '' }) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden="true">
      <ellipse cx="100" cy="92" rx="82" ry="58" className="fill-base-200" />

      <g className="fill-amber-400/80">
        <circle cx="34" cy="46" r="3" />
        <circle cx="168" cy="120" r="2.5" />
      </g>
      <path
        d="M162 44 v8 M158 48 h8"
        className="text-violet-400/80"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M28 116 v7 M24.5 119.5 h7"
        className="text-emerald-400/80"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <g transform="rotate(-7 90 78)">
        <rect x="58" y="30" width="64" height="86" rx="6" className="fill-base-100 stroke-base-300" strokeWidth="1.5" />
      </g>

      <g transform="rotate(6 110 84)">
        <rect x="76" y="36" width="64" height="86" rx="6" className="fill-base-100 stroke-base-300" strokeWidth="1.5" />
        <rect x="86" y="48" width="30" height="6" rx="3" className="fill-base-300" />
        <rect x="86" y="62" width="44" height="3.5" rx="1.75" className="fill-base-200" />
        <rect x="86" y="70" width="44" height="3.5" rx="1.75" className="fill-base-200" />
        <rect x="86" y="78" width="32" height="3.5" rx="1.75" className="fill-base-200" />
      </g>

      <g className="fill-base-content/25">
        <circle cx="146" cy="70" r="9" />
        <path d="M133 118c0-11.6 5.8-19 13-19s13 7.4 13 19v6h-26z" />
        <rect x="141.5" y="86" width="9" height="18" rx="4.5" transform="rotate(28 141.5 86)" />
      </g>
    </svg>
  )
}
