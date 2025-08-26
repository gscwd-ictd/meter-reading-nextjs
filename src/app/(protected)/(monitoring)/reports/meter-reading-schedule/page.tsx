import { MeterReadingSchedulePdfComponent } from "@mr/components/features/reports/meter-reading-schedule/MeterReadingSchedulePdfComponent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@mr/components/ui/Breadcrumb";
import { Suspense } from "react";

export default function MeterReadingSchedulePage() {
  return (
    <>
      <div className="flex h-full flex-col p-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Reports</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Meter Reading Schedule Monthly Report</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Suspense>
          <MeterReadingSchedulePdfComponent />
        </Suspense>
      </div>
    </>
  );
}
