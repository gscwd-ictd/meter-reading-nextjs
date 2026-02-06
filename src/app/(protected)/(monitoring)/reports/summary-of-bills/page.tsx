import { UnderMaintenanceComponent } from "@mr/components/features/(general)/UnderMaintenanceComponent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@mr/components/ui/Breadcrumb";
import React from "react";

export default function SummaryOfBillsPage() {
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
            <BreadcrumbPage>Summary of Bills Reports</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h3 className="mt-5 text-xl font-bold">Summary of Bills Reports</h3>
      <div className="text-base font-medium text-gray-400">Generate Reports from Summary of Bills</div>

      {underMaintenance ? <UnderMaintenanceComponent title="Summary of Bills Reports" /> : <></>}
    </>
  );
}
