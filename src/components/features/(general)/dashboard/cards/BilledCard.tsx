import { DashboardCard } from "@mr/components/ui/cards/DashboardCard";
import { ReceiptTextIcon } from "lucide-react";
import { FunctionComponent } from "react";
import { Styles } from "./styles";

export const BilledCard: FunctionComponent = () => {
  // useQuery function here
  return (
    <DashboardCard
      title="Billed"
      // className="border bg-cyan-200/30 dark:bg-gray-900"
      titleClassName={Styles.primary.titleClassName}
      className={Styles.primary.background}
      icon={
        <ReceiptTextIcon className={Styles.primary.icon} />
        // text-cyan-600
      }
    >
      <div className={Styles.primary.description}>1500</div>
      <div className={Styles.primary.text}>Billed for the month</div>
    </DashboardCard>
  );
};
