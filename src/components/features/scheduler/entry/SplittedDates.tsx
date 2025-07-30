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

  const sortedDueDates = dueDates.map((d) => new Date(d)).sort((a, b) => a.getTime() - b.getTime());
  const sortedDisconnectionDates = disconnectionDates
    .map((d) => new Date(d))
    .sort((a, b) => a.getTime() - b.getTime());

  for (let i = 0; i < maxLength; i++) {
    const due = sortedDueDates[i];
    const disc = sortedDisconnectionDates[i];

    if (!due && !disc) continue;

    pairs.push(
      <Badge
        key={i}
        variant="default"
        className="bg-muted text-muted-foreground flex min-w-[14rem] items-center gap-1 p-2"
      >
        {due && (
          <div className="text-primary flex items-center gap-1 text-[0.5rem] sm:text-[0.5rem] md:text-[0.5rem] lg:text-xs">
            <CalendarClockIcon className="size-2 shrink-0 sm:size-2 md:size-2 lg:size-4" />
            Due: {format(due, "MMM dd, yyyy")}
          </div>
        )}
        {due && disc && <span className="text-[0.5rem] sm:text-[0.5rem] md:text-[0.5rem] lg:text-xs">/</span>}
        {disc && (
          <div className="flex items-center gap-1 text-[0.5rem] text-red-500 sm:text-[0.5rem] md:text-[0.5rem] lg:text-xs">
            <ScissorsLineDashedIcon className="size-2 shrink-0 sm:size-2 md:size-2 lg:size-4" />
            Disconnection: {format(disc, "MMM dd, yyyy")}
          </div>
        )}
      </Badge>,
    );
  }

  return (
    <div className="flex w-full justify-start sm:justify-start md:justify-start lg:justify-start">
      <div className="sm grid grid-rows-2 gap-2 sm:grid-cols-1 sm:grid-rows-2 md:grid-cols-1 md:grid-rows-2 lg:grid-cols-2 lg:grid-rows-1">
        {pairs}
      </div>
    </div>
  );
};
