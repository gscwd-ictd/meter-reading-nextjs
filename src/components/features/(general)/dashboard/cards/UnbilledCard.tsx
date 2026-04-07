import { DashboardCard } from "@mr/components/ui/cards/DashboardCard";
import { SendIcon } from "lucide-react";
import { FunctionComponent } from "react";
import { Styles } from "./styles";
import { Spinner } from "@mr/components/ui/Spinner";

type CardProps = {
  isLoading?: boolean;
  isFetched?: boolean;
  data: number | undefined;
};

export const UnbilledCard: FunctionComponent<CardProps> = ({ data, isFetched, isLoading }) => {
  // useQuery function here

  return (
    <DashboardCard
      title="Unbilled"
      // className="border bg-pink-100/70 dark:bg-gray-900"
      titleClassName={Styles.glass.titleClassName}
      className={Styles.glass.background}
      icon={<SendIcon className={Styles.glass.icon} />}
      // text-pink-400
    >
      <div className={Styles.glass.description}>
        {isLoading && !isFetched ? (
          <Spinner className="size-10" />
        ) : !isLoading && isFetched && data !== undefined ? (
          data
        ) : (
          "-"
        )}
      </div>
      <div className={Styles.glass.text}>Unbilled for the month</div>
    </DashboardCard>
  );
};
