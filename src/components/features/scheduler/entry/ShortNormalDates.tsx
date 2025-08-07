import { Badge } from "@mr/components/ui/Badge";
import { format } from "date-fns";
import { CalendarClockIcon, ScissorsLineDashedIcon } from "lucide-react";
import React from "react";

interface NormalDatesProps {
  dueDate: Date;
  disconnectionDate: Date;
}

export const ShortNormalDates: React.FC<NormalDatesProps> = ({ dueDate, disconnectionDate }) => {
  return (
    <Badge
      variant="default"
      className="text-muted-foreground flex w-full items-center justify-center gap-0 bg-transparent p-0"
    >
      {dueDate && (
        <span className="text-primary flex items-center gap-1 text-[0.3rem] -tracking-wider sm:text-[0.3rem] md:text-[0.6rem] lg:text-xs">
          {/* <CalendarClockIcon className="h-4 w-4 shrink-0" /> */}
          {format(dueDate, "MMM dd")}
        </span>
      )}
      {dueDate && disconnectionDate && (
        <span className="mx-0.5 text-[0.3rem] sm:mx-0 sm:text-[0.3rem] md:text-[0.6rem] lg:text-xs">/</span>
      )}
      {disconnectionDate && (
        <span className="flex items-center gap-1 text-[0.3rem] -tracking-wider text-red-500 sm:text-[0.3rem] md:text-[0.6rem] lg:text-xs">
          {/* <ScissorsLineDashedIcon className="h-4 w-4 shrink-0" /> */}
          {format(disconnectionDate, "MMM dd")}
        </span>
      )}
    </Badge>
  );
};
