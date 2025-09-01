"use client";
import IntradayProgressChart from "@mr/components/features/(monitoring)/monitoring/IntraDayProgressChart";
import MeterReaderActivityChart from "@mr/components/features/(monitoring)/monitoring/MeterReaderActivirtyProgressChart";
import ProgressChart from "@mr/components/features/(monitoring)/monitoring/ProgressChart";
import TodayPieChart from "@mr/components/features/(monitoring)/monitoring/TodayPieChart";
import { ChartCard } from "@mr/components/ui/cards/ChartCard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Progress = {
  scheduled: number;
  finished: number;
};

type ProgressWithTime = Pick<Progress, "finished"> & {
  time: string;
};

const mockDailyData = {
  scheduled: 350,
  finished: 320,
};

const mockIntradayData = [
  { time: "08:00", finished: 60 },
  { time: "09:00", finished: 50 },
  { time: "10:00", finished: 70 },
  { time: "11:00", finished: 50 },
  { time: "12:00", finished: 30 },
  { time: "13:00", finished: 20 },
  { time: "14:00", finished: 30 },
];

export const ProgressComponent = () => {
  const [daily, setDaily] = useState<Progress>({} as Progress);
  const [intraday, setIntraday] = useState<ProgressWithTime[]>([]);
  const [scheduled, setScheduled] = useState<number>(0);

  const router = useRouter();

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
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
      <ChartCard
        onClick={() => {
          router.push("/progress/zonebooks");
        }}
      >
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
