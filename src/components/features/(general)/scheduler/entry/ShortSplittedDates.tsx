import { Badge } from "@mr/components/ui/Badge";
import { format } from "date-fns";
import React from "react";

interface SplittedDatesProps {
  dueDates: Date[];
  disconnectionDates: Date[];
}

export const ShortSplittedDates: React.FC<SplittedDatesProps> = ({ dueDates, disconnectionDates }) => {
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

    // change to unshift, puts the later date at the bottom
    pairs.push(
      <Badge
        key={i}
        variant="default"
        className="text-muted-foreground flex min-w-full items-center gap-0 bg-transparent p-0"
      >
        {due && (
          <div className="text-primary flex items-center gap-1 text-[0.3rem] sm:text-[0.3rem] md:text-[0.6rem] lg:text-xs">
            {format(due, "MMM dd")}
          </div>
        )}
        {due && disc && <span className="text-[0.3rem] sm:text-[0.3rem] md:text-[0.6rem] lg:text-xs">/</span>}
        {disc && (
          <div className="flex items-center gap-1 text-[0.3rem] text-red-500 sm:text-[0.3rem] md:text-[0.6rem] lg:text-xs">
            {format(disc, "MMM dd")}
          </div>
        )}
      </Badge>,
    );
  }

  return <>{pairs}</>;
};
