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
import { format } from "date-fns";
import { FunctionComponent, useEffect, useState } from "react";
import { SelectMeterReaderPopover } from "./SelectMeterReaderPopover";
import { MeterReaderWithZonebooks } from "@mr/lib/types/personnel";
import { Button } from "@mr/components/ui/Button";
import ReassignmentRemarkSuggestionPopover from "./ReassignmentRemarkSuggestionPopover";
import { DoubleArrowRightIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { LightbulbIcon } from "lucide-react";

type Zonebook = {
  zone: string;
  book: string;
  meterReader: { id: string };
  day: number | null;
};

type ReassignmentToPut = {
  remarks: string | null;
  zoneBooks: Zonebook[];
};

export const MeterReaderReassignmentDialog: FunctionComponent = () => {
  const meterReader = useSchedulesStore((state) => state.selectedMeterReader);
  const selectedMeterReader = useSchedulesStore((state) => state.selectedMeterReader);
  const setSelectedMeterReader = useSchedulesStore((state) => state.setSelectedMeterReader);

  const open = useSchedulesStore((state) => state.meterReaderZoneBookReassignmentDialogIsOpen);
  const setOpen = useSchedulesStore((state) => state.setMeterReaderZoneBookReassignmentDialogIsOpen);
  const selectedScheduleEntry = useSchedulesStore((state) => state.selectedScheduleEntry);
  const refetchEntry = useSchedulesStore((state) => state.refetchEntry);

  const [reassigned, setReassigned] = useState<Reassignment>({} as Reassignment);
  const [remarks, setRemarks] = useState<string>("");

  const handleMeterReaderChange = (index: number, meterReader: MeterReaderWithZonebooks) => {
    setReassigned((prev) => {
      const updatedZonebooks = [...prev.zoneBooks];
      updatedZonebooks[index] = {
        ...updatedZonebooks[index],
        meterReader: { id: meterReader.id, name: meterReader.name },
      };
      return { ...prev, zoneBooks: updatedZonebooks };
    });
  };

  // Check if all zonebooks have no reassigned meter reader
  const allZonebooksAssigned = reassigned.zoneBooks?.every((zb) => zb.meterReader.id !== "");

  // Check if Apply button should be disabled
  const isApplyDisabled = !allZonebooksAssigned || remarks === "";

  // Convert the basic meter reader to a format the popover can display
  const getPopoverValue = (zb: any): MeterReaderWithZonebooks | undefined => {
    if (!zb.meterReader || !zb.meterReader.id) return undefined;

    return {
      id: zb.meterReader.id,
      name: zb.meterReader.name,
      assignment: "",
      companyId: "",
      employeeId: "",
      photoUrl: "",
      positionTitle: "",
      reassignment: { remarks: "", zoneBooks: [] },
      scheduleMeterReaderId: "",
      zoneBooks: [],
      mobileNumber: "",
      restDay: undefined,
    } as MeterReaderWithZonebooks;
  };

  const mutateReassignmentObject = async (reassignment: Reassignment): Promise<ReassignmentToPut> => {
    return {
      ...reassignment,
      zoneBooks: reassignment.zoneBooks.map((zb) => {
        return { zone: zb.zone, book: zb.book, meterReader: { id: zb.meterReader.id }, day: zb.day };
      }),
    };
  };

  const putReassignmentMutation = useMutation({
    mutationKey: ["meter-reader-reassignment", selectedScheduleEntry?.id],
    mutationFn: async (reassignment: ReassignmentToPut) => {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_MR_BE}/schedules/meter-reader/${selectedMeterReader?.scheduleMeterReaderId}/reassignment`,

        reassignment,
      );

      return res.data;
    },
    onSuccess: async () => {
      toast.success("Success", {
        description: "You have successfully added a new billing adjustment!",
        position: "top-right",
      });

      refetchEntry!();
      setOpen(false);
      setSelectedMeterReader(null);
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to perform action.";
        toast.error(message, { position: "top-right", duration: 1500 });
      } else {
        toast.error("An unexpected error occurred", { position: "top-right" });
      }
    },
  });

  // apply button handler
  const handleApply = async (reassignment: typeof reassigned) => {
    // 1st step is to sanitize the object to be sent
    const mutateReassignment = await mutateReassignmentObject(reassignment);
    // pass the sanitized object to the mutate function
    await putReassignmentMutation.mutateAsync(mutateReassignment);
  };

  // Update reassigned.remarks when remarks state changes
  useEffect(() => {
    setReassigned((prev) => ({
      ...prev,
      remarks: remarks,
    }));
  }, [remarks]);

  // mutate the reassigned state during opening of the dialog
  useEffect(() => {
    if (open) {
      setReassigned({
        remarks: "",
        zoneBooks:
          meterReader && meterReader.zoneBooks
            ? meterReader.zoneBooks.map((zb) => {
                return { ...zb, meterReader: { id: "", name: "" } };
              })
            : [],
      });
      setRemarks(""); // Reset remarks when dialog opens
    }
  }, [open, meterReader]);

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
            Set Zonebook Reassignment Remarks
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            <span className="flex gap-2 space-y-0">
              <span>{meterReader?.name}</span>
              <Badge className="px-1 tracking-tighter dark:text-white">
                {format(selectedScheduleEntry?.readingDate!, "MMM dd, yyyy")}
              </Badge>{" "}
              <Badge variant="secondary" className="dark:text-white">
                {format(selectedScheduleEntry?.readingDate!, "EEEE")}
              </Badge>
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start gap-2 rounded border border-dashed bg-gray-100 p-2 text-xs dark:bg-transparent">
            <LightbulbIcon className="shrink-0 text-yellow-400/60" />
            <span className="leading-4 tracking-normal">
              To reassign the following zone books for documentation purposes, select a new meter reader. This
              action updates the records (including remarks and the default zone book) but does not alter the
              active field assignment for meter reading duties.
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium">Zone Book</div>

            {reassigned && reassigned.zoneBooks && reassigned.zoneBooks.length > 0 ? (
              reassigned.zoneBooks.map((zb, idx) => {
                return (
                  <div className="grid h-auto grid-cols-3 items-center rounded border px-4 py-2" key={idx}>
                    <div className="text-sm">
                      Zone {zb.zone} - Book {zb.book}
                    </div>
                    <div className="flex justify-center">
                      <DoubleArrowRightIcon className="text-primary" />
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

          <ReassignmentRemarkSuggestionPopover remarks={remarks} onRemarksChange={setRemarks} />
        </div>

        <DialogFooter className="mt-10 flex items-center">
          <Button
            className="w-full dark:text-white"
            disabled={isApplyDisabled}
            onClick={() => handleApply(reassigned)}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
