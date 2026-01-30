import { SimpleDataTable } from "@mr/components/ui/simple-data-table/SimpleDataTable";
import { Zonebook } from "@mr/lib/types/zonebook";
import { FunctionComponent, useState } from "react";
import { useAssignedZonebooksColumns } from "./ViewAssignedZonebooksColumns";

type ViewAssignedZonebooksDataTableProps = {
  data: Zonebook[];
};
export const ViewAssignedZonebooksDataTable: FunctionComponent<ViewAssignedZonebooksDataTableProps> = ({
  data,
}) => {
  const [assignedZonebooks] = useState<Zonebook[]>([]);

  const assignedZonebooksColumns = useAssignedZonebooksColumns(assignedZonebooks);

  return (
    <div className="flex h-full w-full flex-1 flex-col gap-2 p-2">
      <SimpleDataTable data={data} columns={assignedZonebooksColumns} title="" pageSize={15} />
    </div>
  );
};
