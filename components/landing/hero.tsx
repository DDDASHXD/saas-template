import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowRight01Icon,
  UserShield01Icon,
  SidebarLeftIcon,
  DatabaseIcon,
} from '@hugeicons/core-free-icons'

import { siteConfig } from '@/config'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface HeroProps {
  className?: string
}

const Hero = ({ className }: HeroProps) => {
  const getStartedHref =
    siteConfig.auth.genericLoginType === 'emailAndPassword' && !siteConfig.auth.disableRegistration
      ? '/register'
      : '/login'

  return (
    <section className={cn('py-32', className)}>
      <div className="container">
        <div className="text-center">
          <a
            href="#features"
            className="mx-auto mb-3 inline-flex items-center gap-3 rounded-full border px-2 py-1 text-sm"
          >
            <Badge className="rounded-full">Next.js 16</Badge>
            React 19 + Tailwind v4
            <span className="flex size-7 items-center justify-center rounded-full bg-muted">
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </span>
          </a>
          <h1 className="mx-auto mt-4 mb-3 max-w-3xl text-4xl font-semibold text-balance lg:mb-7 lg:text-7xl">
            Production-ready SaaS starter
          </h1>
          <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
            Ship faster with a template that includes
            <span className="mx-2 inline-flex items-center gap-1 font-medium text-primary">
              <HugeiconsIcon icon={UserShield01Icon} size={20} className="shrink-0" />
              Auth,
            </span>
            <span className="mx-2 inline-flex items-center gap-1 font-medium text-primary">
              <HugeiconsIcon icon={SidebarLeftIcon} size={20} className="shrink-0" />
              Dashboard,
            </span>
            <span className="mx-2 inline-flex items-center gap-1 font-medium text-primary">
              <HugeiconsIcon icon={DatabaseIcon} size={20} className="shrink-0" />
              MongoDB,
            </span>
            and more. Clone, configure, and launch.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" nativeButton={false} render={<Link href={getStartedHref} />}>
              Get started
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              nativeButton={false}
              render={<Link href="#features" />}
            >
              View features
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export { Hero }
