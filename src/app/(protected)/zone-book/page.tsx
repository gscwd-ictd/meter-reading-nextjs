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
    <div className="flex h-full flex-col p-5">
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

      <h3 className="mt-5 text-xl font-bold">Zone & Books</h3>
      <div className="text-base font-medium text-gray-400">List of Zones & Books</div>
      <ZonebookTableComponent />
    </div>
  );
}
