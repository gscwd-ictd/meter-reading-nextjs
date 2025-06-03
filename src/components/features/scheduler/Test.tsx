"use client";

import { FunctionComponent, useState } from "react";
import { useScheduler } from "./useScheduler";
import { holidays } from "./holidays";

export const Test: FunctionComponent = () => {
  const [datesToSplit, setDatesToSplit] = useState<Date[]>([new Date(2025, 5, 21)]);

  const scheduler = useScheduler(holidays, [new Date(1, 1)]);

  // fetch from db
  // case 1: no schedule from db
  const schedule = scheduler.splitDates(datesToSplit);
  const withMeterReader = scheduler.assignMeterReaders(schedule); // -> save to db

  //const schedule = scheduler.assignMeterReaders({ schedule: undefined, datesToSplit });

  // 1. schedule
  // 2. dates to split
  // 3. meter readers

  console.log(schedule);

  return <></>;
};
