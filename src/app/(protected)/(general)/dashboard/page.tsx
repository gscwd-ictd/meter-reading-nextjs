import { DashboardComponent } from "@mr/components/features/dashboard/DashboardComponent";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@mr/components/ui/Breadcrumb";

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col p-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <DashboardComponent />
    </div>
  );
}
