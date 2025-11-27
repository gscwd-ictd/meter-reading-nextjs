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
import { useMeterReadersStore } from "@mr/components/stores/useMeterReadersStore";
import { Avatar, AvatarFallback, AvatarImage } from "@mr/components/ui/Avatar";

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
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false);
  const [zonebookToAdd, setZonebookToAdd] = useState<Zonebook | null>(null);
  const [zonebookToRemove, setZonebookToRemove] = useState<Zonebook | null>(null);

  const zonebookSelectorIsOpen = useZonebookStore((state) => state.zonebookSelectorIsOpen);
  const setZonebookSelectorIsOpen = useZonebookStore((state) => state.setZonebookSelectorIsOpen);
  const setSelectedZonebook = useZonebookStore((state) => state.setSelectedZonebook);
  const meterReaderZonebooks = useZonebookStore((state) => state.meterReaderZonebooks);
  const selectedMeterReader = useMeterReadersStore((state) => state.selectedMeterReader);
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
  };

  // Handle add zonebook confirmation
  const handleAddZonebook = (entry: Zonebook) => {
    setZonebookToAdd(entry);
    setAddDialogOpen(true);
  };

  const confirmAddZonebook = () => {
    if (!zonebookToAdd) return;

    handleZonebookSelect(zonebookToAdd);
    // Auto-add to assigned list
    const newMeterReaderZonebooks = [...meterReaderZonebooks, { ...zonebookToAdd, day: null }];
    setMeterReaderZonebooks(zoneBookSorter(newMeterReaderZonebooks));
    setValue("zoneBooks", zoneBookSorter(newMeterReaderZonebooks));

    const newZonebooks = tempFilteredZonebooks.filter((zb) => zb.zoneBook !== zonebookToAdd.zoneBook);
    setTempFilteredZonebooks(zoneBookSorter(newZonebooks));

    setAddDialogOpen(false);
    setZonebookToAdd(null);
  };

  // Handle remove zonebook confirmation
  const handleRemoveZonebook = (entry: Zonebook) => {
    setZonebookToRemove(entry);
    setRemoveDialogOpen(true);
  };

  const confirmRemoveZonebook = () => {
    if (!zonebookToRemove) return;

    const newMeterReaderZonebooks = meterReaderZonebooks.filter(
      (zb) => zb.zoneBook !== zonebookToRemove.zoneBook,
    );
    setMeterReaderZonebooks(zoneBookSorter(newMeterReaderZonebooks));
    setValue("zoneBooks", zoneBookSorter(newMeterReaderZonebooks));

    const newFilteredZonebooks = [...tempFilteredZonebooks, zonebookToRemove];
    setTempFilteredZonebooks(zoneBookSorter(newFilteredZonebooks));

    setRemoveDialogOpen(false);
    setZonebookToRemove(null);
  };

  return (
    <>
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
            <Label
              htmlFor="zoneBooks"
              className="text-sm font-medium text-gray-700 group-hover:cursor-pointer dark:text-gray-300"
            >
              Zonebooks <span className="text-red-600 dark:text-red-400">*</span>
            </Label>
            <PlusCircleIcon className="fill-primary text-primary-foreground size-4" />
          </div>
        </DialogTrigger>
        <DialogContent
          className="max-h-[100vh] overflow-y-auto sm:max-w-6xl lg:max-h-[80vh] lg:max-w-7xl dark:bg-gray-900 dark:text-gray-100"
          hideClose
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="pb-4">
            <DialogTitle className="flex gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              <Avatar>
                <AvatarImage
                  src={
                    selectedMeterReader?.photoUrl
                      ? `${process.env.NEXT_PUBLIC_HRMS_IMAGES_SERVER}/${selectedMeterReader.photoUrl}`
                      : undefined
                  }
                  alt={selectedMeterReader?.name}
                  className="object-cover"
                />
                <AvatarFallback>{selectedMeterReader?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="flex items-center"> {selectedMeterReader?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
              Select zonebooks and assign reading days (1-21)
            </DialogDescription>
          </DialogHeader>

          {/* Proper Responsive Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Available Zonebooks - Left Side */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Available Zonebooks
                  </h3>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {tempFilteredZonebooks.length}
                  </span>
                </div>
              </div>

              {/* Filter Controls - Above the table */}
              <div className="grid grid-cols-1 gap-4 rounded-lg sm:grid-cols-3">
                {/* Zone Combobox */}
                <div className="space-y-2">
                  <Label htmlFor="zone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Zone
                  </Label>
                  <Popover open={zoneIsOpen} onOpenChange={setZoneIsOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                      >
                        <span
                          className={
                            selectedZone
                              ? "text-gray-900 dark:text-gray-100"
                              : "text-gray-500 dark:text-gray-400"
                          }
                        >
                          {selectedZone || "Select zone"}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      avoidCollisions
                      className="w-full p-0 dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search zones..."
                          value={zoneInput}
                          onValueChange={setZoneInput}
                          className="border-0 dark:bg-gray-800 dark:text-gray-200"
                        />
                        <CommandEmpty className="py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                          No zone found.
                        </CommandEmpty>
                        <CommandList
                          className="max-h-[12rem] overflow-auto"
                          onWheel={(e) => e.stopPropagation()}
                        >
                          <CommandItem
                            key="clear-zone"
                            value="clear"
                            onSelect={handleClearZone}
                            className="text-sm text-gray-500 dark:text-gray-400 dark:hover:bg-gray-700"
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
                              className="text-sm dark:text-gray-200 dark:hover:bg-gray-700"
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
                  <Label htmlFor="book" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Book
                  </Label>
                  <Popover open={bookIsOpen} onOpenChange={setBookIsOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                        disabled={!selectedZone}
                      >
                        <span
                          className={
                            selectedBook
                              ? "text-gray-900 dark:text-gray-100"
                              : "text-gray-500 dark:text-gray-400"
                          }
                        >
                          {selectedBook || "Select book"}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 dark:border-gray-700 dark:bg-gray-800">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search books..."
                          value={bookInput}
                          onValueChange={setBookInput}
                          className="border-0 dark:bg-gray-800 dark:text-gray-200"
                        />
                        <CommandEmpty className="py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                          No book found.
                        </CommandEmpty>
                        <CommandList
                          className="max-h-[12rem] overflow-auto"
                          onWheel={(e) => e.stopPropagation()}
                        >
                          <CommandItem
                            key="clear-book"
                            value="clear"
                            onSelect={handleClearBook}
                            className="text-sm text-gray-500 dark:text-gray-400 dark:hover:bg-gray-700"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Clear selection
                          </CommandItem>
                          {filteredBooks?.map((book) => (
                            <CommandItem
                              key={book}
                              value={book}
                              onSelect={() => {
                                handleBookSelect(book);
                                setBookIsOpen(false);
                              }}
                              className="text-sm dark:text-gray-200 dark:hover:bg-gray-700"
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

                {/* Clear Filters Button */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 opacity-0 dark:text-gray-300">
                    Action
                  </Label>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedZone("");
                      setSelectedBook("");
                      setSelectedZonebook(null);
                      setZoneInput("");
                      setBookInput("");
                    }}
                    className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <div className="relative h-88 overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 z-10 bg-gray-50 shadow-sm dark:bg-gray-700">
                      <TableRow>
                        <TableHead className="w-16 py-3 font-semibold text-gray-700 dark:text-gray-300">
                          Status
                        </TableHead>
                        <TableHead className="w-20 py-3 font-semibold text-gray-700 dark:text-gray-300">
                          Zone
                        </TableHead>
                        <TableHead className="w-20 py-3 font-semibold text-gray-700 dark:text-gray-300">
                          Book
                        </TableHead>
                        <TableHead className="min-w-[120px] py-3 font-semibold text-gray-700 dark:text-gray-300">
                          Area
                        </TableHead>

                        <TableHead className="w-16 py-3 font-semibold text-gray-700 dark:text-gray-300">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tempFilteredZonebooks && tempFilteredZonebooks.length > 0 ? (
                        tempFilteredZonebooks.map((entry, index) => (
                          <TableRow
                            key={entry.zoneBook}
                            className="group border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                          >
                            <TableCell className="py-3">
                              <div className="flex justify-center">
                                <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                  <MapPinIcon className="size-5 text-blue-600 dark:text-blue-400" />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-3 font-semibold text-gray-900 dark:text-gray-100">
                              {entry.zone}
                            </TableCell>
                            <TableCell className="py-3 font-semibold text-gray-900 dark:text-gray-100">
                              {entry.book}
                            </TableCell>
                            <TableCell className="max-w-[120px] min-w-[120px] py-3">
                              <div
                                className="truncate text-gray-700 dark:text-gray-300"
                                title={entry.area?.name}
                              >
                                {entry.area?.name}
                              </div>
                            </TableCell>

                            <TableCell className="py-3">
                              <button
                                onClick={() => handleAddZonebook(entry)}
                                className="rounded p-2 opacity-70 transition-all group-hover:opacity-100 hover:bg-blue-100 hover:opacity-100 dark:hover:bg-blue-900"
                                title="Add to assigned"
                              >
                                <PlusCircleIcon className="size-5 fill-green-500 text-white dark:fill-green-600" />
                              </button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="py-16 text-center">
                            <div className="flex flex-col items-center gap-4 text-gray-500 dark:text-gray-400">
                              <CheckCircle className="size-16 text-gray-300 dark:text-gray-600" />
                              <div className="space-y-1">
                                <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                                  All zonebooks assigned
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  All available zonebooks have been assigned
                                </p>
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

            {/* Assigned Zonebooks - Right Side */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Assigned Zonebooks
                  </h3>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {meterReaderZonebooks.length}
                  </span>
                </div>
              </div>
              <div className="flex h-17 items-start gap-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">Available days:</span>
                {getMissingDays(meterReaderZonebooks).length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {getMissingDays(meterReaderZonebooks).map((day, idx) => (
                      <span
                        key={idx}
                        className="flex size-6 items-center justify-center rounded bg-gray-100 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                    Complete ✓
                  </span>
                )}
              </div>

              <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <div className="relative h-88 overflow-y-auto">
                  <Table className="w-full">
                    <TableHeader className="sticky top-0 z-10 bg-gray-50 shadow-sm dark:bg-gray-700">
                      <TableRow>
                        <TableHead className="w-16 py-3 font-semibold text-gray-700 dark:text-gray-300">
                          Status
                        </TableHead>
                        <TableHead className="w-20 py-3 font-semibold text-gray-700 dark:text-gray-300">
                          Zone
                        </TableHead>
                        <TableHead className="w-20 py-3 font-semibold text-gray-700 dark:text-gray-300">
                          Book
                        </TableHead>
                        <TableHead className="min-w-[120px] py-3 font-semibold text-gray-700 dark:text-gray-300">
                          Area
                        </TableHead>
                        <TableHead className="w-32 py-3 font-semibold text-gray-700 dark:text-gray-300">
                          <div className="flex items-center gap-1">
                            Day
                            <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                              (1-21)
                            </span>
                          </div>
                        </TableHead>
                        <TableHead className="w-16 py-3 font-semibold text-gray-700 dark:text-gray-300">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {meterReaderZonebooks && meterReaderZonebooks.length > 0 ? (
                        meterReaderZonebooks.map((entry, index) => (
                          <TableRow
                            key={entry.zoneBook}
                            className="group border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                          >
                            <TableCell className="w-16 py-3">
                              <div className="flex justify-center">
                                {entry.day !== undefined && entry.day !== null ? (
                                  <div className="flex size-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                    <CheckCircle className="size-5 text-green-600 dark:text-green-400" />
                                  </div>
                                ) : (
                                  <div className="flex size-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                    <Ban className="size-5 text-gray-400 dark:text-gray-500" />
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="w-20 py-3 font-semibold text-gray-900 dark:text-gray-100">
                              {entry.zone}
                            </TableCell>
                            <TableCell className="w-20 py-3 font-semibold text-gray-900 dark:text-gray-100">
                              {entry.book}
                            </TableCell>
                            <TableCell className="max-w-[120px] min-w-[120px] py-3">
                              <div
                                className="truncate text-gray-700 dark:text-gray-300"
                                title={entry.area?.name}
                              >
                                {entry.area?.name}
                              </div>
                            </TableCell>
                            <TableCell className="w-32 py-3">
                              <div className="flex items-center gap-2">
                                <div className="relative">
                                  <Input
                                    type="number"
                                    className={`h-9 w-20 text-center font-medium ${
                                      entry.day !== undefined && entry.day !== null
                                        ? "border-green-300 bg-green-50 text-green-900 dark:border-green-600 dark:bg-green-900/30 dark:text-green-100"
                                        : "border-gray-300 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
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
                                      <div className="flex size-5 items-center justify-center rounded-full bg-green-500">
                                        <Check className="size-3 text-white" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="w-16 py-3">
                              <button
                                onClick={() => handleRemoveZonebook(entry)}
                                className="rounded p-2 opacity-70 transition-all group-hover:opacity-100 hover:bg-gray-200 hover:opacity-100 dark:hover:bg-gray-600"
                                title="Remove assignment"
                              >
                                <CircleXIcon className="size-5 fill-red-500 text-white dark:fill-red-600" />
                              </button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="py-16 text-center">
                            <div className="flex flex-col items-center gap-4 text-gray-500 dark:text-gray-400">
                              <MapPinIcon className="size-16 text-gray-300 dark:text-gray-600" />
                              <div className="space-y-1">
                                <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                                  No zonebooks assigned
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Add zonebooks from the list above
                                </p>
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

          <DialogFooter className="flex items-end pt-6">
            <DialogClose asChild>
              <Button variant="default" className="h-[3rem] w-full text-white">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Zonebook Confirmation Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md dark:bg-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <PlusCircleIcon className="size-5 fill-green-500 text-white dark:fill-green-600" />
              Add Zonebook
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to add this zonebook to the assigned list?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {zonebookToAdd && (
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Zone:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {zonebookToAdd.zone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Book:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {zonebookToAdd.book}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Area:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {zonebookToAdd.area?.name}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setAddDialogOpen(false)}
              className="flex-1 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAddZonebook}
              className="flex-1 bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
            >
              <PlusCircleIcon className="mr-2 size-4" />
              Add Zonebook
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Zonebook Confirmation Dialog */}
      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent className="sm:max-w-md dark:bg-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <CircleXIcon className="size-5 fill-red-500 text-white dark:fill-red-600" />
              Remove Zonebook
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to remove this zonebook from the assigned list?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {zonebookToRemove && (
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Zone:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {zonebookToRemove.zone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Book:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {zonebookToRemove.book}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Area:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {zonebookToRemove.area?.name}
                    </span>
                  </div>
                  {zonebookToRemove.day && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Assigned Day:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        Day {zonebookToRemove.day}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setRemoveDialogOpen(false)}
              className="flex-1 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button onClick={confirmRemoveZonebook} variant="destructive" className="flex-1">
              <CircleXIcon className="mr-2 size-4" />
              Remove Zonebook
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
