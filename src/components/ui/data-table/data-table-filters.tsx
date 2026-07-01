import { Table } from "@tanstack/react-table";
import { Button } from "@mr/components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@mr/components/ui/Select";
import { X } from "lucide-react";

interface DataTableFiltersProps<T> {
  table: Table<T>;
  columnFilterOptions?: Array<{
    id: string;
    title: string;
    options: Array<{ label: string; value: string }>;
  }>;
}

export function DataTableFilters<T>({ table, columnFilterOptions }: DataTableFiltersProps<T>) {
  if (!columnFilterOptions?.length) return null;

  const activeFilters = columnFilterOptions.filter((option) => table.getColumn(option.id)?.getFilterValue());

  const clearAllFilters = () => {
    columnFilterOptions.forEach((option) => {
      table.getColumn(option.id)?.setFilterValue(undefined);
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {columnFilterOptions.map((filter) => {
        const column = table.getColumn(filter.id);
        const currentValue = column?.getFilterValue() as string;

        return (
          <Select
            key={filter.id}
            value={currentValue || "all"}
            onValueChange={(value) => {
              column?.setFilterValue(value === "all" ? undefined : value);
            }}
          >
            <SelectTrigger className="h-8 w-[150px]">
              <SelectValue placeholder={`Filter by ${filter.title}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {filter.title}s</SelectItem>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      })}

      {activeFilters.length > 0 && (
        <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8 px-2">
          <X className="mr-1 h-3 w-3" />
          Clear filters ({activeFilters.length})
        </Button>
      )}
    </div>
  );
}
