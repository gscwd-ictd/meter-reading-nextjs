import { DashboardCard } from "@mr/components/ui/cards/DashboardCard";
import { TextQuoteIcon } from "lucide-react";
import { FunctionComponent } from "react";
import { Styles } from "./styles";
import { Spinner } from "@mr/components/ui/Spinner";

type CardProps = {
  isLoading?: boolean;
  isFetched?: boolean;
  data: number | undefined;
};

export const WithRemarksCard: FunctionComponent<CardProps> = ({ data, isFetched, isLoading }) => {
  // useQuery function here

  return (
    <DashboardCard
      title="With Remarks"
      // className="border bg-violet-200/60 dark:bg-gray-900"
      className={Styles.glassBlue.background}
      titleClassName={Styles.glassBlue.titleClassName}
      icon={
        <TextQuoteIcon className={Styles.glassBlue.icon} />
        // text-violet-400
      }
    >
      <div className={Styles.glassBlue.description}>
        {isLoading && !isFetched ? (
          <Spinner className="size-10" />
        ) : !isLoading && isFetched && data !== undefined ? (
          data
        ) : (
          "-"
        )}
      </div>
      <div className={Styles.glassBlue.text}>With remarks for the month</div>
    </DashboardCard>
  );
};
