"use client";

import * as React from "react";
import { NavMain, NavMonitoringAndReports, NavSecondary } from "./NavItems";
import { mainNav, reportsNav, secondaryNav, user } from "./items";
import { NavUser } from "./NavUser";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@mr/components/ui/Sidebar";
import { GaugeCircleIcon } from "lucide-react";

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { state, isMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props} variant="inset">
      <SidebarHeader>
        <div
          className={`flex items-center ${state === "collapsed" ? "justify-center" : "justify-start"} gap-2`}
        >
          {(state === "expanded" || isMobile) && <GaugeCircleIcon className="text-primary size-10" />}
          <div className="flex flex-col items-start">
            {(state === "expanded" || isMobile) && (
              <div className="flex w-full items-center gap-0">
                <span className="text-primary flex text-xl font-black">Metra</span>
                <span className="text-xl font-black text-slate-500">X</span>
              </div>
            )}

            {state === "collapsed" && !isMobile && (
              <div className="flex text-base font-black">
                <span className="text-primary">M</span>
                <span className="-ml-1 text-gray-500 italic dark:text-gray-300">X</span>
              </div>
            )}
            {state === "expanded" && <span className="text-xs text-gray-500">Meter Reading Application</span>}

            {/* Measures Daily Transactions  */}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex h-full flex-col gap-0">
        <NavMain items={mainNav} />
        <NavMonitoringAndReports items={reportsNav} />
        <NavSecondary items={secondaryNav} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
