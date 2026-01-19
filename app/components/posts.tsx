import Link from 'next/link'
import { formatDate, getBlogPosts } from 'app/projects/utils'

export function BlogPosts() {
  const allBlogs = getBlogPosts()

  return (
    <div className="flex flex-col gap-3">
      {allBlogs
        .sort((a, b) => {
          if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
            return -1
          }
          return 1
        })
        .map((post) => (
          <Link
            key={post.slug}
            href={`/projects/${post.slug}`}
            className="group flex items-start justify-between gap-4 rounded-lg border border-neutral-200 dark:border-neutral-800 px-4 py-3 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600"
          >
            <div className="flex w-full flex-col gap-2 md:flex-row md:items-baseline md:gap-6">
              <p className="text-neutral-600 dark:text-neutral-400 w-[140px] tabular-nums">
                {formatDate(post.metadata.publishedAt, false)}
              </p>

              <p className="text-neutral-900 dark:text-neutral-100 font-medium tracking-tight">
                {post.metadata.title}
              </p>
            </div>

            <span className="text-neutral-400 dark:text-neutral-600 transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        ))}
    </div>
  )
}
