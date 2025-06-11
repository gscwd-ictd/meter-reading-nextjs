import SchedulerWrapper from "@mr/components/features/scheduler/SchedulerWrapper";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@mr/components/ui/Breadcrumb";

export default function SchedulePage() {
  return (
    <div className="grid h-full grid-rows-[auto_1fr] pt-5">
      <div className="px-5 pb-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Schedule</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <SchedulerWrapper />
    </div>
  );
}
