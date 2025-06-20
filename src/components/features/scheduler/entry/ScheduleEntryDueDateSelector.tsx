"use client";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { Button } from "@mr/components/ui/Button";
import { Command, CommandItem, CommandList } from "@mr/components/ui/Command";
import { Popover, PopoverContent, PopoverTrigger } from "@mr/components/ui/Popover";
import { ZonebookWithDates } from "@mr/lib/types/zonebook";
import { cn } from "@mr/lib/utils";
import { compareAsc, format } from "date-fns";
import { CheckIcon } from "lucide-react";
import { Dispatch, FunctionComponent, SetStateAction, useState } from "react";

type SelectedDate = {
  dueDate: Date | undefined;
  disconnectionDate: Date | undefined;
};

type ScheduleEntryDueDateSelectorProps = {
  zonebook: string;
  zoneBooks: ZonebookWithDates[];
  setZonebooks: Dispatch<SetStateAction<ZonebookWithDates[]>>;
  dueDate: Date | undefined;
  disconnectionDate: Date | undefined;
};

export const ScheduleEntryDueDateSelector: FunctionComponent<ScheduleEntryDueDateSelectorProps> = ({
  zonebook,
  zoneBooks,
  setZonebooks,
  disconnectionDate,
  dueDate,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<SelectedDate>({
    dueDate: dueDate,
    disconnectionDate: disconnectionDate,
  });
  const formatDate = (date: Date) => format(date, "MMM dd, yyyy");
  const splittedDates = useSchedulesStore((state) => state.splittedDates);

  const findOne = (value: SelectedDate) => {
    const result = splittedDates?.find((date) => date.dueDate === value.dueDate)?.dueDate;
    if (result) return formatDate(result);
    return undefined;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline" role="combobox" aria-expanded={open}>
          {value && findOne(value) !== undefined ? findOne(value) : "Select date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2">
        <Command>
          <CommandList>
            {splittedDates &&
              splittedDates.map((date, idx) => (
                <CommandItem
                  key={idx}
                  value={date ? formatDate(date.dueDate!) : undefined}
                  onSelect={(currentValue) => {
                    const selectedZonebook = splittedDates.find(
                      (x) => compareAsc(x.dueDate!, currentValue) === 0,
                    )!;

                    setValue(selectedZonebook);

                    const newZonebooks = zoneBooks.map((mr) => {
                      if (mr.zoneBook === zonebook)
                        return {
                          ...mr,
                          dueDate: selectedZonebook.dueDate,
                          disconnectionDate: selectedZonebook.disconnectionDate,
                        };
                      return mr;
                    });

                    setZonebooks(newZonebooks);

                    setOpen(false);
                  }}
                >
                  {format(date.dueDate!, "MMM dd, yyyy")}
                  <CheckIcon
                    className={cn("ml-auto", value.dueDate === date.dueDate ? "opacity-100" : "opacity-0")}
                  />
                </CommandItem>
              ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
