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
  SidebarMenuSub,
} from "@/components/ui/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/Collapsible";
import { ChevronRight } from "lucide-react";

type NavProps = {
  items: NavItem[];
};

export const NavMain: FunctionComponent<NavProps & ComponentPropsWithoutRef<typeof SidebarGroup>> = ({
  items,
  ...props
}) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) =>
          item.items ? (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
              <SidebarMenuItem key={index}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={item.items?.some((subItem) => pathname.startsWith(subItem.url))}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    {item.count && (
                      <SidebarMenuBadge className="mr-6 bg-destructive text-white">
                        {item.count}
                      </SidebarMenuBadge>
                    )}
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem, index) => (
                      <SidebarMenuItem key={index}>
                        <SidebarMenuButton
                          tooltip={subItem.title}
                          isActive={pathname.startsWith(subItem.url)}
                          onClick={() => router.push(subItem.url)}
                        >
                          {subItem.icon && <subItem.icon />}
                          <span>{subItem.title}</span>
                          {subItem.count && (
                            <SidebarMenuBadge className="bg-destructive text-white">
                              {subItem.count}
                            </SidebarMenuBadge>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={pathname.startsWith(item.url)}
                onClick={() => router.push(item.url)}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                {item.count && (
                  <SidebarMenuBadge className="bg-destructive text-white">{item.count}</SidebarMenuBadge>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
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
