import { BlogPosts } from 'app/components/posts'

export const metadata = {
  title: 'personal projects',
  description: 'Personal projects that I have completed outside of the classroom and labs.',
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Projects</h1>
      <BlogPosts />
    </section>
  )
}
