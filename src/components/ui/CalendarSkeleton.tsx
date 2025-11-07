import { motion } from "framer-motion";
import { Skeleton } from "./Skeleton";
import { LoadingSpinner } from "./LoadingSpinner";

// Enhanced loading component
export const CalendarSkeleton = ({ numberOfWeeks }: { numberOfWeeks: number }) => (
  <div className="grid grid-cols-7 gap-px">
    {Array.from({ length: numberOfWeeks * 7 }).map((_, idx) => (
      <div key={idx} className="bg-background flex h-32 flex-col gap-2 border border-dashed p-2">
        <div className="flex justify-end">
          <Skeleton className="size-6 rounded-full" />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

// Enhanced loading states
export const LoadingOverlay = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-background/80 absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
  >
    <div className="flex flex-col items-center gap-4">
      <LoadingSpinner className="size-8" />
      <p className="text-lg font-medium">{message}</p>
    </div>
  </motion.div>
);
