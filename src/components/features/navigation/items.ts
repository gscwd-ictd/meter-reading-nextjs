import {
  Calendar,
  LucideIcon,
  Megaphone,
  Package,
  Settings,
  MapPinned,
  BookOpen,
  Send,
  CircleHelp,
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
  Users2Icon,
  MessageCircleWarning,
  FileText,
  Book,
  Scan,
  User2,
  UserCog2,
} from "lucide-react";

import UserIcon from "@images/user-icon.svg";

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

export const mainNav: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Package,
  },
  {
    title: "Meter Readers",
    url: "/meter-readers",
    icon: Users2Icon,
  },
  {
    title: "Schedules",
    url: "/schedules",
    icon: Calendar,
  },
  {
    title: "Zonebooks",
    icon: MapPinned,
    children: [
      { title: "List", url: "/zonebooks-list", icon: Book },
      { title: "Areas", url: "/areas", icon: Scan },
    ],
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
    title: "Notifications",
    url: "/notifications",
    icon: Megaphone,
  },
  {
    title: "User Accounts",
    url: "/user-accounts",
    icon: UserCog2,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export const secondaryNav: NavItem[] = [
  {
    title: "Documentation",
    url: "#",
    icon: BookOpen,
  },
  {
    title: "Feedback",
    url: "#",
    icon: Send,
  },
  {
    title: "Help",
    url: "#",
    icon: CircleHelp,
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
