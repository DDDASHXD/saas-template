import Link from 'next/link'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderDescription,
  ShellContentHeaderTitle,
} from '@/components/shell'

const pageLinks = [
  {
    title: '403 Forbidden',
    href: '/pages/errors/403',
    description: 'Permission denied state with a clear next action.',
  },
  {
    title: '404 Not Found',
    href: '/pages/errors/404',
    description: 'Missing route page and dead-link experience.',
  },
  {
    title: '500 Server Error',
    href: '/pages/errors/500',
    description: 'Unexpected runtime failure fallback.',
  },
]

const PagesIndexPage = () => {
  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>Pages</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>
          Browse reusable UI pages, including production-ready error experiences.
        </ShellContentHeaderDescription>
      </ShellContentHeader>
      <ShellBody>
        <div className="grid gap-3 md:grid-cols-3">
          {pageLinks.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="group rounded-2xl border bg-card p-4 transition-colors hover:bg-accent"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <h3 className="font-medium">{page.title}</h3>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={16}
                  className="text-muted-foreground transition-transform group-hover:translate-x-0.5"
                />
              </div>
              <p className="text-sm text-muted-foreground">{page.description}</p>
            </Link>
          ))}
        </div>
      </ShellBody>
    </>
  )
}

export default PagesIndexPage
