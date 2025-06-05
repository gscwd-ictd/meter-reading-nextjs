/* This component is created due to SSR issues*/
"use client";

import dynamic from "next/dynamic";
import { ZonebookDialog } from "../data-tables/zone-book/ZonebookDialog";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import { SubmitScheduleSuccessDialog } from "./SubmitScheduleSuccessDialog";

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
      <SubmitScheduleSuccessDialog />
      <div className="flex justify-end">
        <ZonebookDialog />
      </div>

      <Scheduler />
    </div>
  );
}
