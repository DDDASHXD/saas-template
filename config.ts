import {
  DocumentAttachmentIcon,
  HelpCircleIcon,
  Home01Icon,
  InformationCircleIcon,
  KeyIcon,
  LinkCircleIcon,
  Notification03Icon,
  PaintBrushIcon,
  SecurityCheckIcon,
  TimeScheduleIcon,
  UserAccountIcon,
  UserGroupIcon,
  UserSettingsIcon,
  DatabaseExportIcon,
  CoinsDollarIcon,
} from '@hugeicons/core-free-icons'

import type { SiteConfig } from '@/types'

export const siteConfig: SiteConfig = {
  name: 'SaaS Template',
  description:
    'A production-ready SaaS starter template built with Next.js 16, React 19, and Tailwind CSS v4.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  auth: {
    requireEmailConfirmation: true,
    genericLoginType: 'emailAndPassword',
  },

  logo: {
    full: '/assets/logo.svg',
    icon: '/assets/logo-icon.svg',
  },

  nav: [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
    { label: 'Docs', href: '/docs' },
  ],

  footer: {
    categories: [
      {
        label: 'Product',
        items: [
          { label: 'Features', href: '/#features' },
          { label: 'Pricing', href: '/pricing' },
          { label: 'Changelog', href: '/changelog' },
          { label: 'Docs', href: '/docs' },
        ],
      },
      {
        label: 'Company',
        items: [
          { label: 'About', href: '/about' },
          { label: 'Blog', href: '/blog' },
          { label: 'Careers', href: '/careers' },
          { label: 'Contact', href: '/contact' },
        ],
      },
      {
        label: 'Legal',
        items: [
          { label: 'Terms of Service', href: '/tos' },
          { label: 'Privacy Policy', href: '/privacy' },
        ],
      },
    ],
    socials: [
      { platform: 'twitter', href: 'https://x.com' },
      { platform: 'github', href: 'https://github.com' },
      { platform: 'discord', href: 'https://discord.gg' },
    ],
  },

  dashboard: {
    sidebar: {
      items: [
        { title: 'Home', href: '/overview', icon: Home01Icon },
        { title: 'Projects', href: '/projects', icon: DocumentAttachmentIcon },
      ],
      utilities: [{ title: 'Help & Support', href: '/help', icon: HelpCircleIcon }],
    },
    settings: [
      {
        label: 'General',
        items: [
          { id: 'account', label: 'Account', icon: UserAccountIcon },
          { id: 'appearance', label: 'Appearance', icon: PaintBrushIcon },
          { id: 'connections', label: 'Connections', icon: LinkCircleIcon },
          { id: 'time-zones', label: 'Time Zones', icon: TimeScheduleIcon },
          { id: 'about', label: 'About', icon: InformationCircleIcon },
          { id: 'notifications', label: 'Notifications', icon: Notification03Icon },
        ],
      },
      {
        label: 'My Team',
        items: [
          { id: 'user-management', label: 'User Management', icon: UserGroupIcon },
          { id: 'permissions', label: 'Permissions', icon: KeyIcon },
          { id: 'authentication', label: 'Authentication', icon: SecurityCheckIcon },
          { id: 'payments', label: 'Payments', icon: CoinsDollarIcon },
          { id: 'security', label: 'Security & Access', icon: UserSettingsIcon },
          { id: 'import-export', label: 'Import / Export Data', icon: DatabaseExportIcon },
        ],
      },
    ],
  },
}
