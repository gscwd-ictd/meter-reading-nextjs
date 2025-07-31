/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { Button } from "@mr/components/ui/Button";
import { MeterReaderWithZonebooks } from "@mr/lib/types/personnel";
import { CircleXIcon, MapPinnedIcon } from "lucide-react";
import { FunctionComponent } from "react";
import { ScheduleEntryZonebookSelector } from "../../scheduler/entry/ScheduleEntryZonebookSelector";
import { RemoveMeterReaderAlertDialog } from "../../scheduler/entry/RemoveMeterReaderAlertDialog";

type MeterReaderEntryRowActionsProps = {
  meterReader: MeterReaderWithZonebooks;
};

// zone 8-63

export const MeterReaderEntryRowActions: FunctionComponent<MeterReaderEntryRowActionsProps> = ({
  meterReader,
}) => {
  const selectedScheduleEntry = useSchedulesStore((state) => state.selectedScheduleEntry);
  const setSelectedScheduleEntry = useSchedulesStore((state) => state.setSelectedScheduleEntry);
  const setSelectedMeterReader = useSchedulesStore((state) => state.setSelectedMeterReader);
  const setEntryZonebookSelectorIsOpen = useSchedulesStore((state) => state.setEntryZonebookSelectorIsOpen);

  const openZonebookSelector = (meterReader: MeterReaderWithZonebooks) => {
    setSelectedMeterReader(meterReader);
    setEntryZonebookSelectorIsOpen(true);
  };

  const removeMeterReader = (id: string) => {
    const temporaryMeterReaders = [...selectedScheduleEntry!.meterReaders!];

    setSelectedScheduleEntry({
      ...selectedScheduleEntry,
      readingDate: selectedScheduleEntry?.readingDate!,
      disconnectionDate: selectedScheduleEntry?.disconnectionDate!,
      dueDate: selectedScheduleEntry?.dueDate!,
      meterReaders: temporaryMeterReaders.filter((mr) => mr.id !== id),
    });
  };

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
          {/* <Button
            variant="destructive"
            className="w-full px-2 hover:brightness-90"
            size="sm"
            onClick={() => removeMeterReader(meterReader.meterReaderId)}
          >
            <CircleXIcon className="size-2 fill-transparent text-white sm:size-4 lg:size-4" />
            <span className="hidden text-xs sm:hidden md:hidden lg:block">Remove</span>
          </Button> */}
          <RemoveMeterReaderAlertDialog
            meterReader={meterReader}
            onDelete={() => removeMeterReader(meterReader.id)}
          />
        </div>
      </div>
    </>
  );
};
