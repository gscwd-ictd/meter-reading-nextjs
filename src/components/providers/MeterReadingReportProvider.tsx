"use client";

import {
  createContext,
  Dispatch,
  FunctionComponent,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";

export const TAB_VALUES = {
  BILLED: "billed",
  UNBILLED: "unbilled",
  WITH_REMARKS: "with-remarks",
  NEW_METERS: "new-meters",
} as const;

export type TabValue = (typeof TAB_VALUES)[keyof typeof TAB_VALUES];

type MeterReadingReportState = {
  isGenerating: boolean;
  setIsGenerating: Dispatch<SetStateAction<boolean>>;
  selectedTab: TabValue;
  setSelectedTab: Dispatch<SetStateAction<TabValue>>;
  hasFetched: boolean;
  setHasFetched: Dispatch<SetStateAction<boolean>>;
  monthYear: string | null;
  setMonthYear: Dispatch<SetStateAction<string | null>>;
};

const MeterReadingReportContext = createContext({} as MeterReadingReportState);

export const MeterReadingReportProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<TabValue>("billed");
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [monthYear, setMonthYear] = useState<string | null>(null);

  return (
    <MeterReadingReportContext.Provider
      value={{
        isGenerating,
        setIsGenerating,
        selectedTab,
        setSelectedTab,
        hasFetched,
        setHasFetched,
        monthYear,
        setMonthYear,
      }}
    >
      {children}
    </MeterReadingReportContext.Provider>
  );
};

export const useMeterReadingReportContext = () => {
  const {
    isGenerating,
    setIsGenerating,
    selectedTab,
    setSelectedTab,
    hasFetched,
    setHasFetched,
    monthYear,
    setMonthYear,
  } = useContext(MeterReadingReportContext);

  return {
    isGenerating,
    setIsGenerating,
    selectedTab,
    setSelectedTab,
    hasFetched,
    setHasFetched,
    monthYear,
    setMonthYear,
  };
};
