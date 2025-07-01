"use client";

import * as React from "react";
import { NavMain, NavSecondary } from "./NavItems";
import { mainNav, secondaryNav, user } from "./items";
import { NavUser } from "./NavUser";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/Sidebar";
import { DropletsIcon } from "lucide-react";

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <DropletsIcon className="text-primary size-10" />
          <div className="flex flex-col">
            <span className="text-xl font-black text-primary flex">
              Me
              <span className="text-slate-500">To</span>Car
            </span>
            <span className="text-xs text-gray-500">Meter Reading Application</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between">
        <NavMain items={mainNav} />
        <NavSecondary items={secondaryNav} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
