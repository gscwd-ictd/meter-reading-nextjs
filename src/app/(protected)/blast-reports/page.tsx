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
    <div className="h-full flex flex-col p-5">
      <div className="">
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
      </div>

      <h3 className="font-bold text-xl mt-5">Text Blast Reports</h3>
      <div className="font-medium text-base text-gray-400">Generate Reports from Text Blast</div>

      <div className="min-h-[90%] min-w-full mt-4 border-2 border-gray-300 rounded-lg">
        <div className="grid grid-cols-3 h-full">
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
    </div>
  );
}
