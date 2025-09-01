"use client";
import { useState } from "react";
import { Button } from "@mr/components/ui/Button";
import { DateRange } from "react-day-picker";
import { CalendarDateRangePicker } from "../../../calendar/CalendarDateRangePicker";
import { ZonebookProgressTable } from "./ZonebookProgressTable";
import { format } from "date-fns";

type MeterReaderWithZonebooksReports = {
  meterReader: string;
  zoneBook: string;
  accountsRead: number;
  totalAccounts: number;
  status: string;
  readingDate: string;
};

const sampleData: MeterReaderWithZonebooksReports[] = [
  {
    meterReader: "John Doe",
    zoneBook: "Zone 1 / Book A",
    accountsRead: 120,
    totalAccounts: 150,
    status: "in progress",
    readingDate: format(new Date(), "MMM dd, yyyy"),
  },
  {
    meterReader: "Jane Smith",
    zoneBook: "Zone 2 / Book B",
    accountsRead: 200,
    totalAccounts: 200,
    status: "completed",
    readingDate: format(new Date(), "MMM dd, yyyy"),
  },
];

export const ZonebookDailyProgressComponent = () => {
  const [dateRange, setDateRange] = useState<DateRange>();
  const [submittedRange, setSubmittedRange] = useState<DateRange | null>(null);

  const handleSubmit = () => {
    if (!dateRange?.from) {
      alert("Please select a date range first");
      return;
    }
    setSubmittedRange(dateRange);
    console.log("Submitted date range:", dateRange);
    // Add your form submission logic here
  };

  return (
    <div className="space-y-4 pt-4 lg:p-4">
      <div className="flex justify-center gap-2 px-4 sm:justify-center md:justify-center lg:justify-end">
        <CalendarDateRangePicker onDateChange={setDateRange} initialDate={{ from: new Date() }} />

        <Button onClick={handleSubmit} disabled={!dateRange?.from} className="dark:text-white">
          Submit
        </Button>
      </div>

      {submittedRange && (
        <div className="bg-muted/50 mt-4 rounded-lg border p-4">
          <h3 className="font-medium">Submitted Range:</h3>
          <p>From: {submittedRange.from?.toLocaleDateString()}</p>
          <p>To: {submittedRange.to?.toLocaleDateString()}</p>
        </div>
      )}

      <ZonebookProgressTable data={sampleData} />
    </div>
  );
};
