import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowRight01Icon,
  UserGroupIcon,
  SourceCodeIcon,
  BubbleChatIcon,
} from '@hugeicons/core-free-icons'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface HeroProps {
  className?: string
}

const Hero = ({ className }: HeroProps) => {
  return (
    <section className={cn('py-32', className)}>
      <div className="container">
        <div className="text-center">
          <a
            href="#"
            className="mx-auto mb-3 inline-flex items-center gap-3 rounded-full border px-2 py-1 text-sm"
          >
            <Badge className="rounded-full">NEW</Badge>
            Introducing Collaboration 2.0
            <span className="flex size-7 items-center justify-center rounded-full bg-muted">
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </span>
          </a>
          <h1 className="mx-auto mt-4 mb-3 max-w-3xl text-4xl font-semibold text-balance lg:mb-7 lg:text-7xl">
            Unlock the power of collaboration
          </h1>
          <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
            Collaboration 2.0 is the ultimate platform for
            <span className="relative top-[5px] mx-2 inline-flex font-medium text-primary md:top-[3px]">
              <HugeiconsIcon icon={UserGroupIcon} size={20} className="mr-1" />
              Teams
            </span>
            to
            <span className="relative top-[5px] mx-2 inline-flex font-medium text-primary md:top-[3px]">
              <HugeiconsIcon
                icon={SourceCodeIcon}
                size={20}
                className="mr-1"
              />
              Collaborate,
            </span>
            <span className="relative top-[5px] mx-2 inline-flex font-medium text-primary md:top-[3px]">
              <HugeiconsIcon
                icon={BubbleChatIcon}
                size={20}
                className="mr-1"
              />
              Communicate,
            </span>
            and achieve their goals. Get a head start with our free plan. No
            credit card required.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" nativeButton={false} render={<Link href="/register" />}>
              Get started for free
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Button>
            <Button size="lg" variant="ghost">
              Learn more
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export { Hero }
