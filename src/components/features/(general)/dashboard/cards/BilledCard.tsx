import { DashboardCard } from "@mr/components/ui/cards/DashboardCard";
import { ReceiptTextIcon } from "lucide-react";
import { FunctionComponent } from "react";
import { Styles } from "./styles";
import { Spinner } from "@mr/components/ui/Spinner";

type CardProps = {
  isLoading?: boolean;
  isFetched?: boolean;
  data: number | undefined;
};

export const BilledCard: FunctionComponent<CardProps> = ({ data, isFetched, isLoading }) => {
  // useQuery function here
  return (
    <DashboardCard
      title="Billed"
      // className="border bg-cyan-200/30 dark:bg-gray-900"
      titleClassName={Styles.gradientBlue.titleClassName}
      className={Styles.gradientBlue.background}
      icon={
        <ReceiptTextIcon className={Styles.gradientBlue.icon} />
        // text-cyan-600
      }
    >
      <div className={Styles.gradientBlue.description}>
        {isLoading && !isFetched ? (
          <Spinner className="size-10" />
        ) : !isLoading && isFetched && data !== undefined ? (
          data
        ) : (
          "-"
        )}
      </div>
      <div className={Styles.gradientBlue.text}>Billed for the month</div>
    </DashboardCard>
  );
};
