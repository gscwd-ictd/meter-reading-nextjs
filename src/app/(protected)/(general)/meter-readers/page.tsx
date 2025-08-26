import { MeterReaderTableComponent } from "@mr/components/features/data-tables/meter-readers/MeterReaderTableComponent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@mr/components/ui/Breadcrumb";

export default function PersonnelPage() {
  return (
    <div className="flex h-full flex-col p-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Meter Readers</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <MeterReaderTableComponent />
    </div>
  );
}
