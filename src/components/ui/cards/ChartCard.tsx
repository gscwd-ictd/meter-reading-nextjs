import { FunctionComponent, PropsWithChildren } from "react";

export const ChartCard: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <div className="relative mx-auto w-full rounded-2xl border bg-white p-6 shadow-sm sm:p-6 md:p-2 lg:p-2 dark:bg-black">
      {children}
    </div>
  );
};
