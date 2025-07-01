// import { Scheduler } from "@/components/features/scheduler/Scheduler";
import SchedulerWrapper from "@/components/features/scheduler/SchedulerWrapper";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";

export default function SchedulePage() {
  return (
    <div className="h-full grid grid-rows-[auto_1fr] pt-5">
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
