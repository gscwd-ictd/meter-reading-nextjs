"use client";

import { ComponentPropsWithoutRef, type FunctionComponent } from "react";
import { NavItem } from "./items";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@mr/components/ui/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";

type NavProps = {
  items: NavItem[];
};

export const NavMain: FunctionComponent<NavProps & ComponentPropsWithoutRef<typeof SidebarGroup>> = ({
  items,
  ...props
}) => {
  const pathname = usePathname();
  const router = useRouter();

  // reset the state in calendar
  const reset = useSchedulesStore((state) => state.reset);

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton
              tooltip={item.title}
              isActive={pathname.startsWith(item.url)}
              onClick={() => {
                if (item.title === "Schedule") reset();
                router.push(item.url);
              }}
            >
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              {item.count && (
                <SidebarMenuBadge className="bg-destructive text-white">{item.count}</SidebarMenuBadge>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export const NavSecondary: FunctionComponent<NavProps & ComponentPropsWithoutRef<typeof SidebarGroup>> = ({
  items,
  ...props
}) => {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm">
                <a href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
