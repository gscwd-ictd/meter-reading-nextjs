import { SquarePenIcon } from "lucide-react";
import { FunctionComponent } from "react";
import { BillingAdjustment } from "@mr/lib/types/billing-adjustment";
import { useBillingAdjustmentsStore } from "@mr/components/stores/useBillingAdjustmentsStore";
import { DeleteBillingAdjustmentsDialog } from "./DeleteBillingAdjustmentsDialog";

type BillingAdjustmentsRowActionsProps = {
  details: BillingAdjustment;
};

export const BillingAdjustmentsRowActions: FunctionComponent<BillingAdjustmentsRowActionsProps> = ({
  details,
}) => {
  const setEditBillingAdjustmentsDialogIsOpen = useBillingAdjustmentsStore(
    (state) => state.setEditBillingAdjustmentsDialogIsOpen,
  );
  const setSelectedBillAdjustment = useBillingAdjustmentsStore((state) => state.setSelectedBillAdjustment);

  return (
    <>
      <div className="flex gap-2">
        <SquarePenIcon
          className="bg-primary size-8 rounded p-2 text-white hover:cursor-pointer"
          role="button"
          onClick={() => {
            setEditBillingAdjustmentsDialogIsOpen(true);
            setSelectedBillAdjustment(details);
          }}
        />

        <DeleteBillingAdjustmentsDialog details={details} />
      </div>
    </>
  );
};
