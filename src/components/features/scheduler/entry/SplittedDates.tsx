import { Badge } from "@mr/components/ui/Badge";
import { format } from "date-fns";
import { CalendarClockIcon, ScissorsLineDashedIcon } from "lucide-react";
import React from "react";

interface SplittedDatesProps {
  dueDates: Date[];
  disconnectionDates: Date[];
}

export const SplittedDates: React.FC<SplittedDatesProps> = ({ dueDates, disconnectionDates }) => {
  const maxLength = Math.max(dueDates.length, disconnectionDates.length);
  const pairs: React.ReactNode[] = [];

  for (let i = 0; i < maxLength; i++) {
    const due = dueDates[i];
    const disc = disconnectionDates[i];

    if (!due && !disc) continue;

    pairs.push(
      <Badge
        key={i}
        variant="default"
        className="bg-muted text-muted-foreground flex min-w-[14rem] items-center gap-1 p-2"
      >
        {due && (
          <div className="text-primary flex gap-1">
            <CalendarClockIcon className="h-4 w-4 shrink-0" />
            Due: {format(due, "MMM dd, yyyy")}
          </div>
        )}
        {due && disc && <span className="mx-1">/</span>}
        {disc && (
          <div className="text-destructive flex gap-1">
            <ScissorsLineDashedIcon className="h-4 w-4 shrink-0" />
            Disconnection: {format(disc, "MMM dd, yyyy")}
          </div>
        )}
      </Badge>,
    );
  }

  return <div className="flex flex-wrap gap-3 lg:flex-nowrap">{pairs}</div>;
};
