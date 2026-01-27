import { DashboardCard } from "@mr/components/ui/cards/DashboardCard";
import { CircleGaugeIcon } from "lucide-react";
import { FunctionComponent } from "react";
import { Styles } from "./styles";

export const NewMetersCard: FunctionComponent = () => {
  // useQuery function here

  return (
    <DashboardCard
      title="New Meters"
      // className="border bg-sky-200/90 dark:bg-gray-900"
      // className="border bg-white/50 dark:bg-gray-900"
      className={Styles.dark.background}
      titleClassName={Styles.dark.titleClassName}
      icon={
        <CircleGaugeIcon className={Styles.dark.icon} />
        // text-sky-400
      }
    >
      <div className={Styles.dark.description}>5</div>
      <div className={Styles.dark.text}>New meters for the month</div>
    </DashboardCard>
  );
};
