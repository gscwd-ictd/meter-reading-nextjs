"use client";

import { Badge } from "@mr/components/ui/Badge";
import { Popover, PopoverContent, PopoverTrigger } from "@mr/components/ui/Popover";

type Zonebook = {
  area: string;
  zone: string;
  book: string;
  zoneBook: string;
};

export function ZonebookPreview({ zonebooks }: { zonebooks: Zonebook[] }) {
  if (!zonebooks || zonebooks.length === 0) {
    return <span className="text-muted-foreground text-sm">No zonebooks</span>;
  }

  const previewCount = 3;
  const shown = zonebooks.slice(0, previewCount);
  const remaining = zonebooks.length - shown.length;

  return (
    <div className="flex flex-wrap gap-1">
      {shown.map((zb, i) => (
        <Badge key={i} variant="outline">
          {zb.zone}-{zb.book}
        </Badge>
      ))}
      {remaining > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Badge variant="secondary" className="cursor-pointer">
              +{remaining} more
            </Badge>
          </PopoverTrigger>
          <PopoverContent className="max-h-60 max-w-sm overflow-auto">
            <div className="flex flex-wrap gap-1">
              {zonebooks.slice(previewCount).map((zb, i) => (
                <Badge key={i} variant="outline">
                  {zb.zone}-{zb.book}
                </Badge>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
