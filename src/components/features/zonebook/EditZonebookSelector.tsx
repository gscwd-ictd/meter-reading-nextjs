"use client";

import { useState, useMemo } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@mr/components/ui/Command";
import { Popover, PopoverContent, PopoverTrigger } from "@mr/components/ui/Popover";
import { Button } from "@mr/components/ui/Button";
import { cn } from "@mr/lib/utils";
import { Check, ChevronDown, CircleXIcon, MapPinCheckIcon, MapPinIcon, PlusCircleIcon } from "lucide-react";
import { Zonebook } from "@mr/lib/types/zonebook";
import { Label } from "@mr/components/ui/Label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@mr/components/ui/Table";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@mr/components/ui/Dialog";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import { ZonebookFlatSorter } from "@mr/lib/functions/zonebook-flat-sorter";
import { useFormContext } from "react-hook-form";

type Props = {
  loading: boolean;
  onSelectionChange?: (zone: string, book: string) => void;
};

export default function EditZonebookSelector({ onSelectionChange, loading }: Props) {
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [zoneIsOpen, setZoneIsOpen] = useState<boolean>(false);
  const [bookIsOpen, setBookIsOpen] = useState<boolean>(false);
  const [zoneInput, setZoneInput] = useState<string>("");
  const [bookInput, setBookInput] = useState<string>("");

  const zonebookSelectorIsOpen = useZonebookStore((state) => state.zonebookSelectorIsOpen);
  const setZonebookSelectorIsOpen = useZonebookStore((state) => state.setZonebookSelectorIsOpen);

  const selectedZonebook = useZonebookStore((state) => state.selectedZonebook);
  const setSelectedZonebook = useZonebookStore((state) => state.setSelectedZonebook);
  const meterReaderZonebooks = useZonebookStore((state) => state.meterReaderZonebooks);
  const setMeterReaderZonebooks = useZonebookStore((state) => state.setMeterReaderZonebooks);
  const tempFilteredZonebooks = useZonebookStore((state) => state.tempFilteredZonebooks);
  const setTempFilteredZonebooks = useZonebookStore((state) => state.setTempFilteredZonebooks);

  const zoneBookSorter = (zoneBooks: Zonebook[]) => ZonebookFlatSorter(zoneBooks);

  const { setValue } = useFormContext();

  const zones = useMemo(() => {
    if (tempFilteredZonebooks && tempFilteredZonebooks.length > 0) {
      const allZones = tempFilteredZonebooks.map((zb) => zb.zone);
      return Array.from(new Set(allZones));
    }
  }, [tempFilteredZonebooks]);

  const booksForZone = useMemo(() => {
    if (!selectedZone) return [];
    const books = tempFilteredZonebooks.filter((zb) => zb.zone === selectedZone).map((zb) => zb.book);
    return Array.from(new Set(books));
  }, [selectedZone, tempFilteredZonebooks]);

  const filteredZones = zones?.filter((option) => option.toLowerCase().includes(zoneInput.toLowerCase()));

  const filteredBooks = booksForZone?.filter((option) =>
    option.toLowerCase().includes(bookInput.toLowerCase()),
  );

  const handleZoneSelect = (zone: string) => {
    setSelectedZone(zone);
    setSelectedBook(""); // reset book when zone changes
    onSelectionChange?.(zone, "");
    setSelectedZonebook(null);
  };

  const handleBookSelect = (book: string) => {
    setSelectedBook(book);

    tempFilteredZonebooks.find((zb) => zb.zone === selectedZone && zb.book === book);

    setSelectedZonebook(tempFilteredZonebooks.find((zb) => zb.zone === selectedZone && zb.book === book)!);

    onSelectionChange?.(selectedZone, book);
  };

  const handleZonebookSelect = (zoneBook: Zonebook) => {
    onSelectionChange?.(zoneBook.zone, zoneBook.book);
    setSelectedZonebook(zoneBook);
    setSelectedZone(zoneBook.zone);
    setSelectedBook(zoneBook.book);
  };

  const getNewFilteredZonebooks = async (selectedZonebook: Zonebook): Promise<Zonebook[]> => {
    const newFilteredZonebooks = tempFilteredZonebooks.filter((zb) => zb !== selectedZonebook);

    return newFilteredZonebooks.map((zb) => {
      return { ...zb, disconnectionDate: undefined!, dueDate: undefined! };
    });
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
            htmlFor="zoneBooks"
            className="gap-1 text-left text-sm font-medium text-gray-700 group-hover:cursor-pointer"
          >
            Zonebooks <span className="text-red-600">*</span>
          </Label>
          <PlusCircleIcon className="fill-primary text-primary-foreground size-4" />
        </div>
      </DialogTrigger>
      <DialogContent
        className="overflow-y-auto"
        hideClose
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="gap-0">
          <DialogTitle>Assign zonebook</DialogTitle>
          <DialogDescription className="text-gray-500">
            Select a zonebook and press add to assign
          </DialogDescription>
        </DialogHeader>

        <Command className="flex h-full flex-col gap-2 overflow-y-auto p-0">
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
              <PopoverContent avoidCollisions className="p-0">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search zones..."
                    value={zoneInput}
                    onValueChange={setZoneInput}
                  />
                  <CommandEmpty>No zone found.</CommandEmpty>
                  <CommandList
                    className="h-auto max-h-[12rem] overflow-auto"
                    onWheel={(e) => e.stopPropagation()}
                  >
                    {filteredZones?.map((zone) => (
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
                  </CommandList>
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
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search books..."
                    value={bookInput}
                    onValueChange={setBookInput}
                  />
                  <CommandEmpty>No book found.</CommandEmpty>
                  <CommandList
                    className="h-auto max-h-[12rem] overflow-auto"
                    onWheel={(e) => e.stopPropagation()}
                  >
                    {filteredBooks.map((book) => (
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
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Add Button */}
            <Button
              disabled={selectedZonebook === null ? true : false}
              onClick={async () => {
                const newMeterReaderZonebooks = [...meterReaderZonebooks];

                newMeterReaderZonebooks.push(selectedZonebook!);

                setZoneInput("");

                setBookInput("");

                setMeterReaderZonebooks(zoneBookSorter(newMeterReaderZonebooks));

                const newZonebooks = await getNewFilteredZonebooks(selectedZonebook!);

                setTempFilteredZonebooks(zoneBookSorter(newZonebooks));

                setValue("zoneBooks", zoneBookSorter(newMeterReaderZonebooks));

                setSelectedBook("");
                setSelectedZone("");
                setSelectedZonebook(null);
              }}
              className="dark:text-white dark:disabled:text-black"
            >
              Add
            </Button>
          </div>

          {loading ? (
            <div className="text-primary flex h-full w-full items-center justify-center">
              <LoadingSpinner /> Loading zoneBooks...
            </div>
          ) : (
            <CommandGroup
              className="h-[8rem] overflow-auto rounded border"
              onWheel={(e) => e.stopPropagation()}
            >
              {!selectedZone && !selectedBook && !tempFilteredZonebooks && loading ? (
                <div>
                  <LoadingSpinner />
                </div>
              ) : !selectedZone && !selectedBook && tempFilteredZonebooks && !loading ? (
                tempFilteredZonebooks.length > 0 &&
                tempFilteredZonebooks.map((zb, idx) => (
                  <CommandItem
                    key={idx}
                    value={selectedZonebook?.zoneBook}
                    onSelect={() => handleZonebookSelect(zb)}
                    className="grid h-[3rem] w-full grid-cols-12 items-center gap-0 rounded-none border-b text-sm"
                  >
                    <MapPinIcon className="text-primary size-5" />
                    <span className="col-span-2 font-medium text-gray-600">{zb.zoneBook}</span>
                    <span className="col-span-9 font-medium text-black">{zb.area.name}</span>
                  </CommandItem>
                ))
              ) : selectedZone && !selectedBook && tempFilteredZonebooks && !loading ? (
                tempFilteredZonebooks
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
                      <span className="col-span-9 font-medium text-black">{zb.area.name}</span>
                    </CommandItem>
                  ))
              ) : selectedZone && selectedBook && tempFilteredZonebooks && !loading ? (
                tempFilteredZonebooks
                  .filter((zb) => zb.zone === selectedZone && zb.book === selectedBook)
                  .map((zb, idx) => (
                    <CommandItem key={idx} className="grid h-[3rem] w-full grid-cols-12 items-center gap-0">
                      <MapPinCheckIcon className="size-5 text-green-600" />
                      <span className="col-span-2 font-medium text-gray-600 dark:text-white">
                        {zb.zoneBook}
                      </span>
                      <span className="col-span-9 font-medium text-black dark:text-white">
                        {zb.area.name}
                      </span>
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
                      <TableCell>{entry.area.name}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => {
                            const newMeterReaderZonebooks = meterReaderZonebooks.filter(
                              (zb) => zb.zoneBook !== entry.zoneBook,
                            );
                            setMeterReaderZonebooks(zoneBookSorter(newMeterReaderZonebooks));
                            setValue("zoneBooks", zoneBookSorter(newMeterReaderZonebooks));

                            const newFilteredZonebooks = [...tempFilteredZonebooks];
                            newFilteredZonebooks.unshift(entry);

                            setTempFilteredZonebooks(zoneBookSorter(newFilteredZonebooks));
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
                      No zone books added
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter className="flex w-full justify-center">
          <DialogClose asChild>
            <Button variant="default" className="w-full dark:text-white">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
