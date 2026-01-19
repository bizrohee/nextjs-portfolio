import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { formatDate, getBlogPosts } from 'app/projects/utils'
import { baseUrl } from 'app/sitemap'

type Params = { slug: string }

export async function generateStaticParams() {
  const posts = getBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Params | Promise<Params>
}) {
  const { slug } = await params
  const post = getBlogPosts().find((p) => p.slug === slug)
  if (!post) return

  const { title, publishedAt: publishedTime, summary: description, image } =
    post.metadata

  const ogImage = image ? image : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/projects/${post.slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function Blog({
  params,
}: {
  params: Params | Promise<Params>
}) {
  const { slug } = await params
  const post = getBlogPosts().find((p) => p.slug === slug)

  if (!post) notFound()

  return (
    <section>
      <h1 className="title font-semibold text-2xl tracking-tighter">
        {post.metadata.title}
      </h1>

      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(post.metadata.publishedAt)}
        </p>
      </div>

      <article className="prose">
        <CustomMDX source={post.content} />
      </article>
    </section>
  )
}
