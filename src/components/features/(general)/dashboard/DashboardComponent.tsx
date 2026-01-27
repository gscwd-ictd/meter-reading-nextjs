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

export const DashboardComponent: FunctionComponent = () => {
  return (
    <div className="flex h-full w-full flex-1 flex-col gap-4">
      {/* Welcome back  */}
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold text-gray-800 dark:text-white">Welcome back</div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </div>
      </div>

      {/* Four cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4">
        {/* Billed */}
        <BilledCard />

        {/* Unbilled */}
        <UnbilledCard />

        {/* With Remarks */}
        <WithRemarksCard />

        {/* New Meters */}
        <NewMetersCard />
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
