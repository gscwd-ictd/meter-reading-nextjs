"use client";

import { FunctionComponent } from "react";
import { AddAreaDialog } from "../../areas/AddAreaDialog";
import { AreasDataTable } from "./AreasDataTable";
import { Button } from "@mr/components/ui/Button";
import { CirclePlusIcon } from "lucide-react";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";
import { EditAreaDialog } from "../../areas/EditAreaDialog";

export const AreaTableComponent: FunctionComponent = () => {
  const setAddAreaDialogIsOpen = useZonebookStore((state) => state.setAddAreaDialogIsOpen);
  return (
    <>
      <h3 className="mt-5 text-xl font-bold">Area</h3>
      <div className="mb-3 text-base font-medium text-gray-400">List of Areas</div>
      <Button className="mb-3 flex w-fit dark:text-white" onClick={() => setAddAreaDialogIsOpen(true)}>
        <CirclePlusIcon /> Add Area
      </Button>
      <AddAreaDialog />
      <EditAreaDialog />

      <AreasDataTable />
    </>
  );
};
