import {
  AppWindowMacIcon,
  AtSign,
  BarChart3Icon,
  BellIcon,
  CircleGaugeIcon,
  FileIcon,
  HandshakeIcon,
  LandmarkIcon,
  LayersIcon,
  ListChecks,
  Pencil,
  ScrollText,
  Settings,
  Settings2,
  SettingsIcon,
  ShapesIcon,
  ShieldCheck,
  ShoppingCartIcon,
  SlidersHorizontalIcon,
  UserPen,
  UserRoundCogIcon,
  Users,
} from 'lucide-react'

import { NavHeading, type NavItem, type Separator } from '@/types'

export const NavItems: (NavItem | Separator | NavHeading)[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: CircleGaugeIcon,
  },
  // {
  //   title: 'Activity Log',
  //   href: '/logs',
  //   icon: ScrollText,
  // },
  {
    type: 'separator',
  },
  {
    title: 'Customers',
    href: '/customers',
    icon: Users,
    isChildren: true,
    children: [
      { title: 'Users', href: '/customers/users' },
      // { title: 'Organizations', href: '/customers/organizations' },
    ],
  },
  {
    title: 'Marketing',
    href: '/marketing',
    icon: AtSign,
    isChildren: true,
    children: [
      { title: 'Contacts', href: '/marketing/contacts' },
      { title: 'Lists', href: '/marketing/contacts/lists' },
      // { title: 'Email Activity', href: '/marketing/email-activity' },
    ],
  },
  // {
  //   title: 'Sales',
  //   href: '/sales',
  //   icon: LandmarkIcon,
  //   isChildren: true,
  //   children: [
  //     { title: 'Prospects', href: '/sales/prospects' },
  //     { title: 'Territories', href: '/sales/territories' },
  //     { title: 'Rep Assignments', href: '/sales/rep-assignments' },
  //     { title: 'Deal Rooms', href: '/sales/deal-rooms' },
  //     { title: 'Quotes', href: '/sales/quotes' },
  //   ],
  // },
  // {
  //   title: 'Billing',
  //   href: '/orders',
  //   icon: ShoppingCartIcon,
  //   isChildren: true,
  //   children: [
  //     { title: 'Pending', href: '/orders/pending' },
  //     { title: 'Signed', href: '/orders/signed' },
  //     { title: 'Delivered', href: '/orders/delivered' },
  //     {
  //       title: 'Cancellations & Renewals',
  //       href: '/orders/cancellations-renewals',
  //     },
  //     { title: 'Compliance', href: '/orders/compliance' },
  //   ],
  // },
  {
    title: 'Back Office',
    href: '/relationships',
    icon: HandshakeIcon,
    isChildren: true,
    children: [
      // {
      //   title: 'Marketing Subscribers',
      //   href: '/relationships/marketing-subscribers',
      // },
      // { title: 'Partners', href: '/relationships/partners' },
      // { title: 'Marketplaces', href: '/relationships/marketplaces' },
      {
        title: 'Vendors',
        href: '/relationships/vendors',
      },
      // { title: 'Internal Users', href: '/relationships/internal-users' },
    ],
  },
  {
    type: 'separator',
  },
  {
    title: 'Workspace Settings',
    href: '/workspace/settings',
    icon: Settings,
    isChildren: true,
    children: [
      {
        title: 'General Settings',
        href: '/workspace/settings',
      },
      {
        title: 'Team Management',
        href: '/workspace/members',
      },
      // {
      //   title: 'Authentication',
      //   href: '/workspace/settings/authentication',
      // },
      // {
      //   title: 'Alerts & Preferences',
      //   href: '/workspace/settings/alerts-and-preferences',
      // },
      // {
      //   title: 'Developers',
      //   href: '/workspace/settings/developers',
      // },
      // {
      //   title: 'Billing & Usage',
      //   href: '/workspace/settings/billing-and-usage',
      // },
      // {
      //   title: 'End User Privacy',
      //   href: '/workspace/settings/end-user-privacy',
      // },
    ],
  },
  // {
  //   title: 'Product Configuration',
  //   href: '/product-configuration',
  //   icon: Settings2,
  //   isChildren: true,
  //   children: [
  //     {
  //       title: 'Branding',
  //       href: '/product-configuration/branding',
  //     },
  //     {
  //       title: 'Agreements & Policies',
  //       href: '/product-configuration/agreements-policies',
  //     },
  //     {
  //       title: 'Taxes, Payments, Localization',
  //       href: '/product-configuration/payments',
  //     },
  //     {
  //       title: 'Data Locality',
  //       href: '/product-configuration/data-locality',
  //     },
  //     {
  //       title: 'Users & Orgs',
  //       href: '/product-configuration/users-orgs',
  //     },
  //     {
  //       title: 'Product Experience',
  //       href: '/product-configuration/product-experience',
  //     },
  //     {
  //       title: 'Monetization',
  //       href: '/product-configuration/monetization',
  //     },
  //     {
  //       title: 'GTM',
  //       href: '/product-configuration/gtm',
  //     },
  //     {
  //       title: 'Management & Reporting',
  //       href: '/product-configuration/management-reporting',
  //     },
  //   ],
  // },
]

export const PersonalNavItems: (NavItem | Separator | NavHeading)[] = [
  {
    title: 'My Profile',
    href: '/profile',
    icon: UserPen,
  },
  {
    title: 'My Workspaces',
    href: '/workspace',
    icon: LayersIcon,
  },
  // {
  //   title: 'General Settings',
  //   href: '/settings',
  //   icon: Pencil,
  // },
  // {
  //   title: 'Notifications',
  //   href: '/notifications',
  //   icon: BellIcon,
  // },
  // {
  //   title: 'Security',
  //   href: '/security',
  //   icon: ShieldCheck,
  // },
]
