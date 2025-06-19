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
import { Dispatch, FunctionComponent, SetStateAction, useEffect } from "react";
import { useMeterReadersStore } from "@mr/components/stores/useMeterReadersStore";
import { PlusCircleIcon, Users2Icon } from "lucide-react";
import { MeterReaderTabs } from "./MeterReaderTabs";
import { SearchPersonnelCombobox } from "./SearchPersonnelCombobox";
import { Employee } from "@mr/lib/types/personnel";
import { toast } from "sonner";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Zonebook } from "@mr/lib/types/zonebook";
import axios from "axios";

type AddMeterReaderDialogProps = {
  addMeterReaderDialogIsOpen: boolean;
  setAddMeterReaderDialogIsOpen: Dispatch<SetStateAction<boolean>>;
};

type ZonebookToSubmit = Pick<Zonebook, "zone" | "book">;

type SubmitEmployeeType = {
  employeeId: string;
  restDay: string;
  zoneBooks: Array<ZonebookToSubmit>;
};

export const AddMeterReaderDialog: FunctionComponent<AddMeterReaderDialogProps> = ({
  addMeterReaderDialogIsOpen,
  setAddMeterReaderDialogIsOpen,
}) => {
  const setSelectedEmployee = useMeterReadersStore((state) => state.setSelectedEmployee);
  const selectedEmployee = useMeterReadersStore((state) => state.selectedEmployee);
  const selectedRestDay = useMeterReadersStore((state) => state.selectedRestDay);
  const setSelectedRestDay = useMeterReadersStore((state) => state.setSelectedRestDay);
  const setMeterReaderZonebooks = useZonebookStore((state) => state.setMeterReaderZonebooks);
  const meterReaderZonebooks = useZonebookStore((state) => state.meterReaderZonebooks);
  const zonebookSelectorIsOpen = useZonebookStore((state) => state.zonebookSelectorIsOpen);

  const queryClient = useQueryClient();

  const transformSelectedPersonnelToSubmit = async (personnel: Employee): Promise<SubmitEmployeeType> => {
    return {
      employeeId: personnel.employeeId,
      restDay: selectedRestDay ? (selectedRestDay === "sunday" ? "0" : "6") : "",
      zoneBooks: meterReaderZonebooks.map((zb) => {
        return { zone: zb.zone, book: zb.book };
      }),
    };
  };

  const personnelMutation = useMutation({
    mutationFn: async () => {
      try {
        const employee = await transformSelectedPersonnelToSubmit(selectedEmployee!);
        return await axios.post(`${process.env.NEXT_PUBLIC_MR_BE}/meter-readers`, employee);
      } catch (error) {
        toast.error("Error", { description: JSON.stringify(error) });
      }
    },
    onSuccess: async () => {
      setAddMeterReaderDialogIsOpen(false);
      setSelectedRestDay(undefined);
      setMeterReaderZonebooks([]);
      // const fetchMeterReaders = queryClient.getQueryData(["get-all-meter-readers"]);

      const fetchMeterReaders = await axios.get(
        `${process.env.NEXT_PUBLIC_MR_BE}/meter-readers?status=assigned`,
      );

      queryClient.setQueryData(["get-all-meter-readers"], fetchMeterReaders.data);

      toast.success("Success", {
        description: "You have successfully added a meter reader!",
        position: "top-right",
      });
    },
  });

  const submitPersonnel = () => {
    if (selectedRestDay !== undefined && selectedRestDay) {
      personnelMutation.mutateAsync();
    } else toast.error("No rest day", { description: "Please select a rest day", position: "top-right" });
  };

  // set the selected employee to undefined when the modal is closed
  useEffect(() => {
    if (addMeterReaderDialogIsOpen) setSelectedEmployee(undefined);
  }, [addMeterReaderDialogIsOpen, setSelectedEmployee]);

  return (
    <Dialog
      open={addMeterReaderDialogIsOpen}
      onOpenChange={() => {
        setAddMeterReaderDialogIsOpen(!addMeterReaderDialogIsOpen);
        setMeterReaderZonebooks([]);
      }}
      modal
    >
      <DialogTrigger asChild>
        <Button variant="default" className="dark:text-white">
          <PlusCircleIcon />
          Add meter reader
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
            <Users2Icon className="size-5" /> New Meter Reader
          </DialogTitle>

          <DialogDescription className="text-gray-500">Add employee as a meter reader</DialogDescription>
        </DialogHeader>
        <div className="">
          <SearchPersonnelCombobox />
          <MeterReaderTabs open={addMeterReaderDialogIsOpen} />
        </div>

        <DialogFooter className="grid grid-cols-2">
          <DialogClose asChild>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                setAddMeterReaderDialogIsOpen(false);
                setSelectedEmployee({} as Employee);
              }}
            >
              Cancel
            </Button>
          </DialogClose>

          <Button size="lg" disabled={!selectedEmployee ? true : false} onClick={submitPersonnel}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
