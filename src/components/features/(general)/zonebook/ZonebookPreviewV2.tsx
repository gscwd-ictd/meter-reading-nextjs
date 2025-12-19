import { useEffect, useState } from "react";
import { Badge } from "@mr/components/ui/Badge";
import { Popover, PopoverContent, PopoverTrigger } from "@mr/components/ui/Popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@mr/components/ui/Tooltip";
import { ZonebookWithDates } from "@mr/lib/types/zonebook";
import { ZonebookFlatSorterV2 } from "@mr/lib/functions/zonebook-flat-sorter";
import { formatDate } from "date-fns";

export function ZonebookPreviewV2({ zonebooks }: { zonebooks: ZonebookWithDates[] }) {
  const previewCount = 3;
  const shown = ZonebookFlatSorterV2(zonebooks.slice(0, previewCount));
  const remaining = zonebooks.length - shown.length;

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [tooltipReady, setTooltipReady] = useState(false);

  // Delay tooltip mount by ~50ms after popover opens
  useEffect(() => {
    if (isPopoverOpen) {
      const timeout = setTimeout(() => {
        setTooltipReady(true);
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      setTooltipReady(false);
    }
  }, [isPopoverOpen]);

  if (!zonebooks || zonebooks.length === 0) {
    return <span className="text-muted-foreground text-xs">No zone books</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {shown.map((zb, i) => (
        <Tooltip key={i}>
          <TooltipTrigger asChild>
            <Badge variant="outline">
              {zb.zone}-{zb.book}
            </Badge>
          </TooltipTrigger>
          <TooltipContent className="dark:text-white">
            {" "}
            <div className="flex flex-col">
              <span>Area: {zb.area.name ? zb.area.name : "N/A"}</span>
              <span> Due Date: {zb.dueDate ? formatDate(zb.dueDate, "MMM dd, yyyy") : null}</span>
              <span>
                Disconnection Date:{" "}
                {zb.disconnectionDate ? formatDate(zb.disconnectionDate, "MMM dd, yyyy") : null}
              </span>
            </div>
          </TooltipContent>
        </Tooltip>
      ))}
      {remaining > 0 && (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Badge variant="secondary" className="cursor-pointer">
              +{remaining} more
            </Badge>
          </PopoverTrigger>
          <PopoverContent className="max-h-60 max-w-sm overflow-auto">
            <div className="flex flex-wrap gap-1">
              {tooltipReady &&
                zonebooks.slice(previewCount).map((zb, i) => (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <Badge variant="outline">
                        {zb.zone}-{zb.book}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="dark:text-white">
                      <div className="flex flex-col">
                        <span>Area: {zb.area.name ? zb.area.name : "N/A"}</span>
                        <span> Due Date: {zb.dueDate ? formatDate(zb.dueDate, "MMM dd, yyyy") : null}</span>
                        <span>
                          Disconnection Date:{" "}
                          {zb.disconnectionDate ? formatDate(zb.disconnectionDate, "MMM dd, yyyy") : null}
                        </span>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
