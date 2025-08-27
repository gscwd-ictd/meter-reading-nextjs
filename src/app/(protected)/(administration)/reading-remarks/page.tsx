import { ReadingRemarksTableComponent } from "@mr/components/features/(administration)/reading-remarks/ReadingRemarksTableComponent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@mr/components/ui/Breadcrumb";

export default function ReadingRemarksPage() {
  return (
    <div className="flex h-full flex-col gap-0 p-5">
      <div className="">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Reading Remarks</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Table component here */}
      <ReadingRemarksTableComponent />
    </div>
  );
}
