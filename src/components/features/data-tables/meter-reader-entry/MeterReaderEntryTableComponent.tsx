import { AddMeterReadersDialog } from "../../meter-readers/AddMeterReadersDialog";
import { MeterReaderEntryDataTable } from "./MeterReaderEntryDataTable";

export const PersonnelTableComponent = () => {
  return (
    <>
      <div className="">
        <div className="flex justify-end">
          <AddMeterReadersDialog />
        </div>
        <MeterReaderEntryDataTable />
      </div>
    </>
  );
};
