import { FC } from "react";
import { CheckCircle, Circle } from "lucide-react";
import { MeterReadingEntryWithZonebooks } from "@mr/lib/types/schedule";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@mr/components/ui/Tooltip";

type ZonebookStatusIndicatorProps = {
  entry: MeterReadingEntryWithZonebooks;
};

export const ZonebookStatusIndicator: FC<ZonebookStatusIndicatorProps> = ({ entry }) => {
  const shouldRender = !!entry.dueDate && !!entry.meterReaders && entry.meterReaders.length > 0;
  if (!shouldRender) return null;

  const totalReaders = entry?.meterReaders?.length;
  const readersWithZonebooks = entry?.meterReaders?.filter((r) => r.zoneBooks.length > 0).length;

  let Icon = Circle;
  let color = "text-gray-300 dark:text-gray-400";

  if (readersWithZonebooks === 0) {
    Icon = Circle;
    color = "text-gray-300 dark:text-gray-400";
  } else if (readersWithZonebooks! < totalReaders!) {
    Icon = Circle;
    color = "text-yellow-500 dark:text-yellow-400";
  } else {
    Icon = CheckCircle;
    color = "text-green-600 dark:text-green-400";
  }

  return (
    <div className="absolute top-1 left-1 z-10">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Icon className={`h-4 w-4 cursor-default ${color}`} />
          </TooltipTrigger>
          <TooltipContent
            side="top"
            align="center"
            className="border-primary text-primary dark:bg-primary border bg-blue-50 dark:text-white"
          >
            <div className="text-xs">
              <div>
                {readersWithZonebooks} of {totalReaders} meter readers have assigned zonebooks
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
