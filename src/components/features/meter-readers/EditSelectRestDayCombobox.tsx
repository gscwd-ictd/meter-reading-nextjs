"use client";

import { useMeterReadersStore } from "@mr/components/stores/useMeterReadersStore";
import { Button } from "@mr/components/ui/Button";
import { Command, CommandItem } from "@mr/components/ui/Command";
import { Label } from "@mr/components/ui/Label";
import { Popover, PopoverContent, PopoverTrigger } from "@mr/components/ui/Popover";
import { CommandList } from "cmdk";
import { Check, CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { FunctionComponent, useState } from "react";
import { useFormContext } from "react-hook-form";

const restDays = [
  { label: "Sunday", value: "sunday" },
  { label: "Saturday", value: "saturday" },
];

export const EditSelectRestDayCombobox: FunctionComponent = () => {
  const [open, setOpen] = useState<boolean>(false);
  const setSelectedRestDay = useMeterReadersStore((state) => state.setSelectedRestDay);
  const selectedRestDay = useMeterReadersStore((state) => state.selectedRestDay);

  const { setValue } = useFormContext();

  return (
    <div className="w-full items-center">
      <Label id="select-rest-day" className="gap-1 text-sm font-medium text-gray-700">
        Rest Day <span className="text-red-600">*</span>
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button role="combobox" variant="outline" className="w-full justify-between">
            {selectedRestDay ? (
              <div className="flex items-center justify-between gap-2">
                {restDays.find((restDay) => restDay.value === selectedRestDay)?.label}
                <CheckIcon />
              </div>
            ) : (
              "Select a rest day"
            )}
            <ChevronsUpDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="p-1">
          <Command>
            <CommandList>
              {restDays.map((restDay) => (
                <CommandItem
                  key={restDay.value}
                  onSelect={() => {
                    setSelectedRestDay(restDay.value === "sunday" ? "sunday" : "saturday");
                    setOpen(false);
                    setValue("restDay", restDay.value === "sunday" ? "sunday" : "saturday");
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
