"use client";

import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, isSaturday, isSunday } from "date-fns";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import { BilledMeterReadingSchedule } from "@mr/lib/types/schedule";

type ScheduleTableProps = {
  yearMonth: string;
};

export const NewScheduleTable: FC<ScheduleTableProps> = ({ yearMonth }) => {
  const { data, isLoading, isError } = useQuery<BilledMeterReadingSchedule[]>({
    queryKey: ["schedule", yearMonth],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/schedules?date=${yearMonth}`);
      return res.data;
    },
    enabled: !!yearMonth,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner /> Loading Schedule...
      </div>
    );
  if (isError) return <div>Failed to load schedule.</div>;
  if (!data || data.length === 0) return <div>Please input the exact year-month.</div>;

  // Sort data by reading date
  const sortedData = data.sort((a, b) => (a.readingDate > b.readingDate ? 1 : -1));

  // Function to compute day numbers with weekend grouping
  const computeDayNumbers = (entries: BilledMeterReadingSchedule[]) => {
    const dayNumbers: number[] = [];
    let currentDayNumber = 0;

    for (let i = 0; i < entries.length; i++) {
      const currentDate = new Date(entries[i].readingDate);

      if (i === 0) {
        // First entry always gets day number 1
        currentDayNumber = 1;
        dayNumbers.push(currentDayNumber);
        continue;
      }

      const previousDate = new Date(entries[i - 1].readingDate);

      // Check if current date is Sunday and previous date was Saturday
      if (isSunday(currentDate) && isSaturday(previousDate)) {
        // Same day number as Saturday
        dayNumbers.push(currentDayNumber);
      } else {
        // Increment day number for new day
        currentDayNumber++;
        dayNumbers.push(currentDayNumber);
      }
    }

    return dayNumbers;
  };

  const dayNumbers = computeDayNumbers(sortedData);

  return (
    <div className="flex h-[44rem] flex-col">
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead>
            <tr className="sticky top-0 bg-gray-100 dark:bg-black">
              <th className="border px-2 py-1">DAY</th>
              <th className="border px-2 py-1">DATE</th>
              <th className="border px-2 py-1">DUE</th>
              <th className="border px-2 py-1">DISC</th>
              <th className="border px-2 py-1">METER READER</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((entry, idx) => {
              const readingDate = new Date(entry.readingDate);
              const dayNumber = dayNumbers[idx];
              const meterReaders = entry.meterReaders || [];

              // If no meter readers, show one row
              if (meterReaders.length === 0) {
                return (
                  <tr key={idx}>
                    <td className="border px-2 py-1">{dayNumber}</td>
                    <td className="border px-2 py-1">
                      {entry.readingDate ? format(readingDate, "MMM dd, yyyy (EEE)") : ""}
                    </td>
                    <td className="border px-2 py-1">
                      {entry.dueDate
                        ? format(
                            Array.isArray(entry.dueDate) ? entry.dueDate[0] : entry.dueDate,
                            "MMM dd, yyyy",
                          )
                        : ""}
                    </td>
                    <td className="border px-2 py-1">
                      {entry.disconnectionDate
                        ? format(
                            Array.isArray(entry.disconnectionDate)
                              ? entry.disconnectionDate[0]
                              : entry.disconnectionDate,
                            "MMM dd, yyyy",
                          )
                        : ""}
                    </td>
                    <td className="border px-2 py-1">No meter readers assigned</td>
                  </tr>
                );
              }

              // Create a complete row for each meter reader
              return meterReaders.map((reader, readerIdx) => (
                <tr key={`${idx}-${readerIdx}`}>
                  <td className="border px-2 py-1">{dayNumber}</td>
                  <td className="border px-2 py-1">
                    {entry.readingDate ? format(readingDate, "MMM dd, yyyy (EEE)") : ""}
                  </td>
                  <td className="border px-2 py-1">
                    {entry.dueDate
                      ? format(
                          Array.isArray(entry.dueDate) ? entry.dueDate[0] : entry.dueDate,
                          "MMM dd, yyyy",
                        )
                      : ""}
                  </td>
                  <td className="border px-2 py-1">
                    {entry.disconnectionDate
                      ? format(
                          Array.isArray(entry.disconnectionDate)
                            ? entry.disconnectionDate[0]
                            : entry.disconnectionDate,
                          "MMM dd, yyyy",
                        )
                      : ""}
                  </td>
                  <td className="border px-2 py-1">{reader.name}</td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
