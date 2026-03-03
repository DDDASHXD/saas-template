'use client'
import {
  Book,
  ChevronRight,
  Code,
  Database,
  Globe,
  Layout,
  MenuIcon,
  Monitor,
  Paintbrush,
  Server,
  Settings,
  Shield,
  Sparkles,
  Terminal,
  Users,
  X,
} from 'lucide-react'
import { LucideIcon } from 'lucide-react'
import { forwardRef, Fragment, MouseEventHandler, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'

interface MenuLink {
  label?: string
  description?: string
  url: string
  icon?: LucideIcon
  image?: string
  background?: string
  company?: {
    logo: string
    name: string
  }
}

interface MenuGroup {
  title: string
  links: MenuLink[]
}

interface MenuItem {
  id?: number
  title: string
  url?: string
  links?: MenuLink[]
  featuredLinks?: MenuLink[]
  imageLink?: MenuLink
  groupLinks?: MenuGroup[]
}

interface DesktopMenuItemProps {
  item: MenuItem
  index: number
}

interface MobileNavigationMenuProps {
  open: boolean
}

type NavLinkProps = {
  link: MenuLink
  onMouseEnter?: MouseEventHandler<HTMLAnchorElement>
  onMouseLeave?: MouseEventHandler<HTMLAnchorElement>
  showDescription?: boolean
}

const LOGO = {
  url: 'https://www.shadcnblocks.com',
  src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg',
  alt: 'logo',
  title: 'Shadcnblocks.com',
}

const NAVIGATION: MenuItem[] = [
  {
    title: 'Products',
    id: 1,
    links: [
      {
        label: 'Insights',
        icon: Book,
        description: 'Latest company news, updates, insights, and announcements',
        url: '#',
        image:
          'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/jeremy-bishop-iEjCQtcsVPY-unsplash.jpg',
      },
      {
        label: 'Engineering',
        icon: Code,
        description: 'Deep technical articles, tutorials, guides, and documentation',
        url: '#',
        image:
          'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/carles-rabada-f7UprkNqi08-unsplash.jpg',
      },
      {
        label: 'Culture',
        icon: Users,
        description: 'Team values, experiences, stories, goals, and traditions',
        url: '#',
        image:
          'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/john-murphey-ZWUWSEY6OGk-unsplash.jpg',
      },
      {
        label: 'Press',
        icon: Globe,
        description: 'Mentions in media, interviews, articles, and publications',
        url: '#',
        image:
          'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/kevin-charit-1fL2Q1JcbNc-unsplash.jpg',
      },
      {
        label: 'API',
        icon: Monitor,
        description: 'Programmatic access using our secure REST API',
        url: '#',
        image:
          'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/pat-whelen-gWfpmH0H2bM-unsplash.jpg',
      },
      {
        label: 'CLI',
        icon: Terminal,
        description: 'Command line tools for automation and productivity',
        url: '#',
        image:
          'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/sam-wermut-FiUuNWxnb3k-unsplash.jpg',
      },
      {
        label: 'SDKs',
        icon: Code,
        description: 'Software kits for easy and fast integration',
        url: '#',
        image:
          'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/vasilis-karkalas-qOaeVSKyhhE-unsplash.jpg',
      },
    ],
  },
  {
    title: 'Solutions',
    id: 2,
    featuredLinks: [
      {
        label: 'Icons',
        icon: Sparkles,
        description: 'Lucide open-source icon library for developers',
        background:
          'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/john-murphey-ZWUWSEY6OGk-unsplash.jpg',
        url: '#',
      },
      {
        label: 'Themes',
        icon: Paintbrush,
        description: 'Customizable UI themes, styles, and appearance presets',
        background:
          'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/kevin-charit-1fL2Q1JcbNc-unsplash.jpg',
        url: '#',
      },
    ],
    links: [
      {
        description: 'Tailored eCommerce solutions for growing online businesses',
        url: '#',
        company: {
          logo: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-1.svg',
          name: 'ARC',
        },
      },
      {
        description: 'Optimized development tools for SaaS web platforms',
        url: '#',
        company: {
          logo: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-2.svg',
          name: 'descript',
        },
      },
      {
        description: 'Bank-grade security for finance-based web applications',
        url: '#',
        company: {
          logo: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-3.svg',
          name: 'MERCURY',
        },
      },
      {
        description: 'Healthcare infrastructure built for medical tech platforms',
        url: '#',
        company: {
          logo: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-4.svg',
          name: 'ramp',
        },
      },
    ],
  },
  {
    title: 'Platform',
    id: 3,
    imageLink: {
      url: '#',
      image:
        'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/carles-rabada-f7UprkNqi08-unsplash.jpg',
      label: 'Explore New Components',
    },
    groupLinks: [
      {
        title: 'Core Services',
        links: [
          {
            label: 'Hosting',
            icon: Server,
            description: 'Global infrastructure hosting your scalable web apps',
            url: '#',
          },
          {
            label: 'Auth',
            icon: Shield,
            description: 'Secure authentication and role-based user access',
            url: '#',
          },
          {
            label: 'Database',
            icon: Database,
            description: 'Reliable, scalable storage for application data needs',
            url: '#',
          },
        ],
      },
      {
        title: 'Design System',
        links: [
          {
            label: 'Components',
            icon: Layout,
            description: 'Reusable components built for consistent UI experiences',
            url: '#',
          },
          {
            label: 'Tokens',
            icon: Settings,
            description: 'Design tokens standardizing consistent branding elements',
            url: '#',
          },
          {
            label: 'Icons',
            icon: Sparkles,
            description: 'Lucide icons used across multiple interface elements',
            url: '#',
          },
        ],
      },
    ],
  },
  {
    title: 'Resources',
    url: '#',
  },
  {
    title: 'Pricing',
    url: '#',
  },
]

const BUTTON = {
  label: 'Sign up',
  isPrimary: true,
  url: '#',
}

const MOBILE_BREAKPOINT = 1024

interface Navbar10Props {
  className?: string
}

const Navbar10 = ({ className }: Navbar10Props) => {
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        setOpen(false)
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto'
  }, [open])

  const handleMobileMenu = () => {
    const nextOpen = !open
    setOpen(nextOpen)
  }

  return (
    <Fragment>
      <section
        className={cn(
          'pointer-events-auto absolute top-0 z-999 flex w-full items-center justify-center bg-background',
          className,
        )}
      >
        <NavigationMenu className="h-20 max-w-full after:absolute after:inset-0 after:z-998 after:block after:size-full after:bg-background after:content-[''] [&>div:last-child>div]:mt-0 [&>div:last-child>div]:animate-none [&>div:last-child>div]:rounded-none [&>div:last-child>div]:border-0 [&>div:last-child>div]:border-b [&>div:last-child>div]:!shadow-[0px_-1px_0px_0px_rgba(0,0,0,0.05),0px_0px_0px_1px_rgba(17,26,37,0.05),0px_2px_5px_0px_rgba(16,25,36,0.1),0px_5px_20px_0px_rgba(16,25,36,0.1)]">
          <div className="relative z-999 container grid w-full grid-cols-2 items-center justify-between gap-8 xl:grid-cols-3">
            <a
              href={LOGO.url}
              className="flex max-h-8 items-center gap-2 text-lg font-semibold tracking-tighter"
            >
              <img src={LOGO.src} alt={LOGO.alt} className="inline-block size-6" />
              <span className="hidden md:inline-block">{LOGO.title}</span>
            </a>
            <div className="hidden xl:flex">
              <NavigationMenuList>
                {NAVIGATION.map((item, index) => (
                  <DesktopMenuItem key={`desktop-link-${index}`} item={item} index={index} />
                ))}
              </NavigationMenuList>
            </div>
            <div className="justify-self-end">
              <div className="hidden xl:block">
                <Button variant="ghost">
                  <a href={BUTTON.url}>
                    {BUTTON.label}
                    <ChevronRight />
                  </a>
                </Button>
              </div>
              <div className="xl:hidden">
                <Button className="size-11" variant="ghost" size="icon" onClick={handleMobileMenu}>
                  {open ? (
                    <X className="size-5.5 stroke-foreground" />
                  ) : (
                    <MenuIcon className="size-5.5 stroke-foreground" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </NavigationMenu>
      </section>
      <MobileNavigationMenu open={open} />
    </Fragment>
  )
}

const DesktopMenuItem = ({ item, index }: DesktopMenuItemProps) => {
  if (item.links || item.featuredLinks || item.groupLinks) {
    return (
      <NavigationMenuItem key={`desktop-menu-item-${index}`} value={`${index}`}>
        <NavigationMenuTrigger className="h-fit bg-transparent font-normal text-foreground/60">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="hidden !rounded-xl !border-0 !p-0 xl:block">
          <div className="w-dvw animate-[fade-in-slide-down_0.35s_cubic-bezier(0.33,1,0.68,1)_forwards] px-8 pt-6 pb-12">
            <div className="container">
              {item.id === 1 && <DropdownMenu1 links={item.links} />}
              {item.id === 2 && (
                <DropdownMenu2 featuredLinks={item.featuredLinks} links={item.links} />
              )}
              {item.id === 3 && (
                <DropdownMenu3 groupLinks={item.groupLinks} imageLink={item.imageLink} />
              )}
            </div>
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  }

  return (
    <NavigationMenuItem key={`desktop-menu-item-${index}`} value={`${index}`}>
      <NavigationMenuLink
        href={item.url}
        className={`${navigationMenuTriggerStyle()} h-fit bg-transparent font-normal text-foreground/60`}
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}

const DropdownMenu1 = ({ links }: { links?: MenuLink[] }) => {
  const linksRef = useRef<HTMLAnchorElement[]>([])
  const imageRefs = useRef<HTMLDivElement[]>([])

  const updateImageClasses = (activeIndex: number) => {
    imageRefs.current.forEach((img, i) => {
      if (!img) return
      const isActive = i === activeIndex

      img.classList.toggle('opacity-100', isActive)
      img.classList.toggle('translate-y-0', isActive)
      img.classList.toggle('opacity-0', !isActive)
      img.classList.toggle('translate-y-20', !isActive)
      img.classList.toggle('z-10', isActive)
    })
  }

  const handleMouseEnter = (index: number) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    linksRef.current.forEach((link) => {
      if (link && link !== event.currentTarget) {
        link.classList.add('opacity-50')
      }
    })

    updateImageClasses(index)
  }

  const handleMouseLeave = () => {
    linksRef.current.forEach((link) => {
      link?.classList.remove('opacity-50')
    })

    updateImageClasses(0)
  }

  if (!links) return null

  return (
    <div className="grid grid-cols-2 gap-8">
      <ul className="grid grid-cols-2 gap-8">
        {links.map((link, index) => (
          <NavLink
            key={`default-nav-link-${index}`}
            link={link}
            onMouseEnter={handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            ref={(el) => {
              if (el) linksRef.current[index] = el
            }}
          />
        ))}
      </ul>
      <div className="relative !h-[16rem] w-full overflow-hidden rounded-lg bg-muted">
        {links.map((link, index) => (
          <div
            key={`default-nav-link-img-${index}`}
            ref={(el) => {
              if (el) imageRefs.current[index] = el
            }}
            className={`will-change-opacity absolute top-14 left-14 aspect-video w-[43.75rem] overflow-hidden rounded-tl-md border-t border-l transition-all duration-600 ease-in-out will-change-transform ${
              index === 0
                ? 'z-10 translate-y-0 opacity-100'
                : 'pointer-events-none z-0 translate-y-20 opacity-0'
            }`}
          >
            <img
              src={link.image}
              alt={link.label}
              className="size-full object-cover object-left-top"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

const DropdownMenu2 = ({
  links,
  featuredLinks,
}: {
  links?: MenuLink[]
  featuredLinks?: MenuLink[]
}) => {
  return (
    <div>
      <div className="flex gap-8 pb-8">
        {featuredLinks &&
          featuredLinks.map((link, index) => (
            <FeaturedLink key={`desktop-featured-link-${index}`} link={link} />
          ))}
      </div>
      <Separator />
      <div className="grid grid-cols-4 pt-8">
        {links &&
          links.map((link, index) => <NavLink key={`default-nav-link-${index}`} link={link} />)}
      </div>
    </div>
  )
}

const DropdownMenu3 = ({
  groupLinks,
  imageLink,
}: {
  groupLinks?: MenuGroup[]
  imageLink?: MenuLink
}) => {
  return (
    <div className="grid grid-cols-2 gap-8">
      <GroupLinks groupLinks={groupLinks} />
      <FeaturedImageLink link={imageLink} />
    </div>
  )
}

const GroupLinks = ({ groupLinks }: { groupLinks?: MenuGroup[] }) => {
  const linksRef = useRef<HTMLAnchorElement[]>([])

  const handleMouseEnter = () => (event: React.MouseEvent<HTMLAnchorElement>) => {
    linksRef.current.forEach((link) => {
      if (link && link !== event.currentTarget) {
        link.classList.add('opacity-50')
      }
    })
  }

  const handleMouseLeave = () => {
    linksRef.current.forEach((link) => {
      link?.classList.remove('opacity-50')
    })
  }

  if (!groupLinks) return null

  let linkIndex = 0
  return (
    <div className="grid grid-cols-2 gap-8">
      {groupLinks.map((group, index1) => (
        <div key={`group-link-${index1}`}>
          <div className="mb-4 text-xs text-muted-foreground">{group.title}</div>
          <ul className="flex flex-col gap-8">
            {group.links.map((link, index2) => {
              const index = linkIndex++
              return (
                <li key={`group-link-${index1}-${index2}`}>
                  <NavLink
                    link={link}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    ref={(el) => {
                      if (el) linksRef.current[index] = el
                    }}
                  />
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}

const FeaturedImageLink = ({ link }: { link?: MenuLink }) => {
  if (!link) return null

  return (
    <div className="hidden xl:block">
      <a href={link.url} className="w-full max-w-[36.875rem]">
        <AspectRatio ratio={1.77245509} className="overflow-hidden rounded-[0.25rem] bg-muted">
          <div className="size-full">
            <Badge className="absolute top-2 left-2">New</Badge>
            <div className="flex w-full flex-col items-center justify-center gap-8 pt-10">
              <div className="text-2xl font-semibold">{link.label}</div>
              <div className="w-[80%]">
                <AspectRatio ratio={1.5} className="overflow-hidden rounded-[0.25rem] bg-muted">
                  <img
                    src={link.image}
                    alt={link.label}
                    className="size-full object-cover object-left-top"
                  />
                </AspectRatio>
              </div>
            </div>
          </div>
        </AspectRatio>
      </a>
    </div>
  )
}

const FeaturedLink = ({ link }: { link: MenuLink }) => {
  return (
    <a
      href={link.url}
      className="group relative flex w-full overflow-hidden rounded-xl bg-muted px-8 py-7"
    >
      <div className="relative z-10 flex w-full items-center gap-6">
        <div className="flex size-12 shrink-0 rounded-lg border bg-background shadow-lg">
          {link.icon && <link.icon className="m-auto size-5 stroke-foreground" />}
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-lg font-semibold text-white">{link.label}</div>
          <div className="font-medium text-white/80">{link.description}</div>
        </div>
      </div>
      <img
        src={link.background}
        alt={link.label}
        className="absolute top-0 left-0 size-full object-cover object-left-top opacity-90 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
      />
    </a>
  )
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ link, onMouseEnter, onMouseLeave }, ref) => {
    return (
      <a
        ref={ref}
        href={link.url}
        className="flex w-full gap-2 transition-opacity duration-300"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {link.icon && (
          <div className="flex size-6 shrink-0 rounded-md border shadow">
            <link.icon className="m-auto size-3.5" />
          </div>
        )}
        <div className="flex flex-col items-start gap-2">
          {link.company && (
            <div className="block text-base leading-normal xl:hidden">{link.company.name}</div>
          )}
          {link.company && (
            <img className="hidden h-6 xl:block" src={link.company.logo} alt={link.company.name} />
          )}
          {link.label && <div className="text-base leading-normal">{link.label}</div>}
          <div className="text-sm leading-normal text-muted-foreground">{link.description}</div>
        </div>
      </a>
    )
  },
)

const MobileNavigationMenu = ({ open }: MobileNavigationMenuProps) => {
  return (
    <Sheet open={open}>
      <SheetContent
        aria-describedby={undefined}
        side="top"
        className="inset-0 z-998 h-dvh w-full bg-background pt-20 [&>button]:hidden"
      >
        <div className="flex-1 overflow-y-auto">
          <div className="container py-8">
            <div className="absolute -m-px h-px w-px overflow-hidden border-0 mask-clip-border p-0 text-nowrap whitespace-nowrap">
              <SheetTitle className="text-primary">Mobile Navigation</SheetTitle>
            </div>
            <div className="flex min-h-full flex-col gap-6">
              <Accordion type="multiple" className="w-full">
                {NAVIGATION.map((item, index) => renderMobileMenuItem(item, index))}
              </Accordion>

              <Button asChild>
                <a href={BUTTON.url}>{BUTTON.label}</a>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

const renderMobileMenuItem = (item: MenuItem, index: number) => {
  if (item.links || item.featuredLinks || item.groupLinks) {
    return (
      <AccordionItem key={item.title} value={`nav-${index}`} className="border-b-0">
        <AccordionTrigger className="h-[2.5rem] items-center text-base font-normal text-foreground hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-6 p-2">
          {item.featuredLinks && (
            <div className="flex flex-col gap-2 p-2">
              {item.featuredLinks.map((link, index) => (
                <NavLink key={`default-nav-link-${index}`} link={link} />
              ))}
            </div>
          )}

          {item.links && (
            <div className="flex flex-col gap-2 p-2">
              {item.links.map((link, index) => (
                <NavLink key={`default-nav-link-${index}`} link={link} />
              ))}
            </div>
          )}

          {item.groupLinks && (
            <div className="flex flex-col gap-2 p-2">
              {item.groupLinks.map((group, index1) => (
                <div className="mb-8 last:mb-0" key={`group-link-${index1}`}>
                  <div className="mb-4 text-xs text-muted-foreground">{group.title}</div>
                  <ul className="flex flex-col gap-2">
                    {group.links.map((link, index2) => (
                      <li key={`group-link-${index1}-${index2}`}>
                        <NavLink link={link} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    )
  }

  return (
    <a
      key={item.title}
      href={item.url}
      className="flex h-[2.5rem] items-center rounded-md text-left text-base leading-[3.75] font-normal text-foreground ring-ring/10 outline-ring/50 transition-all focus-visible:ring-4 focus-visible:outline-1 nth-last-1:border-0"
    >
      {item.title}
    </a>
  )
}

export { Navbar10 }
