"use client";

import { ComponentPropsWithoutRef, FunctionComponent, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@mr/components/ui/Sidebar";
import { NavItem } from "./items";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useNavigationSplash } from "./NavigationSplashProvider";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@mr/components/ui/Tooltip";

type NavProps = {
  items: NavItem[];
};

// Helper function to render submenu items (no hooks inside)
const renderSubmenuItems = (children: NavItem[], router: any, showSplash: any, pathname: string) => (
  <div className="border-muted mt-1 ml-2 flex flex-col gap-1 border-l pl-4">
    {children.map((child) => (
      <SidebarMenuButton
        key={child.title}
        tooltip={child.title}
        size="sm"
        isActive={pathname.startsWith(child.url!)}
        onClick={() => {
          showSplash();
          router.push(child.url!);
        }}
        asChild
      >
        <Link
          href={child.url ? child.url : ""}
          target="_self"
          className="flex w-full items-center gap-2 text-gray-900 dark:text-gray-200"
        >
          {child.icon && <child.icon />}
          <span className="text-sm font-medium">{child.title}</span>
        </Link>
      </SidebarMenuButton>
    ))}
  </div>
);

export const NavMain: FunctionComponent<NavProps & ComponentPropsWithoutRef<typeof SidebarGroup>> = ({
  items,
  ...props
}) => {
  // ✅ All hooks at the top level - unconditionally called
  const pathname = usePathname();
  const router = useRouter();
  const reset = useSchedulesStore((state) => state.reset);
  const refetchData = useSchedulesStore((state) => state.refetchData);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const { state } = useSidebar();
  const { showSplash } = useNavigationSplash();

  // 🟢 Fix hydration: Use state to track if component has mounted on client
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Default to expanded view during SSR to match server render
  const isCollapsed = hasMounted ? state === "collapsed" : false;

  const toggleSubmenu = (title: string) => {
    if (!isCollapsed) {
      setOpenSubmenus((prev) => ({
        ...prev,
        [title]: !prev[title],
      }));
    }
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel className="font-semibold tracking-wide uppercase">General</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, index) => {
            const isSubmenuOpen = openSubmenus[item.title];

            return (
              <SidebarMenuItem key={index}>
                {item.children ? (
                  <div className="flex w-full flex-col">
                    {/* TooltipProvider is always rendered to maintain consistent hook order */}
                    <TooltipProvider>
                      <Tooltip open={hasMounted && isCollapsed ? undefined : false}>
                        <TooltipTrigger asChild>
                          <div>
                            <SidebarMenuButton
                              tooltip={item.title}
                              isActive={
                                Array.isArray(item.children) &&
                                item.children.some((child) => pathname.startsWith(child.url!))
                              }
                              onClick={() => !isCollapsed && toggleSubmenu(item.title)}
                              asChild={!isCollapsed}
                            >
                              {isCollapsed ? (
                                <Link
                                  href="#"
                                  className="flex w-full items-center gap-2"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  {item.icon && <item.icon />}
                                  <span className="flex-1 font-sans font-medium">{item.title}</span>
                                </Link>
                              ) : (
                                <a href={item.url}>
                                  {item.icon && <item.icon />}
                                  <span className="flex-1 font-sans font-medium">{item.title}</span>
                                  {isSubmenuOpen ? (
                                    <ChevronDownIcon className="h-4 w-4 opacity-70" />
                                  ) : (
                                    <ChevronRightIcon className="h-4 w-4 opacity-70" />
                                  )}
                                </a>
                              )}
                            </SidebarMenuButton>
                          </div>
                        </TooltipTrigger>
                        {hasMounted && isCollapsed && (
                          <TooltipContent side="right" className="flex flex-col gap-1 p-2">
                            {item.children?.map((child) => (
                              <Link
                                key={child.title}
                                href={child.url || ""}
                                className="hover:bg-accent flex items-center gap-2 rounded-md px-2 py-1"
                                onClick={() => {
                                  showSplash();
                                  router.push(child.url!);
                                }}
                              >
                                {child.icon && <child.icon className="h-4 w-4" />}
                                <span className="text-sm">{child.title}</span>
                              </Link>
                            ))}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>

                    {/* Show dropdown items when expanded and submenu open */}
                    {!isCollapsed &&
                      isSubmenuOpen &&
                      renderSubmenuItems(item.children, router, showSplash, pathname)}
                  </div>
                ) : (
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={
                      item.title === "Schedules"
                        ? pathname.startsWith("/schedules")
                        : pathname.startsWith(item.url || "")
                    }
                    onClick={() => {
                      // this is a special route, it should call the ff functions upon pressing
                      if (item.title === "Schedules") {
                        showSplash();
                        reset();
                        refetchData?.();

                        router.push(item.url!);
                      }
                      if (item.url) {
                        showSplash();
                        router.push(item.url);
                      }
                    }}
                    asChild
                  >
                    <Link
                      href={item.url ? item.url : ""}
                      target="_self"
                      className="flex w-full items-center gap-2 text-gray-900 dark:text-gray-200"
                    >
                      {item.icon && <item.icon className="size-4" />}
                      <span className="text-sm font-medium">{item.title}</span>
                      {item.count && (
                        <SidebarMenuBadge className="bg-destructive text-white">
                          {item.count}
                        </SidebarMenuBadge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export const NavMonitoringAndReports: FunctionComponent<
  NavProps & ComponentPropsWithoutRef<typeof SidebarGroup>
> = ({ items, ...props }) => {
  // ✅ All hooks at the top level - unconditionally called
  const pathname = usePathname();
  const router = useRouter();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const { state } = useSidebar();
  const { showSplash } = useNavigationSplash();

  // 🟢 Fix hydration: Use state to track if component has mounted on client
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Default to expanded view during SSR to match server render
  const isCollapsed = hasMounted ? state === "collapsed" : false;

  const toggleSubmenu = (title: string) => {
    if (!isCollapsed) {
      setOpenSubmenus((prev) => ({
        ...prev,
        [title]: !prev[title],
      }));
    }
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel className="font-semibold tracking-wide uppercase">
        Monitoring & Reports
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, index) => {
            const isSubmenuOpen = openSubmenus[item.title];

            return (
              <SidebarMenuItem key={index}>
                {item.children ? (
                  <div className="flex w-full flex-col">
                    {/* TooltipProvider is always rendered to maintain consistent hook order */}
                    <TooltipProvider>
                      <Tooltip open={hasMounted && isCollapsed ? undefined : false}>
                        <TooltipTrigger asChild>
                          <div>
                            <SidebarMenuButton
                              tooltip={item.title}
                              isActive={
                                Array.isArray(item.children) &&
                                item.children.some((child) => pathname.startsWith(child.url!))
                              }
                              onClick={() => !isCollapsed && toggleSubmenu(item.title)}
                            >
                              {item.icon && <item.icon />}
                              <span className="flex-1 font-sans font-medium">{item.title}</span>
                              {!isCollapsed &&
                                (isSubmenuOpen ? (
                                  <ChevronDownIcon className="h-4 w-4 opacity-70" />
                                ) : (
                                  <ChevronRightIcon className="h-4 w-4 opacity-70" />
                                ))}
                            </SidebarMenuButton>
                          </div>
                        </TooltipTrigger>
                        {hasMounted && isCollapsed && (
                          <TooltipContent side="right" className="flex flex-col gap-1 p-2">
                            {item.children?.map((child) => (
                              <Link
                                key={child.title}
                                href={child.url || ""}
                                className="hover:bg-accent flex items-center gap-2 rounded-md px-2 py-1"
                                onClick={() => {
                                  showSplash();
                                  router.push(child.url!);
                                }}
                              >
                                {child.icon && <child.icon className="h-4 w-4" />}
                                <span className="text-sm">{child.title}</span>
                              </Link>
                            ))}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>

                    {/* Show dropdown items when expanded and submenu open */}
                    {!isCollapsed &&
                      isSubmenuOpen &&
                      renderSubmenuItems(item.children, router, showSplash, pathname)}
                  </div>
                ) : (
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={pathname.startsWith(item.url || "")}
                    onClick={() => {
                      if (item.url) {
                        showSplash();
                        router.push(item.url);
                      }
                    }}
                    asChild
                  >
                    <Link
                      href={item.url ? item.url : ""}
                      target="_self"
                      className="flex w-full items-center gap-2 text-gray-900 dark:text-gray-200"
                    >
                      {item.icon && <item.icon className="size-4" />}
                      <span className="text-sm font-medium">{item.title}</span>
                      {item.count && (
                        <SidebarMenuBadge className="bg-destructive text-white">
                          {item.count}
                        </SidebarMenuBadge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export const NavMaintenance: FunctionComponent<NavProps & ComponentPropsWithoutRef<typeof SidebarGroup>> = ({
  items,
  ...props
}) => {
  // ✅ All hooks at the top level - unconditionally called
  const pathname = usePathname();
  const router = useRouter();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const { state } = useSidebar();
  const { showSplash } = useNavigationSplash();

  // 🟢 Fix hydration: Use state to track if component has mounted on client
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Default to expanded view during SSR to match server render
  const isCollapsed = hasMounted ? state === "collapsed" : false;

  const toggleSubmenu = (title: string) => {
    if (!isCollapsed) {
      setOpenSubmenus((prev) => ({
        ...prev,
        [title]: !prev[title],
      }));
    }
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>Maintenance</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, index) => {
            const isSubmenuOpen = openSubmenus[item.title];

            return (
              <SidebarMenuItem key={index}>
                {item.children ? (
                  <div className="flex w-full flex-col">
                    {/* TooltipProvider is always rendered to maintain consistent hook order */}
                    <TooltipProvider>
                      <Tooltip open={hasMounted && isCollapsed ? undefined : false}>
                        <TooltipTrigger asChild>
                          <div>
                            <SidebarMenuButton
                              tooltip={item.title}
                              isActive={
                                Array.isArray(item.children) &&
                                item.children.some((child) => pathname.startsWith(child.url!))
                              }
                              onClick={() => !isCollapsed && toggleSubmenu(item.title)}
                            >
                              {item.icon && <item.icon />}
                              <span className="flex-1">{item.title}</span>
                              {!isCollapsed &&
                                (isSubmenuOpen ? (
                                  <ChevronDownIcon className="h-4 w-4 opacity-70" />
                                ) : (
                                  <ChevronRightIcon className="h-4 w-4 opacity-70" />
                                ))}
                            </SidebarMenuButton>
                          </div>
                        </TooltipTrigger>
                        {hasMounted && isCollapsed && (
                          <TooltipContent side="right" className="flex flex-col gap-1 p-2">
                            {item.children?.map((child) => (
                              <Link
                                key={child.title}
                                href={child.url || ""}
                                className="hover:bg-accent flex items-center gap-2 rounded-md px-2 py-1"
                                onClick={() => {
                                  showSplash();
                                  router.push(child.url!);
                                }}
                              >
                                {child.icon && <child.icon className="h-4 w-4" />}
                                <span className="text-sm">{child.title}</span>
                              </Link>
                            ))}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>

                    {/* Show dropdown items when expanded and submenu open */}
                    {!isCollapsed &&
                      isSubmenuOpen &&
                      renderSubmenuItems(item.children, router, showSplash, pathname)}
                  </div>
                ) : (
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={pathname.startsWith(item.url || "")}
                    onClick={() => {
                      if (item.url) {
                        showSplash();
                        router.push(item.url);
                      }
                    }}
                    asChild
                  >
                    <Link
                      href={item.url ? item.url : ""}
                      target="_self"
                      className="flex w-full items-center gap-2 text-gray-900 dark:text-gray-200"
                    >
                      {item.icon && <item.icon className="size-4" />}
                      <span className="text-sm font-medium">{item.title}</span>
                      {item.count && (
                        <SidebarMenuBadge className="bg-destructive text-white">
                          {item.count}
                        </SidebarMenuBadge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export const NavSecondary: FunctionComponent<NavProps & ComponentPropsWithoutRef<typeof SidebarGroup>> = ({
  items,
  ...props
}) => {
  // ✅ All hooks at the top level - unconditionally called
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const router = useRouter();
  const reset = useSchedulesStore((state) => state.reset);
  const { state } = useSidebar();
  const { showSplash } = useNavigationSplash();

  // 🟢 Fix hydration: Use state to track if component has mounted on client
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Default to expanded view during SSR to match server render
  const isCollapsed = hasMounted ? state === "collapsed" : false;

  const toggleSubmenu = (title: string) => {
    if (!isCollapsed) {
      setOpenSubmenus((prev) => ({
        ...prev,
        [title]: !prev[title],
      }));
    }
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel className="font-semibold tracking-wide uppercase">Administration</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, index) => {
            const isSubmenuOpen = openSubmenus[item.title];

            return (
              <SidebarMenuItem key={index}>
                {item.children ? (
                  <div className="flex w-full flex-col">
                    {/* TooltipProvider is always rendered to maintain consistent hook order */}
                    <TooltipProvider>
                      <Tooltip open={hasMounted && isCollapsed ? undefined : false}>
                        <TooltipTrigger asChild>
                          <div>
                            <SidebarMenuButton
                              tooltip={item.title}
                              isActive={
                                Array.isArray(item.children) &&
                                item.children.some((child) => pathname.startsWith(child.url!))
                              }
                              onClick={() => !isCollapsed && toggleSubmenu(item.title)}
                            >
                              {item.icon && <item.icon />}
                              <span className="flex-1 font-medium">{item.title}</span>
                              {!isCollapsed &&
                                (isSubmenuOpen ? (
                                  <ChevronDownIcon className="h-4 w-4 opacity-70" />
                                ) : (
                                  <ChevronRightIcon className="h-4 w-4 opacity-70" />
                                ))}
                            </SidebarMenuButton>
                          </div>
                        </TooltipTrigger>
                        {hasMounted && isCollapsed && (
                          <TooltipContent side="right" className="flex flex-col gap-1 p-2">
                            {item.children?.map((child) => (
                              <Link
                                key={child.title}
                                href={child.url || ""}
                                className="hover:bg-accent flex items-center gap-2 rounded-md px-2 py-1"
                                onClick={() => {
                                  showSplash();
                                  router.push(child.url!);
                                }}
                              >
                                {child.icon && <child.icon className="h-4 w-4" />}
                                <span className="text-sm">{child.title}</span>
                              </Link>
                            ))}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>

                    {/* Show dropdown items when expanded and submenu open */}
                    {!isCollapsed &&
                      isSubmenuOpen &&
                      renderSubmenuItems(item.children, router, showSplash, pathname)}
                  </div>
                ) : (
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={pathname.startsWith(item.url || "")}
                    onClick={() => {
                      if (item.title === "Schedule") reset();
                      if (item.url) {
                        showSplash();
                        router.push(item.url);
                      }
                    }}
                    asChild
                  >
                    <Link
                      href={item.url ? item.url : ""}
                      target="_self"
                      className="flex w-full items-center gap-2 text-gray-900 dark:text-gray-200"
                    >
                      {item.icon && <item.icon className="size-4" />}
                      <span className="text-sm font-medium">{item.title}</span>
                      {item.count && (
                        <SidebarMenuBadge className="bg-destructive text-white">
                          {item.count}
                        </SidebarMenuBadge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export const NavDashboard: FunctionComponent<NavProps & ComponentPropsWithoutRef<typeof SidebarGroup>> = ({
  items,
  ...props
}) => {
  // ✅ All hooks at the top level - unconditionally called
  const pathname = usePathname();
  const router = useRouter();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const { state } = useSidebar();
  const { showSplash } = useNavigationSplash();

  // 🟢 Fix hydration: Use state to track if component has mounted on client
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Default to expanded view during SSR to match server render
  const isCollapsed = hasMounted ? state === "collapsed" : false;

  const toggleSubmenu = (title: string) => {
    if (!isCollapsed) {
      setOpenSubmenus((prev) => ({
        ...prev,
        [title]: !prev[title],
      }));
    }
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, index) => {
            const isSubmenuOpen = openSubmenus[item.title];

            return (
              <SidebarMenuItem key={index}>
                {item.children ? (
                  <div className="flex w-full flex-col">
                    {/* TooltipProvider is always rendered to maintain consistent hook order */}
                    <TooltipProvider>
                      <Tooltip open={hasMounted && isCollapsed ? undefined : false}>
                        <TooltipTrigger asChild>
                          <div>
                            <SidebarMenuButton
                              tooltip={item.title}
                              isActive={
                                Array.isArray(item.children) &&
                                item.children.some((child) => pathname.startsWith(child.url!))
                              }
                              onClick={() => !isCollapsed && toggleSubmenu(item.title)}
                            >
                              {item.icon && <item.icon />}
                              <span className="flex-1">{item.title}</span>
                              {!isCollapsed &&
                                (isSubmenuOpen ? (
                                  <ChevronDownIcon className="h-4 w-4 opacity-70" />
                                ) : (
                                  <ChevronRightIcon className="h-4 w-4 opacity-70" />
                                ))}
                            </SidebarMenuButton>
                          </div>
                        </TooltipTrigger>
                        {hasMounted && isCollapsed && (
                          <TooltipContent side="right" className="flex flex-col gap-1 p-2">
                            {item.children?.map((child) => (
                              <Link
                                key={child.title}
                                href={child.url || ""}
                                className="hover:bg-accent flex items-center gap-2 rounded-md px-2 py-1"
                                onClick={() => {
                                  showSplash();
                                  router.push(child.url!);
                                }}
                              >
                                {child.icon && <child.icon className="h-4 w-4" />}
                                <span className="text-sm">{child.title}</span>
                              </Link>
                            ))}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>

                    {/* Show dropdown items when expanded and submenu open */}
                    {!isCollapsed &&
                      isSubmenuOpen &&
                      renderSubmenuItems(item.children, router, showSplash, pathname)}
                  </div>
                ) : (
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={pathname.startsWith(item.url || "")}
                    onClick={() => {
                      if (item.url) {
                        showSplash();
                        router.push(item.url);
                      }
                    }}
                    asChild
                  >
                    <Link
                      href={item.url ? item.url : ""}
                      target="_self"
                      className="flex w-full items-center gap-2 text-gray-900 dark:text-gray-200"
                    >
                      {item.icon && <item.icon className="size-4" />}
                      <span className="text-sm font-medium">{item.title}</span>
                      {item.count && (
                        <SidebarMenuBadge className="bg-destructive text-white">
                          {item.count}
                        </SidebarMenuBadge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
