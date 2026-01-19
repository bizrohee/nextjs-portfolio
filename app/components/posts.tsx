import Link from 'next/link'
import { formatDate, getBlogPosts } from 'app/projects/utils'

export function BlogPosts() {
  const allBlogs = getBlogPosts()

  return (
    <div className="flex flex-col gap-4">
      {allBlogs
        .sort((a, b) => {
          if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
            return -1
          }
          return 1
        })
        .map((post) => (
          <div
            key={post.slug}
            className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-6"
          >
            <p className="text-neutral-600 dark:text-neutral-400 w-[140px] tabular-nums">
              {formatDate(post.metadata.publishedAt, false)}
            </p>

            <Link
              href={`/projects/${post.slug}`}
              className="inline-flex w-fit items-center rounded-md border border-neutral-300 bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-900 shadow-sm transition-colors hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:focus-visible:ring-neutral-600"
            >
              {post.metadata.title}
              <span className="ml-2 opacity-70">→</span>
            </Link>
          </div>
        ))}
    </div>
  )
}
