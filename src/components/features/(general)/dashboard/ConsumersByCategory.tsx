"use client";

import { DashboardCard } from "@mr/components/ui/cards/DashboardCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ConsumerData {
  name: string;
  value: number;
  color: string;
  percentage?: number;
}

// Updated label function to show percentage
const renderCustomizedLabel = ({ percentage }: any) => {
  return `${percentage?.toFixed(1)}%`;
};

export function ConsumersByCategory() {
  const [consumerCategories, setConsumerCategories] = useState<Array<ConsumerData>>([
    { name: "Active", value: 0, color: "oklch(0.623 0.214 259.815)" },
    { name: "Disconnected", value: 0, color: "#706868" },
    { name: "Write-off", value: 0, color: "#6ac9f5" },
  ]);

  const totalConsumers = consumerCategories.reduce((sum, category) => sum + category.value, 0);

  // Calculate percentages for each category
  const categoriesWithPercentages = consumerCategories.map((category) => ({
    ...category,
    percentage: totalConsumers > 0 ? (category.value / totalConsumers) * 100 : 0,
  }));

  const { data } = useQuery({
    queryKey: ["consumer-count"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/dashboard/consumer-counts`);
      return res.data;
    },
  });

  useEffect(() => {
    if (data)
      setConsumerCategories([
        { name: "Active", value: data.active, color: "oklch(0.623 0.214 259.815)" },
        { name: "Disconnected", value: data.disconnected, color: "#706868" },
        { name: "Write-off", value: data.writeOff, color: "#6ac9f5" },
      ]);
  }, [data]);

  return (
    <DashboardCard
      title="Consumers by Category"
      subtitle="Total number of consumers per category"
      className="col-span-2 bg-white sm:col-span-1 md:col-span-1 lg:col-span-2 dark:bg-gray-900"
    >
      <div className="relative mb-6 flex h-40 items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoriesWithPercentages}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              innerRadius={50}
              dataKey="value"
            >
              {categoriesWithPercentages.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} className="stroke-white stroke-1" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Simple Center Total */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalConsumers.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
      </div>

      {/* Category Breakdown - Now showing percentages */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {categoriesWithPercentages.map((category) => (
          <div key={category.name} className="text-center">
            <div className="mb-2 flex items-center justify-center">
              <div className="mr-2 size-2 rounded-full" style={{ backgroundColor: category.color }} />
              <span className="text-sm font-medium text-gray-700">{category.name}</span>
            </div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white">
              {category.value.toLocaleString()}
            </div>
            {/* <div className="text-xs text-gray-500">({category.value.toLocaleString()})</div> */}
            <div className="text-xs text-gray-500">({category.percentage?.toFixed(1)}%)</div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
