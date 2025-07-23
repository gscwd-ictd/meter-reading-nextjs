import { TextBlastReportTableComponent } from "@mr/components/features/data-tables/text-blast/TextBlastReportDataTable/TextBlastReportTableComponent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@mr/components/ui/Breadcrumb";
import React from "react";

export default function TextBlastReportPage() {
  return (
    <>
      <div className="flex h-full flex-col p-5">
        <div className="">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Text Blast Report</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <h3 className="mt-5 text-xl font-bold">Text Blast Report</h3>
        <div className="text-muted-foreground text-base font-medium">Generate Reports from Text Blast</div>

        <div>
          <TextBlastReportTableComponent />
        </div>
      </div>
    </>
  );
}
