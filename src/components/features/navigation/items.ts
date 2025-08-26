import {
  Calendar,
  LucideIcon,
  MapPinned,
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
  Users2Icon,
  MessageCircleWarning,
  FileText,
  Book,
  UserCog2,
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
];

export const reportsNav: NavItem[] = [
  { title: "Progress", url: "/progress", icon: CircleDashed },
  {
    title: "Reports",
    icon: FileText,
    children: [
      {
        title: "Meter Reading Schedule",
        url: "/reports/meter-reading-schedule",
      },
      {
        title: "Monthly Billing Summary",
        url: "/reports/monthly-billing-summary",
      },
      {
        title: "Summary of Bills",
        url: "/reports/summary-of-bills",
      },
      {
        title: "Text Blast",
        url: "/reports/text-blast",
      },
    ],
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
