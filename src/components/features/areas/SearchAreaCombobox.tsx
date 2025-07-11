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
import { useDebounce } from "@mr/hooks/use-debounce";
import { Area } from "@mr/lib/types/zonebook";
import { cn } from "@mr/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Book, Check, ScanSearchIcon } from "lucide-react";
import { FunctionComponent, useEffect, useRef, useState } from "react";

export const SearchAreaCombobox: FunctionComponent = () => {
  const [open, setOpen] = useState<boolean>(false);
  const selectedArea = useZonebookStore((state) => state.selectedArea);
  const setSelectedArea = useZonebookStore((state) => state.setSelectedArea);
  const [searchArea, setSearchArea] = useState<string>("");

  const searchAreaInputRef = useRef<HTMLInputElement>(null);

  const {
    data: areas,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ["get-all-employees"],
    queryFn: async () => {
      const data = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/area`);
      return data;
    },
    enabled: open,
  });

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
          {selectedArea && selectedArea.areaId ? (
            <span className="flex items-center gap-2 text-sm">
              {areas?.data?.find((area: Area) => area.area === selectedArea?.area)?.area}
            </span>
          ) : (
            <span className="flex items-center gap-2 text-sm">
              <ScanSearchIcon className="text-primary size-5" />
              <span className="text-primary text-sm">Search from areas list...</span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="col-span-3 p-0" onWheel={(e) => e.stopPropagation()}>
        {!areas && (isLoading || isPending) ? (
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
                {areas?.data.map((area: Area, index: number) => (
                  <CommandItem
                    key={area.areaId}
                    value={area.area}
                    onSelect={(currentValue) => {
                      if (area.areaId === selectedArea?.areaId) setSelectedArea({} as Area);
                      else {
                        // this block sets the employee if the same employee is not selected
                        setSelectedArea(area);
                      }
                      //   setTempFilteredZonebooks(ZonebookFlatSorter(filteredZonebooks));
                      //   setMobileNumber(undefined);
                      //   setValue("mobileNumber", undefined);
                      //   setMeterReaderZonebooks([]);
                      //   setValue("restDay", undefined);
                      //   setSelectedRestDay(undefined);
                      //   setSearchEmployee(currentValue === searchEmployee ? "" : currentValue);
                      //   setOpen(false);
                      setSearchArea(currentValue === searchArea ? "" : currentValue);
                      setOpen(false);
                    }}
                    className={cn("px-2 py-2", index !== 0 && "border-muted border-t")}
                  >
                    <div className="flex items-center gap-2">
                      <Book />
                      <div className="flex flex-col">
                        <span className="font-semibold">{area.area}</span>
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
