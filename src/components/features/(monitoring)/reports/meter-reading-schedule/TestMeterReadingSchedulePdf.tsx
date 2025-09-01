"use client";

import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import { Area } from "@mr/server/types/area.type";

type MeterReader = {
  scheduleMeterReaderId: string;
  id: string;
  name: string;
  photoUrl: string;
};

type ScheduleEntry = {
  id: string;
  readingDate: string;
  dueDate: string;
  disconnectionDate: string;
  meterReader: MeterReader;
  zone: string;
  book: string;
  area: Area;
};

type ScheduleTableProps = {
  yearMonth: string;
};

export const ScheduleTable: FC<ScheduleTableProps> = ({ yearMonth }) => {
  const { data, isLoading, isError } = useQuery<ScheduleEntry[]>({
    queryKey: ["schedule", yearMonth],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/schedules/zone-book?date=${yearMonth}`);
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

  return (
    <div className="flex h-[44rem] flex-col">
      {" "}
      {/* Main container */}
      {/* Table container that takes remaining space */}
      <div className="min-h-0 flex-1 overflow-auto">
        {" "}
        {/* Key changes here */}
        <table className="min-w-full border border-gray-300 text-sm">
          <thead>
            <tr className="sticky top-0 bg-gray-100 dark:bg-black">
              <th className="border px-2 py-1">DAY</th>
              <th className="border px-2 py-1">DATE</th>
              <th className="border px-2 py-1">DUE</th>
              <th className="border px-2 py-1">DISC</th>
              <th className="border px-2 py-1">METER READER</th>
              <th className="border px-2 py-1">ZONE/BOOK</th>
              <th className="border px-2 py-1">AREA</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{idx + 1}</td>
                <td className="border px-2 py-1">
                  {entry.readingDate ? format(parseISO(entry.readingDate), "MMM dd, yyyy") : ""}
                </td>
                <td className="border px-2 py-1">
                  {entry.dueDate ? format(parseISO(entry.dueDate), "MMM dd, yyyy") : ""}
                </td>
                <td className="border px-2 py-1">
                  {entry.disconnectionDate ? format(parseISO(entry.disconnectionDate), "MMM dd, yyyy") : ""}
                </td>
                <td className="border px-2 py-1">{entry.meterReader.name}</td>
                <td className="border px-2 py-1">{entry.zone + "-" + entry.book}</td>
                <td className="border px-2 py-1">{entry.area.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
