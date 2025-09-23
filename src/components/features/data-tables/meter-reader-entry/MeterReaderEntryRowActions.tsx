"use client";

import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { Button } from "@mr/components/ui/Button";
import { MeterReaderWithZonebooks } from "@mr/lib/types/personnel";
import { ArrowRightLeftIcon, MapPinnedIcon, MoreVertical, Trash2 } from "lucide-react";
import { FunctionComponent, useEffect, useState } from "react";
import { ScheduleEntryZonebookSelector } from "../../(general)/scheduler/entry/ScheduleEntryZonebookSelector";
import { RemoveMeterReaderAlertDialog } from "../../(general)/scheduler/entry/RemoveMeterReaderAlertDialog";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { MeterReaderReassignmentDialog } from "../../(general)/scheduler/entry/MeterReaderReassignmentDialog";
import { Popover, PopoverContent, PopoverTrigger } from "@mr/components/ui/Popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mr/components/ui/DropdownMenu";
import { differenceInMonths, format, parse } from "date-fns";

type MeterReaderEntryRowActionsProps = {
  meterReader: MeterReaderWithZonebooks;
};

// zone 8-63

export const MeterReaderEntryRowActions: FunctionComponent<MeterReaderEntryRowActionsProps> = ({
  meterReader,
}) => {
  const [zonebookPopoverOpen, setZonebookPopoverOpen] = useState<boolean>(false);
  const [reassignPopoverOpen, setReassignPopoverOpen] = useState<boolean>(false);
  const [removePopoverOpen, setRemovePopoverOpen] = useState<boolean>(false);
  const [monthDifference, setMonthDifference] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState("");
  const lastFetchedMonthYear = useSchedulesStore((state) => state.lastFetchedMonthYear);

  const setSelectedMeterReader = useSchedulesStore((state) => state.setSelectedMeterReader);
  const setEntryZonebookSelectorIsOpen = useSchedulesStore((state) => state.setEntryZonebookSelectorIsOpen);
  const setRemoveMeterReaderEntryIsOpen = useSchedulesStore((state) => state.setRemoveMeterReaderEntryIsOpen);
  const setMeterReaderZoneBookReassignmentDialogIsOpen = useSchedulesStore(
    (state) => state.setMeterReaderZoneBookReassignmentDialogIsOpen,
  );
  const refetchEntry = useSchedulesStore((state) => state.refetchEntry);
  const refetchData = useSchedulesStore((state) => state.refetchData);
  const reset = useSchedulesStore((state) => state.reset);

  // Fixed function to calculate month difference with null check
  const calculateMonthDifference = (dateString: string | null): number => {
    // Handle null or undefined input
    if (!dateString) {
      return 0; // or whatever default value makes sense for your use case
    }

    try {
      // Parse the input date (YYYY-MM format)
      const inputDate = parse(dateString, "yyyy-MM", new Date());

      // Get current date
      const today = new Date();

      // Calculate difference in months
      return differenceInMonths(today, inputDate);
    } catch (error) {
      console.error("Error calculating date difference:", error);
      return 0;
    }
  };

  const openZonebookSelector = (meterReader: MeterReaderWithZonebooks) => {
    setSelectedMeterReader(meterReader);
    setEntryZonebookSelectorIsOpen(true);
  };

  const openRemoveMeterReaderEntry = (meterReader: MeterReaderWithZonebooks) => {
    setSelectedMeterReader(meterReader);
    setRemoveMeterReaderEntryIsOpen(true);
  };

  const openReassignment = (meterReader: MeterReaderWithZonebooks) => {
    setSelectedMeterReader(meterReader);
    setMeterReaderZoneBookReassignmentDialogIsOpen(true);
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

  // Update when selected date changes
  useEffect(() => {
    const diff = calculateMonthDifference(lastFetchedMonthYear!);
    setMonthDifference(diff);

    // Set current date in YYYY-MM format
    const now = new Date();
    setCurrentDate(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
  }, [lastFetchedMonthYear]);

  return (
    <>
      <MeterReaderReassignmentDialog />
      <ScheduleEntryZonebookSelector />
      <RemoveMeterReaderAlertDialog onDelete={removeMeterReader} />
      <div className="flex items-center gap-2">
        {/* Desktop/Tablet View - Individual Buttons */}
        <div className="hidden grid-cols-3 gap-2 md:grid">
          {/* Zonebooks Button with Popover */}
          <div className="col-span-1">
            <Popover open={zonebookPopoverOpen} onOpenChange={setZonebookPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  className="w-full px-2"
                  variant="outline"
                  size="sm"
                  onClick={() => openZonebookSelector(meterReader)}
                  onMouseEnter={() => setZonebookPopoverOpen(true)}
                  onMouseLeave={() => setZonebookPopoverOpen(false)}
                >
                  <MapPinnedIcon className="size-4 dark:text-white" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2 text-xs" side="top" align="center">
                Manage Zonebooks
              </PopoverContent>
            </Popover>
          </div>

          {/* Reassign Button with Popover */}
          <div className="col-span-1">
            <Popover open={reassignPopoverOpen} onOpenChange={setReassignPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  className="w-full px-2"
                  variant="default"
                  size="sm"
                  disabled={
                    meterReader.zoneBooks.length === 0
                      ? true
                      : meterReader.reassignment?.remarks === null &&
                          meterReader.zoneBooks.length > 0 &&
                          monthDifference < 1
                        ? false
                        : true
                  }
                  onClick={() => openReassignment(meterReader)}
                  onMouseEnter={() => setReassignPopoverOpen(true)}
                  onMouseLeave={() => setReassignPopoverOpen(false)}
                >
                  <ArrowRightLeftIcon className="size-4 dark:text-white" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2 text-xs" side="top" align="center">
                Zonebook Reassignment Remarks
              </PopoverContent>
            </Popover>
          </div>

          {/* Remove Button with Popover */}
          <div className="col-span-1">
            <Popover open={removePopoverOpen} onOpenChange={setRemovePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex w-full gap-1"
                  onClick={() => openRemoveMeterReaderEntry(meterReader)}
                  onMouseEnter={() => setRemovePopoverOpen(true)}
                  onMouseLeave={() => setRemovePopoverOpen(false)}
                >
                  <Trash2 className="size-4 dark:text-white" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2 text-xs" side="top" align="center">
                Remove Meter Reader
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Mobile View - Dropdown Menu */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                <MoreVertical className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem
                onClick={() => openZonebookSelector(meterReader)}
                className="flex cursor-pointer items-center gap-2"
              >
                <MapPinnedIcon className="size-4" />
                <span>Manage Zonebooks</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => openReassignment(meterReader)}
                className="flex cursor-pointer items-center gap-2"
              >
                <ArrowRightLeftIcon className="size-4" />
                <span>Reassign Zonebooks</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => openRemoveMeterReaderEntry(meterReader)}
                className="text-destructive focus:text-destructive flex cursor-pointer items-center gap-2"
              >
                <Trash2 className="size-4" />
                <span>Remove Meter Reader</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};
