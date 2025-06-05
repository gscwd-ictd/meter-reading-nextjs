import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@mr/components/ui/AlertDialog";
import { Button } from "@mr/components/ui/Button";

import { ThumbsUpIcon } from "lucide-react";
import { FunctionComponent } from "react";

export const SubmitScheduleSuccessDialog: FunctionComponent = () => {
  const submitSuccessDialogIsOpen = useSchedulesStore((state) => state.submitSuccessDialogIsOpen);
  const setSubmitSuccessDialogIsOpen = useSchedulesStore((state) => state.setSubmitSuccessDialogIsOpen);

  return (
    <AlertDialog open={submitSuccessDialogIsOpen} onOpenChange={setSubmitSuccessDialogIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">Success</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="flex gap-2">
          <ThumbsUpIcon className="size-10 shrink-0" />
          <span className="text-lg tracking-tight text-gray-500">
            The schedule has been successfully submitted. Thank you!
          </span>
        </div>
        <AlertDialogFooter>
          <Button
            variant="default"
            size="lg"
            onClick={() => {
              setSubmitSuccessDialogIsOpen(false);
            }}
          >
            <span className="text-lg">Got it, thanks!</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
