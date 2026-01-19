import { BlogPosts } from 'app/components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Brendan Birozy
      </h1>

      <p className="mb-4">
        {`I am a 3rd year Electrical Engineering student at California State Polytechnic University, Pomona. I have a passion for schematic and PCB design, 
        especially for automotive and vehicular applications. I have hands-on experience designing and routing multi-layer boards for our 
        Formula SAE EV, including its custom Battery management System and accompanying modules using KiCAD.`}
      </p>

      <p className="mb-6">
        Feel free to contact me or browse through my personal projects below.
      </p>

      {/* Contact */}
      <div className="mb-10 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
        <h2 className="font-semibold tracking-tight">Contact</h2>

        <div className="mt-3 flex flex-col gap-2 text-sm">
          <a
            href="mailto:brendanbirozy@gmail.com"
            className="text-blue-600 dark:text-blue-400 underline underline-offset-4"
          >
            brendanbirozy@gmail.com
          </a>

          <a
            href="https://linkedin.com/in/brendanbirozy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 underline underline-offset-4"
          >
            linkedin.com/in/brendanbirozy
          </a>

          <a
            href="/BRENDAN-BIROZY_EE.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 underline underline-offset-4"
          >
            Resume (PDF)
          </a>
        </div>
      </div>

      {/* Projects */}
      <h2 className="mb-4 text-xl font-semibold tracking-tighter">Projects</h2>
      <p className="mb-6 text-neutral-700 dark:text-neutral-300">
        These are large personal projects I’ve pursued independently or in the
        context of organizations outside of coursework and school labs, from
        initial research and design through implementation and testing.
      </p>

      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
