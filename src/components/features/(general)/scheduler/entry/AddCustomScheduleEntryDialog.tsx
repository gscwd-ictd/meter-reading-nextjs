"use client";

import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@mr/components/ui/Dialog";
import { format } from "date-fns";
import CalendarPicker from "../../../calendar/CalendarPicker";
import { useState } from "react";
import { Button } from "@mr/components/ui/Button";
import { NonBusinessDays } from "../holidays";
import { Input } from "@mr/components/ui/Input";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MeterReaderWithZonebooks } from "@mr/lib/types/personnel";
import { toast } from "sonner";
import { Spinner } from "@mr/components/ui/Spinner";
import findLatestMonthlyScheduleWithDay from "@mr/lib/functions/findLatestMonthlyScheduleWithDay";

type SubmitMeterReadingEntryWithZonebooks = {
  readingDate: string;
  dueDate: string;
  disconnectionDate: string;
  meterReaders: MeterReaderWithZonebooks[];
  day: number;
};

export const AddCustomScheduleEntryDialog = () => {
  const open = useSchedulesStore((state) => state.addCustomScheduleEntryDialogIsOpen);
  const setOpen = useSchedulesStore((state) => state.setAddCustomScheduleEntryDialogIsOpen);
  const selectedScheduleEntry = useSchedulesStore((state) => state.selectedScheduleEntry);
  const refetchData = useSchedulesStore((state) => state.refetchData);
  const refetchEntry = useSchedulesStore((state) => state.refetchEntry);
  const reset = useSchedulesStore((state) => state.reset);
  const scheduleDays = useSchedulesStore((state) => state.scheduleDays);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [disconnectionDate, setDisconnectionDate] = useState<Date | undefined>(undefined);

  const mutateScheduleEntry = async (
    entry: typeof selectedScheduleEntry,
  ): Promise<SubmitMeterReadingEntryWithZonebooks[]> => {
    return [
      {
        ...entry,
        meterReaders: [],
        dueDate: format(dueDate!, "yyyy-MM-dd"),
        disconnectionDate: format(disconnectionDate!, "yyyy-MM-dd"),
        readingDate: format(entry?.readingDate!, "yyyy-MM-dd"),
        day: findLatestMonthlyScheduleWithDay(scheduleDays)?.day! + 1,
      },
    ];
  };

  const isValid = dueDate && disconnectionDate;

  const postMutation = useMutation({
    mutationFn: async () => {
      const entry = await mutateScheduleEntry(selectedScheduleEntry);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_MR_BE}/schedules`, entry);

      return res.data;
    },
    onSuccess: async () => {
      toast.success("Success", {
        description: "Successfully added a schedule entry!",
        position: "top-right",
        duration: 1500,
      });
      setOpen(false);
      reset();
      refetchData?.();
      refetchEntry?.();
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to add schedule entry";
        toast.error(message, { position: "top-right", duration: 1500 });
      } else {
        toast.error("An unexpected error occurred.", { position: "top-right", duration: 1500 });
      }
    },
  });

  const {
    data: allHolidays,
    isLoading,
    // isSuccess: holidaysLoaded,
  } = useQuery({
    queryKey: ["get-all-holidayss"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_HRMS_HOLIDAYS}`);

      return res.data;
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogContent className="max-w-md rounded-xl p-6">
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="text-primary text-xl font-semibold">Add Schedule Entry</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Select a due date and we’ll automatically calculate the disconnection date.
          </DialogDescription>
        </DialogHeader>

        {/* Reading Date Section */}
        <div className="mt-4">
          <p className="text-primary mb-1 text-sm font-medium">Reading Date</p>
          {/* <div className="px-3 text-sm font-normal">
            {selectedScheduleEntry ? format(selectedScheduleEntry?.readingDate, "MMMM dd, yyyy") : "-"}
          </div> */}
          <Input
            defaultValue={
              selectedScheduleEntry ? format(selectedScheduleEntry?.readingDate, "MMMM dd, yyyy") : "-"
            }
            className="disabled:text-gray-900"
            readOnly
          />
        </div>

        {/* Calendar Picker Section */}
        <>
          {isLoading ? (
            <Spinner>Loading holidays...</Spinner>
          ) : (
            <CalendarPicker
              startDate={selectedScheduleEntry?.readingDate ?? new Date()}
              dueDate={dueDate}
              setDueDate={setDueDate}
              disconnectionDate={disconnectionDate}
              setDisconnectionDate={setDisconnectionDate}
              nonBusinessDays={NonBusinessDays}
              holidays={allHolidays}
            />
          )}

          {/* Hints for user */}
          <div className="mt-2 text-xs text-gray-500">
            <p>• Due date defaults to 15 days after the reading date (skips holidays & weekends).</p>
            <p>• Disconnection date is 3 days after the due date (skips holidays & weekends).</p>
          </div>
        </>

        {/* Footer */}
        <DialogFooter className="pt-6">
          <Button
            className="w-full text-white"
            disabled={!isValid ? true : postMutation.isPending ? true : false}
            onClick={() => {
              postMutation.mutateAsync();
            }}
          >
            {postMutation.isPending ? (
              <>
                Submitting <Spinner />
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
