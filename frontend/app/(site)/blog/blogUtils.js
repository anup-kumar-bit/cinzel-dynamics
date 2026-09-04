const WORDS_PER_MINUTE = 200

export function estimateReadTime(content) {
  const words = (content ?? [])
    .map((block) => block.text ?? '')
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

export function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Date + time down to the second, for "last updated" — formatDate() alone
// only shows the day, which can't distinguish two edits made hours apart.
export function formatDateTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  })
}

// Tailwind's scanner only picks up class names it can see literally in
// source — a template string like `border-${color}-500` never makes it into
// the build. So the palette is written out in full here, and callers just
// pick one of these objects rather than building class names themselves.
//
// `chip` is solid (not a light tint) on purpose — it sits directly on top of
// a cover photo behind a blurred overlay on the card, where a translucent
// tint reads as washed-out regardless of theme. A solid fill stays legible
// over any photo.
const CATEGORY_PALETTE = [
  { chip: 'bg-amber-500 text-white', border: 'border-amber-500', hoverBorder: 'hover:border-amber-500/60', bar: 'bg-amber-500', ring: 'ring-amber-500/25', avatar: 'bg-amber-500/15 text-amber-700 dark:text-amber-400' },
  { chip: 'bg-rose-500 text-white', border: 'border-rose-500', hoverBorder: 'hover:border-rose-500/60', bar: 'bg-rose-500', ring: 'ring-rose-500/25', avatar: 'bg-rose-500/15 text-rose-700 dark:text-rose-400' },
  { chip: 'bg-sky-500 text-white', border: 'border-sky-500', hoverBorder: 'hover:border-sky-500/60', bar: 'bg-sky-500', ring: 'ring-sky-500/25', avatar: 'bg-sky-500/15 text-sky-700 dark:text-sky-400' },
  { chip: 'bg-emerald-500 text-white', border: 'border-emerald-500', hoverBorder: 'hover:border-emerald-500/60', bar: 'bg-emerald-500', ring: 'ring-emerald-500/25', avatar: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' },
  { chip: 'bg-violet-500 text-white', border: 'border-violet-500', hoverBorder: 'hover:border-violet-500/60', bar: 'bg-violet-500', ring: 'ring-violet-500/25', avatar: 'bg-violet-500/15 text-violet-700 dark:text-violet-400' },
  { chip: 'bg-orange-500 text-white', border: 'border-orange-500', hoverBorder: 'hover:border-orange-500/60', bar: 'bg-orange-500', ring: 'ring-orange-500/25', avatar: 'bg-orange-500/15 text-orange-700 dark:text-orange-400' },
]

// Deterministic so the same category always lands on the same color across
// the listing and detail pages, without storing a color field on the post.
export function getCategoryStyle(category) {
  if (!category) return CATEGORY_PALETTE[0]
  let hash = 0
  for (let i = 0; i < category.length; i++) hash = (hash * 31 + category.charCodeAt(i)) >>> 0
  return CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length]
}

// True once a post has been saved again after the moment it was published —
// a plain publish (which also bumps updated_at to the same instant) doesn't
// count, only a later edit does.
export function wasEditedAfterPublish(post) {
  if (!post.updatedAt || !post.publishedAt) return false
  return new Date(post.updatedAt).getTime() - new Date(post.publishedAt).getTime() > 60_000
}
