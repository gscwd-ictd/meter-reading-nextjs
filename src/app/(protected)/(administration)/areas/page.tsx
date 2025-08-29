import { AreaTableComponent } from "@mr/components/features/(administration)/areas/AreaTableComponent";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@mr/components/ui/Breadcrumb";

export default function AreasPage() {
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
              <BreadcrumbPage>Zone & Books</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <AreaTableComponent />
    </div>
  );
}
