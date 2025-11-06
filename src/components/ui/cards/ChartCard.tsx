import { FunctionComponent, MouseEventHandler, PropsWithChildren } from "react";
import { Button } from "../Button";

type ChartCardProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  title: string;
} & PropsWithChildren;

export const ChartCard: FunctionComponent<ChartCardProps> = ({ children, title, onClick }) => {
  return (
    <div className="group relative mx-auto w-full overflow-hidden rounded-2xl border bg-white p-6 shadow-sm sm:p-6 md:p-2 lg:p-4 dark:bg-black">
      {/* Shine effect – same as DashboardCard */}
      <span className="shine pointer-events-none absolute inset-0 z-10 -translate-x-full bg-gradient-to-r from-transparent via-white/80 to-slate-700/20 dark:to-transparent" />
      <h2 className="mt-5 mb-4 px-2 text-start text-lg font-semibold">{title}</h2>
      {onClick && (
        <Button
          onClick={onClick}
          className="hover:text-primary text-primary absolute top-2 right-2 rounded-lg opacity-0 group-hover:opacity-70 active:text-blue-600"
          size="sm"
          variant="ghost"
        >
          <span className="flex items-center justify-center gap-1 text-xs">View more</span>
        </Button>
      )}
      {children}
    </div>
  );
};
