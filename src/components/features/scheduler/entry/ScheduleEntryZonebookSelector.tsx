/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import { useState, useMemo, FunctionComponent, useEffect } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@mr/components/ui/Command";
import { Popover, PopoverContent, PopoverTrigger } from "@mr/components/ui/Popover";
import { Button } from "@mr/components/ui/Button";
import { cn } from "@mr/lib/utils";
import { Check, ChevronDown, MapPinCheckIcon, MapPinIcon } from "lucide-react";
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
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@mr/components/ui/Avatar";
import { ScheduleEntryDueDateSelector } from "./ScheduleEntryDueDateSelector";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MeterReader } from "@mr/lib/types/personnel";
import { SplittedDates } from "./SplittedDates";
import { NormalDates } from "./NormalDates";
import { toast } from "sonner";
import { RemoveZonebookAlertDialog } from "./RemoveZonebookAlertDialog";

type MeterReaderZonebooks = {
  assigned: ZonebookWithDates[];
  unassigned: ZonebookWithDates[];
} & Omit<MeterReader, "zoneBooks" | "restDay">;

type NewZonebooks = Omit<ZonebookWithDates, "zoneBook" | "area">;

type MeterReaderZonebooksSubmit = {
  scheduleMeterReaderId: string;
  zoneBooks: NewZonebooks[];
};

