import { Table } from "@tanstack/react-table";
import { Checkbox } from "@mr/components/ui/Checkbox";

type DataTbaleSelectableHeaderProps<T> = {
  table: Table<T>;
};

export function DataTableSelectableTableHeader<T>({ table }: DataTbaleSelectableHeaderProps<T>) {
  return (
    <Checkbox
      checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  );
}
