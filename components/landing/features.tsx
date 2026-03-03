'use client'

import * as React from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import AutoScroll from 'embla-carousel-auto-scroll'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import {
  ArrowRight01Icon,
  Clock01Icon,
  CleanIcon,
  GlobeIcon,
  Message01Icon,
  Plug01Icon,
  SecurityCheckIcon,
  Settings02Icon,
  SourceCodeIcon,
  UserGroupIcon,
  ZapIcon,
} from '@hugeicons/core-free-icons'

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
    title: 'Plug & Play',
    description: 'Ready to use components that work out of the box with no configuration needed.',
    icon: Plug01Icon,
  },
  {
    title: 'Customizable',
    description: 'Fully customizable components with clean, maintainable code structure.',
    icon: SourceCodeIcon,
  },
  {
    title: 'Design Control',
    description: 'Complete control over styling and animations with modern design patterns.',
    icon: Settings02Icon,
  },
  {
    title: 'Regular Updates',
    description: 'Continuously updated with new features, improvements and fixes.',
    icon: Clock01Icon,
  },
  {
    title: 'Clean Code',
    description: 'Well-structured, readable code following industry best practices.',
    icon: CleanIcon,
  },
  {
    title: 'Performance',
    description: 'Optimized for speed and efficiency without compromising functionality.',
    icon: ZapIcon,
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
          Everything You Need
        </h2>
        <p className="text-md mx-auto max-w-xl text-center text-muted-foreground lg:text-lg">
          Perfectly balanced between performance and customization.
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
    title: 'Enterprise Security',
    description: 'Bank-grade encryption and security protocols for your data.',
    icon: SecurityCheckIcon,
  },
  {
    title: 'Global CDN',
    description: 'Lightning-fast delivery across the globe with our CDN.',
    icon: GlobeIcon,
  },
  {
    title: 'Open Source',
    description: 'Built on open standards with a transparent codebase.',
    icon: SourceCodeIcon,
  },
  {
    title: 'Configurable',
    description: 'Fine-tune every aspect to match your workflow.',
    icon: Settings02Icon,
  },
  {
    title: 'Blazing Fast',
    description: 'Optimized performance that scales with your needs.',
    icon: ZapIcon,
  },
  {
    title: '24/7 Support',
    description: 'Dedicated support team always ready to help.',
    icon: Message01Icon,
  },
  {
    title: 'Team Collaboration',
    description: 'Real-time collaboration tools for your entire team.',
    icon: UserGroupIcon,
  },
  {
    title: 'Reliable Uptime',
    description: '99.9% uptime guarantee with redundant infrastructure.',
    icon: Clock01Icon,
  },
]

interface FeaturesCarouselProps {
  className?: string
}

const FeaturesCarousel = ({ className }: FeaturesCarouselProps) => {
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
              Explore New Frontiers in Digital Innovation
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Join our journey to craft highly optimized web experiences.
            </p>
            <Button
              size="lg"
              className="w-fit gap-2"
              nativeButton={false}
              render={<Link href="/register" />}
            >
              View Features
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Button>
            <div className="grid grid-cols-2 justify-between gap-4 pt-10 text-left md:gap-20">
              <div className="flex flex-col gap-1">
                <h3 className="text-3xl font-semibold md:text-5xl">85%</h3>
                <p className="text-muted-foreground md:text-lg">Conversion boost</p>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-3xl font-semibold md:text-5xl">25k+</h3>
                <p className="text-muted-foreground md:text-lg">Happy Customers</p>
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
