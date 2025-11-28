"use client";

import { DashboardCard } from "@mr/components/ui/cards/DashboardCard";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ConsumerData {
  name: string;
  value: number;
  color: string;
}

const consumerCategories: ConsumerData[] = [
  { name: "Active", value: 1250, color: "oklch(0.623 0.214 259.815)" },
  { name: "Disconnected", value: 180, color: "#706868" },
  //
  { name: "Write-off", value: 75, color: "#6ac9f5" },
];

const renderCustomizedLabel = ({ value }: any) => value;

export function ConsumersByCategory() {
  const totalConsumers = consumerCategories.reduce((sum, category) => sum + category.value, 0);

  return (
    <DashboardCard
      title="Consumers by Category"
      subtitle="Total number of consumers per category"
      className="col-span-2 border bg-white dark:bg-gray-900"
    >
      <div className="relative mb-6 flex h-40 items-center justify-center">
        <div className="h-full w-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={consumerCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                // label={renderCustomizedLabel}
                outerRadius={80}
                innerRadius={50}
                dataKey="value"
              >
                {consumerCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} className="stroke-white stroke-1" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Simple Center Total */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalConsumers.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {consumerCategories.map((category) => (
          <div key={category.name} className="text-center">
            <div className="mb-2 flex items-center justify-center">
              <div className="mr-2 size-2 rounded-full" style={{ backgroundColor: category.color }} />
              <span className="text-sm font-medium text-gray-700">{category.name}</span>
            </div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white">
              {category.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
