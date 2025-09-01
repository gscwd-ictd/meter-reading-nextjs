import { AppSidebar } from "@mr/components/features/navigation/AppSidebar";
import { CustomSidebarTrigger } from "@mr/components/features/navigation/CustomSidebarTrigger";
import { NavigationSplash } from "@mr/components/features/navigation/NavigationSplash";
import { NavigationSplashProvider } from "@mr/components/features/navigation/NavigationSplashProvider";
import { SidebarInset, SidebarProvider } from "@mr/components/ui/Sidebar";
import { type PropsWithChildren } from "react";

export default function ProtectedPageLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <SidebarProvider>
      <NavigationSplashProvider>
        <AppSidebar className="z-50" />
        <SidebarInset className="relative flex flex-1 flex-col rounded-none border bg-gradient-to-br from-white via-blue-50 to-blue-100/30 px-0 pt-4 shadow-inner transition-colors duration-300 sm:rounded-none sm:px-0 md:rounded-none md:px-0 lg:rounded lg:px-4 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900/20">
          <NavigationSplash />
          <CustomSidebarTrigger />
          {/* Remove overflow from SidebarInset and add it to a wrapper around children */}
          <div className="flex-1 overflow-hidden">
            {/* This prevents outer scrolling */}
            {children}
          </div>
        </SidebarInset>
      </NavigationSplashProvider>
    </SidebarProvider>
  );
}
