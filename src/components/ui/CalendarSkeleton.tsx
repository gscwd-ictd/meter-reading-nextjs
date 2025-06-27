import { FunctionComponent } from "react";
import { Skeleton } from "./Skeleton";
import { LoadingSpinner } from "./LoadingSpinner";

export const CalendarSkeleton: FunctionComponent = () => {
  return (
    <div className="relative grid grid-cols-7 gap-2 p-2">
      {Array.from({ length: 35 }).map((_, i) => (
        <Skeleton key={i} className="h-34 rounded-md" />
      ))}

      <div className="absolute inset-0 z-10 flex items-center justify-center bg-transparent backdrop-blur-xs">
        <div className="text-primary flex items-center gap-2 text-xl">
          <LoadingSpinner className="size-12" />
          Loading Calendar...
        </div>
      </div>
    </div>
  );
};
