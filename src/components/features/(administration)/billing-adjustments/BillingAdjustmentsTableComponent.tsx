"use client";

import { FunctionComponent, useState } from "react";
import { BillingAdjustmentsDataTable } from "./BillingAdjustmentsDataTable";
import { AddBillingAdjustmentsDialog } from "./AddBillingAdjustmentsDialog";
import { EditBillingAdjustmentsDialog } from "./EditBillingAdjustmentsDialog";

export const BillingAdjustmentsTableComponent: FunctionComponent = () => {
  const [addBillingAdjustmentsDialogIsOpen, setAddBillingAdjustmentsDialogIsOpen] = useState<boolean>(false);

  return (
    <div className="mt-4">
      <EditBillingAdjustmentsDialog />
      <BillingAdjustmentsDataTable
        actionBtn={
          <AddBillingAdjustmentsDialog
            open={addBillingAdjustmentsDialogIsOpen}
            setOpen={setAddBillingAdjustmentsDialogIsOpen}
          />
        }
      />
    </div>
  );
};
