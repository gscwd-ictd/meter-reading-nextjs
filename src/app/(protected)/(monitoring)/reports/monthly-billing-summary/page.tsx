import { UnderMaintenanceComponent } from "@mr/components/features/(general)/UnderMaintenanceComponent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@mr/components/ui/Breadcrumb";

export default function MonthlyBillingSummaryPage() {
  const underMaintenance: boolean = true;

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Monthly Billing Summary</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h3 className="mt-5 text-xl font-bold">Monthly Billing Summary Reports</h3>
      <div className="text-base font-medium text-gray-400">Generate Reports from Monthly Billing Summary</div>
      {underMaintenance ? <UnderMaintenanceComponent title="Monthly Billing Summary" /> : <></>}
    </>
  );
}
