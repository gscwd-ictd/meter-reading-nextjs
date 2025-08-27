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
import { FunctionComponent, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Employee } from "@mr/lib/types/personnel";
import { Avatar, AvatarFallback, AvatarImage } from "@mr/components/ui/Avatar";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";
import { ZonebookFlatSorter } from "@mr/lib/functions/zonebook-flat-sorter";
import { useFormContext } from "react-hook-form";

export const SearchPersonnelCombobox: FunctionComponent = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [searchEmployee, setSearchEmployee] = useState<string>("");
  const searchPersonnelInputRef = useRef<HTMLInputElement>(null);

  const setSelectedEmployee = useMeterReadersStore((state) => state.setSelectedEmployee);
  const setMobileNumber = useMeterReadersStore((state) => state.setMobileNumber);
  const selectedEmployee = useMeterReadersStore((state) => state.selectedEmployee);
  const setSelectedRestDay = useMeterReadersStore((state) => state.setSelectedRestDay);
  const meterReaderZonebooks = useZonebookStore((state) => state.meterReaderZonebooks);
  const setMeterReaderZonebooks = useZonebookStore((state) => state.setMeterReaderZonebooks);

  const filteredZonebooks = useZonebookStore((state) => state.filteredZonebooks);
  const setTempFilteredZonebooks = useZonebookStore((state) => state.setTempFilteredZonebooks);
  const setZonebooks = useZonebookStore((state) => state.setZonebooks);

  const { setValue } = useFormContext();

  const {
    data: employees,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ["get-all-employees"],
    queryFn: async () => {
      const data = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/meter-readers?status=unassigned`);
      return data;
    },
    enabled: open,
  });

  useEffect(() => {
    if (open) {
      // Delay to ensure CommandInput is mounted
      const timer = setTimeout(() => {
        searchPersonnelInputRef.current?.focus();
      }, 10); // 0–50ms usually works

      return () => clearTimeout(timer);
    }
  }, [open]);

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
                employees?.data?.find(
                  (employee: Employee) => employee.employeeId === selectedEmployee?.employeeId,
                )?.name
              }
            </span>
          ) : (
            <span className="flex items-center gap-2 text-sm">
              <UserRoundSearchIcon className="text-primary size-5" />
              <span className="text-primary text-sm">Search from employee list...</span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" onWheel={(e) => e.stopPropagation()}>
        {!employees && (isLoading || isPending) ? (
          <div className="text-primary flex w-full justify-center gap-2 font-medium">
            <LoadingSpinner /> Loading...
          </div>
        ) : (
          <Command>
            <CommandInput placeholder="Search employee..." ref={searchPersonnelInputRef} />
            <CommandList className="max-h-60 overflow-y-auto" role="listbox" tabIndex={-1}>
              <CommandEmpty>No employee found.</CommandEmpty>
              <CommandGroup>
                {employees?.data.map((employee: Employee, index: number) => (
                  <CommandItem
                    key={employee.employeeId}
                    value={employee.name}
                    onSelect={(currentValue) => {
                      if (employee.employeeId === selectedEmployee?.employeeId) {
                        // this block removes all the selected values if the same employee is being selected in the dropdown

                        setValue("mobileNumber", undefined);
                        setSelectedEmployee(undefined);
                        setZonebooks(ZonebookFlatSorter(meterReaderZonebooks));
                      } else {
                        // this block sets the employee if the same employee is not selected
                        setSelectedEmployee(employee);
                        setValue("employeeId", employee.employeeId);
                      }
                      setTempFilteredZonebooks(ZonebookFlatSorter(filteredZonebooks));
                      setMobileNumber(undefined);
                      setValue("mobileNumber", undefined);
                      setMeterReaderZonebooks([]);
                      setValue("restDay", undefined);
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
