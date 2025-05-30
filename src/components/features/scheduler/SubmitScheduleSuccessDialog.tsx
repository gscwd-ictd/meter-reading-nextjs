import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { Button } from "@mr/components/ui/Button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@mr/components/ui/Dialog";

import { ThumbsUpIcon } from "lucide-react";

export const SubmitScheduleSuccessDialog = () => {
  const submitSuccessDialogIsOpen = useSchedulesStore((state) => state.submitSuccessDialogIsOpen);
  const setSubmitSuccessDialogIsOpen = useSchedulesStore((state) => state.setSubmitSuccessDialogIsOpen);
  return (
    <Dialog open={submitSuccessDialogIsOpen} onOpenChange={setSubmitSuccessDialogIsOpen} modal>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Success</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          <ThumbsUpIcon className="size-10 shrink-0" />
          <span className=" text-lg text-gray-500 tracking-tight">
            Your response has been successfully submitted. Thank you!
          </span>
        </div>
        <DialogFooter>
          <Button variant="default" size="lg" onClick={() => setSubmitSuccessDialogIsOpen(false)}>
            <span className="text-lg">Got it, thanks!</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
