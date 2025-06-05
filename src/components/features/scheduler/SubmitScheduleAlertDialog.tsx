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
import { FunctionComponent } from "react";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { Button } from "@mr/components/ui/Button";

export const SubmitScheduleAlertDialog: FunctionComponent = () => {
  const setSubmitSuccessDialogIsOpen = useSchedulesStore((state) => state.setSubmitSuccessDialogIsOpen);

  return (
    <AlertDialog>
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
                setSubmitSuccessDialogIsOpen(true);
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
