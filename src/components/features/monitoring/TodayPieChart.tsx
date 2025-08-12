"use client";
import { CircleIcon } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Label } from "recharts";

const COLORS = {
  finished: "#3b82f6", // Green
  extra: "#0c5ad6", // Blue
  remaining: "#98b4ed", // Gray
};

function LegendItems({ finished, remaining, extra }: { finished: number; remaining: number; extra: number }) {
  return (
    <div className="flex w-full flex-col justify-center gap-2 text-left">
      <div>
        <span className="text-3xl font-bold text-gray-800">
          {isNaN(finished) ? 0 : finished ? finished : 0}
        </span>
        <span className="mt-1 flex items-center gap-1 font-medium">
          <CircleIcon className="size-3 fill-[#3b82f6] text-[#3b82f6]" />
          <span className="text-gray-500">Finished</span>
        </span>
      </div>

      <div>
        <span className="text-3xl font-bold text-gray-800">
          {isNaN(remaining) ? 0 : remaining ? remaining : 0}
        </span>
        <span className="mt-1 flex items-center gap-1 font-medium">
          <CircleIcon className="size-3 fill-[#98b4ed] text-[#98b4ed]" />
          <span className="text-gray-500">Remaining</span>
        </span>
      </div>

      <div>
        <span className="text-3xl font-bold text-gray-800">{isNaN(extra) ? 0 : extra ? extra : 0}</span>
        <span className="mt-1 flex items-center gap-1 font-medium">
          <CircleIcon className="size-3 fill-[#0c5ad6] text-[#0c5ad6]" />
          <span className="text-gray-500">Extra</span>
        </span>
      </div>
    </div>
  );
}

export default function TodayDonutChart({ scheduled, finished }: { scheduled: number; finished: number }) {
  const safeScheduled = typeof scheduled === "number" ? scheduled : 0;
  const safeFinished = typeof finished === "number" ? finished : 0;

  const extra = Math.max(safeFinished - safeScheduled, 0);
  const withinSchedule = Math.min(safeFinished, safeScheduled);
  const remaining = Math.max(safeScheduled - safeFinished, 0);

  const data =
    extra > 0
      ? [
          { name: "Finished (On Schedule)", value: scheduled, fill: COLORS.finished },
          { name: "Extra Finished", value: extra, fill: COLORS.extra },
        ]
      : [
          { name: "Finished", value: withinSchedule, fill: COLORS.finished },
          { name: "Remaining", value: remaining, fill: COLORS.remaining },
        ];

  return (
    <>
      <h2 className="text-primary mb-4 px-2 text-start text-lg font-semibold">Today&apos;s Completion</h2>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50} // Makes it a donut!
            outerRadius={90}
            labelLine={false}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            dataKey="value"
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
                        {finished.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground text-xs"
                      >
                        Finished
                      </tspan>
                    </text>
                  );
                }
              }}
            />
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
          {/* <Legend verticalAlign="bottom" height={36}  /> */}
        </PieChart>
      </ResponsiveContainer>

      {/* Legend for small/medium screens (bottom center) */}
      <div className="mt-4 flex flex-col items-center justify-center gap-2 text-sm text-gray-500 lg:hidden">
        <LegendItems finished={finished} remaining={remaining} extra={extra} />
      </div>

      {/* Legend for large screens (middle-right) */}
      <div className="absolute top-1/2 left-5 hidden -translate-y-1/2 text-sm text-gray-500 lg:block">
        <div className="w-[160px]">
          <LegendItems finished={finished} remaining={remaining} extra={extra} />
        </div>
      </div>
    </>
  );
}
