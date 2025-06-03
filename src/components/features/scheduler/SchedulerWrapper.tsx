/* This component is created due to SSR issues*/
"use client";

import dynamic from "next/dynamic";
import { ZonebookDialog } from "../data-tables/zone-book/ZonebookDialog";
import { SubmitScheduleSuccessDialog } from "./SubmitScheduleSuccessDialog";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";

const Scheduler = dynamic(() => import("@mr/components/features/scheduler/Scheduler"), {
  ssr: false,
  loading: () => (
    <div className="text-primary flex h-full w-full items-center justify-center gap-2">
      <LoadingSpinner size={50} /> Loading Calendar...
    </div>
  ),
});

export default function SchedulerWrapper() {
  return (
    <div>
      <div className="flex justify-end">
        {/* <ScheduleEntryDialog /> */}
        <ZonebookDialog />
        <SubmitScheduleSuccessDialog />
      </div>

      <Scheduler />
    </div>
  );
}
