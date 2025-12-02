/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import { useState, useMemo, FunctionComponent, useEffect } from "react";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@mr/components/ui/Command";
import { Popover, PopoverContent, PopoverTrigger } from "@mr/components/ui/Popover";
import { Button } from "@mr/components/ui/Button";
import { cn } from "@mr/lib/utils";
import { Check, ChevronDown, MapPinIcon, X, PlusCircleIcon, CircleXIcon, CheckCircle } from "lucide-react";
import { ZonebookWithDates } from "@mr/lib/types/zonebook";
import { Label } from "@mr/components/ui/Label";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@mr/components/ui/Table";
import { ZonebookDaySorter, ZonebookSorter } from "@mr/lib/functions/zonebook-sorter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
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
import { Badge } from "@mr/components/ui/Badge";

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
  const [zoneInput, setZoneInput] = useState<string>("");
  const [bookInput, setBookInput] = useState<string>("");
  const [hasFetchedZonebooks, setHasFetchedZonebooks] = useState<boolean>(false);
  const [hasAnEmptyDueDate, setHasAnEmptyDueDate] = useState<boolean>(false);
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false);
  const [zonebookToAdd, setZonebookToAdd] = useState<ZonebookWithDates | null>(null);
  const [zonebookToRemove, setZonebookToRemove] = useState<ZonebookWithDates | null>(null);

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
  const setSelectedZonebook = useSchedulesStore((state) => state.setSelectedZonebook);
  const queryClient = useQueryClient();

  const zoneBookSorter = (zoneBooks: ZonebookWithDates[]) => ZonebookSorter(zoneBooks);

  const hasEmptyDueDate = (zonebooks: ZonebookWithDates[]): boolean =>
    zonebooks.some((item) => item.dueDate === undefined || item.dueDate === null);

  // new meter reader assigned and unassigned zonebooks pool
  const {
    data: meterReaderData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["get-meter-reader-zonebooks-by-exact-date", selectedMeterReader?.scheduleMeterReaderId],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_MR_BE}/schedules/meter-reader/${selectedMeterReader?.scheduleMeterReaderId}/zone-books`,
      );
      console.log(res.data);
      return res.data as MeterReaderZonebooks;
    },

    enabled:
      !hasFetchedZonebooks &&
      entryZonebookSelectorIsOpen &&
      selectedMeterReader?.scheduleMeterReaderId !== null,
    staleTime: 0,
    gcTime: 0,
    retry: 2,
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

  const filteredZones = zones?.filter((option) => option.toLowerCase().includes(zoneInput.toLowerCase()));

  const filteredBooks = booksForZone?.filter((option) =>
    option.toLowerCase().includes(bookInput.toLowerCase()),
  );

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
                  day: zb.day,
                };
              })
            : [],
      };

      postMeterReaderZonebooks.mutateAsync(submitObject);
    }
  };

  // Handle add zonebook confirmation
  const handleAddZonebook = (entry: ZonebookWithDates) => {
    setZonebookToAdd(entry);
    setAddDialogOpen(true);
  };

  const confirmAddZonebook = () => {
    if (!zonebookToAdd) return;

    const zoneBooksToBeAssigned = [...assignedZonebooks!];

    zoneBooksToBeAssigned.push({
      area: zonebookToAdd.area!,
      book: zonebookToAdd.book!,
      zone: zonebookToAdd.zone!,
      zoneBook: zonebookToAdd.zoneBook!,
      // Preserve the existing dueDate from the zonebook, only set to undefined if it doesn't exist
      dueDate:
        zonebookToAdd.dueDate !== undefined
          ? zonebookToAdd.dueDate
          : Array.isArray(selectedScheduleEntry?.dueDate)
            ? undefined
            : selectedScheduleEntry?.dueDate,
      // Same for disconnectionDate
      disconnectionDate:
        zonebookToAdd.disconnectionDate !== undefined
          ? zonebookToAdd.disconnectionDate
          : Array.isArray(selectedScheduleEntry?.disconnectionDate)
            ? undefined
            : selectedScheduleEntry?.disconnectionDate,
      day: zonebookToAdd.day !== undefined ? zonebookToAdd.day : null,
    });

    setAssignedZonebooks(zoneBooksToBeAssigned);

    const newUnassignedZonebooks = [...unassignedZonebooks];
    setUnassignedZonebooks(newUnassignedZonebooks.filter((zb) => zb.zoneBook !== zonebookToAdd.zoneBook));

    setSelectedBook("");
    setSelectedZone("");
    setSelectedZonebook(null);
    setZoneInput("");
    setBookInput("");

    setAddDialogOpen(false);
    setZonebookToAdd(null);
  };

  // Handle remove zonebook confirmation
  const handleRemoveZonebook = (entry: ZonebookWithDates) => {
    setZonebookToRemove(entry);
    setRemoveDialogOpen(true);
  };

  const confirmRemoveZonebook = () => {
    if (!zonebookToRemove) return;

    const tempAssignedZonebooks = [...assignedZonebooks];
    setAssignedZonebooks(
      zoneBookSorter(tempAssignedZonebooks.filter((zb) => zb.zoneBook !== zonebookToRemove.zoneBook)),
    );

    const tempUnassignedZonebooks = [...unassignedZonebooks];
    tempUnassignedZonebooks.push(zonebookToRemove);
    setUnassignedZonebooks(ZonebookSorter(tempUnassignedZonebooks));

    setRemoveDialogOpen(false);
    setZonebookToRemove(null);
  };

  const handleZoneSelect = (zone: string) => {
    setSelectedZone(zone);
    setSelectedBook(""); // reset book when zone changes
    setSelectedZonebook(null);
  };

  const handleBookSelect = (book: string) => {
    setSelectedBook(book);
    setSelectedZonebook(unassignedZonebooks?.find((zb) => zb.zone === selectedZone && zb.book === book)!);
  };

  // Add clear option handler for zone
  const handleClearZone = () => {
    setSelectedZone("");
    setSelectedBook("");
    setSelectedZonebook(null);
    setZoneIsOpen(false);
    setZoneInput("");
  };

  // Add clear option handler for book
  const handleClearBook = () => {
    setSelectedBook("");
    setSelectedZonebook(null);
    setBookIsOpen(false);
    setBookInput("");
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedZone("");
    setSelectedBook("");
    setSelectedZonebook(null);
    setZoneInput("");
    setBookInput("");
  };

  // useEffect for checking if fetched
  useEffect(() => {
    if (meterReaderData && !hasFetchedZonebooks && entryZonebookSelectorIsOpen && !isLoading && !isError) {
      setAssignedZonebooks(ZonebookDaySorter(meterReaderData.assigned));

      // const unassigned = meterReaderData.unassigned.filter(
      //   (zonebook) =>
      //     !meterReaderData.assigned.some((a) => a.zone === zonebook.zone && a.book === zonebook.book),
      // );

      setUnassignedZonebooks(ZonebookSorter(meterReaderData.unassigned));

      // setUnassignedZonebooks(ZonebookSorter(unassigned));
      setHasFetchedZonebooks(true);
    }
  }, [meterReaderData, hasFetchedZonebooks, entryZonebookSelectorIsOpen, isLoading, setAssignedZonebooks]);

  useEffect(() => {
    if (entryZonebookSelectorIsOpen) {
      setHasAnEmptyDueDate(hasEmptyDueDate(assignedZonebooks));
    }
  }, [assignedZonebooks, entryZonebookSelectorIsOpen]);

  return (
    <>
      <Dialog
        open={entryZonebookSelectorIsOpen}
        onOpenChange={() => {
          setEntryZonebookSelectorIsOpen(!entryZonebookSelectorIsOpen);
          setSelectedBook("");
          setSelectedZone("");
          setSelectedZonebook(null);
          setAssignedZonebooks([]);
          setUnassignedZonebooks([]);
          setHasFetchedZonebooks(false);
          setSelectedMeterReader(null);
          setZoneInput("");
          setBookInput("");
        }}
        modal
      >
        <DialogContent
          className="max-h-[100vh] overflow-y-auto sm:max-w-6xl lg:max-h-[85vh] lg:max-w-7xl dark:bg-gray-900 dark:text-gray-100"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          hideClose
        >
          <DialogHeader className="pb-4">
            <DialogTitle className="flex flex-col gap-2 text-start text-xl font-semibold text-gray-900 dark:text-gray-100">
              <div className="flex items-center gap-2">
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
              <div className="text-sm font-normal text-gray-600 dark:text-gray-400">
                Reading Date: {format(selectedScheduleEntry?.readingDate!, "MMM dd, yyyy")}{" "}
                {selectedScheduleEntry && selectedScheduleEntry.day && (
                  <Badge className="items-center text-xs">Day {selectedScheduleEntry?.day}</Badge>
                )}
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
            </DialogTitle>
            <DialogDescription className="text-start text-sm text-gray-600 dark:text-gray-400">
              <span className="flex flex-col gap-2">
                <span>Select a zonebook and press the add button to assign</span>
              </span>
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
                    {unassignedZonebooks.length}
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
                    onClick={handleClearFilters}
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
                          Day
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
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="py-16 text-center">
                            <div className="flex flex-col items-center gap-4 text-gray-500 dark:text-gray-400">
                              <LoadingSpinner className="size-8" />
                              <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                                Loading zonebooks...
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : unassignedZonebooks && unassignedZonebooks.length > 0 ? (
                        unassignedZonebooks
                          .filter(
                            (zb) =>
                              (!selectedZone || zb.zone === selectedZone) &&
                              (!selectedBook || zb.book === selectedBook),
                          )
                          .map((entry, index) => (
                            <TableRow
                              key={index}
                              className="group border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                              <TableCell className="py-3 text-xs font-semibold text-gray-500 dark:text-gray-100">
                                {entry.day ? `#${entry.day}` : ""}
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
                          <TableCell colSpan={5} className="py-16 text-center">
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
                    {assignedZonebooks.length}
                  </span>
                </div>
              </div>

              <div className="mt-0 rounded-lg border border-gray-200 bg-white lg:mt-25 dark:border-gray-700 dark:bg-gray-800">
                <div className="relative h-88 overflow-y-auto">
                  <Table className="w-full">
                    <TableHeader className="sticky top-0 z-10 bg-gray-50 shadow-sm dark:bg-gray-700">
                      <TableRow>
                        <TableHead className="w-20 py-3 font-semibold text-gray-700 dark:text-gray-300">
                          Day
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

                        <TableHead className="py-3 font-semibold text-gray-700 dark:text-gray-300">
                          Due
                        </TableHead>
                        <TableHead className="py-3 font-semibold text-gray-700 dark:text-gray-300">
                          Disc
                        </TableHead>
                        <TableHead className="w-16 py-3 font-semibold text-gray-700 dark:text-gray-300">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!isLoading && assignedZonebooks && assignedZonebooks.length > 0 ? (
                        assignedZonebooks.map((entry, idx) => (
                          <TableRow
                            key={idx}
                            className="group border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                          >
                            <TableCell className="py-3 text-xs font-semibold text-gray-500 dark:text-gray-100">
                              {entry.day ? `#${entry.day}` : ""}
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
                              {selectedScheduleEntry?.dueDate &&
                              Array.isArray(selectedScheduleEntry.dueDate) &&
                              Array.isArray(selectedScheduleEntry.disconnectionDate) ? (
                                <ScheduleEntryDueDateSelector
                                  zonebook={entry.zoneBook}
                                  zoneBooks={assignedZonebooks}
                                  setZonebooks={setAssignedZonebooks}
                                  dueDate={entry.dueDate}
                                  disconnectionDate={entry.disconnectionDate}
                                />
                              ) : selectedScheduleEntry?.dueDate &&
                                !Array.isArray(selectedScheduleEntry.dueDate) ? (
                                format(selectedScheduleEntry.dueDate, "MMM dd, yyyy")
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell className="py-3">
                              {selectedScheduleEntry?.disconnectionDate &&
                              Array.isArray(selectedScheduleEntry.disconnectionDate)
                                ? entry.dueDate && entry.disconnectionDate
                                  ? format(entry.disconnectionDate, "MMM dd, yyyy")
                                  : "-"
                                : selectedScheduleEntry?.disconnectionDate &&
                                    !Array.isArray(selectedScheduleEntry.disconnectionDate)
                                  ? format(selectedScheduleEntry.disconnectionDate, "MMM dd, yyyy")
                                  : "-"}
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
                      ) : isLoading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="py-16 text-center">
                            <div className="flex flex-col items-center gap-4 text-gray-500 dark:text-gray-400">
                              <LoadingSpinner className="size-8" />
                              <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                                Loading assigned zonebooks...
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="py-16 text-center">
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

          <DialogFooter className="flex items-end gap-2 pt-6">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="h-[3rem] flex-1 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="h-[3rem] flex-1 dark:text-white"
              onClick={handleApplyAllZonebooks}
              disabled={hasAnEmptyDueDate || postMeterReaderZonebooks.isPending}
            >
              {postMeterReaderZonebooks.isPending ? (
                <>
                  <LoadingSpinner className="mr-2 size-4" />
                  Applying...
                </>
              ) : (
                "Apply Changes"
              )}
            </Button>
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
                    <span className="font-medium text-gray-700 dark:text-gray-300">Default Day:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {zonebookToAdd.day}
                    </span>
                  </div>
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
                    <span className="font-medium text-gray-700 dark:text-gray-300">Default Day:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {zonebookToRemove.day}
                    </span>
                  </div>
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
                  {zonebookToRemove.dueDate && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Due Date:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {format(zonebookToRemove.dueDate, "MMM dd, yyyy")}
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
};
