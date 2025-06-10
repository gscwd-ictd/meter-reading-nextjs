"use client";

import { useState, useMemo } from "react";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@mr/components/ui/Command";
import { Popover, PopoverContent, PopoverTrigger } from "@mr/components/ui/Popover";
import { Button } from "@mr/components/ui/Button";
import { cn } from "@mr/lib/utils";
import { Check, ChevronDown, CircleXIcon, MapPinCheckIcon, MapPinIcon, PlusCircleIcon } from "lucide-react";
import { Zonebook } from "@mr/lib/types/zonebook";
import { Label } from "@mr/components/ui/Label";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@mr/components/ui/Table";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";
import { ZonebookSorter } from "@mr/lib/functions/zonebook-sorter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@mr/components/ui/Dialog";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";

type Props = {
  isLoading: boolean;
  onSelectionChange?: (zone: string, book: string) => void;
};

export default function ZoneBookSelector({ onSelectionChange, isLoading }: Props) {
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [zoneIsOpen, setZoneIsOpen] = useState<boolean>(false);
  const [bookIsOpen, setBookIsOpen] = useState<boolean>(false);

  const filteredZonebooks = useZonebookStore((state) => state.filteredZonebooks);
  const setFilteredZonebooks = useZonebookStore((state) => state.setFilteredZonebooks);
  const zonebookSelectorIsOpen = useZonebookStore((state) => state.zonebookSelectorIsOpen);
  const setZonebookSelectorIsOpen = useZonebookStore((state) => state.setZonebookSelectorIsOpen);

  const selectedZonebook = useSchedulesStore((state) => state.selectedZonebook);
  const setSelectedZonebook = useSchedulesStore((state) => state.setSelectedZonebook);
  const meterReaderZonebooks = useZonebookStore((state) => state.meterReaderZonebooks);
  const setMeterReaderZonebooks = useZonebookStore((state) => state.setMeterReaderZonebooks);

  const zoneBookSorter = (zonebooks: Zonebook[]) => ZonebookSorter(zonebooks);

  const zones = useMemo(() => {
    if (filteredZonebooks && filteredZonebooks.length > 0) {
      const allZones = filteredZonebooks.map((zb) => zb.zone);
      return Array.from(new Set(allZones));
    }
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

  const handleZonebookSelect = (zoneBook: Zonebook) => {
    onSelectionChange?.(zoneBook.zone, zoneBook.book);
    setSelectedZonebook(zoneBook);
    setSelectedZone(zoneBook.zone);
    setSelectedBook(zoneBook.book);
  };

  const getNewFilteredZonebooks = async (selectedZonebook: Zonebook): Promise<Zonebook[]> => {
    return filteredZonebooks.filter((zb) => zb !== selectedZonebook);
  };

  return (
    <Dialog
      open={zonebookSelectorIsOpen}
      onOpenChange={() => {
        setZonebookSelectorIsOpen(!zonebookSelectorIsOpen);
        setSelectedBook("");
        setSelectedZone("");
        setSelectedZonebook(null);
      }}
    >
      <DialogTrigger asChild>
        <div role="button" className="text-primary flex items-center gap-1">
          <Label
            htmlFor="zonebooks"
            className="text-left text-sm font-medium text-gray-700 group-hover:cursor-pointer"
          >
            Zonebooks
          </Label>
          <PlusCircleIcon className="fill-primary text-primary-foreground size-4" />
        </div>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto">
        <DialogHeader className="gap-0">
          <DialogTitle>Assign zonebook</DialogTitle>
          <DialogDescription className="text-gray-500">
            Select a zonebook and press add to assign
          </DialogDescription>
        </DialogHeader>

        <Command className="flex h-full flex-col gap-2 overflow-y-auto">
          <div className="grid w-full grid-cols-3 items-end gap-2">
            {/* Zone Combobox */}
            <Popover open={zoneIsOpen} onOpenChange={setZoneIsOpen}>
              <PopoverTrigger asChild className="flex flex-col gap-1">
                <div>
                  <Label
                    htmlFor="zone"
                    className="text-primary text-left text-sm font-bold group-hover:cursor-pointer"
                  >
                    Zone
                  </Label>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    {selectedZone || "Zone"}
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
                    {zones?.map((zone) => (
                      <CommandItem
                        key={zone}
                        value={zone}
                        onSelect={() => {
                          handleZoneSelect(zone);
                          setZoneIsOpen(false);
                        }}
                      >
                        <Check
                          className={cn("mr-2 h-4 w-4", selectedZone === zone ? "opacity-100" : "opacity-0")}
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
                    className="text-primary text-left text-sm font-bold group-hover:cursor-pointer"
                  >
                    Book
                  </Label>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                    disabled={!selectedZone}
                  >
                    {selectedBook || "Book"}
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
                          className={cn("mr-2 h-4 w-4", selectedBook === book ? "opacity-100" : "opacity-0")}
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

                setMeterReaderZonebooks(zoneBookSorter(newMeterReaderZonebooks));

                const news = await getNewFilteredZonebooks(selectedZonebook!);
                setFilteredZonebooks(zoneBookSorter(news));

                setSelectedBook("");
                setSelectedZone("");
                setSelectedZonebook(null);
              }}
              className="dark:text-white dark:disabled:text-black"
            >
              Add
            </Button>
          </div>

          {isLoading ? (
            <div className="text-primary flex h-full w-full items-center justify-center">
              <LoadingSpinner /> Loading zonebooks...
            </div>
          ) : (
            <CommandGroup
              className="h-[8rem] overflow-auto rounded border"
              onWheel={(e) => e.stopPropagation()}
            >
              {!selectedZone && !selectedBook && !filteredZonebooks && isLoading ? (
                <div>
                  <LoadingSpinner />
                </div>
              ) : !selectedZone && !selectedBook && filteredZonebooks && !isLoading ? (
                filteredZonebooks.length > 0 &&
                filteredZonebooks.map((zb, idx) => (
                  <CommandItem
                    key={idx}
                    value={selectedZonebook?.zoneBook}
                    onSelect={() => handleZonebookSelect(zb)}
                    className="grid h-[3rem] w-full grid-cols-12 items-center gap-0 rounded-none border-b text-sm"
                  >
                    <MapPinIcon className="text-primary size-5" />
                    <span className="col-span-2 font-medium text-gray-600">{zb.zoneBook}</span>
                    <span className="col-span-9 font-medium text-black">{zb.area}</span>
                  </CommandItem>
                ))
              ) : selectedZone && !selectedBook && filteredZonebooks && !isLoading ? (
                filteredZonebooks
                  .filter((zb) => zb.zone === selectedZone)
                  .map((zb, idx) => (
                    <CommandItem
                      key={idx}
                      value={selectedZonebook?.zoneBook}
                      onSelect={() => handleZonebookSelect(zb)}
                      className="grid h-[3rem] w-full grid-cols-12 items-center gap-0"
                    >
                      <MapPinIcon className="text-primary size-5" />
                      <span className="col-span-2 font-medium text-gray-600">{zb.zoneBook}</span>
                      <span className="col-span-9 font-medium text-black">{zb.area}</span>
                    </CommandItem>
                  ))
              ) : selectedZone && selectedBook && filteredZonebooks && !isLoading ? (
                filteredZonebooks
                  .filter((zb) => zb.zone === selectedZone && zb.book === selectedBook)
                  .map((zb, idx) => (
                    <CommandItem key={idx} className="grid h-[3rem] w-full grid-cols-12 items-center gap-0">
                      <MapPinCheckIcon className="size-5 text-green-600" />
                      <span className="col-span-2 font-medium text-gray-600 dark:text-white">
                        {zb.zoneBook}
                      </span>
                      <span className="col-span-9 font-medium text-black dark:text-white">{zb.area}</span>
                    </CommandItem>
                  ))
              ) : null}
            </CommandGroup>
          )}
        </Command>

        <div className="flex flex-col gap-1">
          <Label className="text-primary font-bold">Meter Reader Zonebooks</Label>
          <div className="h-[16rem] overflow-auto rounded border p-0">
            <Table className="table-auto text-sm" onWheel={(e) => e.stopPropagation()}>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-gray-600"></TableHead>
                  <TableHead className="w-[100px] font-semibold text-gray-600">Zone-book</TableHead>
                  <TableHead className="font-semibold text-gray-600">Zone</TableHead>
                  <TableHead className="font-semibold text-gray-600">Book</TableHead>
                  <TableHead className="font-semibold text-gray-600">Area</TableHead>
                  <TableHead className="font-semibold text-gray-600"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {meterReaderZonebooks && meterReaderZonebooks.length > 0 ? (
                  meterReaderZonebooks.map((entry) => (
                    <TableRow key={entry.zoneBook} className="">
                      <TableCell>
                        <MapPinCheckIcon className="size-5 text-green-600" />
                      </TableCell>
                      <TableCell>{entry.zoneBook}</TableCell>
                      <TableCell>{entry.zone}</TableCell>
                      <TableCell>{entry.book}</TableCell>
                      <TableCell>{entry.area}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => {
                            const newMeterReaderZonebooks = meterReaderZonebooks.filter(
                              (zb) => zb.zoneBook !== entry.zoneBook,
                            );
                            setMeterReaderZonebooks(zoneBookSorter(newMeterReaderZonebooks));

                            const newFilteredZonebooks = [...filteredZonebooks];
                            newFilteredZonebooks.unshift(entry);

                            setFilteredZonebooks(zoneBookSorter(newFilteredZonebooks));
                          }}
                        >
                          <CircleXIcon className="fill-red-600 text-white" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No zonebooks added
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
