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
        <SidebarInset className="relative flex flex-1 flex-col">
          <NavigationSplash />
          <div className="relative flex-1 overflow-y-auto">
            <CustomSidebarTrigger />
            {children}
          </div>
        </SidebarInset>
      </NavigationSplashProvider>
    </SidebarProvider>
  );
}
