'use client'

import * as React from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import AutoScroll from 'embla-carousel-auto-scroll'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import {
  ArrowRight01Icon,
  DatabaseExportIcon,
  IconjarIcon,
  Key01Icon,
  Layout01Icon,
  Moon01Icon,
  PanelLeftIcon,
  SecurityCheckIcon,
  Settings02Icon,
  SourceCodeIcon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'

import { siteConfig } from '@/config'
import { cn } from '@/lib/utils'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

const gridItems: {
  title: string
  description: string
  icon: IconSvgElement
}[] = [
  {
    title: 'Landing Page',
    description: 'Responsive navigation, hero section, feature showcases, and footer out of the box.',
    icon: Layout01Icon,
  },
  {
    title: 'Application Shell',
    description: 'Collapsible sidebar, organization switcher, and user menu for your dashboard.',
    icon: PanelLeftIcon,
  },
  {
    title: 'Authentication',
    description: 'NextAuth v5 with email/password and optional OAuth (Google, GitHub, Discord, Twitter/X).',
    icon: SecurityCheckIcon,
  },
  {
    title: 'MongoDB',
    description: 'MongoDB integration with adapter for user storage and session management.',
    icon: DatabaseExportIcon,
  },
  {
    title: 'Centralized Config',
    description: 'Single config.ts for site name, logos, navigation, footer, and sidebar items.',
    icon: Settings02Icon,
  },
  {
    title: 'HugeIcons',
    description: '46,000+ icons throughout the template with tree-shakable imports.',
    icon: IconjarIcon,
  },
  {
    title: 'Dark Mode',
    description: 'Dark mode support via CSS variables and system preference detection.',
    icon: Moon01Icon,
  },
  {
    title: 'TypeScript',
    description: 'TypeScript with strict mode for type-safe development.',
    icon: SourceCodeIcon,
  },
]

interface FeaturesGridProps {
  className?: string
}

const FeaturesGrid = ({ className }: FeaturesGridProps) => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  return (
    <section className={cn('overflow-hidden py-32', className)} id="features">
      <div className="container flex w-full flex-col items-center justify-center px-4">
        <p className="rounded-full bg-muted px-4 py-1 text-xs uppercase">Features</p>
        <h2 className="relative z-20 py-2 text-center font-sans text-5xl font-semibold tracking-tighter md:py-7 lg:text-6xl">
          Production-ready out of the box
        </h2>
        <p className="text-md mx-auto max-w-xl text-center text-muted-foreground lg:text-lg">
          Next.js 16, React 19, Tailwind v4, shadcn/ui, and more.
        </p>

        <div className="relative mt-10 grid w-full max-w-4xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {gridItems.map((item, idx) => (
            <div
              key={idx}
              className="group relative block h-full w-full p-2"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <AnimatePresence mode="wait" initial={false}>
                {hoveredIndex === idx && (
                  <motion.span
                    className="absolute inset-0 block h-full w-full rounded-2xl bg-muted-foreground/20"
                    layoutId="hoverBackground"
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
              <div className="relative z-20 flex h-full flex-col items-center justify-center gap-4 rounded-2xl bg-muted p-5 text-center">
                <HugeiconsIcon
                  icon={item.icon}
                  size={32}
                  strokeWidth={1.5}
                  className="mt-3 text-muted-foreground"
                />
                <h3 className="text-2xl font-semibold tracking-tight">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const carouselItems: {
  title: string
  description: string
  icon: IconSvgElement
}[] = [
  {
    title: 'Next.js 16',
    description: 'App Router, server components, and the latest Next.js features.',
    icon: SourceCodeIcon,
  },
  {
    title: 'React 19',
    description: 'Latest React with improved performance and concurrent features.',
    icon: SourceCodeIcon,
  },
  {
    title: 'Tailwind CSS v4',
    description: 'Utility-first styling with the newest Tailwind release.',
    icon: Settings02Icon,
  },
  {
    title: 'shadcn/ui',
    description: 'Base UI primitives for accessible, customizable components.',
    icon: Layout01Icon,
  },
  {
    title: 'NextAuth v5',
    description: 'Auth.js with email/password and OAuth providers.',
    icon: Key01Icon,
  },
  {
    title: 'Framer Motion',
    description: 'Smooth animations and transitions throughout.',
    icon: SourceCodeIcon,
  },
  {
    title: 'Organization Switcher',
    description: 'Multi-tenant support with org switcher in the shell.',
    icon: UserGroupIcon,
  },
  {
    title: 'OAuth Providers',
    description: 'Google, GitHub, Discord, and Twitter/X ready to configure.',
    icon: SecurityCheckIcon,
  },
]

interface FeaturesCarouselProps {
  className?: string
}

const FeaturesCarousel = ({ className }: FeaturesCarouselProps) => {
  const getStartedHref =
    siteConfig.auth.genericLoginType === 'emailAndPassword' ? '/register' : '/login'

  return (
    <section className={cn('py-32', className)}>
      <div className="container">
        <div className="grid items-center gap-20 md:grid-cols-2">
          <div className="flex flex-col items-center gap-5 text-center md:items-start md:text-left">
            <span className="inline-flex items-center -space-x-4">
              <Avatar className="size-11 border lg:size-16">
                <AvatarImage
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp"
                  alt="User"
                />
              </Avatar>
              <Avatar className="size-11 border lg:size-16">
                <AvatarImage
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-6.webp"
                  alt="User"
                />
              </Avatar>
              <Avatar className="size-11 border lg:size-16">
                <AvatarImage
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp"
                  alt="User"
                />
              </Avatar>
            </span>
            <h2 className="text-3xl font-semibold md:text-5xl">
              Modern tech stack, zero setup
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Clone, configure config.ts, add your MongoDB URI, and ship.
            </p>
            <Button
              size="lg"
              className="w-fit gap-2"
              nativeButton={false}
              render={<Link href={getStartedHref} />}
            >
              Get started
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Button>
            <div className="grid grid-cols-2 justify-between gap-4 pt-10 text-left md:gap-20">
              <div className="flex flex-col gap-1">
                <h3 className="text-3xl font-semibold md:text-5xl">8+</h3>
                <p className="text-muted-foreground md:text-lg">Built-in features</p>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-3xl font-semibold md:text-5xl">MIT</h3>
                <p className="text-muted-foreground md:text-lg">License</p>
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:gap-7 lg:grid-cols-2">
            <Carousel
              opts={{ loop: true, align: 'start' }}
              plugins={[AutoScroll({ speed: 0.7 })]}
              orientation="vertical"
              className="pointer-events-none relative lg:hidden"
            >
              <CarouselContent className="max-h-[600px]">
                {carouselItems.map((feature, index) => (
                  <CarouselItem key={index}>
                    <div className="flex flex-col rounded-xl border p-5 md:p-7">
                      <HugeiconsIcon icon={feature.icon} size={32} />
                      <h3 className="mt-5 mb-2.5 font-semibold md:text-xl">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground md:text-base">
                        {feature.description}
                      </p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-background" />
            </Carousel>
            <Carousel
              opts={{ loop: true, align: 'start' }}
              plugins={[AutoScroll({ speed: 0.7 })]}
              orientation="vertical"
              className="pointer-events-none relative hidden lg:block"
            >
              <CarouselContent className="max-h-[600px]">
                {carouselItems.slice(0, 4).map((feature, index) => (
                  <CarouselItem key={index}>
                    <div className="flex flex-col rounded-xl border p-4 md:p-7">
                      <HugeiconsIcon icon={feature.icon} size={32} />
                      <h3 className="mt-5 mb-2.5 font-semibold md:text-xl">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground md:text-base">
                        {feature.description}
                      </p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-background" />
            </Carousel>
            <Carousel
              opts={{ loop: true, align: 'start' }}
              // This carousel moves in the reverse direction due to negative speed
              plugins={[AutoScroll({ speed: -0.7 })]}
              orientation="vertical"
              className="pointer-events-none relative hidden lg:block"
            >
              <CarouselContent className="max-h-[600px]">
                {carouselItems.slice(4).map((feature, index) => (
                  <CarouselItem key={index}>
                    <div className="flex flex-col rounded-xl border p-4 md:p-7">
                      <HugeiconsIcon icon={feature.icon} size={32} />
                      <h3 className="mt-5 mb-2.5 font-semibold md:text-xl">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground md:text-base">
                        {feature.description}
                      </p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-background" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  )
}

export { FeaturesGrid, FeaturesCarousel }
