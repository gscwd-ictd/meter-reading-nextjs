/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@mr/components/ui/AlertDialog";
import { SendHorizonalIcon } from "lucide-react";
import { FunctionComponent, useState } from "react";

import { Button } from "@mr/components/ui/Button";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { toast } from "sonner";

export const SubmitScheduleAlertDialog: FunctionComponent = () => {
  const [submitScheduleAlertDialogIsOpen, setSubmitScheduleAlertDialogIsOpen] = useState<boolean>(false);
  const setCalendarScheduleDropdownIsOpen = useSchedulesStore(
    (state) => state.setCalendarScheduleDropdownIsOpen,
  );

  const setSubmitSuccessDialogIsOpen = useSchedulesStore((state) => state.setSubmitSuccessDialogIsOpen);

  return (
    <AlertDialog
      open={submitScheduleAlertDialogIsOpen}
      onOpenChange={() => {
        setSubmitScheduleAlertDialogIsOpen(!submitScheduleAlertDialogIsOpen);
      }}
    >
      <AlertDialogTrigger className="flex w-full gap-2 px-2 py-1 text-sm">
        <SendHorizonalIcon className="text-primary size-5" /> <span>Submit schedule</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Action</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to submit this schedule?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              size="lg"
              onClick={() => {
                setCalendarScheduleDropdownIsOpen(false);
                setSubmitSuccessDialogIsOpen(true);
                toast.success("Success", {
                  description: "Successfully submitted the schedule for this month!",
                  position: "top-right",
                });
              }}
            >
              Submit
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
