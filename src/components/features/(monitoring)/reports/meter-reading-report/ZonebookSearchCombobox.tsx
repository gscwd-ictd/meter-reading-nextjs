import { Zonebook } from "@mr/lib/types/zonebook";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Check, ChevronsUpDown, AlertCircle, X } from "lucide-react";
import { cn } from "@mr/lib/utils";
import { Button } from "@mr/components/ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@mr/components/ui/Command";
import { Popover, PopoverContent, PopoverTrigger } from "@mr/components/ui/Popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@mr/components/ui/Tooltip";

type ZonebookType = Pick<Zonebook, "zone" | "book">;

interface ZoneBookSearchComboboxProps {
  zoneName?: string;
  bookName?: string;
  disabled?: boolean;
}

export const ZonebookSearchCombobox = ({
  zoneName = "zone",
  bookName = "book",
  disabled,
}: ZoneBookSearchComboboxProps) => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
    trigger,
    getValues,
  } = useFormContext();

  const selectedZone = watch(zoneName);
  const selectedBook = watch(bookName);

  const [zoneOpen, setZoneOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);

  const extractZoneAndBook = (data: Zonebook[]): ZonebookType[] => {
    return data
      .filter((item) => item.zone && item.book)
      .map((item) => ({
        zone: String(parseInt(item.zone, 10)),
        book: item.book,
      }));
  };

  const { data, isLoading } = useQuery({
    queryKey: ["get-all-zonebooks"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/zone-book`);
      return res.data as Zonebook[];
    },
  });

  const zoneBookData = useMemo(() => {
    if (!data) return [];
    return extractZoneAndBook(data);
  }, [data]);

  // Get unique zones sorted numerically
  const uniqueZones = useMemo(() => {
    const zones = new Set(zoneBookData.map((item) => item.zone));
    return Array.from(zones)
      .map(Number)
      .sort((a, b) => a - b)
      .map(String);
  }, [zoneBookData]);

  // Get books for selected zone sorted numerically
  const availableBooks = useMemo(() => {
    if (!selectedZone) return [];
    const books = zoneBookData
      .filter((item) => item.zone === selectedZone)
      .map((item) => item.book)
      .filter((book, index, self) => self.indexOf(book) === index);

    return books.sort((a, b) => {
      const numA = parseInt(a, 10);
      const numB = parseInt(b, 10);

      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b);
    });
  }, [zoneBookData, selectedZone]);

  const handleZoneChange = (zone: string | null) => {
    if (zone === null) {
      // Clear zone - explicitly set to null
      setValue(zoneName, null, { shouldValidate: true, shouldDirty: true });
      setValue(bookName, null, { shouldValidate: true, shouldDirty: true });
      // Force validation after state update
      setTimeout(() => {
        trigger([zoneName, bookName]);
      }, 0);
    } else {
      setValue(zoneName, zone, { shouldValidate: true, shouldDirty: true });
      setValue(bookName, null, { shouldValidate: true, shouldDirty: true });
      setTimeout(() => {
        trigger(bookName);
      }, 0);
    }
    setZoneOpen(false);
  };

  const handleBookChange = (book: string | null) => {
    if (book === null) {
      setValue(bookName, null, { shouldValidate: true, shouldDirty: true });
    } else {
      setValue(bookName, book, { shouldValidate: true, shouldDirty: true });
    }
    setTimeout(() => {
      trigger(bookName);
    }, 0);
    setBookOpen(false);
  };

  if (!data && !isLoading) {
    return <div className="text-red-500">Cannot find zonebooks</div>;
  }

  if (isLoading) {
    return (
      <div className="flex w-full max-w-md gap-1">
        <div className="h-10 w-[150px] animate-pulse rounded-md bg-gray-200" />
        <div className="h-10 min-w-[150px] animate-pulse rounded-md bg-gray-200" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex w-full max-w-md gap-1">
        {/* Zone Combobox - Optional, accepts null */}
        <div className="flex-1">
          <Controller
            name={zoneName}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Tooltip open={error ? undefined : false}>
                <TooltipTrigger asChild>
                  <div>
                    <Popover open={zoneOpen} onOpenChange={setZoneOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={zoneOpen}
                          className={cn(
                            "h-[2.5rem] w-[150px] justify-between transition-all duration-200",
                            "disabled:cursor-not-allowed",
                            error && "border-red-500 ring-1 ring-red-500",
                            !field.value && "text-muted-foreground",
                            !error && "focus:ring-2 focus:ring-blue-500",
                          )}
                          disabled={disabled}
                        >
                          <span className="truncate">
                            {field.value ? `Zone ${field.value}` : "Zone (Optional)"}
                          </span>
                          <div className="flex items-center gap-1">
                            {field.value && (
                              <X
                                className="h-3 w-3 opacity-50 hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleZoneChange(null);
                                }}
                              />
                            )}
                            {error && <AlertCircle className="h-4 w-4 text-red-500" />}
                            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-full p-0"
                        style={{ width: "var(--radix-popover-trigger-width)" }}
                      >
                        <Command>
                          <CommandInput placeholder="Search zone..." />
                          <CommandList>
                            <CommandEmpty>No zone found.</CommandEmpty>
                            <CommandGroup>
                              {/* Clear option - only shows when zone is selected */}
                              {field.value && (
                                <>
                                  <CommandItem
                                    value="clear-zone"
                                    onSelect={() => {
                                      handleZoneChange("");
                                      handleBookChange("");
                                    }}
                                    className="text-red-500"
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Clear Zone
                                  </CommandItem>
                                  <CommandSeparator />
                                </>
                              )}
                              {uniqueZones.map((zone) => (
                                <CommandItem key={zone} value={zone} onSelect={() => handleZoneChange(zone)}>
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === zone ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  Zone {zone}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TooltipTrigger>
                {error && (
                  <TooltipContent side="bottom" className="bg-red-500 text-white">
                    <p>{error.message as string}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            )}
          />
        </div>

        {/* Book Combobox - Required only when zone has a value (not null) */}
        <div className="flex-1">
          <Controller
            name={bookName}
            control={control}
            rules={{
              validate: (value) => {
                // Get the current zone value directly from form state
                const currentZone = getValues(zoneName);
                // If zone has a value (not null, undefined, or empty string), book is required
                if (currentZone && currentZone !== null && currentZone !== "" && !value) {
                  return "Book is required when zone is selected";
                }
                return true;
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <Tooltip open={error ? undefined : false}>
                <TooltipTrigger asChild>
                  <div>
                    <Popover open={bookOpen} onOpenChange={setBookOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={bookOpen}
                          disabled={!selectedZone || selectedZone === null || disabled}
                          className={cn(
                            "h-[2.5rem] min-w-[150px] justify-between transition-all duration-200",
                            "disabled:cursor-not-allowed",
                            (!selectedZone || selectedZone === null) && "bg-gray-50",
                            error && "border-red-500 ring-1 ring-red-500",
                            !field.value && selectedZone && selectedZone !== null && "text-muted-foreground",
                            !field.value && (!selectedZone || selectedZone === null) && "text-gray-400",
                            !error && "focus:ring-2 focus:ring-blue-500",
                          )}
                        >
                          <span className="truncate">
                            {field.value
                              ? `Book ${field.value}`
                              : !selectedZone || selectedZone === null
                                ? "Select zone first"
                                : "Book (Required)"}
                          </span>
                          <div className="flex items-center gap-1">
                            {field.value && selectedZone && selectedZone !== null && (
                              <X
                                className="h-3 w-3 opacity-50 hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBookChange(null);
                                }}
                              />
                            )}
                            {error && <AlertCircle className="h-4 w-4 text-red-500" />}
                            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-full p-0"
                        style={{ width: "var(--radix-popover-trigger-width)" }}
                      >
                        <Command>
                          <CommandInput
                            placeholder="Search book..."
                            disabled={!selectedZone || selectedZone === null}
                          />
                          <CommandList>
                            <CommandEmpty>
                              {!selectedZone || selectedZone === null
                                ? "Select a zone first"
                                : "No book found."}
                            </CommandEmpty>
                            {selectedZone && selectedZone !== null && (
                              <CommandGroup>
                                {/* Clear option - only shows when book is selected */}
                                {field.value && (
                                  <>
                                    <CommandItem
                                      value="clear-book"
                                      onSelect={() => handleBookChange("")}
                                      className="text-red-500"
                                    >
                                      <X className="mr-2 h-4 w-4" />
                                      Clear Book
                                    </CommandItem>
                                    <CommandSeparator />
                                  </>
                                )}
                                {availableBooks.map((book) => (
                                  <CommandItem
                                    key={book}
                                    value={book}
                                    onSelect={() => handleBookChange(book)}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === book ? "opacity-100" : "opacity-0",
                                      )}
                                    />
                                    {book}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TooltipTrigger>
                {error && (
                  <TooltipContent side="bottom" className="bg-red-500 text-white">
                    <p>{error.message as string}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            )}
          />
        </div>
      </div>
    </TooltipProvider>
  );
};
