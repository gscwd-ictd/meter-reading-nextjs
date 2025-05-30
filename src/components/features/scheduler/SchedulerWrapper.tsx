/* This component is created due to SSR issues*/
"use client";

import dynamic from "next/dynamic";
import { ScheduleEntryDialog } from "./ScheduleEntryDialog";
import { ZonebookDialog } from "../data-tables/zone-book/ZonebookDialog";
import { SubmitScheduleSuccessDialog } from "./SubmitScheduleSuccessDialog";

const Scheduler = dynamic(() => import("@mr/components/features/scheduler/Scheduler"), { ssr: false });

export default function SchedulerWrapper() {
  return (
    <div>
      <div className="flex justify-end">
        <ScheduleEntryDialog />
        <ZonebookDialog />
        <SubmitScheduleSuccessDialog />
      </div>
      <div className="m-5 border rounded">
        <Scheduler />
      </div>
    </div>
  );
}
