"use client";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { Badge } from "@mr/components/ui/Badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@mr/components/ui/Dialog";
import { Reassignment } from "@mr/lib/types/zonebook";
import { format, parseISO } from "date-fns";
import { ArrowRightIcon } from "lucide-react";
import { FunctionComponent, useEffect, useState } from "react";
import { SelectMeterReaderPopover } from "./SelectMeterReaderPopover";
import { MeterReaderWithZonebooks } from "@mr/lib/types/personnel";
import { Button } from "@mr/components/ui/Button";

// Create a compatible type for the popover value
interface PopoverMeterReaderValue {
  id: string;
  name: string;
}

export const MeterReaderReassignmentDialog: FunctionComponent = () => {
  const meterReader = useSchedulesStore((state) => state.selectedMeterReader);
  const setSelectedMeterReader = useSchedulesStore((state) => state.setSelectedMeterReader);

  const open = useSchedulesStore((state) => state.meterReaderZoneBookReassignmentDialogIsOpen);
  const setOpen = useSchedulesStore((state) => state.setMeterReaderZoneBookReassignmentDialogIsOpen);
  const selectedScheduleEntry = useSchedulesStore((state) => state.selectedScheduleEntry);

  const [reassigned, setReassigned] = useState<Reassignment>({} as Reassignment);

  useEffect(() => {
    if (open)
      setReassigned({
        remarks: "",
        zonebooks:
          meterReader && meterReader.zoneBooks
            ? meterReader.zoneBooks.map((zb) => {
                return { ...zb, meterReader: { id: "", name: "" } };
              })
            : [],
      });
  }, [open]);

  const handleMeterReaderChange = (index: number, meterReader: MeterReaderWithZonebooks) => {
    setReassigned((prev) => {
      const updatedZonebooks = [...prev.zonebooks];
      updatedZonebooks[index] = {
        ...updatedZonebooks[index],
        meterReader: { id: meterReader.id, name: meterReader.name },
      };
      return { ...prev, zonebooks: updatedZonebooks };
    });
  };

  // Convert the basic meter reader to a format the popover can display
  const getPopoverValue = (zb: any): MeterReaderWithZonebooks | undefined => {
    if (!zb.meterReader || !zb.meterReader.id) return undefined;

    return {
      id: zb.meterReader.id,
      name: zb.meterReader.name,
      // Add minimal required properties
      assignment: "",
      companyId: "",
      employeeId: "",
      photoUrl: "",
      positionTitle: "",
      reassignment: { remarks: "", zonebooks: [] },
      scheduleMeterReaderId: "",
      zoneBooks: [],
      mobileNumber: "",
      restDay: undefined,
    } as MeterReaderWithZonebooks;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        !open && setSelectedMeterReader(null);
      }}
    >
      <DialogContent className="h-auto min-w-full overflow-y-auto sm:max-h-full sm:w-full sm:min-w-full md:max-h-full md:w-[80%] md:min-w-[80%] lg:max-h-[95%] lg:min-w-[35%]">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl font-semibold dark:text-white">
            Zone Book Reassignment
          </DialogTitle>
          <DialogDescription className="text-muted-foreground items-center text-sm">
            {meterReader?.name}{" "}
            <Badge className="dark:text-white">
              {format(selectedScheduleEntry?.readingDate!, "MMM dd, yyyy")}
            </Badge>{" "}
            <Badge variant="secondary" className="dark:text-white">
              {format(selectedScheduleEntry?.readingDate!, "EEEE")}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {reassigned && reassigned.zonebooks && reassigned.zonebooks.length > 0 ? (
            reassigned.zonebooks.map((zb, idx) => {
              return (
                <div className="grid h-[5rem] grid-cols-3 items-center gap-2 rounded border p-4" key={idx}>
                  <div className="text-sm">
                    Zone {zb.zone} & Book {zb.book}
                  </div>
                  <div className="flex justify-center">
                    <ArrowRightIcon className="text-primary" />
                  </div>

                  <SelectMeterReaderPopover
                    value={getPopoverValue(zb)}
                    onChange={(meterReader) => handleMeterReaderChange(idx, meterReader)}
                  />
                </div>
              );
            })
          ) : (
            <div className="rounded border-2 border-dashed p-4">
              <div className="flex h-[32rem] w-full items-center justify-center text-sm">No zonebook</div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button className="w-full">Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
