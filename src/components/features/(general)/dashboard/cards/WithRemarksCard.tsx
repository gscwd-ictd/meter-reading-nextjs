import { DashboardCard } from "@mr/components/ui/cards/DashboardCard";
import { TextQuoteIcon } from "lucide-react";
import { FunctionComponent } from "react";
import { Styles } from "./styles";

export const WithRemarksCard: FunctionComponent = () => {
  // useQuery function here

  return (
    <DashboardCard
      title="With Remarks"
      // className="border bg-violet-200/60 dark:bg-gray-900"
      className={Styles.dark.background}
      titleClassName={Styles.dark.titleClassName}
      icon={
        <TextQuoteIcon className={Styles.dark.icon} />
        // text-violet-400
      }
    >
      <div className={Styles.dark.description}>58</div>
      <div className={Styles.dark.text}>With remarks for the month</div>
    </DashboardCard>
  );
};
