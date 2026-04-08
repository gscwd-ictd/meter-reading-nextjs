"use client";

import { Button } from "@mr/components/ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@mr/components/ui/Command";
import { Popover, PopoverContent, PopoverTrigger } from "@mr/components/ui/Popover";
import { cn } from "@mr/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Check, UserRoundSearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MeterReader } from "@mr/lib/types/personnel";
import { Avatar, AvatarFallback, AvatarImage } from "@mr/components/ui/Avatar";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import { useFormContext } from "react-hook-form";

type SearchMeterReaderComboboxProps = {
  disabled?: boolean;
};

export const SearchMeterReaderCombobox = ({ disabled }: SearchMeterReaderComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [searchEmployee, setSearchEmployee] = useState("");
  const searchPersonnelInputRef = useRef<HTMLInputElement>(null);

  const { setValue, watch } = useFormContext();
  const selectedMeterReader = watch("meterReader"); // Get from form instead of store

  // Fetch data once when component mounts
  const { data: meterReadersData, isLoading } = useQuery({
    queryKey: ["get-all-meter-readers"],
    queryFn: async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/meter-readers?status=assigned`);
      return response.data as MeterReader[];
    },
    // Remove enabled: open - fetch once on mount
  });

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        searchPersonnelInputRef.current?.focus();
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleSelectMeterReader = (meterReader: MeterReader | undefined) => {
    if (!meterReader) {
      setValue("meterReader", undefined, { shouldValidate: true, shouldDirty: true });
    } else {
      setValue("meterReader", meterReader, { shouldValidate: true, shouldDirty: true });
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-[2.5rem] w-[200px] justify-start px-3 disabled:cursor-not-allowed"
          size="sm"
          disabled={disabled}
        >
          {selectedMeterReader ? (
            <div className="flex items-center gap-2 truncate">
              <Avatar className="ring-background h-6 w-6 ring-2">
                <AvatarImage
                  src={
                    selectedMeterReader?.photoUrl
                      ? `${process.env.NEXT_PUBLIC_HRMS_IMAGES_SERVER}/${selectedMeterReader.photoUrl}`
                      : undefined
                  }
                  alt={selectedMeterReader.photoUrl}
                  className="object-cover"
                />
                <AvatarFallback className="text-xs">{selectedMeterReader?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="truncate text-xs sm:text-sm">{selectedMeterReader?.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 truncate">
              <UserRoundSearchIcon className="text-primary size-4" />
              <span className="truncate text-xs text-gray-500 sm:text-sm">Search meter reader...</span>
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start" side="bottom">
        {isLoading ? (
          <div className="flex w-full items-center justify-center gap-2 p-4">
            <LoadingSpinner className="text-primary" />
            <span className="text-xs sm:text-sm">Loading...</span>
          </div>
        ) : (
          <Command>
            <CommandInput placeholder="Name..." ref={searchPersonnelInputRef} className="text-sm" />
            <CommandList className="max-h-60 overflow-y-auto">
              <CommandEmpty className="py-4 text-center text-xs sm:text-sm">
                No meter reader found.
              </CommandEmpty>
              <CommandGroup>
                <CommandItem value="clear" onSelect={() => handleSelectMeterReader(undefined)}>
                  <div className="text-primary cursor-auto items-end px-2 font-medium hover:cursor-pointer hover:brightness-75">
                    Clear
                  </div>
                </CommandItem>
                {meterReadersData?.map((meterReader: MeterReader, index: number) => (
                  <CommandItem
                    key={meterReader.employeeId}
                    value={meterReader.name}
                    onSelect={() => handleSelectMeterReader(meterReader)}
                    className={cn("px-3 py-2", index !== 0 && "border-muted border-t")}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <Avatar className="ring-background h-8 w-8 flex-shrink-0 ring-2">
                        <AvatarImage
                          src={
                            meterReader.photoUrl
                              ? `${process.env.NEXT_PUBLIC_HRMS_IMAGES_SERVER}/${meterReader.photoUrl}`
                              : undefined
                          }
                          srcSet=""
                          className="object-cover"
                        />
                        <AvatarFallback className="text-xs">{meterReader.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-semibold">{meterReader.name}</span>
                        <span className="truncate text-xs text-gray-500">{meterReader.positionTitle}</span>
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "ml-2 h-4 w-4 flex-shrink-0",
                        selectedMeterReader?.employeeId === meterReader.employeeId
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
