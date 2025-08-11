import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@mr/components/ui/Select";
import { FunctionComponent } from "react";
import { useFormContext } from "react-hook-form";

export const SelectReports: FunctionComponent = () => {
  const { setValue, watch } = useFormContext();

  const selectedReport = watch("selectedReport");

  return (
    <Select value={selectedReport} onValueChange={(value) => setValue("selectedReport", value)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a report" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel className="text-gray-700 dark:text-gray-400">List of reports</SelectLabel>
          <SelectItem value="mr-schedule">Meter Reading Schedule</SelectItem>
          <SelectItem value="monthly-billing-summary">Monthly Billing Summary</SelectItem>
          <SelectItem value="bills-summary">Summary of Bills</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
