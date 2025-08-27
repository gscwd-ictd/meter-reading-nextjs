import { ZonebookDailyProgressComponent } from "@mr/components/features/(monitoring)/monitoring/zonebook/ZonebookDailyProgressComponent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@mr/components/ui/Breadcrumb";

export default function ZonebookProgressPage() {
  return (
    <div className="flex h-full flex-col gap-0 p-5">
      <div className="">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/progress">Progress</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Zonebook Progress Table</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* <h3 className="mt-5 text-xl font-bold">Zonebook Progress Table</h3> */}

      <ZonebookDailyProgressComponent />
    </div>
  );
}
