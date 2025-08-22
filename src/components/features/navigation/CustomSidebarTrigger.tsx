"use client";

import { useSidebar } from "@mr/components/ui/Sidebar";
import { MenuIcon } from "lucide-react";

export const CustomSidebarTrigger = () => {
  const { toggleSidebar, isMobile } = useSidebar();
  if (isMobile)
    return (
      <button onClick={toggleSidebar} className="fixed top-0 left-0 z-30 p-2">
        <MenuIcon className="size-4" />
      </button>
    );
};
