import { AddPersonnelDialog } from "../../personnel/AddPersonnelDialog";
import { PersonnelDataTable } from "./PersonnelDataTable";

export const PersonnelTableComponent = () => {
  return (
    <>
      <div className="">
        <div className="flex justify-end">
          <AddPersonnelDialog />
        </div>
        <PersonnelDataTable />
      </div>
    </>
  );
};
