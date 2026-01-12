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
  isSubmitted: boolean;
  setIsSubmitted: Dispatch<SetStateAction<boolean>>;
  selectedTab: TabValue;
  setSelectedTab: Dispatch<SetStateAction<TabValue>>;
  fetchStatus: string;
  setFetchStatus: Dispatch<SetStateAction<string>>;
};

const MeterReadingReportContext = createContext({} as MeterReadingReportState);

export const MeterReadingReportProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<TabValue>("billed");
  const [fetchStatus, setFetchStatus] = useState<string>("");

  return (
    <MeterReadingReportContext.Provider
      value={{ isSubmitted, setIsSubmitted, selectedTab, setSelectedTab, fetchStatus, setFetchStatus }}
    >
      {children}
    </MeterReadingReportContext.Provider>
  );
};

export const useMeterReadingReportContext = () => {
  const { isSubmitted, setIsSubmitted, selectedTab, setSelectedTab, fetchStatus, setFetchStatus } =
    useContext(MeterReadingReportContext);

  return { isSubmitted, setIsSubmitted, selectedTab, setSelectedTab, fetchStatus, setFetchStatus };
};
