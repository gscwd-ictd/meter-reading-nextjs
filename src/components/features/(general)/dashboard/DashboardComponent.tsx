"use client";
import { FunctionComponent } from "react";
import { TotalConsumersCard } from "./TotalConsumersCard";
import { ConsumptionCard } from "./ConsumptionCard";

import { MonthlyProgressCard } from "./cards/MonthlyProgressCard";
import { WithRemarksProgressCard } from "./cards/WithRemarksProgressCard";
import { BilledCard } from "./cards/BilledCard";
import { UnbilledCard } from "./cards/UnbilledCard";
import { NewMetersCard } from "./cards/NewMetersCard";
import { WithRemarksCard } from "./cards/WithRemarksCard";
import { ConsumersByCategory } from "./ConsumersByCategory";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type ReadingCount = {
  billed: number;
  unbilled: number;
  remarks: number;
  newMeters: number;
};

export const DashboardComponent: FunctionComponent = () => {
  const {
    data: monthlyReadingCount,
    isLoading,
    isFetched,
  } = useQuery({
    queryKey: ["monthly-reading-counts"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/dashboard/monthly-reading-counts`);
      return res.data as ReadingCount;
    },
  });
  return (
    <div className="-mb-4 flex h-full w-full flex-1 flex-col gap-4">
      {/* Welcome back  */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xl font-bold text-gray-800 dark:text-white">Welcome back</div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </div>
      </div>

      {/* Four cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4">
        {/* Billed */}
        <BilledCard isLoading={isLoading} isFetched={isFetched} data={monthlyReadingCount?.billed} />

        {/* Unbilled */}
        <UnbilledCard isLoading={isLoading} isFetched={isFetched} data={monthlyReadingCount?.unbilled} />

        {/* With Remarks */}
        <WithRemarksCard isLoading={isLoading} isFetched={isFetched} data={monthlyReadingCount?.remarks} />

        {/* New Meters */}
        <NewMetersCard isLoading={isLoading} isFetched={isFetched} data={monthlyReadingCount?.newMeters} />
      </div>

      {/* Consumption and Consumer Cards */}
      <div className="grid grid-cols-5 gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-5">
        {/* Consumption */}
        <ConsumptionCard />

        {/* Total Consumers */}
        <ConsumersByCategory />
      </div>

      {/* Consumption and Consumer Cards */}
      <div className="grid grid-cols-5 gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-5">
        {/* Monthly Progress */}
        <MonthlyProgressCard />

        {/* With Remarks Details - Fixed scrolling */}
        <WithRemarksProgressCard />
      </div>
    </div>
  );
};
