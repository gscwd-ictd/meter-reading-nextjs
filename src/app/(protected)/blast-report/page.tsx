import { TextBlastReportTableComponent } from "@/components/features/data-tables/text-blast/TextBlastReportDataTable/TextBlastReportTableComponent";
import { Heading } from "@/components/features/typography/Heading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
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
        <div className="text-base font-medium text-gray-400">Generate Reports from Text Blast</div>

        <div className="mt-4 h-full w-full rounded-lg border-1 border-gray-300">
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
      </div>
    </>
  );
}
