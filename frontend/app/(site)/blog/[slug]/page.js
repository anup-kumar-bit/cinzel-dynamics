import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBlogPostBySlug } from '@/lib/cinzelPanel/db'
import { estimateReadTime, formatDate, formatDateTime, getCategoryStyle, wasEditedAfterPublish } from '../blogUtils'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  return post ? { title: post.title, description: post.excerpt || undefined } : {}
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  // getBlogPostBySlug only ever returns published posts (the backend's
  // /public/blog-posts/{slug} filters on status itself) — draft or missing
  // both come back null here, and either way that's a 404.
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  const readTime = estimateReadTime(post.content)
  const categoryStyle = getCategoryStyle(post.category?.name)
  const edited = wasEditedAfterPublish(post)

  return (
    <article className="pb-20">
      <div className="px-4 pt-10 sm:px-8 lg:px-16">
        <div className="container mx-auto max-w-6xl">
          <Link
            href="/blog"
            className="font-opensans group inline-flex items-center gap-1.5 text-[13px] font-medium text-base-content/50 hover:text-base-content"
          >
            <span
              aria-hidden="true"
              className="icon-[lucide--arrow-left] size-3.5 transition-transform group-hover:-translate-x-0.5 motion-reduce:group-hover:translate-x-0"
            />
            Blog
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-[11px] text-base-content/45">
            {post.category ? (
              <span
                className={`font-mono rounded-full px-3 py-1 font-semibold tracking-widest uppercase ${categoryStyle.chip}`}
              >
                {post.category.name}
              </span>
            ) : null}
            <span>{readTime} min read</span>
          </div>

          <h1 className="font-cinzel mt-4 text-3xl leading-tight font-extrabold tracking-tight text-base-content sm:text-4xl">
            {post.title}
          </h1>

          {post.excerpt ? (
            <p className="font-opensans mt-4 text-lg leading-relaxed text-base-content/60">{post.excerpt}</p>
          ) : null}

          <div className="mt-6 flex items-center gap-3 border-t border-base-200 pt-5">
            <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${categoryStyle.avatar}`}>
              {(post.author || '?').charAt(0).toUpperCase()}
            </span>
            <span className="min-w-0">
              {post.author ? <span className="block truncate text-sm font-semibold text-base-content">{post.author}</span> : null}
              {post.publishedAt ? (
                <span className="block text-[12px] text-base-content/45">
                  {formatDate(post.publishedAt)}
                  {edited ? ` · Updated ${formatDateTime(post.updatedAt)}` : ''}
                </span>
              ) : null}
            </span>
          </div>
        </div>
      </div>

      {post.coverImage ? (
        <div className="mt-10 px-4 sm:px-8 lg:px-16">
          <div className="container mx-auto max-w-6xl">
            <div className="aspect-video overflow-hidden rounded-xl border border-base-200 bg-base-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.coverImage.url} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-10 px-4 sm:px-8 lg:px-16">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col gap-6">
            {post.content.map((block, index) => (
              <ContentBlock key={index} block={block} categoryStyle={categoryStyle} />
            ))}
          </div>

          {post.tags?.length > 0 ? (
            <div className="mt-12 flex flex-wrap gap-2 border-t border-base-200 pt-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono rounded-full bg-base-200 px-2.5 py-1 text-[11px] text-base-content/55"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
}

function ContentBlock({ block, categoryStyle }) {
  if (block.type === 'heading') {
    return (
      <h2 className="font-cinzel relative mt-4 pl-4 text-xl font-extrabold tracking-tight text-base-content sm:text-2xl">
        <span aria-hidden="true" className={`absolute top-1 bottom-1 left-0 w-1 rounded-full ${categoryStyle.bar}`} />
        {block.text}
      </h2>
    )
  }

  if (block.type === 'quote') {
    return (
      <blockquote className={`border-l-4 ${categoryStyle.border} pl-5 text-lg leading-relaxed text-base-content/70 italic`}>
        {block.text}
      </blockquote>
    )
  }

  if (block.type === 'image') {
    if (!block.image) return null
    return (
      <figure className="m-0">
        <div className="aspect-video overflow-hidden rounded-lg border border-base-200 bg-base-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.image.url} alt={block.caption || ''} className="h-full w-full object-cover" />
        </div>
        {block.caption ? (
          <figcaption className="font-opensans mt-2 text-[12px] leading-relaxed text-base-content/45">
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    )
  }

  return (
    <p className="font-opensans text-base leading-relaxed whitespace-pre-line text-base-content/75">{block.text}</p>
  )
}
