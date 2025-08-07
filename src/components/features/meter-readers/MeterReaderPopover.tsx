"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@mr/components/ui/Popover";
import { Button } from "@mr/components/ui/Button";
import { ScrollArea } from "@mr/components/ui/ScrollArea";
import { MeterReaderWithZonebooks } from "@mr/lib/types/personnel";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { toast } from "sonner";

type Props = {
  filteredMeterReaders: MeterReaderWithZonebooks[];
  selectedMeterReader?: MeterReaderWithZonebooks;
  setSelectedMeterReader: (reader: MeterReaderWithZonebooks) => void;
};

export function MeterReaderPopover({
  filteredMeterReaders,
  selectedMeterReader,
  setSelectedMeterReader,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const setAddCustomMeterReaderDialogIsOpen = useSchedulesStore(
    (state) => state.setAddCustomMeterReaderDialogIsOpen,
  );

  const selectedScheduleEntry = useSchedulesStore((state) => state.selectedScheduleEntry);
  const refetchEntry = useSchedulesStore((state) => state.refetchEntry);
  const refetchData = useSchedulesStore((state) => state.refetchData);

  const postNewMeterReader = useMutation({
    mutationFn: async (meterReader: MeterReaderWithZonebooks) => {
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_MR_BE}/schedules/meter-reader`, {
          id: selectedScheduleEntry?.id,
          meterReaderId: meterReader.id,
        });
        return res;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      refetchEntry?.();
      refetchData?.();
      toast.success("Success", {
        description: "You have successfully added a meter reader to the schedule entry",
        position: "top-right",
      });
      setSelectedMeterReader({} as MeterReaderWithZonebooks);
      setAddCustomMeterReaderDialogIsOpen(false);
    },
    onError: () => {
      toast.error("Error", {
        description: "An error has been encountered. Please try again later.",
        position: "top-right",
      });
    },
  });

  return (
    <Popover
      open={open}
      onOpenChange={() => {
        setSelectedMeterReader({} as MeterReaderWithZonebooks);
        setOpen(!open);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {selectedMeterReader ? selectedMeterReader.name : "Select Meter Reader"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[400px] p-2">
        {filteredMeterReaders && filteredMeterReaders.length > 0 ? (
          <ScrollArea className="max-h-64 overflow-y-auto">
            <div className="text-muted-foreground mb-2 grid grid-cols-3 gap-2 px-2 text-sm font-semibold">
              <div>Name</div>
              <div>Mobile</div>
              <div>Rest Day</div>
            </div>
            <div className="space-y-1 overflow-y-auto">
              {filteredMeterReaders.map((mr) => (
                <div
                  key={mr.id}
                  onClick={() => {
                    setSelectedMeterReader(mr);
                    setOpen(false);
                  }}
                  className="hover:bg-muted grid cursor-pointer grid-cols-3 items-start gap-2 rounded-md p-2 text-xs"
                >
                  <div className="">{mr.name}</div>
                  <div className="text-muted-foreground">{mr.mobileNumber}</div>
                  <div className="text-muted-foreground">
                    {mr.restDay && mr.restDay === "sunday" ? "Sunday" : "Saturday"}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-muted-foreground p-2 text-sm">No available meter readers</div>
        )}
      </PopoverContent>
      <div className="flex w-full justify-center">
        <Button
          className="w-full dark:text-white"
          onClick={() => postNewMeterReader.mutateAsync(selectedMeterReader!)}
        >
          Manually add this meter reader
        </Button>
      </div>
    </Popover>
  );
}
