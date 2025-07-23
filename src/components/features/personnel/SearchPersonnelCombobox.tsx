"use client";

import { usePersonnelStore } from "@mr/components/stores/usePersonnelStore";
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
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { Check, User2Icon } from "lucide-react";
import { FunctionComponent, useEffect, useState } from "react";
import axios from "axios";
import { Employee } from "@mr/lib/types/personnel";
import { useDebounce } from "@mr/hooks/useDebounce";
import { Avatar, AvatarFallback, AvatarImage } from "@mr/components/ui/Avatar";

export const SearchPersonnelCombobox: FunctionComponent = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [searchEmployee, setSearchEmployee] = useState<string>("");
  const debouncedSearchEmployee = useDebounce(searchEmployee, 1500);

  const setSelectedEmployee = usePersonnelStore((state) => state.setSelectedEmployee);
  const selectedEmployee = usePersonnelStore((state) => state.selectedEmployee);
  const setSelectedRestDay = usePersonnelStore((state) => state.setSelectedRestDay);

  const { data: employees } = useQuery({
    queryKey: ["get-all-employees"],
    queryFn: async () => {
      const data = await axios.get(
        `${process.env.NEXT_PUBLIC_HRMS_BE}/employees/meter-reading/all-employees?page=1&limit=320`
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
          className={`w-full justify-between h-[3rem] border border-gray-200`}
        >
          {selectedEmployee && selectedEmployee !== undefined ? (
            <span className="flex gap-2 items-center text-sm">
              <User2Icon className="size-6 text-primary" />
              {
                employees?.data.items?.find(
                  (employee: Employee) => employee.employeeId === selectedEmployee?.employeeId
                )?.name
              }
            </span>
          ) : (
            <span className="flex items-center gap-2 text-sm">
              <MagnifyingGlassIcon className="size-6 text-primary" />
              <span className="text-sm text-gray-700">Search Employee...</span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full" onWheel={(e) => e.stopPropagation()}>
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
                      setSelectedEmployee(undefined);
                    } else {
                      setSelectedEmployee(employee);
                    }
                    setSelectedRestDay(undefined);
                    setSearchEmployee(currentValue === searchEmployee ? "" : currentValue);
                    setOpen(false);
                  }}
                  className={cn("px-2 py-2", index !== 0 && "border-t border-muted")}
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
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