export const ScheduleEntryZonebookSelector: FunctionComponent = () => {
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [zoneIsOpen, setZoneIsOpen] = useState<boolean>(false);
  const [bookIsOpen, setBookIsOpen] = useState<boolean>(false);
  const [hasFetchedZonebooks, setHasFetchedZonebooks] = useState<boolean>(false);
  const [hasAnEmptyDueDate, setHasAnEmptyDueDate] = useState<boolean>(false);

  // this is the existing selected zonebooks for the selected meter reader
  const [assignedZonebooks, setAssignedZonebooks] = useState<ZonebookWithDates[]>([]);
  const [unassignedZonebooks, setUnassignedZonebooks] = useState<ZonebookWithDates[]>([]);

  const entryZonebookSelectorIsOpen = useSchedulesStore((state) => state.entryZonebookSelectorIsOpen);
  const setEntryZonebookSelectorIsOpen = useSchedulesStore((state) => state.setEntryZonebookSelectorIsOpen);
  const selectedMeterReader = useSchedulesStore((state) => state.selectedMeterReader);
  const setSelectedMeterReader = useSchedulesStore((state) => state.setSelectedMeterReader);
  const selectedScheduleEntry = useSchedulesStore((state) => state.selectedScheduleEntry);
  const refetchEntry = useSchedulesStore((state) => state.refetchEntry);
  const refetchData = useSchedulesStore((state) => state.refetchData);
  const reset = useSchedulesStore((state) => state.reset);
  const selectedZonebook = useSchedulesStore((state) => state.selectedZonebook);
  const setSelectedZonebook = useSchedulesStore((state) => state.setSelectedZonebook);
  const queryClient = useQueryClient();

  const zoneBookSorter = (zoneBooks: ZonebookWithDates[]) => ZonebookSorter(zoneBooks);

  const hasEmptyDueDate = (zonebooks: ZonebookWithDates[]): boolean =>
    zonebooks.some((item) => item.dueDate === undefined || item.dueDate === null);

  // new meter reader assigned and unassigned zonebooks pool
  const { data: meterReaderData, isLoading } = useQuery({
    queryKey: ["get-meter-reader-zonebooks-by-exact-date", selectedMeterReader?.scheduleMeterReaderId],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_MR_BE}/schedules/meter-reader/${selectedMeterReader?.scheduleMeterReaderId}/zone-books`,
        );

        return res.data as MeterReaderZonebooks;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error("Something went wrong. Please try again in a few seconds...");
        }
      }
    },

    enabled:
      !hasFetchedZonebooks &&
      entryZonebookSelectorIsOpen &&
      selectedMeterReader?.scheduleMeterReaderId !== null,
  });

  // new zones, should target unassigned
  const zones = useMemo(() => {
    if (unassignedZonebooks && unassignedZonebooks.length > 0) {
      const allZonesForMeterReader = unassignedZonebooks.map((zb) => zb.zone);
      return Array.from(new Set(allZonesForMeterReader));
    }
  }, [unassignedZonebooks]);

  // new booksForZone
  const booksForZone = useMemo(() => {
    if (!selectedZone) return [];
    const allBooksForSelectedZone = unassignedZonebooks
      ?.filter((zb) => zb.zone === selectedZone)
      .map((zb) => zb.book);
    return Array.from(new Set(allBooksForSelectedZone));
  }, [selectedZone, unassignedZonebooks]);

  // post mutation
  const postMeterReaderZonebooks = useMutation({
    mutationKey: ["post-meter-reader-zonebooks", selectedMeterReader?.scheduleMeterReaderId],
    mutationFn: async (meterReaderWithZonebooks: MeterReaderZonebooksSubmit) => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_MR_BE}/schedules/meter-reader/zone-books`,
          meterReaderWithZonebooks,
        );
        return res;
      } catch (error) {
        console.log(error);
        toast.error("Error", {
          description: "Something went wrong. Please try again later.",
          position: "top-right",
        });
        return error;
      }
    },
    onSuccess: async () => {
      try {
        queryClient.removeQueries({
          queryKey: ["get-meter-reader-zonebooks-by-exact-date", selectedMeterReader?.scheduleMeterReaderId],
        });
        // refetch
        await queryClient.invalidateQueries({
          queryKey: ["get-meter-reader-zonebooks-by-exact-date", selectedMeterReader?.scheduleMeterReaderId],
          refetchType: "active",
        });
        setEntryZonebookSelectorIsOpen(false);
        setSelectedZonebook(null);
        setAssignedZonebooks([]);
        setUnassignedZonebooks([]);
        setHasFetchedZonebooks(false);
        reset();

        refetchEntry!();
        refetchData!();
        setSelectedMeterReader(null);
        toast.success("Success", {
          description: "Successfully updated the meter reader zonebooks!",
          position: "top-right",
        });
      } catch (error) {
        toast.error("Error", { description: JSON.stringify(error), position: "top-right" });
      }
    },
    onError: () => {
      toast.error("Error", {
        description: "Something went wrong. Please try again later.",
        position: "top-right",
      });
    },
  });

  // handle apply all changes to the zone book
  const handleApplyAllZonebooks = async () => {
    const zonebooksToBeAssigned = [...assignedZonebooks];

    if (selectedMeterReader !== null) {
      setSelectedMeterReader({
        ...selectedMeterReader,

        zoneBooks: zonebooksToBeAssigned,
      });

      const submitObject = {
        scheduleMeterReaderId: selectedMeterReader.scheduleMeterReaderId!,
        zoneBooks:
          zonebooksToBeAssigned && zonebooksToBeAssigned.length > 0
            ? zonebooksToBeAssigned.map((zb) => {
                return {
                  zone: zb.zone,
                  book: zb.book,
                  dueDate: zb.dueDate,
                  disconnectionDate: zb.disconnectionDate,
                };
              })
            : [],
      };

      postMeterReaderZonebooks.mutateAsync(submitObject);
    }
  };

  // handle add zonebook from tempPool
  const handleAddZonebook = () => {
    const zoneBooksToBeAssigned = [...assignedZonebooks!];

    zoneBooksToBeAssigned.push({
      area: selectedZonebook?.area!,
      book: selectedZonebook?.book!,
      zone: selectedZonebook?.zone!,
      zoneBook: selectedZonebook?.zoneBook!,
      dueDate: Array.isArray(selectedScheduleEntry?.dueDate) ? undefined : selectedScheduleEntry?.dueDate,
      disconnectionDate: Array.isArray(selectedScheduleEntry?.disconnectionDate)
        ? undefined
        : selectedScheduleEntry?.disconnectionDate,
    });

    setAssignedZonebooks(zoneBooksToBeAssigned);

    // setHasAnEmptyDueDate(hasEmptyDueDate(zoneBooksToBeAssigned));

    const newUnassignedZonebooks = [...unassignedZonebooks];
    // filter the unassigned with the selected zonebook

    setUnassignedZonebooks(newUnassignedZonebooks.filter((zb) => zb.zoneBook !== selectedZonebook?.zoneBook));

    setSelectedBook("");
    setSelectedZone("");
    setSelectedZonebook(null);
  };

  // handle delete zonebook row
  const handleDelete = (zonebook: string) => {
    const tempAssignedZonebooks = [...assignedZonebooks];
    setAssignedZonebooks(zoneBookSorter(tempAssignedZonebooks.filter((zb) => zb.zoneBook !== zonebook)));

    // setHasAnEmptyDueDate(hasEmptyDueDate(tempAssignedZonebooks.filter((zb) => zb.zoneBook !== zonebook)));

    const tempUnassignedZonebooks = [...unassignedZonebooks];
    const foundZonebook = tempAssignedZonebooks.find((zb) => zb.zoneBook === zonebook);
    tempUnassignedZonebooks.push(foundZonebook!);
    setUnassignedZonebooks(ZonebookSorter(tempUnassignedZonebooks));
  };

  const handleZoneSelect = (zone: string) => {
    setSelectedZone(zone);
    setSelectedBook(""); // reset book when zone changes
    setSelectedZonebook(null);
  };

  const handleBookSelect = (book: string) => {
    setSelectedBook(book);
    setSelectedZonebook(assignedZonebooks?.find((zb) => zb.zone === selectedZone && zb.book === book)!);
  };

  const handleZonebookSelect = (zoneBook: ZonebookWithDates) => {
    setSelectedZonebook(zoneBook);
    setSelectedZone(zoneBook.zone);
    setSelectedBook(zoneBook.book);
  };

  // useEffect for checking if fetched
  useEffect(() => {
    if (meterReaderData && !hasFetchedZonebooks && entryZonebookSelectorIsOpen && !isLoading) {
      setAssignedZonebooks(ZonebookSorter(meterReaderData.assigned));

      const unassigned = meterReaderData.unassigned.filter(
        (zonebook) =>
          !meterReaderData.assigned.some((a) => a.zone === zonebook.zone && a.book === zonebook.book),
      );

      setUnassignedZonebooks(ZonebookSorter(unassigned));
      setHasFetchedZonebooks(true);
    }
  }, [meterReaderData, hasFetchedZonebooks, entryZonebookSelectorIsOpen, isLoading, setAssignedZonebooks]);

  useEffect(() => {
    if (entryZonebookSelectorIsOpen) {
      setHasAnEmptyDueDate(hasEmptyDueDate(assignedZonebooks));
    }
  }, [assignedZonebooks, entryZonebookSelectorIsOpen]);

  return (
    <Dialog
      open={entryZonebookSelectorIsOpen}
      onOpenChange={() => {
        setEntryZonebookSelectorIsOpen(!entryZonebookSelectorIsOpen);
        setSelectedBook("");
        setSelectedZone("");
        setSelectedZonebook(null);
        setHasFetchedZonebooks(false);
        setAssignedZonebooks([]);
        setUnassignedZonebooks([]);
        setHasFetchedZonebooks(false);
        refetchEntry!();
      }}
      modal
    >
      <DialogContent
        className="max-h-full min-w-full overflow-y-auto sm:max-h-full sm:w-full sm:min-w-full md:max-h-full md:w-[80%] md:min-w-[80%] lg:max-h-[90%] lg:min-w-[50%]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="gap-0">
          <DialogTitle className="flex flex-col gap-0 text-start">
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
                {Array.isArray(selectedScheduleEntry?.dueDate) &&
                  Array.isArray(selectedScheduleEntry.disconnectionDate) && (
                    <SplittedDates
                      dueDates={selectedScheduleEntry.dueDate}
                      disconnectionDates={selectedScheduleEntry.disconnectionDate}
                    />
                  )}

                {selectedScheduleEntry &&
                  !Array.isArray(selectedScheduleEntry?.dueDate) &&
                  !Array.isArray(selectedScheduleEntry.disconnectionDate) && (
                    <NormalDates
                      dueDate={selectedScheduleEntry.dueDate!}
                      disconnectionDate={selectedScheduleEntry.disconnectionDate!}
                    />
                  )}
              </div>
            </div>
          </DialogTitle>

          <DialogDescription className="text-start text-[0.5rem] text-gray-500 sm:text-[0.5rem] md:text-[0.5rem] lg:text-xs">
            Select a zonebook and press add to assign, don&apos;t forget to press apply to finalize.
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
              <PopoverContent avoidCollisions className="p-0" side="top">
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
              <PopoverContent className="w-full p-0" side="top">
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

          {isLoading ? (
            <div className="text-primary flex h-full w-full items-center justify-center">
              Loading zone books <LoadingSpinner className="text-primary" />
            </div>
          ) : (
            <CommandGroup
              className="h-[10rem] overflow-auto rounded border"
              onWheel={(e) => e.stopPropagation()}
            >
              {!selectedZone && !selectedBook && !unassignedZonebooks && isLoading ? (
                <div>
                  <LoadingSpinner />
                </div>
              ) : !selectedZone && !selectedBook && unassignedZonebooks && !isLoading ? (
                unassignedZonebooks.length > 0 &&
                unassignedZonebooks.map((zb, idx) => (
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
              ) : selectedZone && !selectedBook && unassignedZonebooks && !isLoading ? (
                unassignedZonebooks
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
              ) : selectedZone && selectedBook && unassignedZonebooks && !isLoading ? (
                unassignedZonebooks
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
          <Label className="text-primary font-bold">Assigned Zonebooks</Label>
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
                {!isLoading && assignedZonebooks && assignedZonebooks.length > 0 ? (
                  assignedZonebooks.map((entry) => (
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
                            zoneBooks={assignedZonebooks}
                            setZonebooks={setAssignedZonebooks}
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
                          ? entry.dueDate && entry.disconnectionDate
                            ? format(entry.disconnectionDate, "MMM dd, yyyy")
                            : "-"
                          : selectedScheduleEntry?.disconnectionDate &&
                              !Array.isArray(selectedScheduleEntry.disconnectionDate)
                            ? format(selectedScheduleEntry.disconnectionDate, "MMM dd, yyyy")
                            : null}
                      </TableCell>
                      <TableCell>
                        {/* <button onClick={() => handleDelete(entry.zoneBook)}>
                          <CircleXIcon className="fill-red-600 text-white" />
                        </button> */}
                        <RemoveZonebookAlertDialog
                          zoneBook={entry.zoneBook}
                          onDelete={() => handleDelete(entry.zoneBook)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="p-4">
                      <div className="flex w-full items-center justify-center gap-2 text-center">
                        <span className="text-primary">Loading assigned zonebooks</span>
                        <LoadingSpinner className="text-primary" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No zone books added
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <Button
          className="h-[3rem]"
          onClick={handleApplyAllZonebooks}
          disabled={hasAnEmptyDueDate ? true : false}
        >
          Apply
        </Button>
      </DialogContent>
    </Dialog>
  );
};
