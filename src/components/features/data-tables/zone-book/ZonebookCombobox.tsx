"use client";

import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
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
import { Popover, PopoverContent, PopoverTrigger } from "@mr/components/ui/Popover";
import { Zonebook } from "@mr/lib/types/zonebook";
import { FunctionComponent, useEffect, useState } from "react";

export const ZonebookCombobox: FunctionComponent = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [zonebooksPool, setZonebooksPool] = useState<Zonebook[]>([]);
  const [searchZonebook, setSearchZonebook] = useState<string>("");

  const selectedZonebook = useSchedulesStore((state) => state.selectedZonebook);
  const setSelectedZonebook = useSchedulesStore((state) => state.setSelectedZonebook);
  const zonebookDialogIsOpen = useSchedulesStore((state) => state.zonebookDialogIsOpen);
  const zoneBooks = useZonebookStore((state) => state.zoneBooks);

  useEffect(() => {
    if (zonebookDialogIsOpen && zonebooksPool.length === 0) {
      setZonebooksPool(zoneBooks);
    }
  }, [zonebookDialogIsOpen, zonebooksPool, zoneBooks]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="flex justify-between">
          {selectedZonebook && selectedZonebook !== null
            ? zoneBooks.find((zb) => zb.zoneBook === selectedZonebook.zoneBook)?.zoneBook
            : "Search zoneBook"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px]" onWheel={(e) => e.stopPropagation()}>
        <Command>
          <CommandInput placeholder="Search for a zoneBook..." />
          <CommandList>
            <CommandEmpty>No zoneBooks found.</CommandEmpty>
            <CommandGroup>
              {zonebooksPool &&
                zonebooksPool.map((zb) => (
                  <CommandItem
                    key={zb.zoneBook}
                    value={zb.zoneBook}
                    onSelect={(currentValue) => {
                      setSearchZonebook(currentValue === searchZonebook ? "" : currentValue);
                      setSelectedZonebook({ ...zb, dueDate: undefined!, disconnectionDate: undefined! });
                      setOpen(false);
                    }}
                  >
                    <div className="grid grid-cols-2">
                      <span>{zb.zoneBook}</span>
                      <span>{zb.area}</span>
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
