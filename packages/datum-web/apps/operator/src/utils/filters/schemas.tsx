import {
  Building,
  ChartLine,
  Clock4,
  Clock8,
  Clock11,
  Coins,
  Cpu,
  Factory,
  GanttChartSquare,
  Hash,
  LineChart,
  Lock,
  LogOut,
  LucideProps,
  Mail,
  MailCheck,
  MapPin,
  Phone,
  Shapes,
  User,
  UserCheck,
  UserRoundCog,
  UserSquare2,
  Users,
  WalletCards,
} from 'lucide-react'

import { Datum } from '@repo/types'

const BOOLEAN_OPTIONS: Datum.FilterOption[] = [
  {
    key: 'Yes',
    value: true,
  },
  {
    key: 'No',
    value: false,
  },
]

export const CONTACT_FILTERS: Record<string, Datum.Filter> = {
  fullName: {
    icon: User,
    title: 'Has a name',
    operator: 'empty',
    options: BOOLEAN_OPTIONS,
  },
  address: {
    icon: MapPin,
    title: 'Has an address',
    operator: 'empty',
    options: BOOLEAN_OPTIONS,
  },
  email: {
    icon: Mail,
    title: 'Has an email',
    operator: 'empty',
    options: BOOLEAN_OPTIONS,
  },
  phoneNumber: {
    icon: Phone,
    title: 'Has a phone number',
    operator: 'empty',
    options: BOOLEAN_OPTIONS,
  },
  status: {
    icon: LogOut,
    title: 'Contact Status',
    operator: 'equals',
    options: [
      { key: 'Active', value: 'ACTIVE' },
      { key: 'Inactive', value: 'INACTIVE' },
      { key: 'Onboarding', value: 'ONBOARDING' },
      { key: 'Suspended', value: 'SUSPENDED' },
      { key: 'Deactivated', value: 'DEACTIVATED' },
    ],
  },
  company: {
    icon: Factory,
    title: 'Has a company',
    operator: 'empty',
    options: BOOLEAN_OPTIONS,
  },
  //   source: {
  //     icon: GanttChartSquare,
  //     title: 'Source',
  //     options: ['form']
  //   },
  //   lists: {
  //     icon: GanttChartSquare,
  //     title: 'Lists',
  //     options: [],
  //   },
}

export const USER_FILTERS: Record<string, Datum.Filter> = {
  firstName: {
    icon: User,
    title: 'Has a first name',
    operator: 'empty',
    options: BOOLEAN_OPTIONS,
  },
  lastName: {
    icon: User,
    title: 'Has a last name',
    operator: 'empty',
    options: BOOLEAN_OPTIONS,
  },
  email: {
    icon: Mail,
    title: 'Has an email',
    operator: 'empty',
    options: BOOLEAN_OPTIONS,
  },
  logins: {
    icon: Hash,
    title: 'Number of logins',
    operator: 'empty',
    options: BOOLEAN_OPTIONS,
  },
  role: {
    icon: UserCheck,
    title: 'Role',
    operator: 'equals',
    options: [
      { key: 'Admin', value: 'ADMIN' },
      { key: 'Member', value: 'MEMBER' },
    ],
  },
  status: {
    icon: UserCheck,
    title: 'User Status',
    operator: 'equals',
    options: [
      { key: 'Active', value: 'ACTIVE' },
      { key: 'Inactive', value: 'INACTIVE' },
      { key: 'Onboarding', value: 'ONBOARDING' },
      { key: 'Suspended', value: 'SUSPENDED' },
      { key: 'Deactivated', value: 'DEACTIVATED' },
    ],
  },
  provider: {
    icon: Factory,
    title: 'Has a provider',
    operator: 'empty',
    options: BOOLEAN_OPTIONS,
  },
}

export const ORGANISATION_FILTERS = {
  contact: {
    Location: {
      icon: <MapPin size={18} className="text-blackberry-400" />,
      values: {},
    },
    'Has workspace': {
      icon: <Building size={18} className="text-blackberry-400" />,
    },
    'Has organization': {
      icon: <Shapes size={18} className="text-blackberry-400" />,
    },
    'Has any email': {
      icon: <Mail size={18} className="text-blackberry-400" />,
    },
    'Has primary email': {
      icon: <MailCheck size={18} className="text-blackberry-400" />,
    },
    'Has phone number': {
      icon: <Phone size={18} className="text-blackberry-400" />,
    },
    'Has provider': {
      icon: <Cpu size={18} className="text-blackberry-400" />,
    },
    'First active': {
      icon: <Clock4 size={18} className="text-blackberry-400" />,
    },
    'Last active': {
      icon: <Clock8 size={18} className="text-blackberry-400" />,
    },
    'First seen': {
      icon: <Clock11 size={18} className="text-blackberry-400" />,
    },
    'Provider change': {
      icon: <Cpu size={18} className="text-blackberry-400" />,
    },
    'Password reset': {
      icon: <UserRoundCog size={18} className="text-blackberry-400" />,
    },
    'Failed login': {
      icon: <Lock size={18} className="text-blackberry-400" />,
    },
  },
  organizations: {
    'Organization size': {
      icon: <Users size={18} className="text-blackberry-400" />,
    },
    'Contact count': {
      icon: <Users size={18} className="text-blackberry-400" />,
    },
    'Capital raised': {
      icon: <Coins size={18} className="text-blackberry-400" />,
    },
    'Annual revenue': {
      icon: <ChartLine size={18} className="text-blackberry-400" />,
    },
    Industries: {
      icon: <Factory size={18} className="text-blackberry-400" />,
    },
    'First active': {
      icon: <Clock4 size={18} className="text-blackberry-400" />,
    },
    'Last active': {
      icon: <Clock8 size={18} className="text-blackberry-400" />,
    },
    'First seen': {
      icon: <Clock11 size={18} className="text-blackberry-400" />,
    },
  },
  product: {
    'Total logins': {
      icon: <LogOut size={18} className="text-blackberry-400" />,
    },
    'Total collaborators': {
      icon: <Users size={18} className="text-blackberry-400" />,
    },
    'Emails sent': {
      icon: <Mail size={18} className="text-blackberry-400" />,
    },
    '# of customer orgs': {
      icon: <Shapes size={18} className="text-blackberry-400" />,
    },
    '# of end users': {
      icon: <Users size={18} className="text-blackberry-400" />,
    },
    'Has phone number': {
      icon: <Phone size={18} className="text-blackberry-400" />,
    },
  },
  revenue: {
    'Last invoice': {
      icon: <GanttChartSquare size={18} className="text-blackberry-400" />,
    },
    'YTD spend': {
      icon: <Coins size={18} className="text-blackberry-400" />,
    },
    'Lifetime spend': {
      icon: <WalletCards size={18} className="text-blackberry-400" />,
    },
    'Has sales lead': {
      icon: <LineChart size={18} className="text-blackberry-400" />,
    },
    'Has sales manager': {
      icon: <UserSquare2 size={18} className="text-blackberry-400" />,
    },
    'Has success lead': {
      icon: <UserSquare2 size={18} className="text-blackberry-400" />,
    },
    'Has success manager': {
      icon: <UserSquare2 size={18} className="text-blackberry-400" />,
    },
    'Has custom terms': {
      icon: <GanttChartSquare size={18} className="text-blackberry-400" />,
    },
  },
}
