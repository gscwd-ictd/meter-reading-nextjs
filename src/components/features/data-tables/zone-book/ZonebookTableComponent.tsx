"use client";

import { AssignAreaZonebookDialog } from "../../zonebook/AssignAreaZonebookDialog";
import { ZonebookDataTable } from "./ZonebookDataTable";

export const ZonebookTableComponent = () => {
  return (
    <>
      <h3 className="mt-5 text-xl font-bold">Zone & Books</h3>
      <div className="mb-3 text-base font-medium text-gray-400">List of Zones & Books</div>
      <AssignAreaZonebookDialog />

      <ZonebookDataTable />
    </>
  );
};
