"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";

export default function ProgressChart({ scheduled, finished }: { scheduled: number; finished: number }) {
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const data = [
    {
      date: today,
      scheduled,
      finished,
    },
  ];

  return (
    <>
      <h2 className="text-primary mb-4 px-2 text-start text-lg font-semibold">
        Monitoring Today: Scheduled vs Finished
      </h2>

      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={data} margin={{ top: 20, right: 60, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="date" tick={{ fontSize: 14 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="scheduled" fill="#3b82f6" name="Scheduled" barSize={30}>
              <LabelList dataKey="scheduled" position="right" fill="#3b82f6" />
            </Bar>
            <Bar dataKey="finished" fill="#98b4ed" name="Finished" barSize={30}>
              <LabelList dataKey="finished" position="right" fill="#98b4ed" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
