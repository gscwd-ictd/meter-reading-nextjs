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

type MeterReadingReportState = {
  isSubmitted: boolean;
  setIsSubmitted: Dispatch<SetStateAction<boolean>>;
};

const MeterReadingReportContext = createContext({} as MeterReadingReportState);

export const MeterReadingReportProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  return (
    <MeterReadingReportContext.Provider value={{ isSubmitted, setIsSubmitted }}>
      {children}
    </MeterReadingReportContext.Provider>
  );
};

export const useMeterReadingReportContext = () => {
  const { isSubmitted, setIsSubmitted } = useContext(MeterReadingReportContext);

  return { isSubmitted, setIsSubmitted };
};
