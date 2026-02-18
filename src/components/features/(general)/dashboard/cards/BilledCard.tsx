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
      titleClassName={Styles.gradientBlue.titleClassName}
      className={Styles.gradientBlue.background}
      icon={
        <ReceiptTextIcon className={Styles.gradientBlue.icon} />
        // text-cyan-600
      }
    >
      <div className={Styles.gradientBlue.description}>1500</div>
      <div className={Styles.gradientBlue.text}>Billed for the month</div>
    </DashboardCard>
  );
};
