"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";

export default function IntradayProgressChart({
  finishedByHour,
  scheduled,
}: {
  finishedByHour: { time: string; finished: number }[];
  scheduled: number;
}) {
  // Add scheduled value to each data point
  const data = finishedByHour.map((entry) => ({
    ...entry,
    scheduled,
  }));

  return (
    <>
      <h2 className="text-primary mb-4 px-2 text-lg font-semibold">
        Intraday Monitoring: Scheduled vs Finished
      </h2>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 20, right: 60, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="colorScheduled" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorFinished" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a9a9a9" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#a9a9a9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="scheduled"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorScheduled)"
            name="Scheduled"
          />
          <Area
            type="monotone"
            dataKey="finished"
            stroke="#858585"
            fillOpacity={1}
            fill="url(#colorFinished)"
            name="Finished"
          />
          <YAxis>
            <ReferenceLine y={scheduled} stroke="#3b82f6" strokeDasharray="3 3" />
          </YAxis>
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
}
