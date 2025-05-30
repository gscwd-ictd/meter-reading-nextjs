import { Button } from "@mr/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mr/components/ui/DropdownMenu";
import { Ellipsis, RotateCcwIcon, SendHorizonalIcon } from "lucide-react";
import { FunctionComponent } from "react";
import { Scheduler } from "./useScheduler";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { toast } from "sonner";

type CalendarSettingDropdownProps = {
  scheduler: Scheduler;
};

export const CalendarSettingDropdown: FunctionComponent<CalendarSettingDropdownProps> = ({ scheduler }) => {
  const setSchedule = useSchedulesStore((state) => state.setSchedule);
  const setSubmitSuccessDialogIsOpen = useSchedulesStore((state) => state.setSubmitSuccessDialogIsOpen);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent avoidCollisions alignOffset={2} sideOffset={2} align="end">
        <DropdownMenuItem
          className="cursor-pointer flex justify-start"
          onClick={() => {
            setSchedule(scheduler.calculateSchedule());
            toast.success("Success", {
              description: "Successfully reset the calendar for this month!",
              position: "top-right",
              duration: 1500,
            });
          }}
        >
          <RotateCcwIcon className="text-green-500" /> <span>Reset</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer flex justify-start"
          onClick={() => {
            setSubmitSuccessDialogIsOpen(true);
            toast.success("Success", {
              description: "Successfully submitted this month's schedule!",
              position: "top-right",
              duration: 1500,
            });
          }}
        >
          <SendHorizonalIcon className="text-primary" /> <span>Submit schedule</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
