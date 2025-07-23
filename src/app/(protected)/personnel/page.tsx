import { PersonnelTableComponent } from "@mr/components/features/data-tables/personnel/PersonnelTableComponent";
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
      <div className="">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Personnel</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <h3 className="mt-5 text-xl font-bold">Personnel</h3>
      <div className="text-base font-medium text-gray-400">List of Meter Readers</div>
      <PersonnelTableComponent />
    </div>
  );
}
