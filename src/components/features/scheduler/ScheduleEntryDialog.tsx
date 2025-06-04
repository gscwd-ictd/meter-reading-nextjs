/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

"use client";

import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@mr/components/ui/Dialog";
import { compareAsc, format, formatDate } from "date-fns";
import { Dispatch, FunctionComponent, SetStateAction, useState } from "react";
import { MeterReaderDataTable } from "../data-tables/meter-readers/MeterReaderDataTable";
import { Button } from "@mr/components/ui/Button";
import { MeterReadingEntry } from "@mr/lib/types/schedule";
import { StackedAvatars } from "@mr/components/ui/StackedAvatars";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@mr/components/ui/Badge";
import { MeterReader } from "@mr/lib/types/personnel";

type ScheduleEntryDialogProps = {
  activeContext: number | null;
  setActiveContext: Dispatch<SetStateAction<number | null>>;
  entry: MeterReadingEntry;
  hasSchedule: MeterReader | undefined;
  isWithinMonth: boolean;
  dateIsSunday: boolean;
  dateIsSaturday: boolean;
  idx: number | null;
};

export const ScheduleEntryDialog: FunctionComponent<ScheduleEntryDialogProps> = ({
  activeContext,
  setActiveContext,
  hasSchedule,
  isWithinMonth,
  dateIsSaturday,
  dateIsSunday,
  idx,
  entry,
}) => {
  const selectedScheduleEntry = useSchedulesStore((state) => state.selectedScheduleEntry);
  const currentSchedule = useSchedulesStore((state) => state.currentSchedule);
  const setCurrentSchedule = useSchedulesStore((state) => state.setCurrentSchedule);
  const setSelectedScheduleEntry = useSchedulesStore((state) => state.setSelectedScheduleEntry);

  const [scheduleEntryDialogIsOpen, setScheduleEntryDialogIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={scheduleEntryDialogIsOpen} onOpenChange={setScheduleEntryDialogIsOpen} modal>
      <DialogTrigger asChild className="h-full w-full">
        <button
          onContextMenu={() => setActiveContext(idx)}
          onClick={() => {
            setScheduleEntryDialogIsOpen(true);
            setSelectedScheduleEntry(entry);
          }}
          className={`group relative grid h-full ${activeContext === idx ? "z-[30] scale-[1.05] rounded-lg border-none bg-gray-50 brightness-95" : ""} grid-rows-5 gap-0 overflow-hidden p-0 text-sm transition-all duration-200 ease-in-out hover:z-[30] hover:scale-[1.05] hover:cursor-pointer hover:rounded-lg hover:border-none hover:bg-gray-50 hover:brightness-95`}
        >
          {/* Date Number */}
          <div
            className={`flex items-center justify-center font-bold ${
              isWithinMonth ? "" : "text-gray-300"
            } group-hover:text-primary items-center text-center`}
          >
            {formatDate(entry.readingDate, "dd")}
          </div>
          {/* Meter Readers */}
          <div className="col-span-1 flex justify-center">
            {entry.meterReaders && entry.meterReaders.length > 0 && (
              <StackedAvatars
                users={entry.meterReaders
                  .map((meterReader) => ({
                    id: meterReader.companyId,
                    image: `${process.env.NEXT_PUBLIC_HRMS_IMAGES_SERVER}/${meterReader.photoUrl}`,
                    name: meterReader.name,
                  }))
                  .sort((a, b) => (a.name > b.name ? 1 : -1))}
              />
            )}
          </div>
          <div className="absolute top-0 right-1">
            {hasSchedule && (
              <div className="flex items-center justify-center">
                <CheckCircle2 className="fill-green-500 text-white" />
                {/* <span className="text-sm text-green-600">Assigned</span> */}
              </div>
            )}
          </div>
          {/* Due Date */}
          {Array.isArray(entry.dueDate) ? (
            <div className="flex items-center justify-center">
              <Badge className="w-full gap-0 rounded-none bg-blue-200">
                <span className="text-blue-600">
                  {entry.dueDate.sort(compareAsc).map((day, idx) => (
                    <span className="overflow-auto font-bold" key={idx}>
                      {day && idx === 0 ? formatDate(day, "MMM dd") : "/" + formatDate(day, "MMM dd")}
                    </span>
                  ))}
                </span>
              </Badge>
            </div>
          ) : entry.dueDate ? (
            <div className="flex items-center justify-center">
              <Badge className="w-full gap-0 rounded-none bg-blue-200">
                <span className="font-bold text-blue-600">{formatDate(entry.dueDate, "MMM dd")}</span>
              </Badge>
            </div>
          ) : null}
          {/* Disconnection Date */}
          {Array.isArray(entry.disconnectionDate) ? (
            <div className="flex items-center justify-center">
              <Badge className="w-full gap-0 rounded-none bg-rose-100">
                <div className="text-red-600">
                  {entry.disconnectionDate.sort(compareAsc).map((day, idx) => (
                    <span className="font-bold" key={idx}>
                      {day && idx === 0 ? formatDate(day, "MMM dd") : "/" + formatDate(day, "MMM dd")}
                    </span>
                  ))}
                </div>
              </Badge>
            </div>
          ) : entry.disconnectionDate ? (
            <div className="flex items-center justify-center">
              <Badge className="w-full gap-0 rounded-none bg-rose-100">
                <span className="font-bold text-red-600">
                  {formatDate(entry.disconnectionDate, "MMM dd")}
                </span>
              </Badge>
            </div>
          ) : null}
          {/* Rest Day Indicator */}
          {(dateIsSunday || dateIsSaturday) &&
            isWithinMonth &&
            entry.dueDate &&
            entry.meterReaders?.length === 0 && (
              <div className="flex items-center justify-center">
                <Badge className="w-full gap-0 rounded-none bg-gray-100 text-[5px] font-medium tracking-wide text-gray-600 sm:text-[5px] lg:text-xs">
                  Applicable Rest Day
                </Badge>
              </div>
            )}
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90%] min-w-[50%] sm:w-full lg:min-w-[50%]">
        <DialogHeader>
          <DialogTitle>
            {selectedScheduleEntry ? format(selectedScheduleEntry?.readingDate!, "EEE MMM dd, yyyy ") : null}
          </DialogTitle>
        </DialogHeader>

        <MeterReaderDataTable
          meterReaders={selectedScheduleEntry?.meterReaders ? selectedScheduleEntry!.meterReaders : []}
        />
        <DialogFooter>
          <Button
            onClick={() => {
              const updatedCurrentSchedule = currentSchedule.map((entry) => {
                if (entry.readingDate === selectedScheduleEntry?.readingDate) {
                  return { ...entry, meterReaders: selectedScheduleEntry.meterReaders };
                }
                return entry;
              });

              setCurrentSchedule(updatedCurrentSchedule);
              setScheduleEntryDialogIsOpen(false);
            }}
          >
            Apply for the current day
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
