/* This component is created due to SSR issues*/
"use client";

import dynamic from "next/dynamic";
import { ZonebookDialog } from "../data-tables/zone-book/ZonebookDialog";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import { SubmitScheduleSuccessDialog } from "./SubmitScheduleSuccessDialog";
import { holidays } from "./holidays";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";

const Scheduler = dynamic(() => import("@mr/components/features/scheduler/Scheduler"), {
  ssr: false,
  loading: () => (
    <div className="text-primary flex h-full w-full items-center justify-center gap-2">
      <LoadingSpinner size={50} /> Loading Calendar...
    </div>
  ),
});

export default function SchedulerWrapper() {
  const searchParams = useSearchParams();
  const monthYear = searchParams.get("date");

  //! fetch the holidays and pass it as a prop to the scheduler
  return (
    <div>
      <SubmitScheduleSuccessDialog />
      <div className="flex justify-end">
        <ZonebookDialog />
      </div>

      <Scheduler holidays={holidays} monthYear={monthYear ?? format(new Date(), "MM-yyyy")} />
    </div>
  );
}
