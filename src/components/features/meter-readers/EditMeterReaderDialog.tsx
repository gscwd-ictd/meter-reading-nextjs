/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import { Button } from "@mr/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@mr/components/ui/Dialog";
import { Dispatch, FunctionComponent, SetStateAction, useEffect } from "react";
import { useMeterReadersStore } from "@mr/components/stores/useMeterReadersStore";
import { SquarePenIcon, Users2Icon } from "lucide-react";
import { MeterReaderTabs } from "./MeterReaderTabs";
import { Employee, MeterReader } from "@mr/lib/types/personnel";
import { toast } from "sonner";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";

type EditMeterReaderDialogProps = {
  editMeterReaderDialogIsOpen: boolean;
  setEditMeterReaderDialogIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedMeterReader: MeterReader;
};

export const EditMeterReaderDialog: FunctionComponent<EditMeterReaderDialogProps> = ({
  editMeterReaderDialogIsOpen,
  setEditMeterReaderDialogIsOpen,
  selectedMeterReader,
}) => {
  const setSelectedEmployee = useMeterReadersStore((state) => state.setSelectedEmployee);

  const selectedEmployee = useMeterReadersStore((state) => state.selectedEmployee);

  const meterReaders = useMeterReadersStore((state) => state.meterReaders);
  const setMeterReaders = useMeterReadersStore((state) => state.setMeterReaders);
  // const selectedMeterReader = useMeterReadersStore((state) => state.selectedMeterReader);
  const setSelectedMeterReader = useMeterReadersStore((state) => state.setSelectedMeterReader);
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
        assignment: selectedEmployee?.assignment!,
      });

      const newEmployees = [...employees];

      setEmployees(newEmployees);
      setMeterReaders(newMeterReaders);
      setEditMeterReaderDialogIsOpen(false);
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
    if (editMeterReaderDialogIsOpen) {
      //! Temporary only, use find but replace it later with /findbyid
      const tempSelectedMeterReader = meterReaders.find(
        (meterReader) => meterReader.companyId === selectedMeterReader?.companyId,
      );

      console.log(selectedMeterReader);

      setSelectedMeterReader(tempSelectedMeterReader);

      setMeterReaderZonebooks(tempSelectedMeterReader?.zonebooks!);
    }
  }, [setEditMeterReaderDialogIsOpen, setSelectedEmployee, editMeterReaderDialogIsOpen, selectedMeterReader]);

  useEffect(() => {
    if (editMeterReaderDialogIsOpen) console.log("From Edit : ", selectedMeterReader);
  }, [selectedMeterReader, editMeterReaderDialogIsOpen]);

  return (
    <Dialog
      open={editMeterReaderDialogIsOpen}
      onOpenChange={() => {
        setEditMeterReaderDialogIsOpen(!editMeterReaderDialogIsOpen);
        setMeterReaderZonebooks([]);
      }}
    >
      <DialogTrigger asChild>
        <button className="flex w-full items-center justify-start gap-2 rounded p-2 text-sm hover:bg-amber-400">
          <SquarePenIcon className="size-4" />
          Update personnel
        </button>
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
          <MeterReaderTabs />
        </div>

        <DialogFooter className="grid grid-cols-2">
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              setEditMeterReaderDialogIsOpen(false);
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
