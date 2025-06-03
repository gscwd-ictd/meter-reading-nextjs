/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import { Button } from "@mr/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@mr/components/ui/Dialog";
import { FunctionComponent, useEffect } from "react";
import { useMeterReadersStore } from "@mr/components/stores/useMeterReadersStore";
import { PlusCircleIcon, Users2Icon } from "lucide-react";
import { MeterReaderTabs } from "./MeterReaderTabs";
import { SearchPersonnelCombobox } from "./SearchPersonnelCombobox";
import { Employee } from "@mr/lib/types/personnel";
import { toast } from "sonner";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";

export const AddMeterReadersDialog: FunctionComponent = () => {
  const setSelectedEmployee = useMeterReadersStore((state) => state.setSelectedEmployee);
  const addMeterReadersDialogIsOpen = useMeterReadersStore((state) => state.addMeterReadersDialogIsOpen);
  const selectedEmployee = useMeterReadersStore((state) => state.selectedEmployee);
  const setAddMeterReadersDialogIsOpen = useMeterReadersStore(
    (state) => state.setAddMeterReadersDialogIsOpen,
  );
  const meterReaders = useMeterReadersStore((state) => state.meterReaders);
  const setMeterReaders = useMeterReadersStore((state) => state.setMeterReaders);
  const employees = useMeterReadersStore((state) => state.employees);
  const setEmployees = useMeterReadersStore((state) => state.setEmployees);
  const selectedRestDay = useMeterReadersStore((state) => state.selectedRestDay);
  const setSelectedRestDay = useMeterReadersStore((state) => state.setSelectedRestDay);
  const setMeterReaderZonebooks = useZonebookStore((state) => state.setMeterReaderZonebooks);
  const meterReaderZonebooks = useZonebookStore((state) => state.meterReaderZonebooks);

  const zonebookSelectorIsOpen = useZonebookStore((state) => state.zonebookSelectorIsOpen);

  const submitPersonnel = () => {
    if (selectedRestDay !== undefined) {
      const newMeterReaders = [...meterReaders];
      newMeterReaders?.push({
        ...selectedEmployee,
        name: selectedEmployee?.name!,
        mobileNumber: selectedEmployee?.mobileNumber!,
        positionTitle: selectedEmployee?.positionTitle!,
        companyId: selectedEmployee?.companyId!,
        employeeId: selectedEmployee?.employeeId!,
        photoUrl: selectedEmployee?.photoUrl!,
        restDay: selectedRestDay,
        zonebooks: meterReaderZonebooks,
      });

      const newEmployees = [...employees];

      setEmployees(newEmployees);
      setMeterReaders(newMeterReaders);
      setAddMeterReadersDialogIsOpen(false);
      setSelectedRestDay(undefined);
      setMeterReaderZonebooks([]);

      toast.success("Success", {
        description: "You have successfully added a meter reader!",
        position: "top-right",
      });
    } else toast.error("No rest day", { description: "Please select a rest day", position: "top-right" });
  };

  // set the selected employee to undefined when the modal is closed
  useEffect(() => {
    if (addMeterReadersDialogIsOpen) setSelectedEmployee(undefined);
  }, [addMeterReadersDialogIsOpen]);

  return (
    <Dialog
      open={addMeterReadersDialogIsOpen}
      onOpenChange={() => {
        setAddMeterReadersDialogIsOpen(!addMeterReadersDialogIsOpen);
        setMeterReaderZonebooks([]);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusCircleIcon />
          Add personnel
        </Button>
      </DialogTrigger>
      <DialogContent
        className="h-full max-w-full overflow-y-auto sm:h-full md:h-full lg:h-auto"
        onInteractOutside={(e) => {
          if (zonebookSelectorIsOpen) e.preventDefault();
        }}
      >
        <DialogHeader className="flex flex-col gap-0">
          <DialogTitle className="text-primary flex items-center gap-1 text-xl font-bold">
            <Users2Icon className="size-5" /> Personnel
          </DialogTitle>

          <DialogDescription className="text-gray-500">Add new meter reader</DialogDescription>
        </DialogHeader>
        <div className="">
          <SearchPersonnelCombobox />
          <MeterReaderTabs />
        </div>

        <DialogFooter className="grid grid-cols-2">
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              setAddMeterReadersDialogIsOpen(false);
              setSelectedEmployee({} as Employee);
            }}
          >
            Cancel
          </Button>

          <Button size="lg" disabled={!selectedEmployee ? true : false} onClick={submitPersonnel}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
