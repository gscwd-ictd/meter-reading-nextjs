import { DashboardComponent } from "@mr/components/features/(general)/dashboard/DashboardComponent";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@mr/components/ui/Breadcrumb";

export default function DashboardPage() {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <DashboardComponent />
    </>
  );
}
