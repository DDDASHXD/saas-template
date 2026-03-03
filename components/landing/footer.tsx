import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import {
  NewTwitterIcon,
  GithubIcon,
  DiscordIcon,
  Linkedin02Icon,
  RedditIcon,
  TelegramIcon,
} from '@hugeicons/core-free-icons'

import { cn } from '@/lib/utils'
import { siteConfig } from '@/config'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const socialIcons: Record<string, IconSvgElement> = {
  twitter: NewTwitterIcon,
  github: GithubIcon,
  discord: DiscordIcon,
  linkedin: Linkedin02Icon,
  reddit: RedditIcon,
  telegram: TelegramIcon,
}

interface FooterProps {
  className?: string
}

const Footer = ({ className }: FooterProps) => {
  return (
    <section className={cn('py-32', className)}>
      <div className="container">
        <footer>
          <Link href="/" className="flex items-center">
            <img
              src={siteConfig.logo.full}
              alt={siteConfig.name}
              className="h-8"
            />
          </Link>
          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-4">
            {siteConfig.footer.categories.map((category) => (
              <div key={category.label}>
                <h3 className="mb-4 font-bold">{category.label}</h3>
                <ul className="space-y-4 text-muted-foreground">
                  {category.items.map((item) => (
                    <li
                      key={item.href}
                      className="font-medium hover:text-primary"
                    >
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="lg:col-span-2 xl:col-span-1">
              <ul className="mb-10 flex items-center gap-2 text-muted-foreground">
                {siteConfig.footer.socials.map((social) => {
                  const icon = socialIcons[social.platform]
                  if (!icon) return null
                  return (
                    <li key={social.platform}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="flex size-12 items-center justify-center rounded-full bg-muted transition-colors hover:text-primary">
                          <HugeiconsIcon icon={icon} size={24} />
                        </span>
                      </a>
                    </li>
                  )
                })}
              </ul>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="newsletter-email">
                  Subscribe to our newsletter
                </Label>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    id="newsletter-email"
                    type="email"
                    placeholder="Email"
                  />
                  <Button type="submit">Subscribe</Button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  By submitting, you agree to our
                  <Link
                    href="/privacy"
                    className="ml-1 text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-24 flex flex-col flex-wrap justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
            <p>
              &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
              reserved.
            </p>
            <ul className="flex gap-4">
              <li className="whitespace-nowrap underline hover:text-primary">
                <Link href="/tos">Terms and Conditions</Link>
              </li>
              <li className="whitespace-nowrap underline hover:text-primary">
                <Link href="/privacy">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </section>
  )
}

export { Footer }
