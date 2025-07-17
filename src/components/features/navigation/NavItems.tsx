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
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (title: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
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
                            onClick={() => router.push(child.url!)}
                          >
                            {child.icon && <child.icon />}
                            <span className="text-sm">{child.title}</span>
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
                    if (item.url) router.push(item.url);
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
    </SidebarGroup>
  );
};

export const NavSecondary: FunctionComponent<NavProps & ComponentPropsWithoutRef<typeof SidebarGroup>> = ({
  items,
  ...props
}) => {
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (title: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const hasChildren = Array.isArray(item.children);
            const isOpen = openSubmenus[item.title];

            return (
              <SidebarMenuItem key={item.title}>
                {hasChildren ? (
                  <div className="flex w-full flex-col">
                    <SidebarMenuButton
                      tooltip={item.title}
                      size="sm"
                      onClick={() => toggleSubmenu(item.title)}
                    >
                      {item.icon && <item.icon />}
                      <span className="flex-1">{item.title}</span>
                      {isOpen ? (
                        <ChevronDownIcon className="h-4 w-4 opacity-70" />
                      ) : (
                        <ChevronRightIcon className="h-4 w-4 opacity-70" />
                      )}
                    </SidebarMenuButton>

                    {isOpen && (
                      <div className="border-muted mt-1 ml-2 flex flex-col gap-1 border-l pl-4">
                        {Array.isArray(item.children) &&
                          item.children.map((child) => (
                            <SidebarMenuButton key={child.title} asChild size="sm">
                              <a href={child.url}>
                                <span>{child.title}</span>
                              </a>
                            </SidebarMenuButton>
                          ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <SidebarMenuButton asChild size="sm">
                    <a href={item.url ?? "#"}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </a>
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
