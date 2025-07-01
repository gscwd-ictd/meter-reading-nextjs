import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Column } from "@tanstack/react-table";

export function DateRangeFilter<TData>({ column }: { column: Column<TData, unknown> }) {
  const columnFilterValue = column.getFilterValue() as [string, string] | undefined;

  return (
    <div className="flex gap-2">
      <div className="flex flex-row items-center gap-2 whitespace-nowrap">
        <Label htmlFor="from">Date From</Label>
        <Input
          type="date"
          id="from"
          value={(columnFilterValue?.[0] ?? "") as string}
          onChange={(e) => {
            column.setFilterValue((old: [string, string]) => [e.target.value, old?.[1]]);
          }}
          className="w-36 rounded border p-1 text-sm"
        />
      </div>

      <div className="flex flex-row items-center gap-2 whitespace-nowrap">
        <Label htmlFor="to">Date To</Label>
        <Input
          type="date"
          id="to"
          value={(columnFilterValue?.[1] ?? "") as string}
          onChange={(e) => {
            column.setFilterValue((old: [string, string]) => [old?.[0], e.target.value]);
          }}
          className="w-36 rounded border p-1 text-sm"
        />
      </div>
    </div>
  );
}
