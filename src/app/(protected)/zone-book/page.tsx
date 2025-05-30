import { ZonebookTableComponent } from "@mr/components/features/data-tables/zone-book/ZonebookTableComponent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@mr/components/ui/Breadcrumb";

export default function ZoneBookpage() {
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

      <h3 className="font-bold text-xl mt-5">Zone & Book</h3>
      <div className="font-medium text-base text-gray-400">List of Zones & Books</div>
      <ZonebookTableComponent />
    </div>
  );
}
