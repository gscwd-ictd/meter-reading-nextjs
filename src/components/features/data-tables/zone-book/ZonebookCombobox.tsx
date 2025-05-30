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
  const zonebooks = useZonebookStore((state) => state.zonebooks);

  useEffect(() => {
    if (zonebookDialogIsOpen && zonebooksPool.length === 0) {
      setZonebooksPool(zonebooks);
    }
  }, [zonebookDialogIsOpen, zonebooksPool, zonebooks]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between flex">
          {selectedZonebook && selectedZonebook !== null
            ? zonebooks.find((zb) => zb.zonebook === selectedZonebook.zonebook)?.zonebook
            : "Search zonebook"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px]" onWheel={(e) => e.stopPropagation()}>
        <Command>
          <CommandInput placeholder="Search for a zonebook..." />
          <CommandList>
            <CommandEmpty>No zonebooks found.</CommandEmpty>
            <CommandGroup>
              {zonebooksPool &&
                zonebooksPool.map((zb) => (
                  <CommandItem
                    key={zb.zonebook}
                    value={zb.zonebook}
                    onSelect={(currentValue) => {
                      setSearchZonebook(currentValue === searchZonebook ? "" : currentValue);
                      setSelectedZonebook(zb);
                      setOpen(false);
                    }}
                  >
                    <div className="grid grid-cols-2">
                      <span>{zb.zonebook}</span>
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
