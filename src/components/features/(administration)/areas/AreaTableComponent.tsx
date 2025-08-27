"use client";

import { FunctionComponent } from "react";
import { AddAreaDialog } from "./AddAreaDialog";
import { EditAreaDialog } from "./EditAreaDialog";
import { AreasDataTable } from "../../data-tables/areas/AreasDataTable";

export const AreaTableComponent: FunctionComponent = () => {
  return (
    <div className="mt-4">
      <AddAreaDialog />
      <EditAreaDialog />

      <AreasDataTable />
    </div>
  );
};
