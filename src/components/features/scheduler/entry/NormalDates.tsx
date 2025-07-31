import { Badge } from "@mr/components/ui/Badge";
import { format } from "date-fns";
import { CalendarClockIcon, ScissorsLineDashedIcon } from "lucide-react";
import React from "react";

interface NormalDatesProps {
  dueDate: Date;
  disconnectionDate: Date;
}

export const NormalDates: React.FC<NormalDatesProps> = ({ dueDate, disconnectionDate }) => {
  return (
    <Badge
      variant="default"
      className="bg-muted text-muted-foreground flex min-w-[14rem] items-center gap-1 p-2"
    >
      {dueDate && (
        <span className="text-primary flex items-center gap-1">
          <CalendarClockIcon className="h-4 w-4 shrink-0" />
          Due: {format(dueDate, "MMM dd, yyyy")}
        </span>
      )}
      {dueDate && disconnectionDate && <span className="mx-1">/</span>}
      {disconnectionDate && (
        <span className="flex items-center gap-1 text-red-500">
          <ScissorsLineDashedIcon className="h-4 w-4 shrink-0" />
          Disconnection: {format(disconnectionDate, "MMM dd, yyyy")}
        </span>
      )}
    </Badge>
  );
};
