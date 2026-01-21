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

const TAB_VALUES = {
  BILLED: "billed",
  UNBILLED: "unbilled",
  WITH_REMARKS: "with-remarks",
  NEW_METERS: "new-meters",
} as const;

type TabValue = (typeof TAB_VALUES)[keyof typeof TAB_VALUES];

type MeterReadingReportState = {
  isGenerating: boolean;
  setIsGenerating: Dispatch<SetStateAction<boolean>>;
  selectedTab: TabValue;
  setSelectedTab: Dispatch<SetStateAction<TabValue>>;
  hasFetched: boolean;
  setHasFetched: Dispatch<SetStateAction<boolean>>;
  monthYear: string;
  setMonthYear: Dispatch<SetStateAction<string>>;
  shouldFetch: boolean;
  setShouldFetch: Dispatch<SetStateAction<boolean>>;
};

const MeterReadingReportContext = createContext({} as MeterReadingReportState);

export const MeterReadingReportProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<TabValue>("billed");
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [monthYear, setMonthYear] = useState<string>("");

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
        shouldFetch,
        setShouldFetch,
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
    shouldFetch,
    setShouldFetch,
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
    shouldFetch,
    setShouldFetch,
  };
};
