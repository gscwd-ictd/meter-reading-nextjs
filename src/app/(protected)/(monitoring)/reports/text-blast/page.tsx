import { TextBlastReportTableComponent } from "@mr/components/features/data-tables/text-blast/TextBlastReportDataTable/TextBlastReportTableComponent";
import { Heading } from "@mr/components/features/typography/Heading";
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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Text Blast Reports</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h3 className="mt-5 text-xl font-bold">Text Blast Reports</h3>
      <div className="text-base font-medium text-gray-400">Generate Reports from Text Blast</div>

      <div className="mt-4 min-h-[90%] min-w-full rounded-lg border-2 border-gray-300">
        <div className="grid h-full grid-cols-3">
          <div className="col-span-3">
            <div className="p-4">
              <Heading variant={"h4"} className="text-blue-700">
                Report
              </Heading>
            </div>
            <TextBlastReportTableComponent />
          </div>
        </div>
      </div>
    </>
  );
}
