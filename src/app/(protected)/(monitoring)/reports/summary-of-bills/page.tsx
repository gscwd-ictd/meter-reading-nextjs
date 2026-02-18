import { UnderMaintenanceComponent } from "@mr/components/features/(general)/UnderMaintenanceComponent";
import { SummaryOfBillsReportComponent } from "@mr/components/features/(monitoring)/reports/summary-of-bills/SummaryOfBillsReportComponent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@mr/components/ui/Breadcrumb";
import React, { Suspense } from "react";

export default function SummaryOfBillsPage() {
  const underMaintenance: boolean = false;
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
            <BreadcrumbPage>Summary of Bills Reports</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {underMaintenance ? (
        <UnderMaintenanceComponent title="Summary of Bills Reports" />
      ) : (
        <Suspense fallback={<>Loading...</>}>
          <SummaryOfBillsReportComponent />
        </Suspense>
      )}
    </>
  );
}
