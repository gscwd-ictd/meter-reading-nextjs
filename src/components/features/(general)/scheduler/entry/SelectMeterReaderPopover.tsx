"use client";

import * as React from "react";
import { ChevronsUpDown, Search } from "lucide-react";
import { Button } from "@mr/components/ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@mr/components/ui/Popover";
import { Input } from "@mr/components/ui/Input";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MeterReaderWithZonebooks } from "@mr/lib/types/personnel";
import { useMemo, useState } from "react";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { ScrollArea } from "@mr/components/ui/ScrollArea";

// Add props interface
interface SelectMeterReaderPopoverProps {
  value?: MeterReaderWithZonebooks;
  onChange?: (meterReader: MeterReaderWithZonebooks) => void;
}

export function SelectMeterReaderPopover({ value, onChange }: SelectMeterReaderPopoverProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Use the value from props instead of internal state
  const selectedMeterReader = value;

  const meterReader = useSchedulesStore((state) => state.selectedMeterReader);

  const { data: assignedMeterReaders } = useQuery({
    queryKey: ["get-all-meter-readers"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/meter-readers?status=assigned`);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const getSymmetricDifference = (
    a: MeterReaderWithZonebooks[] = [],
    b: MeterReaderWithZonebooks[] = [],
  ): MeterReaderWithZonebooks[] => {
    return [
      ...a.filter((readerA) => !b.some((readerB) => readerB.id === readerA.id)),
      ...b.filter((readerB) => !a.some((readerA) => readerA.id === readerB.id)),
    ];
  };

  const filteredMeterReaders = useMemo(() => {
    const existingMeterReaders = [{ ...meterReader! }];
    const symmetricDifference = getSymmetricDifference(assignedMeterReaders, existingMeterReaders);

    // Filter by search term
    if (!searchTerm) return symmetricDifference;

    return symmetricDifference.filter(
      (mr) =>
        mr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mr.mobileNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [assignedMeterReaders, meterReader, searchTerm]);

  const handleSelect = (mr: MeterReaderWithZonebooks) => {
    if (onChange) {
      onChange(mr); // Notify parent component
    }
    setOpen(false);
    setSearchTerm(""); // Clear search when selection is made
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSearchTerm(""); // Clear search when popover closes
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-xs"
        >
          {selectedMeterReader?.name || "Select Meter Reader"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="border-b p-2">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4 text-xs" />
            <Input
              placeholder="Search by name or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 text-xs"
            />
          </div>
        </div>

        {filteredMeterReaders && filteredMeterReaders.length > 0 ? (
          <ScrollArea className="max-h-64 overflow-y-auto">
            <div className="text-muted-foreground mb-2 grid grid-cols-3 gap-2 px-2 text-sm font-semibold">
              <div>Name</div>
              <div>Mobile</div>
              <div>Rest Day</div>
            </div>
            <div className="space-y-1">
              {filteredMeterReaders.map((mr) => (
                <div
                  key={mr.id}
                  onClick={() => handleSelect(mr)}
                  className="hover:bg-muted grid cursor-pointer grid-cols-3 items-start gap-2 rounded-md p-2 text-xs"
                >
                  <div className="">{mr.name}</div>
                  <div className="text-muted-foreground">{mr.mobileNumber}</div>
                  <div className="text-muted-foreground">
                    {mr.restDay && mr.restDay === "sunday" ? "Sunday" : "Saturday"}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="p-4 text-center">
            {searchTerm ? (
              <div className="text-muted-foreground text-sm">No meter readers found for "{searchTerm}"</div>
            ) : (
              <div className="text-muted-foreground text-sm">No available meter readers</div>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
