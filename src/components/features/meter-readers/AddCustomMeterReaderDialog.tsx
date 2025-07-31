"use client";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@mr/components/ui/Dialog";
import { MeterReaderWithZonebooks } from "@mr/lib/types/personnel";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FunctionComponent, useMemo, useState } from "react";
import { MeterReaderPopover } from "./MeterReaderPopover";

export const AddCustomMeterReaderDialog: FunctionComponent = () => {
  const open = useSchedulesStore((state) => state.addCustomMeterReaderDialogIsOpen);
  const setOpen = useSchedulesStore((state) => state.setAddCustomMeterReaderDialogIsOpen);
  const selectedScheduleEntry = useSchedulesStore((state) => state.selectedScheduleEntry);
  const [selectedMeterReader, setSelectedMeterReader] = useState<MeterReaderWithZonebooks>(
    {} as MeterReaderWithZonebooks,
  );

  const { data: assignedMeterReaders } = useQuery({
    queryKey: ["get-all-meter-readers"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/meter-readers?status=assigned`);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const getSymmetricDifference = (
    a: MeterReaderWithZonebooks[] = [],
    b: MeterReaderWithZonebooks[] = [],
  ): MeterReaderWithZonebooks[] => {
    return [
      ...a.filter((readerA) => !b.some((readerB) => readerB.id === readerA.id)),
      ...b.filter((readerB) => !a.some((readerA) => readerA.id === readerB.id)),
    ];
  };

  const filteredMeterReaders = useMemo(() => {
    const existingMeterReaders = selectedScheduleEntry?.meterReaders;
    return getSymmetricDifference(assignedMeterReaders, existingMeterReaders!);
  }, [assignedMeterReaders, selectedScheduleEntry?.meterReaders]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-primary text-xl font-bold">Add meter reader</DialogTitle>
          <DialogDescription className="dark:text-white">
            Manually select from a list of meter readers
          </DialogDescription>
          <MeterReaderPopover
            filteredMeterReaders={filteredMeterReaders}
            selectedMeterReader={selectedMeterReader}
            setSelectedMeterReader={setSelectedMeterReader}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
