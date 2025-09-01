"use client";

import { AssignAreaZonebookDialog } from "../../(general)/zonebook/AssignAreaZonebookDialog";
import { EditAssignAreaZonebookDialog } from "../../(general)/zonebook/EditAssignAreaZonebookDialog";
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
