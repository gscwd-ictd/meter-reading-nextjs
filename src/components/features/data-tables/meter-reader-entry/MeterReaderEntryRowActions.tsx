/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { Button } from "@mr/components/ui/Button";
import { MeterReaderWithZonebooks } from "@mr/lib/types/personnel";
import { MapPinnedIcon } from "lucide-react";
import { FunctionComponent } from "react";
import { ScheduleEntryZonebookSelector } from "../../scheduler/entry/ScheduleEntryZonebookSelector";
import { RemoveMeterReaderAlertDialog } from "../../scheduler/entry/RemoveMeterReaderAlertDialog";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

type MeterReaderEntryRowActionsProps = {
  meterReader: MeterReaderWithZonebooks;
};

// zone 8-63

export const MeterReaderEntryRowActions: FunctionComponent<MeterReaderEntryRowActionsProps> = ({
  meterReader,
}) => {
  const setSelectedMeterReader = useSchedulesStore((state) => state.setSelectedMeterReader);
  const setEntryZonebookSelectorIsOpen = useSchedulesStore((state) => state.setEntryZonebookSelectorIsOpen);
  const refetchEntry = useSchedulesStore((state) => state.refetchEntry);
  const refetchData = useSchedulesStore((state) => state.refetchData);
  const reset = useSchedulesStore((state) => state.reset);

  const openZonebookSelector = (meterReader: MeterReaderWithZonebooks) => {
    setSelectedMeterReader(meterReader);
    setEntryZonebookSelectorIsOpen(true);
  };

  const removeMeterReader = async (id: string) => {
    await deleteMeterReaderMutation.mutateAsync(id);
  };

  const deleteMeterReaderMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_MR_BE}/schedules/meter-reader/${id}`);
        return res;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      reset();
      refetchEntry?.();
      refetchData?.();
      toast.success("Success", {
        description: "You have successfully removed the meter reader and the assigned zonebooks",
        position: "top-right",
      });
    },
    onError: () => {
      toast.error("Error", { description: "Cannot remove meter reader", position: "top-right" });
    },
  });

  return (
    <>
      <ScheduleEntryZonebookSelector />
      <div className="flex grid-cols-2 gap-2">
        <div className="col-span-1">
          <Button
            className="w-full px-2"
            variant="outline"
            size="sm"
            onClick={() => openZonebookSelector(meterReader)}
          >
            <MapPinnedIcon className="size-2 sm:size-4 lg:size-4 dark:text-white" />
            <span className="hidden text-xs sm:hidden md:hidden lg:block dark:text-white"> Zonebooks</span>
          </Button>
        </div>
        <div className="col-span-1">
          <RemoveMeterReaderAlertDialog
            meterReader={meterReader}
            onDelete={() => removeMeterReader(meterReader.scheduleMeterReaderId!)}
          />
        </div>
      </div>
    </>
  );
};
