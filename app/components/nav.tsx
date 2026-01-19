import Link from 'next/link'

const navItems = {
  '/': { name: 'home' },
  '/projects': { name: 'personal projects' },
}

export function Navbar() {
  return (
    <aside className="mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-start relative pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          {/* -ml-2 cancels the first link's px-2 so "home" aligns with page content */}
          <div className="flex flex-row gap-2 pr-10 -ml-2">
            {Object.entries(navItems).map(([path, { name }]) => (
              <Link
                key={path}
                href={path}
                className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2"
              >
                {name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  )
}
