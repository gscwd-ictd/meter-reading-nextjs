import { DashboardCard } from "@mr/components/ui/cards/DashboardCard";
import { CircleGaugeIcon } from "lucide-react";
import { FunctionComponent } from "react";
import { Styles } from "./styles";
import { Spinner } from "@mr/components/ui/Spinner";

type CardProps = {
  isLoading?: boolean;
  isFetched?: boolean;
  data: number | undefined;
};

export const NewMetersCard: FunctionComponent<CardProps> = ({ data, isFetched, isLoading }) => {
  // useQuery function here

  return (
    <DashboardCard
      title="New Meters"
      // className="border bg-sky-200/90 dark:bg-gray-900"
      // className="border bg-white/50 dark:bg-gray-900"
      className={Styles.light.background}
      titleClassName={Styles.light.titleClassName}
      icon={
        <CircleGaugeIcon className={Styles.light.icon} />
        // text-sky-400
      }
    >
      <div className={Styles.light.description}>
        {isLoading && !isFetched ? (
          <Spinner className="size-10" />
        ) : !isLoading && isFetched && data !== undefined ? (
          data
        ) : (
          "-"
        )}
      </div>
      <div className={Styles.light.text}>New meters for the month</div>
    </DashboardCard>
  );
};
