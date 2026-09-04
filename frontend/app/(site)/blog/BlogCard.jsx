import Link from 'next/link'
import { formatDate, getCategoryStyle } from './blogUtils'

// Filmstrip panel: full-bleed image with a gradient scrim and white text
// laid over the bottom, browsed in a horizontal scroll-snap row.
export default function BlogClipping({ post }) {
  const categoryStyle = getCategoryStyle(post.category?.name)

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative h-120 w-80 shrink-0 snap-start overflow-hidden rounded-xl bg-base-200 sm:w-96"
    >
      {post.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage.url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center">
          <span aria-hidden="true" className="icon-[lucide--newspaper] size-6 text-base-content/15" />
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-base-100/40 p-5 backdrop-blur-xl">
        {post.category ? (
          <span className={`font-mono inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-widest uppercase ${categoryStyle.chip}`}>
            {post.category.name}
          </span>
        ) : null}

        <h2 className="font-cinzel mt-2.5 text-lg leading-snug font-extrabold tracking-tight text-base-content group-hover:underline">
          {post.title}
        </h2>

        {post.excerpt ? (
          <p className="font-opensans mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-base-content/60">
            {post.excerpt}
          </p>
        ) : null}

        <p className="font-mono mt-3 text-[10px] tracking-wide text-base-content/40 uppercase">
          {post.author ? `${post.author} · ` : ''}
          {post.publishedAt ? formatDate(post.publishedAt) : ''}
        </p>
      </div>
    </Link>
  )
}
