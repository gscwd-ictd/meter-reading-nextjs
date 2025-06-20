"use client";

import { FunctionComponent, useState } from "react";
import { AddMeterReaderDialog } from "../../meter-readers/AddMeterReaderDialog";
import { MeterReaderDataTable } from "./MeterReaderDataTable";

export const MeterReaderTableComponent: FunctionComponent = () => {
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
        <MeterReaderDataTable />
      </div>
    </>
  );
};
