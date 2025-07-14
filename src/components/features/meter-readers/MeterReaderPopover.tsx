"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@mr/components/ui/Popover";
import { Button } from "@mr/components/ui/Button";
import { ScrollArea } from "@mr/components/ui/ScrollArea";
import { MeterReaderWithZonebooks } from "@mr/lib/types/personnel";
import { useState } from "react";

type Props = {
  filteredMeterReaders: MeterReaderWithZonebooks[];
  selectedMeterReader?: MeterReaderWithZonebooks;
  setSelectedMeterReader: (reader: MeterReaderWithZonebooks) => void;
};

export function MeterReaderPopover({
  filteredMeterReaders,
  selectedMeterReader,
  setSelectedMeterReader,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Popover
      open={open}
      onOpenChange={() => {
        setSelectedMeterReader({} as MeterReaderWithZonebooks);
        setOpen(!open);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {selectedMeterReader ? selectedMeterReader.name : "Select Meter Reader"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[400px] p-2">
        {filteredMeterReaders && filteredMeterReaders.length > 0 ? (
          <ScrollArea className="max-h-64 overflow-y-auto">
            <div className="text-muted-foreground mb-2 grid grid-cols-3 gap-2 px-2 text-sm font-semibold">
              <div>Name</div>
              <div>Mobile</div>
              <div>Rest Day</div>
            </div>
            <div className="space-y-1 overflow-y-auto">
              {filteredMeterReaders.map((mr) => (
                <div
                  key={mr.meterReaderId}
                  onClick={() => {
                    setSelectedMeterReader(mr);
                    setOpen(false);
                  }}
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
          <div className="text-muted-foreground p-2 text-sm">No available meter readers</div>
        )}
      </PopoverContent>
      <div className="flex w-full justify-center">
        <Button className="w-full">Manually add this meter reader</Button>
      </div>
    </Popover>
  );
}
