import { FC } from "react";
import { CheckCircle, Circle } from "lucide-react";
import { MeterReadingEntryWithZonebooks } from "@mr/lib/types/schedule";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@mr/components/ui/Tooltip";

type ZonebookStatusIndicatorProps = {
  entry: MeterReadingEntryWithZonebooks;
};

const hasEmptyZonebooks = (entry: MeterReadingEntryWithZonebooks): boolean => {
  if (!entry.meterReaders || entry.meterReaders.length === 0) return true;
  return entry.meterReaders.some((reader) => reader.zoneBooks.length === 0);
};

export const ZonebookStatusIndicator: FC<ZonebookStatusIndicatorProps> = ({ entry }) => {
  const shouldRender = !!entry.dueDate && !!entry.meterReaders && entry.meterReaders.length > 0;

  if (!shouldRender) return null;

  const isComplete = !hasEmptyZonebooks(entry);

  return (
    <div className="absolute top-1 left-1 z-10">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {isComplete ? (
              <CheckCircle className="h-4 w-4 cursor-default text-green-600 dark:text-green-400" />
            ) : (
              <Circle className="h-4 w-4 cursor-default text-yellow-500 dark:text-yellow-400" />
            )}
          </TooltipTrigger>
          <TooltipContent side="right" align="center" className="dark:text-white">
            <p>
              {isComplete ? "All meter readers have zonebooks" : "Some meter readers have missing zonebooks"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
