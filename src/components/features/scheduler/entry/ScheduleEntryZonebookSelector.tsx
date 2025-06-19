/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import { useState, useMemo, FunctionComponent, useEffect } from "react";

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
import { ZonebookWithDates } from "@mr/lib/types/zonebook";
import { Label } from "@mr/components/ui/Label";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@mr/components/ui/Table";
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
import { ScheduleEntryDueDateSelector } from "./ScheduleEntryDueDateSelector";
import { MeterReaderWithDesignatedZonebooks } from "@mr/lib/types/personnel";

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
  const [initialPoolIsSet, setInitialPoolIsSet] = useState<boolean>(false);
  const [hasFetchedUnassigned, setHasFetchedUnassigned] = useState<boolean>(false);

  const entryZonebookSelectorIsOpen = useSchedulesStore((state) => state.entryZonebookSelectorIsOpen);
  const setEntryZonebookSelectorIsOpen = useSchedulesStore((state) => state.setEntryZonebookSelectorIsOpen);
  const selectedMeterReader = useSchedulesStore((state) => state.selectedMeterReader);
  const setSelectedMeterReader = useSchedulesStore((state) => state.setSelectedMeterReader);
  const selectedScheduleEntry = useSchedulesStore((state) => state.selectedScheduleEntry);
  const setSelectedScheduleEntry = useSchedulesStore((state) => state.setSelectedScheduleEntry);
  const selectedZonebook = useSchedulesStore((state) => state.selectedZonebook);
  const setSelectedZonebook = useSchedulesStore((state) => state.setSelectedZonebook);
  const meterReaderZonebooks = useSchedulesStore((state) => state.meterReaderZonebooks);
  const setMeterReaderZonebooks = useSchedulesStore((state) => state.setMeterReaderZonebooks);

  const meterReadersWithDesignatedZonebooks = useSchedulesStore(
    (state) => state.meterReadersWithDesignatedZonebooks,
  );
  const zoneBookSorter = (zonebooks: ZonebookWithDates[]) => ZonebookSorter(zonebooks);

  const [tempMeterReaderZonebooks, setTempMeterReaderZonebooks] = useState<ZonebookWithDates[]>([]);
  const [tempMeterReadersWithDesignatedZonebooks, setTempMeterReadersWithDesignatedZonebooks] = useState<
    MeterReaderWithDesignatedZonebooks[]
  >([]);

  //! this has to be changed
  const selectedMeterReaderPool = useMemo(() => {
    const zonebooksByEmployeeId = tempMeterReadersWithDesignatedZonebooks.find(
      (mr) => selectedMeterReader?.employeeId === mr.employeeId,
    )?.zonebooks.unassigned;

    console.log(zonebooksByEmployeeId);
    if (!zonebooksByEmployeeId) return [];
    return zonebooksByEmployeeId;
  }, [tempMeterReadersWithDesignatedZonebooks]);

  // this should be the filtered pool, all assigned zonebooks minus the currently selected
  const allRemainingPool = useMemo(() => {
    const getRemainingZonebooks = (pool: ZonebookWithDates[], selected: ZonebookWithDates[]) => {
      return pool && pool.filter((itemA) => !selected.some((itemB) => itemB.zoneBook === itemA.zoneBook));
    };

    // temp meterReaderZonebooks will be the currently selected ones

    if (entryZonebookSelectorIsOpen)
      return getRemainingZonebooks(selectedMeterReaderPool!, tempMeterReaderZonebooks);
  }, [selectedMeterReaderPool, tempMeterReaderZonebooks, entryZonebookSelectorIsOpen]);

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

  // handle apply all changes to the zone book
  const handleApplyAllZonebooks = () => {
    {
      const newMeterReaderZonebooks = [...tempMeterReaderZonebooks];

      if (selectedMeterReader !== null) {
        setSelectedMeterReader({
          ...selectedMeterReader,

          zonebooks: newMeterReaderZonebooks,
        });

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
            if (selectedMeterReader && mr.employeeId === selectedMeterReader?.employeeId) {
              return {
                ...mr,
                zonebooks: newMeterReaderZonebooks,
              };
            }
            return mr;
          }),
        });
      }
      setEntryZonebookSelectorIsOpen(false);
      setSelectedMeterReader(null);
      setTempMeterReaderZonebooks([]);
      setMeterReaderZonebooks([]);
      setInitialPoolIsSet(false);
      setTempMeterReadersWithDesignatedZonebooks([]);
      setHasFetchedUnassigned(false);
    }
  };

  // handle add zonebook from tempPool
  const handleAddZonebook = () => {
    const newMeterReaderZonebooks = [...tempMeterReaderZonebooks];

    newMeterReaderZonebooks.push({
      area: selectedZonebook?.area!,
      book: selectedZonebook?.book!,
      zone: selectedZonebook?.zone!,
      zoneBook: selectedZonebook?.zoneBook!,
      dueDate: Array.isArray(selectedScheduleEntry?.dueDate) ? undefined : selectedScheduleEntry?.dueDate,
      disconnectionDate: Array.isArray(selectedScheduleEntry?.disconnectionDate)
        ? undefined
        : selectedScheduleEntry?.disconnectionDate,
    });

    setTempMeterReaderZonebooks(zoneBookSorter(newMeterReaderZonebooks));

    setSelectedBook("");
    setSelectedZone("");
    setSelectedZonebook(null);
  };

  // handle delete zonebook row
  const handleDelete = (zonebook: string) => {
    const newMeterReaderZonebooks = tempMeterReaderZonebooks.filter((zb) => zb.zoneBook !== zonebook);
    const selectedZonebook = tempMeterReaderZonebooks.find((zb) => zb.zoneBook === zonebook);

    //!
    const newMeterReadersWithDesignatedZonebooks = [...tempMeterReadersWithDesignatedZonebooks];

    const newReadersWithDesignatedZonebooks = newMeterReadersWithDesignatedZonebooks.map((mr) => {
      if (mr.employeeId === selectedMeterReader?.employeeId) {
        const newUnassigned = [...mr.zonebooks.unassigned];
        newUnassigned.push(selectedZonebook!);
        return {
          ...mr,
          zonebooks: {
            unassigned: newUnassigned,
            assigned: newMeterReaderZonebooks,
          },
        };
      }

      return mr;
    });

    console.log(newReadersWithDesignatedZonebooks);
    setTempMeterReadersWithDesignatedZonebooks(newReadersWithDesignatedZonebooks);
    // selectedMeterReaderPool?.push(selectedZonebook!);
    setTempMeterReaderZonebooks(zoneBookSorter(newMeterReaderZonebooks));
  };

  const handleZoneSelect = (zone: string) => {
    setSelectedZone(zone);
    setSelectedBook(""); // reset book when zone changes
    setSelectedZonebook(null);
  };

  const handleBookSelect = (book: string) => {
    setSelectedBook(book);
    setSelectedZonebook(allRemainingPool?.find((zb) => zb.zone === selectedZone && zb.book === book)!);
  };

  const handleZonebookSelect = (zoneBook: ZonebookWithDates) => {
    setSelectedZonebook(zoneBook);
    setSelectedZone(zoneBook.zone);
    setSelectedBook(zoneBook.book);
  };

  // set initial pool from meterReaderZonebooks to temporary array
  useEffect(() => {
    if (entryZonebookSelectorIsOpen && initialPoolIsSet === false) {
      setTempMeterReaderZonebooks(meterReaderZonebooks);
      setInitialPoolIsSet(true);
    }
  }, [entryZonebookSelectorIsOpen, setTempMeterReaderZonebooks, initialPoolIsSet, meterReaderZonebooks]);

  useEffect(() => {
    if (entryZonebookSelectorIsOpen && !hasFetchedUnassigned) {
      setTempMeterReadersWithDesignatedZonebooks(meterReadersWithDesignatedZonebooks);
      setHasFetchedUnassigned(true);
    }
  }, [
    entryZonebookSelectorIsOpen,
    hasFetchedUnassigned,
    setTempMeterReadersWithDesignatedZonebooks,
    meterReadersWithDesignatedZonebooks,
  ]);

  return (
    <Dialog
      open={entryZonebookSelectorIsOpen}
      onOpenChange={() => {
        setEntryZonebookSelectorIsOpen(!entryZonebookSelectorIsOpen);
        setSelectedBook("");
        setSelectedZone("");
        setSelectedZonebook(null);
        setTempMeterReaderZonebooks([]);
        setMeterReaderZonebooks([]);
        setInitialPoolIsSet(false);
        setTempMeterReadersWithDesignatedZonebooks([]);
        setHasFetchedUnassigned(false);
      }}
      modal
    >
      <DialogContent
        className="max-h-full min-w-full overflow-y-auto sm:max-h-full sm:w-full sm:min-w-full md:max-h-full md:w-[80%] md:min-w-[80%] lg:max-h-[90%] lg:min-w-[50%]"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
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

        <Button onClick={() => console.log(tempMeterReaderZonebooks)}>Log Temp Pool</Button>
        <Button onClick={() => console.log(tempMeterReadersWithDesignatedZonebooks)}>
          Log Temp Readers with Pool
        </Button>
        {/* <Button onClick={() => console.log(selectedMeterReaderPool)}>Log Pool</Button> */}

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
              onClick={handleAddZonebook}
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
                  <TableHead className="w-[10rem] font-semibold text-gray-600">Area</TableHead>
                  <TableHead className="font-semibold text-gray-600">Due</TableHead>
                  <TableHead className="font-semibold text-gray-600">Disc</TableHead>
                  <TableHead className="font-semibold text-gray-600"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {tempMeterReaderZonebooks && tempMeterReaderZonebooks.length > 0 ? (
                  tempMeterReaderZonebooks.map((entry) => (
                    <TableRow key={entry.zoneBook} className="">
                      <TableCell>
                        <MapPinCheckIcon className="size-5 text-green-600" />
                      </TableCell>
                      <TableCell>{entry.zoneBook}</TableCell>
                      <TableCell>{entry.zone}</TableCell>
                      <TableCell>{entry.book}</TableCell>
                      <TableCell className="w-[10rem]">{entry.area}</TableCell>
                      <TableCell>
                        {selectedScheduleEntry?.dueDate &&
                        Array.isArray(selectedScheduleEntry.dueDate) &&
                        Array.isArray(selectedScheduleEntry.disconnectionDate) ? (
                          <ScheduleEntryDueDateSelector
                            zonebook={entry.zoneBook}
                            zonebooks={tempMeterReaderZonebooks}
                            setZonebooks={setTempMeterReaderZonebooks}
                            dueDate={entry.dueDate ?? undefined}
                            disconnectionDate={entry.disconnectionDate}
                          />
                        ) : selectedScheduleEntry?.dueDate &&
                          !Array.isArray(selectedScheduleEntry.dueDate) ? (
                          format(selectedScheduleEntry.dueDate, "MMM dd, yyyy")
                        ) : (
                          "else"
                        )}
                      </TableCell>
                      <TableCell>
                        {selectedScheduleEntry?.disconnectionDate &&
                        Array.isArray(selectedScheduleEntry.disconnectionDate)
                          ? isValid(entry.dueDate) &&
                            entry.disconnectionDate &&
                            isValid(entry.disconnectionDate)
                            ? format(entry.disconnectionDate, "MMM dd, yyyy")
                            : "-"
                          : selectedScheduleEntry?.disconnectionDate &&
                              !Array.isArray(selectedScheduleEntry.disconnectionDate)
                            ? format(selectedScheduleEntry.disconnectionDate, "MMM dd, yyyy")
                            : null}
                      </TableCell>
                      <TableCell>
                        <button onClick={() => handleDelete(entry.zoneBook)}>
                          <CircleXIcon className="fill-red-600 text-white" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No zonebooks added
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <Button className="h-[3rem]" onClick={handleApplyAllZonebooks}>
          Apply
        </Button>
      </DialogContent>
    </Dialog>
  );
};
