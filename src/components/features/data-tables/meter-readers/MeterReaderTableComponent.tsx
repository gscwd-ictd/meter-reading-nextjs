"use client";

import { FunctionComponent, useState } from "react";
import { AddMeterReaderDialog } from "../../(general)/meter-readers/AddMeterReaderDialog";
import { MeterReaderDataTable } from "./MeterReaderDataTable";

export const MeterReaderTableComponent: FunctionComponent = () => {
  const [addMeterReaderDialogIsOpen, setAddMeterReaderDialogIsOpen] = useState<boolean>(false);

  return (
    <div className="mt-4">
      <MeterReaderDataTable
        actionBtn={
          <AddMeterReaderDialog
            addMeterReaderDialogIsOpen={addMeterReaderDialogIsOpen}
            setAddMeterReaderDialogIsOpen={setAddMeterReaderDialogIsOpen}
          />
        }
      />
    </div>
  );
};
