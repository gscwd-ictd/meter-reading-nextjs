import { FunctionComponent, MouseEventHandler, PropsWithChildren } from "react";
import { Button } from "../Button";
import { ArrowRightCircleIcon } from "lucide-react";

type ChartCardProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
} & PropsWithChildren;

export const ChartCard: FunctionComponent<ChartCardProps> = ({ children, onClick }) => {
  return (
    <div className="relative mx-auto w-full rounded-2xl border bg-white p-6 shadow-sm sm:p-6 md:p-2 lg:p-2 dark:bg-black">
      {onClick && (
        <Button
          onClick={onClick}
          className="hover:text-primary absolute top-2 right-2 rounded-lg text-gray-700 active:text-blue-600"
          size="sm"
          variant="ghost"
        >
          <span className="flex items-center justify-center gap-1 text-xs">
            <ArrowRightCircleIcon className="size-full" />
          </span>
        </Button>
      )}
      {children}
    </div>
  );
};
