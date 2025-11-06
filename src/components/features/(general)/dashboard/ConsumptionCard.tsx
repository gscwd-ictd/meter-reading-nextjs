import { DashboardCard } from "@mr/components/ui/cards/DashboardCard";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@mr/components/ui/Chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartData = [
  { year: "2020", consumption: 1758877 },
  { year: "2021", consumption: 2123000 },
  { year: "2022", consumption: 2902795 },
  { year: "2023", consumption: 3365744 },
  { year: "2024", consumption: 4888872 },
];

const chartConfig = {
  consumption: {
    label: "Consumption",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export const ConsumptionCard = () => {
  return (
    <DashboardCard title="Consumption Pattern" className="col-span-3" size="sm">
      <ChartContainer config={chartConfig} className="flex h-[240px] w-full">
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid
            vertical={false}
            horizontal={true}
            stroke="#dfe3e7" // Custom color
            strokeWidth={1} // Custom line thickness
            strokeDasharray="0 0"
          />
          <XAxis
            dataKey="year"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 4)}
          />
          <YAxis
            ticks={[500000, 1000000, 1500000, 2000000, 2500000, 3000000, 3500000, 4000000, 4500000, 5000000]}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" hideLabel />} />
          <Area
            dataKey="consumption"
            type="linear"
            fill="var(--color-consumption)"
            fillOpacity={0.4}
            stroke="var(--color-consumption)"
          />
        </AreaChart>
      </ChartContainer>
    </DashboardCard>
  );
};
