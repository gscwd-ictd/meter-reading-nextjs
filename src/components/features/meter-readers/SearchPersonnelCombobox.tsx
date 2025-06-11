"use client";

import { useMeterReadersStore } from "@mr/components/stores/useMeterReadersStore";
import { Button } from "@mr/components/ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@mr/components/ui/Command";
import { Popover, PopoverContent, PopoverTrigger } from "@mr/components/ui/Popover";
import { cn } from "@mr/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Check, UserRoundSearchIcon } from "lucide-react";
import { FunctionComponent, useEffect, useState } from "react";
import axios from "axios";
import { Employee } from "@mr/lib/types/personnel";
import { useDebounce } from "@mr/hooks/use-debounce";
import { Avatar, AvatarFallback, AvatarImage } from "@mr/components/ui/Avatar";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";
import { ZonebookFlatSorter } from "@mr/lib/functions/zonebook-flat-sorter";

export const SearchPersonnelCombobox: FunctionComponent = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [searchEmployee, setSearchEmployee] = useState<string>("");
  const debouncedSearchEmployee = useDebounce(searchEmployee, 1500);

  const setSelectedEmployee = useMeterReadersStore((state) => state.setSelectedEmployee);
  const selectedEmployee = useMeterReadersStore((state) => state.selectedEmployee);
  const setSelectedRestDay = useMeterReadersStore((state) => state.setSelectedRestDay);
  const meterReaderZonebooks = useZonebookStore((state) => state.meterReaderZonebooks);
  const setMeterReaderZonebooks = useZonebookStore((state) => state.setMeterReaderZonebooks);
  const zonebooks = useZonebookStore((state) => state.zonebooks);
  const setZonebooks = useZonebookStore((state) => state.setZonebooks);

  const {
    data: employees,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ["get-all-employees"],
    queryFn: async () => {
      const data = await axios.get(
        `${process.env.NEXT_PUBLIC_HRMS_BE}/employees/meter-reading/all-employees?page=1&limit=320`,
      );
      return data;
    },
    enabled: open,
  });

  useEffect(() => {
    if (debouncedSearchEmployee) setSearchEmployee(debouncedSearchEmployee);
  }, [debouncedSearchEmployee]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          size="lg"
          className={`flex w-full justify-start`}
        >
          {selectedEmployee && selectedEmployee !== undefined ? (
            <span className="flex items-center gap-2 text-sm">
              <Avatar className={`ring-background cursor-pointer ring-2`}>
                <AvatarImage
                  src={
                    selectedEmployee?.photoUrl
                      ? `${process.env.NEXT_PUBLIC_HRMS_IMAGES_SERVER}/${selectedEmployee.photoUrl}`
                      : undefined
                  }
                  alt={selectedEmployee.photoUrl}
                  className="object-cover"
                />
                <AvatarFallback>{selectedEmployee?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              {
                employees?.data.items?.find(
                  (employee: Employee) => employee.employeeId === selectedEmployee?.employeeId,
                )?.name
              }
            </span>
          ) : (
            <span className="flex items-center gap-2 text-sm">
              <UserRoundSearchIcon className="text-primary size-5" />
              <span className="text-primary text-sm">Search Employee...</span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full" onWheel={(e) => e.stopPropagation()}>
        {!employees && (isLoading || isPending) ? (
          <div className="text-primary flex w-full justify-center gap-2 font-medium">
            <LoadingSpinner /> Loading...
          </div>
        ) : (
          <Command>
            <CommandInput placeholder="Search employee..." />
            <CommandList className="max-h-60 overflow-y-auto" role="listbox" tabIndex={-1}>
              <CommandEmpty>No employee found.</CommandEmpty>
              <CommandGroup>
                {employees?.data.items.map((employee: Employee, index: number) => (
                  <CommandItem
                    key={employee.companyId}
                    value={employee.name}
                    onSelect={(currentValue) => {
                      if (employee.companyId === selectedEmployee?.companyId) {
                        const tempZonebooks = [...zonebooks];
                        tempZonebooks.concat(meterReaderZonebooks);

                        setSelectedEmployee(undefined);
                        setZonebooks(ZonebookFlatSorter(tempZonebooks));
                        setMeterReaderZonebooks([]);
                      } else {
                        setSelectedEmployee(employee);
                      }
                      setSelectedRestDay(undefined);
                      setSearchEmployee(currentValue === searchEmployee ? "" : currentValue);
                      setOpen(false);
                    }}
                    className={cn("px-2 py-2", index !== 0 && "border-muted border-t")}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className={`ring-background cursor-pointer ring-2`}>
                        <AvatarImage
                          src={
                            employee.photoUrl
                              ? `${process.env.NEXT_PUBLIC_HRMS_IMAGES_SERVER}/${employee.photoUrl}`
                              : undefined
                          }
                          alt={employee.photoUrl}
                          className="object-cover"
                        />
                        <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold">{employee.name}</span>
                        <span className="text-sm text-gray-500">{employee.positionTitle}</span>
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto",
                        searchEmployee.toLowerCase().includes(employee.name.toLowerCase())
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
};
