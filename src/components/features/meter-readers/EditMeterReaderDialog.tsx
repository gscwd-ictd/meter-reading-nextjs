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
import { Employee, MeterReader } from "@mr/lib/types/personnel";
import { toast } from "sonner";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";
import { EditMeterReaderTabs } from "./EditMeterReaderTabs";

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
  const setSelectedMeterReader = useMeterReadersStore((state) => state.setSelectedMeterReader);
  const selectedRestDay = useMeterReadersStore((state) => state.selectedRestDay);
  const setSelectedRestDay = useMeterReadersStore((state) => state.setSelectedRestDay);
  const setMeterReaderZonebooks = useZonebookStore((state) => state.setMeterReaderZonebooks);
  const meterReaderZonebooks = useZonebookStore((state) => state.meterReaderZonebooks);
  const zonebookSelectorIsOpen = useZonebookStore((state) => state.zonebookSelectorIsOpen);

  const submitPersonnel = () => {
    if (selectedRestDay !== undefined) {
      setSelectedMeterReader({
        ...selectedMeterReader,
        name: selectedMeterReader?.name!,
        mobileNumber: selectedMeterReader?.mobileNumber!,
        positionTitle: selectedMeterReader?.positionTitle!,
        companyId: selectedMeterReader?.companyId!,
        employeeId: selectedMeterReader?.employeeId!,
        photoUrl: selectedMeterReader?.photoUrl!,
        restDay: selectedRestDay,
        zonebooks: meterReaderZonebooks,
        assignment: selectedMeterReader?.assignment!,
      });

      setMeterReaders(
        meterReaders.map((meterReader) => {
          if (meterReader.employeeId) {
            return { ...meterReader, restDay: selectedRestDay, zonebooks: meterReaderZonebooks };
          }
          return meterReader;
        }),
      );
      setEditMeterReaderDialogIsOpen(false);
      setSelectedRestDay(undefined);
      setSelectedMeterReader(undefined);
      setMeterReaderZonebooks([]);

      toast.success("Success", {
        description: "You have successfully updated this meter reader!",
        position: "top-right",
      });
    } else toast.error("No rest day", { description: "Please select a rest day", position: "top-right" });
  };

  // set the selected employee to undefined when the modal is closed
  useEffect(() => {
    if (editMeterReaderDialogIsOpen) {
      //! Temporary only, use find but replace it later with /findbyid
      const tempSelectedMeterReader = meterReaders.find(
        (meterReader) => meterReader.employeeId === selectedMeterReader?.employeeId,
      );

      setSelectedMeterReader(tempSelectedMeterReader);

      setMeterReaderZonebooks(tempSelectedMeterReader?.zonebooks!);

      setSelectedRestDay(tempSelectedMeterReader?.restDay);
    }
  }, [
    setEditMeterReaderDialogIsOpen,
    setSelectedEmployee,
    editMeterReaderDialogIsOpen,
    selectedMeterReader,
    meterReaders,
    setMeterReaderZonebooks,
    setSelectedMeterReader,
    setSelectedRestDay,
  ]);

  return (
    <Dialog
      open={editMeterReaderDialogIsOpen}
      onOpenChange={() => {
        setEditMeterReaderDialogIsOpen(!editMeterReaderDialogIsOpen);
        setMeterReaderZonebooks([]);
        setSelectedMeterReader(undefined);
      }}
    >
      <DialogTrigger asChild>
        <button className="flex w-full items-center justify-start gap-2 rounded p-2 text-sm hover:bg-amber-400">
          <SquarePenIcon className="size-4" />
          Update Meter Reader
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

          <DialogDescription className="text-gray-500">Edit meter reader</DialogDescription>
        </DialogHeader>
        {selectedMeterReader && (
          <div className="">
            <EditMeterReaderTabs />
          </div>
        )}

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
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
