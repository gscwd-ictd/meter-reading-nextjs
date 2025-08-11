"use client";
import IntradayProgressChart from "@mr/components/features/monitoring/IntraDayProgressChart";
import MeterReaderActivityChart from "@mr/components/features/monitoring/MeterReaderActivirtyProgressChart";
import ProgressChart from "@mr/components/features/monitoring/ProgressChart";
import TodayPieChart from "@mr/components/features/monitoring/TodayPieChart";
import { ChartCard } from "@mr/components/ui/cards/ChartCard";
import { useEffect, useState } from "react";

type Progress = {
  scheduled: number;
  finished: number;
};

type ProgressWithTime = Pick<Progress, "finished"> & {
  time: string;
};

const mockDailyData = {
  scheduled: 15,
  finished: 12,
};

const mockIntradayData = [
  { time: "08:00", finished: 1 },
  { time: "09:00", finished: 3 },
  { time: "10:00", finished: 5 },
  { time: "11:00", finished: 6 },
  { time: "12:00", finished: 7 },
  { time: "13:00", finished: 9 },
  { time: "14:00", finished: 15 },
];

export const ProgressComponent = () => {
  const [daily, setDaily] = useState<Progress>({} as Progress);
  const [intraday, setIntraday] = useState<ProgressWithTime[]>([]);
  const [scheduled, setScheduled] = useState<number>(0);

  useEffect(() => {
    if (mockDailyData) setDaily(mockDailyData);
  }, [setDaily]);

  useEffect(() => {
    if (mockIntradayData) setIntraday(mockIntradayData);
  }, [setIntraday]);

  useEffect(() => {
    if (mockDailyData.scheduled) setScheduled(mockDailyData.scheduled);
  }, [setScheduled]);
  return (
    // <div className="flex flex-1 flex-col gap-5">
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
      <ChartCard>
        <TodayPieChart scheduled={daily.scheduled} finished={daily.finished} />
      </ChartCard>

      <ChartCard>
        <ProgressChart scheduled={daily.scheduled} finished={daily.finished} />
      </ChartCard>
      <ChartCard>
        <IntradayProgressChart scheduled={scheduled} finishedByHour={intraday} />
      </ChartCard>
      <ChartCard>
        <MeterReaderActivityChart />
      </ChartCard>
    </div>
  );
};
