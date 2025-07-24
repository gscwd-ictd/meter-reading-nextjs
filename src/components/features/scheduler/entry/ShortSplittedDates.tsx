import { Badge } from "@mr/components/ui/Badge";
import { format } from "date-fns";
import { CalendarClockIcon, ScissorsLineDashedIcon } from "lucide-react";
import React from "react";

interface SplittedDatesProps {
  dueDates: Date[];
  disconnectionDates: Date[];
}

export const ShortSplittedDates: React.FC<SplittedDatesProps> = ({ dueDates, disconnectionDates }) => {
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
        className="text-muted-foreground flex min-w-full items-center gap-0 bg-transparent p-0"
      >
        {due && (
          <div className="text-primary flex items-center gap-1 text-xs sm:text-[0.6rem] lg:text-xs">
            {format(due, "MMM dd")}
          </div>
        )}
        {due && disc && <span className="text-[0.5rem] sm:text-[0.5rem] md:text-[0.5rem] lg:text-xs">/</span>}
        {disc && (
          <div className="text-destructive flex items-center gap-1 text-xs sm:text-[0.6rem] lg:text-xs">
            {format(disc, "MMM dd")}
          </div>
        )}
      </Badge>,
    );
  }

  return <>{pairs}</>;
};
