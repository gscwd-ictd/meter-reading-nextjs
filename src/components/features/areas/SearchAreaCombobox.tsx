"use client";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";
import { Button } from "@mr/components/ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@mr/components/ui/Command";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import { Popover, PopoverContent, PopoverTrigger } from "@mr/components/ui/Popover";
import { Area } from "@mr/lib/types/zonebook";
import { cn } from "@mr/lib/utils";
import { Check, Scan, ScanSearchIcon } from "lucide-react";
import { FunctionComponent, useRef, useState } from "react";

type SearchAreaComboboxProps = {
  areaList: Area[];
  isLoading: boolean;
  isPending: boolean;
};

export const SearchAreaCombobox: FunctionComponent<SearchAreaComboboxProps> = ({
  areaList,
  isLoading,
  isPending,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const selectedArea = useZonebookStore((state) => state.selectedArea);
  const setSelectedArea = useZonebookStore((state) => state.setSelectedArea);
  const [searchArea, setSearchArea] = useState<string>("");

  const searchAreaInputRef = useRef<HTMLInputElement>(null);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          size="lg"
          className={`flex w-full justify-start`}
        >
          {areaList && selectedArea && selectedArea.areaId ? (
            <span className="flex items-center gap-2 text-sm">
              {areaList && areaList.find((area: Area) => area.area === selectedArea?.area)?.area}
            </span>
          ) : (
            !areaList &&
            !selectedArea?.areaId && (
              <span className="flex items-center gap-2 text-sm">
                <ScanSearchIcon className="text-primary size-5" />
                <span className="text-primary text-sm">Search from areas list...</span>
              </span>
            )
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="col-span-3 p-0" onWheel={(e) => e.stopPropagation()}>
        {!areaList && (isLoading || isPending) ? (
          <div className="text-primary flex w-full justify-center gap-2 font-medium">
            <LoadingSpinner /> Loading...
          </div>
        ) : (
          <Command>
            <CommandInput
              placeholder="Search areas..."
              ref={searchAreaInputRef}
              value={searchArea}
              onValueChange={setSearchArea}
            />
            <CommandList className="max-h-60 overflow-y-auto" role="listbox" tabIndex={-1}>
              <CommandEmpty>No areas found.</CommandEmpty>
              <CommandGroup>
                {areaList &&
                  areaList.map((area: Area, index: number) => (
                    <CommandItem
                      key={area.areaId}
                      value={area.area}
                      onSelect={(currentValue) => {
                        if (area.areaId === selectedArea?.areaId) setSelectedArea({} as Area);
                        else setSelectedArea(area);

                        setSearchArea(currentValue === searchArea ? "" : currentValue);
                        setOpen(false);
                      }}
                      className={cn("px-2 py-2 hover:cursor-pointer", index !== 0 && "border-muted border-t")}
                    >
                      <div className="flex items-center gap-2">
                        <Scan />
                        <div className="flex flex-col">
                          <span className="font-medium">{area.area}</span>
                        </div>
                      </div>
                      <Check
                        className={cn(
                          "ml-auto",
                          searchArea.toLowerCase().includes(area.area.toLowerCase())
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
};
