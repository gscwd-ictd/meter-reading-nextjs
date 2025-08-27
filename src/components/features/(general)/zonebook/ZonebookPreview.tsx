import { useEffect, useState } from "react";
import { Badge } from "@mr/components/ui/Badge";
import { Popover, PopoverContent, PopoverTrigger } from "@mr/components/ui/Popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@mr/components/ui/Tooltip";
import { Zonebook } from "@mr/lib/types/zonebook";

export function ZonebookPreview({ zonebooks }: { zonebooks: Zonebook[] }) {
  const previewCount = 3;
  const shown = zonebooks.slice(0, previewCount);
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
    return <span className="text-muted-foreground text-sm">No zone books</span>;
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
          <TooltipContent className="dark:text-white"> {zb.area.name ? zb.area.name : "N/A"}</TooltipContent>
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
                      {zb.area.name ? zb.area.name : "N/A"}
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
