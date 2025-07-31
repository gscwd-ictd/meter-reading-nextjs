import { AppSidebar } from "@mr/components/features/navigation/AppSidebar";
import { NavigationSplashProvider } from "@mr/components/features/navigation/NavigationSplashProvider";
import { SidebarInset, SidebarProvider } from "@mr/components/ui/Sidebar";
import { type PropsWithChildren } from "react";

export default function ProtectedPageLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <SidebarProvider>
      <NavigationSplashProvider>
        <AppSidebar className="z-50" />
        <SidebarInset className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto">{children}</div>
        </SidebarInset>
      </NavigationSplashProvider>
    </SidebarProvider>
  );
}
