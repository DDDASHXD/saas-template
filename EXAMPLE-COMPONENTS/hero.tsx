import { ArrowRight, Blocks, MessagesSquare, MoveRight, Users } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Hero26Props {
  className?: string
}

const Hero26 = ({ className }: Hero26Props) => {
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
              <ArrowRight className="w-4" />
            </span>
          </a>
          <h1 className="mx-auto mt-4 mb-3 max-w-3xl text-4xl font-semibold text-balance lg:mb-7 lg:text-7xl">
            Unlock the power of collaboration
          </h1>
          <p className="m mx-auto max-w-3xl text-muted-foreground lg:text-xl">
            Collaboration 2.0 is the ultimate platform for
            <span className="relative top-[5px] mx-2 inline-flex font-medium text-primary md:top-[3px]">
              <Users className="mr-1 w-4 md:w-5" />
              Teams
            </span>
            to
            <span className="relative top-[5px] mx-2 inline-flex font-medium text-primary md:top-[3px]">
              <Blocks className="mr-1 w-5" />
              Collaborate,
            </span>
            <span className="relative top-[5px] mx-2 inline-flex font-medium text-primary md:top-[3px]">
              <MessagesSquare className="mr-1 w-5" />
              Communicate,
            </span>
            and achieve their goals. Get a head start with our free plan. No credit card required.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg">
              Get started for free
              <MoveRight className="ml-2" strokeWidth={1} />
            </Button>
            <Button size="lg" variant="ghost">
              Learn more
              <MoveRight className="ml-2" strokeWidth={1} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export { Hero26 }
