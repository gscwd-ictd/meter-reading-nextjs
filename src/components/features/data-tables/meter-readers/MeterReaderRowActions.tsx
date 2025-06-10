/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { Button } from "@mr/components/ui/Button";
import { MeterReader } from "@mr/lib/types/personnel";
import { CircleXIcon, MapPinnedIcon } from "lucide-react";
import { FunctionComponent } from "react";
import { ScheduleEntryZonebookSelector } from "../../scheduler/entry/ScheduleEntryZonebookSelector";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";

type PersonnelRowActionsProps = {
  meterReader: MeterReader;
};

// zone 8-63

export const MeterReaderRowActions: FunctionComponent<PersonnelRowActionsProps> = ({ meterReader }) => {
  const selectedScheduleEntry = useSchedulesStore((state) => state.selectedScheduleEntry);
  const setSelectedScheduleEntry = useSchedulesStore((state) => state.setSelectedScheduleEntry);
  const setSelectedMeterReader = useSchedulesStore((state) => state.setSelectedMeterReader);
  const setEntryZonebookSelectorIsOpen = useSchedulesStore((state) => state.setEntryZonebookSelectorIsOpen);
  const setMeterReaderZonebooks = useZonebookStore((state) => state.setMeterReaderZonebooks);

  const openZonebookSelector = (meterReader: MeterReader) => {
    setSelectedMeterReader(meterReader);
    setEntryZonebookSelectorIsOpen(true);
    setMeterReaderZonebooks(meterReader.zonebooks ?? []);
  };

  const removeMeterReader = (companyId: string) => {
    const temporaryMeterReaders = [...selectedScheduleEntry!.meterReaders!];

    setSelectedScheduleEntry({
      ...selectedScheduleEntry,
      readingDate: selectedScheduleEntry?.readingDate!,
      disconnectionDate: selectedScheduleEntry?.disconnectionDate!,
      dueDate: selectedScheduleEntry?.dueDate!,
      meterReaders: temporaryMeterReaders.filter((mr) => mr.companyId !== companyId),
    });
  };

  return (
    <>
      <ScheduleEntryZonebookSelector isLoading={false} />
      <div className="flex grid-cols-2 gap-2">
        <div className="col-span-1">
          <Button className="w-full px-2" size="sm" onClick={() => openZonebookSelector(meterReader)}>
            <MapPinnedIcon className="size-2 sm:size-4 lg:size-4 dark:text-white" />
            <span className="hidden text-xs sm:hidden md:hidden lg:block dark:text-white"> Zonebooks</span>
          </Button>
        </div>
        <div className="col-span-1">
          <Button
            variant="destructive"
            className="w-full px-2"
            size="sm"
            onClick={() => removeMeterReader(meterReader.companyId)}
          >
            <CircleXIcon className="size-2 fill-red-600 text-white sm:size-4 lg:size-4" />
            <span className="hidden text-xs sm:hidden md:hidden lg:block">Remove</span>
          </Button>
        </div>
      </div>
    </>
  );
};
