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
    <div className="mt-4 flex w-full flex-col gap-6 sm:gap-4 md:gap-4 lg:gap-6">
      {/* Welcome */}
      <div className="mb-1 flex items-center justify-between">
        <div className="text-xl font-bold text-gray-800 dark:text-white">Welcome back</div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 sm:gap-4 md:grid-cols-1 md:gap-4 lg:grid-cols-4 lg:gap-6">
        {/* Billed */}
        <BilledCard />

        {/* Unbilled */}
        <UnbilledCard />

        {/* With Remarks */}
        <WithRemarksCard />

        {/* New Meters */}
        <NewMetersCard />
      </div>

      {/* Consumers & Readings Section */}
      <div className="grid grid-cols-1 gap-6 sm:gap-4 md:gap-4 lg:grid-cols-5 lg:gap-6">
        {/* Consumption */}
        <ConsumptionCard />

        {/* Total Consumers */}
        {/* <TotalConsumersCard /> */}
        <ConsumersByCategory />
      </div>

      {/* Bottom Part */}
      <div className="grid min-h-0 grid-cols-1 gap-6 sm:gap-4 md:gap-4 lg:grid-cols-5 lg:gap-6">
        {/* Monthly Progress */}
        <MonthlyProgressCard />

        {/* With Remarks Details - Fixed scrolling */}
        <WithRemarksProgressCard />
      </div>
    </div>
  );
};
