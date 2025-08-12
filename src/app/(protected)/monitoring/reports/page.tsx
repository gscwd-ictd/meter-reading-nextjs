import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@mr/components/ui/Breadcrumb";

import { ReportComponent } from "@mr/components/features/reports/ReportComponent";

export default function MonitoringPage() {
  return (
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
        </BreadcrumbList>
      </Breadcrumb>

      <h3 className="mt-5 text-xl font-bold">Reports</h3>
      <div className="mb-5 text-base font-medium text-gray-400"> </div>

      <ReportComponent />
    </div>
  );
}
