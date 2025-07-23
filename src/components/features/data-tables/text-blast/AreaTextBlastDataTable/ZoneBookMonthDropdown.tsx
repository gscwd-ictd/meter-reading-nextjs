import { FunctionComponent, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { MonthPicker } from "@/components/ui/MonthPicker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { Form, FormField, FormItem, FormControl, FormLabel } from "@/components/ui/Form";
import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command";
import { useTextBlastStore } from "@/components/stores/useTextBlastStore";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Account, AccountWithDates, Zonebook } from "@/lib/types/text-blast/ReadingDetails";

const FormSchema = z.object({
  zone: z.string().nonempty({ message: "This field is required" }),
  book: z.string().nonempty({ message: "This field is required" }),
  billMonthYear: z.string({
    required_error: "Please select a month and year",
  }),
});

type ZoneOption = {
  value: string;
  label: string;
};

type BookOption = {
  value: string;
  label: string;
};

export const ZoneBookMonthDropdown: FunctionComponent = () => {
  const setSelectedZone = useTextBlastStore((state) => state.setSelectedZone);
  const setSelectedBook = useTextBlastStore((state) => state.setSelectedBook);
  const setSelectedBillMonthYear = useTextBlastStore((state) => state.setSelectedBillMonthYear);
  const setSelectedConsumers = useTextBlastStore((state) => state.setSelectedConsumers);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      zone: "",
      book: "",
      billMonthYear: undefined,
    },
  });

  const { data: zonebooks } = useQuery<Zonebook[]>({
    queryKey: ["get-all-zonebooks"],
    queryFn: async () => {
      try {
        const response = await axios.get<Zonebook[]>(`${process.env.NEXT_PUBLIC_HOST}/zone-book`);
        if (response.data.length === 0) {
          toast.info("Info", { description: "No zonebooks found" });
        } else {
          toast.success("Success", { description: "Zonebooks fetched successfully" });
        }
        return response.data;
      } catch (error) {
        toast.error("Error fetching zonebooks", { description: `${error}` });
        return [];
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const selectedZone = useWatch({ control: form.control, name: "zone" });

  const zones: ZoneOption[] = useMemo(() => {
    if (!zonebooks || zonebooks.length === 0) return [];
    const uniqueZones = [...new Set(zonebooks.map((zb) => zb.zone.toString()))];
    return uniqueZones.map((zone) => ({
      value: zone,
      label: zone,
    }));
  }, [zonebooks]);

  const books: BookOption[] = useMemo(() => {
    if (!selectedZone || !zonebooks) return [];
    const booksForZone = zonebooks
      .filter((zb) => zb.zone.toString() === selectedZone)
      .map((zb) => zb.book.toString());
    const uniqueBooks = [...new Set(booksForZone)];
    return uniqueBooks.map((book) => ({
      value: book,
      label: book,
    }));
  }, [selectedZone, zonebooks]);

  const handleZoneSelect = (zone: string) => {
    form.setValue("zone", zone);
    form.resetField("book");
  };

  const handleBookSelect = (book: string) => {
    form.setValue("book", book);
  };

  const { data: accounts } = useQuery<AccountWithDates[]>({
    queryKey: ["get-all-read-accounts-by-date"],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}/meter-readers/cmcisxft004jmsy58bxkb03nf00bq/schedule-reading`,
      );

      const accounts = response.data.zoneBooks.flatMap((zoneBook: Zonebook) =>
        zoneBook.accounts.map((account: Account) => ({
          ...account,
          book: zoneBook.book.toString(),
          dueDate: zoneBook.dueDate,
          disconnectionDate: zoneBook.disconnectionDate,
          readingDate: format(response.data.readingDate, "yyyy-MM"),
          contactNumber: account.contactNumber === null ? "" : account.contactNumber,
        })),
      );

      return accounts;
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const { zone, book, billMonthYear } = data;

    setSelectedZone(zone);
    setSelectedBook(book);
    setSelectedBillMonthYear(billMonthYear);

    if (!accounts) {
      toast.error("Error fetching accounts", { description: "There is something wrong fetching accounts" });
      return;
    }

    const filtered = accounts.filter((consumer) => {
      const matchesFilters =
        consumer.zone === zone && consumer.book === book && consumer.readingDate === billMonthYear;

      return matchesFilters;
    });

    setSelectedConsumers(filtered);

    if (filtered.length === 0) {
      toast.info("Info", { description: "No recipients found" });
    } else {
      toast.success("Success", {
        description: `Found ${filtered.length} consumer(s) matching your filters`,
      });
    }

    form.reset({
      zone: "",
      book: "",
      billMonthYear: undefined,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex w-full flex-row justify-between gap-2">
          {/* Zone Field */}
          <FormField
            control={form.control}
            name="zone"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-center gap-1">
                <FormLabel>Zone</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn("w-[200px] justify-between", !field.value && "text-muted-foreground")}
                      >
                        {field.value
                          ? zones.find((zone) => zone.value === field.value)?.label
                          : "Select zone"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search zone..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>No zone found.</CommandEmpty>
                        <CommandGroup>
                          {zones.map((zone) => (
                            <CommandItem
                              value={zone.value}
                              key={zone.value}
                              onSelect={() => {
                                handleZoneSelect(zone.value);
                              }}
                            >
                              {zone.label}
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  zone.value === field.value ? "opacity-100" : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          {/* Book Field */}
          <FormField
            control={form.control}
            name="book"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-center gap-1">
                <FormLabel>Book</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn("w-[200px] justify-between", !field.value && "text-muted-foreground")}
                        disabled={!form.watch("zone")}
                      >
                        {field.value
                          ? books.find((book) => book.value === field.value)?.label
                          : "Select book"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search book..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>No book found.</CommandEmpty>
                        <CommandGroup>
                          {books.map((book) => (
                            <CommandItem
                              value={book.value}
                              key={book.value}
                              onSelect={() => {
                                handleBookSelect(book.value);
                              }}
                            >
                              {book.label}
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  book.value === field.value ? "opacity-100" : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          {/* Bill Month/Year Field */}
          <FormField
            control={form.control}
            name="billMonthYear"
            render={({ field }) => (
              <FormItem className="flex w-fit flex-row gap-1">
                <FormLabel htmlFor="billMonthYear" className="whitespace-nowrap">
                  Bill Month/Year
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[200px] justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? field.value : <span>Select...</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <MonthPicker
                      onMonthSelect={(date) => {
                        const stringValue = format(date, "yyyy-MM");
                        field.onChange(stringValue);
                      }}
                      selectedMonth={field.value ? parse(field.value, "yyyy-MM", new Date()) : undefined}
                      maxDate={new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          <Button variant={"default"} className="bg-primary w-fit" type="submit">
            Load
          </Button>
        </div>
      </form>
    </Form>
  );
};
