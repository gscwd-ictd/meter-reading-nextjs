"use client";

import { FunctionComponent } from "react";
import { AddAreaDialog } from "./AddAreaDialog";
import { AreasDataTable } from "../data-tables/areas/AreasDataTable";
import { EditAreaDialog } from "./EditAreaDialog";

export const AreaTableComponent: FunctionComponent = () => {
  return (
    <div className="mt-4">
      <AddAreaDialog />
      <EditAreaDialog />

      <AreasDataTable />
    </div>
  );
};
