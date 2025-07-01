import { useTextBlastStore } from "@/components/stores/useTextBlastStore";
import { Button } from "@/components/ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { TextBlastSentMessageStatus } from "@/lib/mock/SampleTextBlastReportData";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Check, ChevronsUpDown } from "lucide-react";
import { FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const FormSchema = z.object({
  dateFrom: z.string().nonempty("Date from is required"),
  dateTo: z.string().nonempty("Date to is required"),
  status: z.string().optional(),
});

export const GenerateTextBlastReportForm: FunctionComponent = () => {
  const setSelectedDateFrom = useTextBlastStore((state) => state.setSelectedDateFrom);
  const setSelectedDateTo = useTextBlastStore((state) => state.setSelectedDateTo);
  const setSelectedStatus = useTextBlastStore((state) => state.setSelectedStatus);
  const textBlastReports = useTextBlastStore((state) => state.textBlastReports);
  const setTextBlastReports = useTextBlastStore((state) => state.setTextBlastReports);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dateFrom: "",
      dateTo: "",
      status: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const { dateFrom, dateTo, status } = data;

    setSelectedDateFrom(dateFrom);
    setSelectedDateTo(dateTo);
    setSelectedStatus(status ?? null);

    const filtered = textBlastReports.filter((textBlastReport) => {
      const dateCreated = format(textBlastReport.dateCreated, "yyyy-MM-dd");

      const matchesDateRange = dateCreated >= dateFrom && dateCreated <= dateTo;
      const matchesStatus = !status || textBlastReport.status === status;

      return matchesDateRange && matchesStatus;
    });

    setTextBlastReports(filtered);

    if (filtered.length === 0) {
      toast.info("Info", {
        description: `No data found from ${data.dateFrom} to ${data.dateTo}`,
      });
    } else {
      toast.success("Success", {
        description: `Found data from ${data.dateFrom} to ${data.dateTo}`,
      });
    }
    
    form.reset({
      dateFrom: "",
      dateTo: "",
      status: "",
    });
  }

  return (
    <>
      <Form {...form}>
        <form className="flex w-full flex-row items-center gap-2" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="dateFrom"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2">
                <FormLabel htmlFor="dateFrom" className="whitespace-nowrap">
                  Date From
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateTo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2">
                <FormLabel htmlFor="dateTo" className="whitespace-nowrap">
                  Date To
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="flex flex-row items-center justify-center gap-1">
                  <FormLabel>Status</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("w-[200px] justify-between", !field.value && "text-muted-foreground")}
                        >
                          {field.value
                            ? TextBlastSentMessageStatus.find((status) => status.value === field.value)?.label
                            : "Select status"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search status..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No zone found.</CommandEmpty>
                          <CommandGroup>
                            {TextBlastSentMessageStatus.map((status) => (
                              <CommandItem
                                value={status.value}
                                key={status.value}
                                onSelect={() => {
                                  field.onChange(status.value);
                                }}
                              >
                                {status.label}
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    status.value === field.value ? "opacity-100" : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="">
            <Button variant={"default"} className="w-fit">
              Load
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
