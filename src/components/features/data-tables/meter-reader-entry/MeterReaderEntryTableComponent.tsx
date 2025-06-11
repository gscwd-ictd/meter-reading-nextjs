"use client";

import { FunctionComponent, useState } from "react";
import { AddMeterReaderDialog } from "../../meter-readers/AddMeterReaderDialog";
import { MeterReaderEntryDataTable } from "./MeterReaderEntryDataTable";

export const PersonnelTableComponent: FunctionComponent = () => {
  const [addMeterReaderDialogIsOpen, setAddMeterReaderDialogIsOpen] = useState<boolean>(false);

  return (
    <>
      <div className="">
        <div className="flex justify-end">
          <AddMeterReaderDialog
            addMeterReaderDialogIsOpen={addMeterReaderDialogIsOpen}
            setAddMeterReaderDialogIsOpen={setAddMeterReaderDialogIsOpen}
          />
        </div>
        <MeterReaderEntryDataTable />
      </div>
    </>
  );
};
