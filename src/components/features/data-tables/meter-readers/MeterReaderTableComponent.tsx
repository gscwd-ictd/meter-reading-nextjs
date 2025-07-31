"use client";

import { FunctionComponent, useState } from "react";
import { AddMeterReaderDialog } from "../../meter-readers/AddMeterReaderDialog";
import { MeterReaderDataTable } from "./MeterReaderDataTable";

export const MeterReaderTableComponent: FunctionComponent = () => {
  const [addMeterReaderDialogIsOpen, setAddMeterReaderDialogIsOpen] = useState<boolean>(false);

  return (
    <>
      <div className="flex justify-start pb-1">
        <AddMeterReaderDialog
          addMeterReaderDialogIsOpen={addMeterReaderDialogIsOpen}
          setAddMeterReaderDialogIsOpen={setAddMeterReaderDialogIsOpen}
        />
      </div>
      <MeterReaderDataTable />
    </>
  );
};
