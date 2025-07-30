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
} from "@mr/components/ui/Sidebar";
import { GaugeCircleIcon } from "lucide-react";

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <GaugeCircleIcon className="text-primary size-10" />
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-0">
              <span className="text-primary flex text-xl font-black">Metra</span>
              <span className="text-xl font-black text-slate-500">X</span>
            </div>
            <span className="text-xs text-gray-500">Meter Reading Application</span>

            {/* Measures Daily Transactions  */}
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
