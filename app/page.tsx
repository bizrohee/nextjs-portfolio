import { BlogPosts } from 'app/components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        My Portfolio
      </h1>
      <p className="mb-4">
        {`I'm a 3rd year Electrical Engineering student at California State Polytechnic University, Pomona with a passion for schematic and PCB design, 
        especially for automotive and vehicular applications. I have hands-on experience designing and routing multi-layer boards for our 
        Formula SAE EV, including its custom Battery management System and accompanying modules using KiCAD.
        
        I am driven by the challenge of creating the robust and efficient electronics that power modern technology.`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
