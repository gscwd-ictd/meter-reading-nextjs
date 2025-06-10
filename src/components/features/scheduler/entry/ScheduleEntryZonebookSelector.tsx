/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import { useState, useMemo, FunctionComponent } from "react";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@mr/components/ui/Command";
import { Popover, PopoverContent, PopoverTrigger } from "@mr/components/ui/Popover";
import { Button } from "@mr/components/ui/Button";
import { cn } from "@mr/lib/utils";
import {
  AlertTriangleIcon,
  CalendarIcon,
  Check,
  ChevronDown,
  CircleXIcon,
  MapPinCheckIcon,
  MapPinIcon,
} from "lucide-react";
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
} from "@mr/components/ui/Dialog";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import { format, isValid } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@mr/components/ui/Avatar";

type ScheduleEntryZonebookSelectorProps = {
  isLoading: boolean;
};

export const ScheduleEntryZonebookSelector: FunctionComponent<ScheduleEntryZonebookSelectorProps> = ({
  isLoading,
}) => {
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [zoneIsOpen, setZoneIsOpen] = useState<boolean>(false);
  const [bookIsOpen, setBookIsOpen] = useState<boolean>(false);

  const entryZonebookSelectorIsOpen = useSchedulesStore((state) => state.entryZonebookSelectorIsOpen);
  const setEntryZonebookSelectorIsOpen = useSchedulesStore((state) => state.setEntryZonebookSelectorIsOpen);
  const selectedMeterReader = useSchedulesStore((state) => state.selectedMeterReader);
  const setSelectedMeterReader = useSchedulesStore((state) => state.setSelectedMeterReader);
  const selectedScheduleEntry = useSchedulesStore((state) => state.selectedScheduleEntry);
  const setSelectedScheduleEntry = useSchedulesStore((state) => state.setSelectedScheduleEntry);
  const selectedZonebook = useSchedulesStore((state) => state.selectedZonebook);
  const setSelectedZonebook = useSchedulesStore((state) => state.setSelectedZonebook);
  const meterReaderZonebooks = useZonebookStore((state) => state.meterReaderZonebooks);
  const setMeterReaderZonebooks = useZonebookStore((state) => state.setMeterReaderZonebooks);
  const zoneBookSorter = (zonebooks: Zonebook[]) => ZonebookSorter(zonebooks);

  // this should be the filtered pool, all assigned zonebooks minus the currently selected
  const allRemainingPool = useMemo(() => {
    const getRemainingZonebooks = (pool: Zonebook[], selected: Zonebook[]) => {
      return pool.filter((itemA) => !selected.some((itemB) => itemB.zoneBook === itemA.zoneBook));
    };

    if (entryZonebookSelectorIsOpen)
      return getRemainingZonebooks(selectedMeterReader?.recommendedZonebooks!, meterReaderZonebooks);
  }, [selectedMeterReader?.recommendedZonebooks, meterReaderZonebooks, entryZonebookSelectorIsOpen]);

  // new zones
  const zones = useMemo(() => {
    if (allRemainingPool && allRemainingPool.length > 0) {
      const allZonesForMeterReader = allRemainingPool.map((zb) => zb.zone);
      return Array.from(new Set(allZonesForMeterReader));
    }
  }, [allRemainingPool]);

  // new booksForZone
  const booksForZone = useMemo(() => {
    if (!selectedZone) return [];
    const allBooksForSelectedZone = allRemainingPool
      ?.filter((zb) => zb.zone === selectedZone)
      .map((zb) => zb.book);
    return Array.from(new Set(allBooksForSelectedZone));
  }, [selectedZone, allRemainingPool]);

  const handleZoneSelect = (zone: string) => {
    setSelectedZone(zone);
    setSelectedBook(""); // reset book when zone changes
    setSelectedZonebook(null);
  };

  const handleBookSelect = (book: string) => {
    setSelectedBook(book);
    setSelectedZonebook(allRemainingPool?.find((zb) => zb.zone === selectedZone && zb.book === book)!);
  };

  const handleZonebookSelect = (zoneBook: Zonebook) => {
    setSelectedZonebook(zoneBook);
    setSelectedZone(zoneBook.zone);
    setSelectedBook(zoneBook.book);
  };

  return (
    <div className="flex w-full flex-col">
      <Dialog
        open={entryZonebookSelectorIsOpen}
        onOpenChange={() => {
          setEntryZonebookSelectorIsOpen(!entryZonebookSelectorIsOpen);
          setSelectedBook("");
          setSelectedZone("");
          setSelectedZonebook(null);
        }}
      >
        <DialogContent className="max-h-[90%] w-[100vw] min-w-[50%] overflow-y-auto">
          <DialogHeader className="gap-0">
            <DialogTitle>
              <div className="space-y-0">
                <div className="flex items-center gap-1 text-xl font-bold dark:text-white">
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

                  {selectedMeterReader?.name}
                </div>
                <div className="text-muted-foreground text-sm">
                  Reading Date: {format(selectedScheduleEntry?.readingDate!, "MMM dd, yyyy")}
                </div>

                <div className="flex flex-col text-sm sm:flex-row sm:gap-6">
                  <div className="text-primary flex items-center gap-2 font-medium dark:text-blue-400">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                      Due:{" "}
                      {selectedScheduleEntry?.dueDate && Array.isArray(selectedScheduleEntry.dueDate) ? (
                        <span className="flex gap-2">
                          {selectedScheduleEntry.dueDate.map((day, idx) => {
                            if (idx === 0) return ` ${format(day, "MMM dd, yyyy")} / `;
                            return format(day, "MMM dd, yyyy");
                          })}
                        </span>
                      ) : selectedScheduleEntry &&
                        selectedScheduleEntry.dueDate &&
                        isValid(selectedScheduleEntry?.dueDate) &&
                        !Array.isArray(selectedScheduleEntry.dueDate) ? (
                        format(selectedScheduleEntry.dueDate, "MMM dd, yyyy")
                      ) : null}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-medium text-red-500">
                    <AlertTriangleIcon className="h-4 w-4" />
                    <span>
                      Disconnection:{" "}
                      {selectedScheduleEntry?.disconnectionDate &&
                      Array.isArray(selectedScheduleEntry.disconnectionDate) ? (
                        <span className="flex gap-2">
                          {selectedScheduleEntry.disconnectionDate.map((day, idx) => {
                            if (idx === 0) return ` ${format(day, "MMM dd, yyyy")} / `;
                            return format(day, "MMM dd, yyyy");
                          })}
                        </span>
                      ) : selectedScheduleEntry &&
                        selectedScheduleEntry.disconnectionDate &&
                        isValid(selectedScheduleEntry?.disconnectionDate) &&
                        !Array.isArray(selectedScheduleEntry.disconnectionDate) ? (
                        format(selectedScheduleEntry.disconnectionDate, "MMM dd, yyyy")
                      ) : null}
                    </span>
                  </div>
                </div>
              </div>
            </DialogTitle>

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
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedZone === zone ? "opacity-100" : "opacity-0",
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
                              selectedBook === book ? "opacity-100" : "opacity-0",
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
                  setMeterReaderZonebooks(zoneBookSorter(newMeterReaderZonebooks));

                  setSelectedBook("");
                  setSelectedZone("");
                  setSelectedZonebook(null);
                }}
                className="dark:text-white dark:disabled:text-black"
              >
                Add
              </Button>
            </div>

            {/* <CommandEmpty>No zone found.</CommandEmpty> */}
            {isLoading ? (
              <div className="text-primary flex h-full w-full items-center justify-center">
                <LoadingSpinner /> Loading zonebooks...
              </div>
            ) : (
              <CommandGroup
                className="h-[10rem] overflow-auto rounded border"
                onWheel={(e) => e.stopPropagation()}
              >
                {!selectedZone && !selectedBook && !allRemainingPool && isLoading ? (
                  <div>
                    <LoadingSpinner />
                  </div>
                ) : !selectedZone && !selectedBook && allRemainingPool && !isLoading ? (
                  allRemainingPool.length > 0 &&
                  allRemainingPool.map((zb, idx) => (
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
                ) : selectedZone && !selectedBook && allRemainingPool && !isLoading ? (
                  allRemainingPool
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
                ) : selectedZone && selectedBook && allRemainingPool && !isLoading ? (
                  allRemainingPool
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
                    <TableHead className="font-semibold text-gray-600">Due</TableHead>
                    <TableHead className="font-semibold text-gray-600">Disc</TableHead>
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
                          {selectedScheduleEntry?.dueDate && Array.isArray(selectedScheduleEntry.dueDate)
                            ? "select-two"
                            : selectedScheduleEntry?.dueDate && !Array.isArray(selectedScheduleEntry.dueDate)
                              ? format(selectedScheduleEntry.dueDate, "MMM dd, yyyy")
                              : null}
                        </TableCell>
                        <TableCell>
                          {selectedScheduleEntry?.disconnectionDate &&
                          Array.isArray(selectedScheduleEntry.disconnectionDate)
                            ? "select-two"
                            : selectedScheduleEntry?.disconnectionDate &&
                                !Array.isArray(selectedScheduleEntry.disconnectionDate)
                              ? format(selectedScheduleEntry.disconnectionDate, "MMM dd, yyyy")
                              : null}
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => {
                              const newMeterReaderZonebooks = meterReaderZonebooks.filter(
                                (zb) => zb.zoneBook !== entry.zoneBook,
                              );
                              setMeterReaderZonebooks(zoneBookSorter(newMeterReaderZonebooks));

                              // const newFilteredZonebooks = [...filteredZonebooks];
                              // newFilteredZonebooks.unshift(entry);

                              // setFilteredZonebooks(zoneBookSorter(newFilteredZonebooks));
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

          <Button
            className="h-[3rem]"
            onClick={() => {
              const newMeterReaderZonebooks = [...selectedMeterReader!.zonebooks];

              if (selectedMeterReader !== null) {
                setSelectedMeterReader({
                  ...selectedMeterReader,

                  zonebooks: newMeterReaderZonebooks,
                });

                setMeterReaderZonebooks(newMeterReaderZonebooks);

                setSelectedZonebook(null);

                setEntryZonebookSelectorIsOpen(false);
              }

              if (selectedScheduleEntry && selectedMeterReader) {
                setSelectedScheduleEntry({
                  ...selectedScheduleEntry,
                  disconnectionDate: selectedScheduleEntry.disconnectionDate,
                  dueDate: selectedScheduleEntry.dueDate,
                  readingDate: selectedScheduleEntry.readingDate,
                  meterReaders: selectedScheduleEntry.meterReaders!.map((mr) => {
                    if (selectedMeterReader && mr.companyId === selectedMeterReader?.companyId) {
                      return {
                        ...mr,
                        zonebooks: meterReaderZonebooks,
                      };
                    }
                    return mr;
                  }),
                });
              }
              setEntryZonebookSelectorIsOpen(false);
              setSelectedMeterReader(null);
            }}
          >
            Apply
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};
