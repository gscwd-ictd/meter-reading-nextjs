import { MeterReadingReportComponent } from "@mr/components/features/(monitoring)/reports/meter-reading-report/MeterReadingReportComponent";
import { MeterReadingReportProvider } from "@mr/components/providers/MeterReadingReportProvider";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@mr/components/ui/Breadcrumb";
import { Suspense } from "react";
export default function MeterReadingReportPage() {
  return (
    <>
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
            <BreadcrumbPage>Meter Reading Report</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex h-full w-full flex-col justify-start">
        <div className="flex-1">
          {/* Add this wrapper */}
          <Suspense fallback={<>Loading...</>}>
            <MeterReadingReportProvider>
              <MeterReadingReportComponent />
            </MeterReadingReportProvider>
          </Suspense>
        </div>
      </div>
    </>
  );
}
