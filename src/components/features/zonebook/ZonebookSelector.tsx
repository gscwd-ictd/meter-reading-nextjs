"use client";

import { useState, useMemo, useEffect } from "react";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@mr/components/ui/Command";
import { Popover, PopoverContent, PopoverTrigger } from "@mr/components/ui/Popover";
import { Button } from "@mr/components/ui/Button";
import { cn } from "@mr/lib/utils";
import { Check, ChevronDown, CircleXIcon, PlusCircleIcon } from "lucide-react";
import { Zonebook } from "@mr/lib/types/zonebook";
import { Label } from "@mr/components/ui/Label";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@mr/components/ui/Table";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";

type Props = {
  zonebooks: Zonebook[];
  onSelectionChange?: (zone: string, book: string) => void;
};

export default function ZoneBookSelector({ zonebooks, onSelectionChange }: Props) {
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [filteredZonebooks, setFilteredZonebooks] = useState<Zonebook[]>([]);
  const [hasSetInitialPool, setHasSetInitialPool] = useState<boolean>(false);
  const [zoneIsOpen, setZoneIsOpen] = useState<boolean>(false);
  const [bookIsOpen, setBookIsOpen] = useState<boolean>(false);

  const zonebookSelectorIsOpen = useZonebookStore((state) => state.zonebookSelectorIsOpen);
  const setZonebookSelectorIsOpen = useZonebookStore((state) => state.setZonebookSelectorIsOpen);

  const selectedZonebook = useSchedulesStore((state) => state.selectedZonebook);
  const setSelectedZonebook = useSchedulesStore((state) => state.setSelectedZonebook);
  const meterReaderZonebooks = useZonebookStore((state) => state.meterReaderZonebooks);
  const setMeterReaderZonebooks = useZonebookStore((state) => state.setMeterReaderZonebooks);

  const zones = useMemo(() => {
    const allZones = filteredZonebooks.map((zb) => zb.zone);
    return Array.from(new Set(allZones));
  }, [filteredZonebooks]);

  const booksForZone = useMemo(() => {
    if (!selectedZone) return [];
    const books = filteredZonebooks.filter((zb) => zb.zone === selectedZone).map((zb) => zb.book);
    return Array.from(new Set(books));
  }, [selectedZone, filteredZonebooks]);

  const handleZoneSelect = (zone: string) => {
    setSelectedZone(zone);
    setSelectedBook(""); // reset book when zone changes
    onSelectionChange?.(zone, "");
    setSelectedZonebook(null);
  };

  const handleBookSelect = (book: string) => {
    setSelectedBook(book);

    setSelectedZonebook(filteredZonebooks.find((zb) => zb.zone === selectedZone && zb.book === book)!);

    onSelectionChange?.(selectedZone, book);
  };

  const handleZonebookSelect = (zonebook: Zonebook) => {
    onSelectionChange?.(zonebook.zone, zonebook.book);
    setSelectedZonebook(zonebook);
    setSelectedZone(zonebook.zone);
    setSelectedBook(zonebook.book);
  };

  const getNewFilteredZonebooks = async (selectedZonebook: Zonebook): Promise<Zonebook[]> => {
    return filteredZonebooks.filter((zb) => zb !== selectedZonebook);
  };

  useEffect(() => {
    if (!hasSetInitialPool) {
      setFilteredZonebooks(zonebooks);
      setHasSetInitialPool(true);
    }
  }, [zonebooks, hasSetInitialPool]);

  return (
    <div className="flex flex-col w-full">
      <Popover
        open={zonebookSelectorIsOpen}
        onOpenChange={() => {
          setZonebookSelectorIsOpen(!zonebookSelectorIsOpen);
          setSelectedBook("");
          setSelectedZone("");
          setSelectedZonebook(null);
        }}
      >
        <PopoverTrigger asChild className="group ">
          <div role="button" className="flex gap-1 text-primary items-center">
            <Label
              htmlFor="zonebooks"
              className="text-left text-sm font-medium text-gray-700 group-hover:cursor-pointer"
            >
              Zonebooks
            </Label>
            <PlusCircleIcon className="size-4 fill-primary text-primary-foreground" />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="flex flex-col w-[600px] gap-2 m-2"
          align="start"
          side="bottom"
          sideOffset={8}
          alignOffset={10}
          avoidCollisions
        >
          <Command className="flex flex-col gap-2">
            <div className="grid grid-cols-3 items-end w-full gap-2">
              {/* Zone Combobox */}
              <Popover open={zoneIsOpen} onOpenChange={setZoneIsOpen}>
                <PopoverTrigger asChild className="flex flex-col gap-1">
                  <div>
                    <Label
                      htmlFor="zone"
                      className="text-left text-sm font-medium text-primary group-hover:cursor-pointer"
                    >
                      Zone
                    </Label>
                    <Button variant="outline" role="combobox" className="w-full justify-between ">
                      {selectedZone || "Select zone"}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent avoidCollisions>
                  <Command>
                    <CommandInput placeholder="Search zones..." />
                    <CommandEmpty>No zone found.</CommandEmpty>
                    <CommandGroup
                      className="h-auto max-h-[12rem] overflow-auto"
                      onWheel={(e) => e.stopPropagation()}
                    >
                      {zones.map((zone) => (
                        <CommandItem
                          key={zone}
                          value={zone}
                          onSelect={() => {
                            handleZoneSelect(zone);
                            setZoneIsOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedZone === zone ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {zone}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Book Combobox */}
              <Popover open={bookIsOpen} onOpenChange={setBookIsOpen}>
                <PopoverTrigger asChild className="flex flex-col gap-1">
                  <div>
                    <Label
                      htmlFor="book"
                      className="text-left text-sm font-medium text-primary group-hover:cursor-pointer"
                    >
                      Book
                    </Label>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                      disabled={!selectedZone}
                    >
                      {selectedBook || "Select book"}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search books..." />
                    <CommandEmpty>No book found.</CommandEmpty>
                    <CommandGroup
                      className="h-auto max-h-[12rem] overflow-auto"
                      onWheel={(e) => e.stopPropagation()}
                    >
                      {booksForZone.map((book) => (
                        <CommandItem
                          key={book}
                          value={book}
                          onSelect={() => {
                            handleBookSelect(book);
                            setBookIsOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedBook === book ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {book}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Add Button */}
              <Button
                disabled={selectedZonebook === null ? true : false}
                onClick={async () => {
                  const newMeterReaderZonebooks = [...meterReaderZonebooks];

                  newMeterReaderZonebooks.push(selectedZonebook!);

                  setMeterReaderZonebooks(newMeterReaderZonebooks);

                  const news = await getNewFilteredZonebooks(selectedZonebook!);
                  setFilteredZonebooks(news);

                  setSelectedBook("");
                  setSelectedZone("");
                  setSelectedZonebook(null);
                }}
              >
                Add
              </Button>
            </div>

            <CommandEmpty>No zone found.</CommandEmpty>
            <CommandGroup
              className="h-[8rem] overflow-auto border rounded"
              onWheel={(e) => e.stopPropagation()}
            >
              {!selectedZone && filteredZonebooks
                ? filteredZonebooks.map((zb) => (
                    <CommandItem
                      key={zb.zonebook}
                      value={selectedZonebook?.zonebook}
                      onSelect={() => handleZonebookSelect(zb)}
                    >
                      {zb.zonebook}
                    </CommandItem>
                  ))
                : selectedZone && !selectedBook && filteredZonebooks
                ? filteredZonebooks
                    .filter((zb) => zb.zone === selectedZone)
                    .map((zb, idx) => (
                      <CommandItem
                        key={idx}
                        value={selectedZonebook?.zonebook}
                        onSelect={() => handleZonebookSelect(zb)}
                      >
                        {zb.zonebook}
                      </CommandItem>
                    ))
                : selectedZone && selectedBook && filteredZonebooks
                ? filteredZonebooks
                    .filter((zb) => zb.zone === selectedZone && zb.book === selectedBook)
                    .map((zb) => (
                      <CommandItem key={zb.zonebook} className="flex gap-2">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            zb.book === selectedBook && zb.zone === selectedZone ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {zb.zonebook}
                      </CommandItem>
                    ))
                : ""}
            </CommandGroup>
          </Command>

          <Label className="text-primary pt-5">Meter Reader Zonebooks</Label>
          <div className="border rounded p-2 h-[14rem] overflow-auto">
            <Table className="">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Zone-book</TableHead>
                  <TableHead className="">Zone</TableHead>
                  <TableHead className="">Book</TableHead>
                  <TableHead className="">Area</TableHead>
                  <TableHead className=""></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {meterReaderZonebooks && meterReaderZonebooks.length > 0 ? (
                  meterReaderZonebooks.map((entry) => (
                    <TableRow key={entry.zonebook}>
                      <TableCell>{entry.zonebook}</TableCell>
                      <TableCell>{entry.zone}</TableCell>
                      <TableCell>{entry.book}</TableCell>
                      <TableCell>{entry.area}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => {
                            const newMeterReaderZonebooks = meterReaderZonebooks.filter(
                              (zb) => zb.zonebook !== entry.zonebook
                            );
                            setMeterReaderZonebooks(newMeterReaderZonebooks);

                            const newFilteredZonebooks = [...filteredZonebooks];
                            newFilteredZonebooks.unshift(entry);

                            setFilteredZonebooks(newFilteredZonebooks);
                          }}
                        >
                          <CircleXIcon className="fill-red-600 text-white" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="w-full justify-center flex border">
                    <TableCell colSpan={5}>No zonebooks added</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* <Button size="lg">Apply</Button> */}
        </PopoverContent>
      </Popover>
    </div>
  );
}
