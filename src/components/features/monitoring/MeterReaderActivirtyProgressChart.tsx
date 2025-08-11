"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, Cell } from "recharts";
import { useTheme } from "next-themes";

type ReaderActivity = {
  name: string;
  completion: number;
  completed: number;
  assigned: number;
};

const data: ReaderActivity[] = [
  { name: "Artajo, Charlesbe D.", completion: 80, completed: 145, assigned: 180 },
  { name: "Hingco, Ralph Angelo E.", completion: 100, completed: 120, assigned: 120 },
  { name: "Oliva, Jeramel R.", completion: 43, completed: 65, assigned: 150 },
];

const COLORS = {
  good: "#669ef8", // green
  warning: "#9ec3ff", // yellow
  bad: "#ef4444", // red
  top: "#3b82f6", // blue for top performer
};

export default function MeterReaderActivityChart() {
  const { theme } = useTheme(); // "light" | "dark" | "system"
  const isDark = theme === "dark";

  // Determine top performer based on completion %
  const topPerformer = data.reduce((prev, curr) => (curr.completion > prev.completion ? curr : prev));

  const getColor = (entry: ReaderActivity) => {
    if (entry.name === topPerformer.name) return COLORS.top;
    if (entry.completion >= 90) return COLORS.good;
    if (entry.completion >= 50) return COLORS.warning;
    return COLORS.bad;
  };

  return (
    <>
      <h2 className="text-primary mb-4 px-2 text-start text-lg font-semibold">Meter Reader Activity</h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart layout="vertical" data={data} margin={{ top: 20, right: 30, left: 100, bottom: 20 }}>
            <XAxis type="number" domain={[0, 100]} hide tickFormatter={(value) => `${value}%`} />
            <YAxis type="category" dataKey="name" fontSize={14} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div
                      style={{
                        background: isDark ? "#1f2937" : "#fff", // gray-800 vs white
                        color: isDark ? "#f9fafb" : "#111827", // gray-50 vs gray-900
                        padding: "8px 12px",
                        border: `1px solid ${isDark ? "#374151" : "#ddd"}`, // gray-700 vs light gray
                        borderRadius: "8px",
                      }}
                    >
                      <p style={{ margin: 0, fontWeight: "bold" }}>{label}</p>
                      <p style={{ margin: 0 }}>
                        Completion: {item.completion}%<br />
                        {item.completed} of {item.assigned} readings
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="completion" radius={[0, 10, 10, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry)} />
              ))}
              <LabelList dataKey="completion" position="right" formatter={(val: number) => `${val}%`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
