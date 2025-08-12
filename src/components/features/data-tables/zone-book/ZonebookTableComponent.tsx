"use client";

import { AssignAreaZonebookDialog } from "../../zonebook/AssignAreaZonebookDialog";
import { EditAssignAreaZonebookDialog } from "../../zonebook/EditAssignAreaZonebookDialog";
import { ZonebookDataTable } from "./ZonebookDataTable";

export const ZonebookTableComponent = () => {
  return (
    <div className="mt-4">
      <AssignAreaZonebookDialog />
      <EditAssignAreaZonebookDialog />

      <ZonebookDataTable />
    </div>
  );
};
