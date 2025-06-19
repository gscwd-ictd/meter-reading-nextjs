"use client";

// import { ZonebookDialog } from "../data-tables/zone-book/ZonebookDialog";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import { SubmitScheduleSuccessDialog } from "./SubmitScheduleSuccessDialog";
import { holidays } from "./holidays";
import { Suspense } from "react";
import { Scheduler } from "./Scheduler";

export default function SchedulerWrapper() {
  //! fetch the holidays and pass it as a prop to the scheduler
  return (
    <div>
      <SubmitScheduleSuccessDialog />

      <Suspense
        fallback={
          <div className="text-primary flex h-full w-full items-center justify-center gap-2">
            <LoadingSpinner size={50} /> Loading Calendar...
          </div>
        }
      >
        <Scheduler />
      </Suspense>
    </div>
  );
}
