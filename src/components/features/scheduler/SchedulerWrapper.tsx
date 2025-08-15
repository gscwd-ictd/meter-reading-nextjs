"use client";

import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import { SubmitScheduleSuccessDialog } from "./SubmitScheduleSuccessDialog";
import { Suspense, useMemo } from "react";
import { Scheduler } from "./Scheduler";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { transformHolidays } from "@mr/lib/functions/transformHolidays";

export default function SchedulerWrapper() {
  const { data: allHolidays, isSuccess: holidaysLoaded } = useQuery({
    queryKey: ["get-all-holidays"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_HRMS_HOLIDAYS}`);

      return res.data;
    },
    staleTime: Infinity,
  });

  const holidays = useMemo(() => {
    if (allHolidays) return transformHolidays(allHolidays);
    else [];
  }, [allHolidays]);

  if (!holidaysLoaded) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner className="size-8" />
        <span className="ml-2">Fetching holidays...</span>
      </div>
    );
  }

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
        <Scheduler holidays={holidays ?? []} holidaysLoaded={holidaysLoaded} />
      </Suspense>
    </div>
  );
}
