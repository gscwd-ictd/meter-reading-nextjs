import { DashboardCard } from "@mr/components/ui/cards/DashboardCard";
import { SendIcon } from "lucide-react";
import { FunctionComponent } from "react";
import { Styles } from "./styles";

export const UnbilledCard: FunctionComponent = () => {
  // useQuery function here

  return (
    <DashboardCard
      title="Unbilled"
      // className="border bg-pink-100/70 dark:bg-gray-900"
      titleClassName={Styles.light.titleClassName}
      className={Styles.light.background}
      icon={<SendIcon className={Styles.light.icon} />}
      // text-pink-400
    >
      <div className={Styles.light.description}>1000</div>
      <div className={Styles.light.text}>Unbilled for the month</div>
    </DashboardCard>
  );
};
