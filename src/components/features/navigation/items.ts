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
} from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  count?: number;
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
    title: "Personnel",
    url: "/personnel",
    icon: Users2Icon,
  },
  {
    title: "Schedule",
    url: "/schedule",
    icon: Calendar,
  },
  {
    title: "Zone - Book",
    url: "/zone-book",
    icon: MapPinned,
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
  name: "shadcn",
  email: "m@example.com",
  avatar: "https://github.com/shadcn.png",
};
