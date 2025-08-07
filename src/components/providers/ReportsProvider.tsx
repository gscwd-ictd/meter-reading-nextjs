import { Report } from "@mr/lib/enums/reports";
import {
  createContext,
  Dispatch,
  FunctionComponent,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";

export type ReportsContextType = {
  selectedReport: Report | undefined;
  setSelectedReport: Dispatch<SetStateAction<Report | undefined>>;
};

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export const ReportsProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [selectedReport, setSelectedReport] = useState<Report | undefined>(undefined);

  return (
    <ReportsContext.Provider value={{ selectedReport, setSelectedReport }}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReportsContext = () => {
  const context = useContext(ReportsContext);

  if (!context) {
    throw new Error("useReportsContext must be used within the provider");
  }
  return context;
};
