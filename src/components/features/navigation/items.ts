import {
  Calendar,
  LucideIcon,
  Megaphone,
  Settings,
  MapPinned,
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
  Users2Icon,
  MessageCircleWarning,
  FileText,
  Book,
  Scan,
  UserCog2,
  Activity,
  CircleDashed,
  SquaresSubtract,
  Proportions,
} from "lucide-react";

import UserIcon from "@images/user-icon.svg";
import { format } from "date-fns";

export type NavItem = {
  title: string;
  url?: string;
  icon?: LucideIcon;
  isActive?: boolean;
  count?: number;
  children?: NavItem[];
};

export type NavItemTeam = {
  name: string;
  logo: React.ElementType;
  plan: string;
};

export type NavItemUser = {
  name: string;
  email: string;
  avatar: string;
};

const dateToday = new Date();
const currentYearMonth = format(dateToday, "yyyy-MM");

export const mainNav: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: SquaresSubtract,
  },
  {
    title: "Meter Readers",
    url: "/meter-readers",
    icon: Users2Icon,
  },
  {
    title: "Zonebooks",
    url: "/zonebooks",
    icon: Book,
  },
  {
    title: "Schedules",
    url: `/schedules?date=${currentYearMonth}`,
    icon: Calendar,
  },

  {
    title: "Text Blast",
    url: "/text-blast",
    icon: MessageCircleWarning,
  },
  {
    title: "Text Blast Reports",
    url: "/blast-reports",
    icon: FileText,
  },
  {
    title: "Monitoring",
    url: "/monitoring",
    icon: Activity,
    children: [
      { title: "Progress", url: "/monitoring/progress", icon: CircleDashed },
      { title: "Reports", url: "/monitoring/reports", icon: FileText },
    ],
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Megaphone,
  },
];

export const secondaryNav: NavItem[] = [
  { title: "Areas", url: "/areas", icon: MapPinned },
  { title: "Billing Adjustments", url: "/billing-adjustments", icon: Proportions },
  {
    title: "User Accounts",
    url: "/user-accounts",
    icon: UserCog2,
  },
];

export const teams: NavItemTeam[] = [
  {
    name: "Acme Inc",
    logo: GalleryVerticalEnd,
    plan: "Enterprise",
  },
  {
    name: "Acme Corp.",
    logo: AudioWaveform,
    plan: "Startup",
  },
  {
    name: "Evil Corp.",
    logo: Command,
    plan: "Free",
  },
];

export const user: NavItemUser = {
  name: "admin",
  email: "admin@gscwd.com",
  avatar: UserIcon.src,
};
