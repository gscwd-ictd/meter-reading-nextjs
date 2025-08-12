"use client";

import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, parseISO } from "date-fns";

type MeterReader = {
  scheduleMeterReaderId: string;
  id: string;
  name: string;
};

type ScheduleEntry = {
  id: string;
  readingDate: string; // yyyy-MM-dd
  dueDate: string; // yyyy-MM-dd
  disconnectionDate: string; // yyyy-MM-dd
  meterReaders: MeterReader[];
  zoneBook: string;
  area: string;
  billed: number;
  remarks: string;
};

type ScheduleTableProps = {
  yearMonth: string; // yyyy-MM
};

export const ScheduleTable: FC<ScheduleTableProps> = ({ yearMonth }) => {
  const { data, isLoading, isError } = useQuery<ScheduleEntry[]>({
    queryKey: ["schedule", yearMonth],
    queryFn: async () => {
      const res = await axios.get(`/api/schedules?date=${yearMonth}`);
      return res.data;
    },
  });

  if (isLoading) return <div>Loading schedule...</div>;
  if (isError) return <div>Failed to load schedule.</div>;
  if (!data || data.length === 0) return <div>No schedule found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">DAY</th>
            <th className="border px-2 py-1">DATE</th>
            <th className="border px-2 py-1">DUE</th>
            <th className="border px-2 py-1">DISC</th>
            <th className="border px-2 py-1">METER READER</th>
            <th className="border px-2 py-1">ZONE/BOOK</th>
            <th className="border px-2 py-1">AREA</th>
            <th className="border px-2 py-1">BILLED</th>
            <th className="border px-2 py-1">REMARKS</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.id}>
              <td className="border px-2 py-1">{format(parseISO(entry.readingDate), "d")}</td>
              <td className="border px-2 py-1">{format(parseISO(entry.readingDate), "MMM dd, yyyy")}</td>
              {/* <td className="border px-2 py-1">{format(parseISO(entry.dueDate), "MMM dd, yyyy")}</td>
              <td className="border px-2 py-1">
                {format(parseISO(entry.disconnectionDate), "MMM dd, yyyy")}
              </td> */}
              <td className="border px-2 py-1">TEST</td>
              <td className="border px-2 py-1">TEST</td>

              <td className="border px-2 py-1">{entry.meterReaders.map((mr) => mr.name).join(", ")}</td>
              <td className="border px-2 py-1">{entry.zoneBook}</td>
              <td className="border px-2 py-1">{entry.area}</td>
              <td className="border px-2 py-1">{entry.billed}</td>
              <td className="border px-2 py-1">{entry.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
