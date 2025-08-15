"use client";

import { ComponentPropsWithoutRef, FunctionComponent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@mr/components/ui/Sidebar";
import { NavItem } from "./items";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useNavigationSplash } from "./NavigationSplashProvider";

type NavProps = {
  items: NavItem[];
};

export const NavMain: FunctionComponent<NavProps & ComponentPropsWithoutRef<typeof SidebarGroup>> = ({
  items,
  ...props
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const reset = useSchedulesStore((state) => state.reset);
  const refetchData = useSchedulesStore((state) => state.refetchData);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (title: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const { showSplash } = useNavigationSplash();

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
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={
                        Array.isArray(item.children) &&
                        item.children.some((child) => pathname.startsWith(child.url!))
                      }
                      onClick={() => toggleSubmenu(item.title)}
                    >
                      {item.icon && <item.icon />}
                      <span className="flex-1 font-sans font-medium">{item.title}</span>
                      {isSubmenuOpen ? (
                        <ChevronDownIcon className="h-4 w-4 opacity-70" />
                      ) : (
                        <ChevronRightIcon className="h-4 w-4 opacity-70" />
                      )}
                    </SidebarMenuButton>

                    {isSubmenuOpen && (
                      <div className="border-muted mt-1 ml-2 flex flex-col gap-1 border-l pl-4">
                        {Array.isArray(item.children) &&
                          item.children.map((child) => (
                            <SidebarMenuButton
                              key={child.title}
                              tooltip={child.title}
                              size="sm"
                              isActive={pathname.startsWith(child.url!)}
                              onClick={() => {
                                showSplash("Loading...", child.url);
                                router.push(child.url!);
                              }}
                            >
                              {child.icon && <child.icon />}
                              <span className="text-sm font-medium">{child.title}</span>
                            </SidebarMenuButton>
                          ))}
                      </div>
                    )}
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
                      if (item.title === "Schedules") {
                        showSplash("Loading...", item.url);
                        reset();
                        refetchData?.();

                        router.push(item.url!);
                      }
                      if (item.url) {
                        showSplash("Loading...", item.url);
                        router.push(item.url);
                      }
                    }}
                  >
                    {item.icon && <item.icon />}
                    <span className="text-sm font-medium">{item.title}</span>
                    {item.count && (
                      <SidebarMenuBadge className="bg-destructive text-white">{item.count}</SidebarMenuBadge>
                    )}
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
  const pathname = usePathname();
  const router = useRouter();
  const reset = useSchedulesStore((state) => state.reset);
  const refetchData = useSchedulesStore((state) => state.refetchData);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (title: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const { showSplash } = useNavigationSplash();

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
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={
                        Array.isArray(item.children) &&
                        item.children.some((child) => pathname.startsWith(child.url!))
                      }
                      onClick={() => toggleSubmenu(item.title)}
                    >
                      {item.icon && <item.icon />}
                      <span className="flex-1 font-sans font-medium">{item.title}</span>
                      {isSubmenuOpen ? (
                        <ChevronDownIcon className="h-4 w-4 opacity-70" />
                      ) : (
                        <ChevronRightIcon className="h-4 w-4 opacity-70" />
                      )}
                    </SidebarMenuButton>

                    {isSubmenuOpen && (
                      <div className="border-muted mt-1 ml-2 flex flex-col gap-1 border-l pl-4">
                        {Array.isArray(item.children) &&
                          item.children.map((child) => (
                            <SidebarMenuButton
                              key={child.title}
                              tooltip={child.title}
                              size="sm"
                              isActive={pathname.startsWith(child.url!)}
                              onClick={() => {
                                showSplash("Loading...", child.url);
                                router.push(child.url!);
                              }}
                            >
                              {child.icon && <child.icon />}
                              <span className="text-sm font-medium">{child.title}</span>
                            </SidebarMenuButton>
                          ))}
                      </div>
                    )}
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
                      if (item.title === "Schedules") {
                        showSplash("Loading...", item.url);
                        reset();
                        refetchData?.();

                        router.push(item.url!);
                      }
                      if (item.url) {
                        showSplash("Loading...", item.url);
                        router.push(item.url);
                      }
                    }}
                  >
                    {item.icon && <item.icon />}
                    <span className="text-sm font-medium">{item.title}</span>
                    {item.count && (
                      <SidebarMenuBadge className="bg-destructive text-white">{item.count}</SidebarMenuBadge>
                    )}
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
  const pathname = usePathname();
  const router = useRouter();
  const reset = useSchedulesStore((state) => state.reset);
  const refetchData = useSchedulesStore((state) => state.refetchData);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (title: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const { showSplash } = useNavigationSplash();

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
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={
                        Array.isArray(item.children) &&
                        item.children.some((child) => pathname.startsWith(child.url!))
                      }
                      onClick={() => toggleSubmenu(item.title)}
                    >
                      {item.icon && <item.icon />}
                      <span className="flex-1">{item.title}</span>
                      {isSubmenuOpen ? (
                        <ChevronDownIcon className="h-4 w-4 opacity-70" />
                      ) : (
                        <ChevronRightIcon className="h-4 w-4 opacity-70" />
                      )}
                    </SidebarMenuButton>

                    {isSubmenuOpen && (
                      <div className="border-muted mt-1 ml-2 flex flex-col gap-1 border-l pl-4">
                        {Array.isArray(item.children) &&
                          item.children.map((child) => (
                            <SidebarMenuButton
                              key={child.title}
                              tooltip={child.title}
                              size="sm"
                              isActive={pathname.startsWith(child.url!)}
                              onClick={() => {
                                showSplash("Loading...", child.url);
                                router.push(child.url!);
                              }}
                            >
                              {child.icon && <child.icon />}
                              <span>{child.title}</span>
                            </SidebarMenuButton>
                          ))}
                      </div>
                    )}
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
                      if (item.title === "Schedules") {
                        showSplash("Loading...", item.url);
                        reset();
                        refetchData?.();

                        router.push(item.url!);
                      }
                      if (item.url) {
                        showSplash("Loading...", item.url);
                        router.push(item.url);
                      }
                    }}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    {item.count && (
                      <SidebarMenuBadge className="bg-destructive text-white">{item.count}</SidebarMenuBadge>
                    )}
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
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const router = useRouter();
  const reset = useSchedulesStore((state) => state.reset);
  const { showSplash } = useNavigationSplash();

  const toggleSubmenu = (title: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
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
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={
                        Array.isArray(item.children) &&
                        item.children.some((child) => pathname.startsWith(child.url!))
                      }
                      onClick={() => toggleSubmenu(item.title)}
                    >
                      {item.icon && <item.icon />}
                      <span className="flex-1 font-medium">{item.title}</span>
                      {isSubmenuOpen ? (
                        <ChevronDownIcon className="h-4 w-4 opacity-70" />
                      ) : (
                        <ChevronRightIcon className="h-4 w-4 opacity-70" />
                      )}
                    </SidebarMenuButton>

                    {isSubmenuOpen && (
                      <div className="border-muted mt-1 ml-2 flex flex-col gap-1 border-l pl-4">
                        {Array.isArray(item.children) &&
                          item.children.map((child) => (
                            <SidebarMenuButton
                              key={child.title}
                              tooltip={child.title}
                              size="sm"
                              isActive={pathname.startsWith(child.url!)}
                              onClick={() => {
                                showSplash("Loading...", child.url);
                                router.push(child.url!);
                              }}
                            >
                              {child.icon && <child.icon />}
                              <span className="">{child.title}</span>
                            </SidebarMenuButton>
                          ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={pathname.startsWith(item.url || "")}
                    onClick={() => {
                      if (item.title === "Schedule") reset();
                      if (item.url) {
                        showSplash("Loading", item.url);
                        router.push(item.url);
                      }
                    }}
                  >
                    {item.icon && <item.icon />}
                    <span className="font-medium">{item.title}</span>
                    {item.count && (
                      <SidebarMenuBadge className="bg-destructive text-white">{item.count}</SidebarMenuBadge>
                    )}
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
