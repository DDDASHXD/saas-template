'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Menu01Icon } from '@hugeicons/core-free-icons'

import { cn } from '@/lib/utils'
import { siteConfig } from '@/config'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface NavProps {
  className?: string
}

const Nav = ({ className }: NavProps) => {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const { status } = useSession()
  const isAuthenticated = status === 'authenticated'
  const getStartedHref =
    siteConfig.auth.genericLoginType === 'emailAndPassword' ? '/register' : '/login'

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background',
        className,
      )}
    >
      <div className="container flex h-16 items-center">
        <Link
          href="/"
          className="flex flex-1 items-center"
        >
          <img
            src={siteConfig.logo.full}
            alt={siteConfig.name}
            className="h-6"
          />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 md:flex">
          {siteConfig.nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden flex-1 items-center justify-end gap-2 md:flex">
          {isAuthenticated ? (
            <Button nativeButton={false} render={<Link href="/overview" />}>
              Dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" nativeButton={false} render={<Link href="/login" />}>
                Sign In
              </Button>
              <Button nativeButton={false} render={<Link href={getStartedHref} />}>
                Get Started
              </Button>
            </>
          )}
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden" />
            }
          >
            <HugeiconsIcon icon={Menu01Icon} size={20} />
          </SheetTrigger>
          <SheetContent side="right">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <nav className="flex flex-col gap-4 p-4">
              {siteConfig.nav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium transition-colors hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2 border-t pt-4">
                {isAuthenticated ? (
                  <Button nativeButton={false} render={<Link href="/overview" />}>
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" nativeButton={false} render={<Link href="/login" />}>
                      Sign In
                    </Button>
                    <Button nativeButton={false} render={<Link href={getStartedHref} />}>
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

export { Nav }
