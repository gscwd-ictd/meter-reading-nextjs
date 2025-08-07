import { useReportsContext } from "@mr/components/providers/ReportsProvider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@mr/components/ui/Select";
import { Report } from "@mr/lib/enums/reports";
import { FunctionComponent } from "react";

export const SelectReports: FunctionComponent = () => {
  const { selectedReport, setSelectedReport } = useReportsContext();
  return (
    <>
      <Select value={selectedReport} onValueChange={(value) => setSelectedReport(value as Report)}>
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
    </>
  );
};
