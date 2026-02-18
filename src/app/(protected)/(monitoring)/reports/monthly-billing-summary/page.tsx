import { UnderMaintenanceComponent } from "@mr/components/features/(general)/UnderMaintenanceComponent";
import { MonthlyBillingSummaryReportComponent } from "@mr/components/features/(monitoring)/reports/monthly-billing-summary/MonthlyBillingSummaryReportComponent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@mr/components/ui/Breadcrumb";
import { Suspense } from "react";

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
            <BreadcrumbPage>Reports</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Monthly Billing Summary</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {underMaintenance ? (
        <UnderMaintenanceComponent title="Monthly Billing Summary" />
      ) : (
        <Suspense fallback={<>Loading...</>}>
          <MonthlyBillingSummaryReportComponent />
        </Suspense>
      )}
    </>
  );
}
