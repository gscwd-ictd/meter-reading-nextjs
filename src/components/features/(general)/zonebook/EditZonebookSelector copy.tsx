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
import {
  Ban,
  Check,
  CheckCircle,
  ChevronDown,
  CircleXIcon,
  MapPinCheckIcon,
  MapPinIcon,
  PlusCircleIcon,
  X,
} from "lucide-react";
import { Zonebook, ZoneBookEntry } from "@mr/lib/types/zonebook";
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
import { Input } from "@mr/components/ui/Input";

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

  // Add clear option handler for zone
  const handleClearZone = () => {
    setSelectedZone("");
    setSelectedBook("");
    setSelectedZonebook(null);
    setZoneIsOpen(false);
  };

  // Add clear option handler for book
  const handleClearBook = () => {
    setSelectedBook("");
    setSelectedZonebook(null);
    setBookIsOpen(false);
  };

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

  // get the missing days
  const getMissingDays = (entries: ZoneBookEntry[]): number[] => {
    const validDays = Array.from({ length: 21 }, (_, i) => i + 1);
    const assignedDays = new Set<number>();

    entries.forEach((entry) => {
      if (entry.day !== undefined && entry.day && entry.day >= 1 && entry.day <= 21) {
        assignedDays.add(entry.day);
      }
    });

    return validDays.filter((day) => !assignedDays.has(day));
  };

  const handleDayChange = (value: number | null, index: number, entry: Zonebook) => {
    const updatedZonebooks = [...meterReaderZonebooks];
    updatedZonebooks[index] = {
      ...entry,
      day: value,
    };
    setMeterReaderZonebooks(updatedZonebooks);
    setValue("zoneBooks", updatedZonebooks);
    console.log(`Row ${index}:`, value);
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
        <div role="button" className="text-primary flex items-center gap-2">
          <Label htmlFor="zoneBooks" className="text-sm font-medium text-gray-700 group-hover:cursor-pointer">
            Default Zonebooks <span className="text-red-600">*</span>
          </Label>
          <PlusCircleIcon className="fill-primary text-primary-foreground size-4" />
        </div>
      </DialogTrigger>
      <DialogContent
        className="flex h-[95vh] max-h-[800px] min-w-[90vw] flex-col overflow-hidden lg:min-w-[70vw] xl:min-w-[60vw]"
        hideClose
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg font-semibold">Assign Zonebooks</DialogTitle>
          <DialogDescription className="text-gray-600">
            Select zonebooks and assign reading days (1-21)
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-hidden">
          {/* Selection Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Available Zonebooks</h3>
              <div className="text-xs text-gray-500">
                Unassigned: <span className="font-medium text-gray-700">{tempFilteredZonebooks.length}</span>
              </div>
            </div>

            <Command className="flex flex-col gap-3 overflow-hidden dark:bg-transparent">
              <div className="grid grid-cols-3 gap-3">
                {/* Zone Combobox */}
                <div className="space-y-2">
                  <Label htmlFor="zone" className="text-sm font-medium text-gray-700">
                    Zone
                  </Label>
                  <Popover open={zoneIsOpen} onOpenChange={setZoneIsOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" className="w-full justify-between">
                        <span
                          className={
                            selectedZone
                              ? "text-gray-900 dark:text-gray-400"
                              : "text-gray-500 dark:text-gray-400"
                          }
                        >
                          {selectedZone || "Select zone"}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search zones..."
                          value={zoneInput}
                          onValueChange={setZoneInput}
                        />
                        <CommandEmpty>No zone found.</CommandEmpty>
                        <CommandList className="max-h-48">
                          <CommandItem
                            key="clear-zone"
                            value="clear"
                            onSelect={handleClearZone}
                            className="text-muted-foreground"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Clear selection
                          </CommandItem>
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
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedZone === zone ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {zone}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Book Combobox */}
                <div className="space-y-2">
                  <Label htmlFor="book" className="text-sm font-medium text-gray-700">
                    Book
                  </Label>
                  <Popover open={bookIsOpen} onOpenChange={setBookIsOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                        disabled={!selectedZone}
                      >
                        <span
                          className={
                            selectedZone
                              ? "text-gray-900 dark:text-gray-400"
                              : "text-gray-500 dark:text-gray-400"
                          }
                        >
                          {selectedBook || "Select book"}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search books..."
                          value={bookInput}
                          onValueChange={setBookInput}
                        />
                        <CommandEmpty>No book found.</CommandEmpty>
                        <CommandList className="max-h-48">
                          <CommandItem
                            key="clear-book"
                            value="clear"
                            onSelect={handleClearBook}
                            className="text-muted-foreground"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Clear selection
                          </CommandItem>
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
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedBook === book ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {book}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Add Button */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 opacity-0">Action</Label>
                  <Button
                    disabled={!selectedZonebook}
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
                    className="w-full dark:text-white"
                  >
                    Add to List
                  </Button>
                </div>
              </div>

              {/* Zonebook List */}
              <div className="rounded-md border">
                <CommandGroup className="max-h-48 overflow-y-scroll">
                  {loading ? (
                    <div className="flex h-32 items-center justify-center text-gray-500">
                      <LoadingSpinner className="mr-2" />
                      Loading zonebooks...
                    </div>
                  ) : (
                    <>
                      {!selectedZone && !selectedBook && tempFilteredZonebooks && !loading
                        ? tempFilteredZonebooks.map((zb, idx) => (
                            <CommandItem
                              key={idx}
                              onSelect={() => handleZonebookSelect(zb)}
                              className="flex items-center gap-3 px-3 py-2 text-sm"
                            >
                              <MapPinIcon className="size-4 text-gray-400" />
                              <span className="font-medium text-gray-600">{zb.zoneBook}</span>
                              <span className="flex-1 truncate text-gray-900">{zb.area.name}</span>
                            </CommandItem>
                          ))
                        : selectedZone &&
                          !selectedBook &&
                          tempFilteredZonebooks &&
                          !loading &&
                          tempFilteredZonebooks
                            .filter((zb) => zb.zone === selectedZone)
                            .map((zb, idx) => (
                              <CommandItem
                                key={idx}
                                onSelect={() => handleZonebookSelect(zb)}
                                className="flex items-center gap-3 px-3 py-2 text-sm"
                              >
                                <MapPinIcon className="size-4 text-gray-400" />
                                <span className="font-medium text-gray-600 dark:text-gray-400">
                                  {zb.zoneBook}
                                </span>
                                <span className="flex-1 truncate text-gray-900 dark:text-gray-600">
                                  {zb.area.name}
                                </span>
                              </CommandItem>
                            ))}
                    </>
                  )}
                </CommandGroup>
              </div>
            </Command>
          </div>

          {/* Assignment Section */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-700">Assigned Zonebooks</h3>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                  {meterReaderZonebooks.length}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Available days:</span>
                {getMissingDays(meterReaderZonebooks).length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {getMissingDays(meterReaderZonebooks).map((day) => (
                      <span
                        key={day}
                        className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    Complete ✓
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-hidden rounded-md border">
              {/* Table Container with Scroll */}
              <div className="h-full overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-gray-50">
                    <TableRow>
                      <TableHead className="w-12 font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="w-20 font-semibold text-gray-700">Zone</TableHead>
                      <TableHead className="w-20 font-semibold text-gray-700">Book</TableHead>
                      <TableHead className="font-semibold text-gray-700">Area</TableHead>
                      <TableHead className="w-32 font-semibold text-gray-700">
                        <div className="flex items-center gap-1">
                          Day
                          <span className="text-xs font-normal text-gray-500">(1-21)</span>
                        </div>
                      </TableHead>
                      <TableHead className="w-12 font-semibold text-gray-700">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {meterReaderZonebooks && meterReaderZonebooks.length > 0 ? (
                      meterReaderZonebooks.map((entry, index) => (
                        <TableRow key={entry.zoneBook} className="group hover:bg-gray-50">
                          <TableCell>
                            <div className="flex justify-center">
                              {entry.day !== undefined && entry.day !== null ? (
                                <div className="flex size-6 items-center justify-center rounded-full bg-green-100">
                                  <CheckCircle className="size-4 text-green-600" />
                                </div>
                              ) : (
                                <div className="flex size-6 items-center justify-center rounded-full bg-gray-100">
                                  <Ban className="size-4 text-gray-400" />
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-gray-900 dark:text-gray-400">
                            {entry.zone}
                          </TableCell>
                          <TableCell className="font-medium text-gray-900 dark:text-gray-400">
                            {entry.book}
                          </TableCell>
                          <TableCell>
                            <div
                              className="max-w-[200px] truncate text-gray-700 dark:text-gray-600"
                              title={entry.area?.name}
                            >
                              {entry.area?.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="relative">
                                <Input
                                  type="number"
                                  className={`h-8 w-20 text-center ${
                                    entry.day !== undefined && entry.day !== null
                                      ? "border-green-300 bg-green-50 text-green-900"
                                      : "border-gray-300 text-gray-900"
                                  }`}
                                  min={1}
                                  max={21}
                                  placeholder="Day"
                                  value={entry.day || ""}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    if (inputValue === "") {
                                      handleDayChange(null, index, entry);
                                      return;
                                    }
                                    const numericValue = Number(inputValue);
                                    if (
                                      Number.isInteger(numericValue) &&
                                      numericValue >= 1 &&
                                      numericValue <= 21
                                    ) {
                                      handleDayChange(numericValue, index, entry);
                                    }
                                  }}
                                  onWheel={(e) => e.currentTarget.blur()}
                                />

                                {entry.day && (
                                  <div className="absolute -top-1 -right-1">
                                    <div className="flex size-4 items-center justify-center rounded-full bg-green-500">
                                      <Check className="size-2.5 text-white" />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
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
                              className="rounded p-1 opacity-70 transition-all group-hover:opacity-100 hover:bg-gray-200 hover:opacity-100"
                              title="Remove assignment"
                            >
                              <CircleXIcon className="size-4 fill-red-500 text-white" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="py-12 text-center">
                          <div className="flex flex-col items-center gap-3 text-gray-500">
                            <MapPinIcon className="size-12 text-gray-300" />
                            <div>
                              <p className="font-medium text-gray-600">No zonebooks assigned</p>
                              <p className="text-sm">Add zonebooks from the list above</p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="default" className="w-full">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
