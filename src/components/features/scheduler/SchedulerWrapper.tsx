"use client";

import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import { SubmitScheduleSuccessDialog } from "./SubmitScheduleSuccessDialog";
import { Suspense } from "react";
import { Scheduler } from "./Scheduler";

export default function SchedulerWrapper() {
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
