"use client";

import { usePersonnelStore } from "@mr/components/stores/usePersonnelStore";
import { Button } from "@mr/components/ui/Button";
import { Command, CommandItem } from "@mr/components/ui/Command";
import { Label } from "@mr/components/ui/Label";
import { Popover, PopoverContent, PopoverTrigger } from "@mr/components/ui/Popover";
import { CommandList } from "cmdk";
import { Check, CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { FunctionComponent, useState } from "react";

const restDays = [
  { label: "Sunday", value: "sunday" },
  { label: "Saturday", value: "saturday" },
];

export const SelectRestDayCombobox: FunctionComponent = () => {
  const [open, setOpen] = useState<boolean>(false);
  const setSelectedRestDay = usePersonnelStore((state) => state.setSelectedRestDay);
  const selectedRestDay = usePersonnelStore((state) => state.selectedRestDay);

  return (
    <div className=" w-full items-center gap-1">
      <Label id="select-rest-day" className="text-sm font-medium text-gray-700">
        Rest Day
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            role="combobox"
            variant="secondary"
            className="w-full justify-between bg-green-500 text-white hover:bg-green-600 hover:brightness-95"
          >
            {selectedRestDay ? (
              <div className="flex justify-between items-center gap-2">
                {restDays.find((restDay) => restDay.value === selectedRestDay)?.label}
                <CheckIcon />
              </div>
            ) : (
              "Select a rest day"
            )}
            <ChevronsUpDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandList>
              {restDays.map((restDay) => (
                <CommandItem
                  key={restDay.value}
                  onSelect={() => {
                    setSelectedRestDay(restDay.value === "sunday" ? "sunday" : "saturday");
                    setOpen(false);
                  }}
                >
                  {restDay.label}
                  {selectedRestDay === restDay.value && <Check />}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
