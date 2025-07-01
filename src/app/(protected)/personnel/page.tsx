import { PersonnelTableComponent } from "@/components/features/data-tables/personnel/PersonnelTableComponent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";

export default function PersonnelPage() {
  return (
    <div className="h-full flex flex-col p-5">
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

      <h3 className="font-bold text-xl mt-5">Personnel</h3>
      <div className="font-medium text-base text-gray-400">List of Meter Readers</div>
      <PersonnelTableComponent />
    </div>
  );
}
