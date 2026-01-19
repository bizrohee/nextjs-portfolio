import Link from 'next/link'
import { formatDate, getBlogPosts } from 'app/projects/utils'

export function BlogPosts() {
  let allBlogs = getBlogPosts()

  return (
    <div>
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
            className="group mb-6 block rounded-lg py-2 -mx-2 px-2 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            <div className="w-full flex flex-col gap-2 md:flex-row md:items-baseline md:gap-6">
              <p className="text-neutral-600 dark:text-neutral-400 w-[140px] tabular-nums">
                {formatDate(post.metadata.publishedAt, false)}
              </p>

              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight group-hover:underline underline-offset-4">
                {post.metadata.title}
              </p>
            </div>
          </Link>
        ))}
    </div>
  )
}
