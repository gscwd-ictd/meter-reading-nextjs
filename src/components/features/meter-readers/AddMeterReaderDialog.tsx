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
import { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from "react";
import { useMeterReadersStore } from "@mr/components/stores/useMeterReadersStore";
import { PlusCircleIcon, Users2Icon } from "lucide-react";
import { MeterReaderTabs } from "./MeterReaderTabs";
import { SearchPersonnelCombobox } from "./SearchPersonnelCombobox";
import { toast } from "sonner";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Zonebook } from "@mr/lib/types/zonebook";
import axios from "axios";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import { ZonebookFlatSorter } from "@mr/lib/functions/zonebook-flat-sorter";

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

const meterReaderSchema = z.object({
  employeeId: z.string().optional(),
  zoneBooks: z.array(
    z.object({
      zone: z.string(),
      book: z.string(),
    }),
  ),
  restDay: z.string().optional(),
});

type MeterReaderType = z.infer<typeof meterReaderSchema>;

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
  const setMobileNumber = useMeterReadersStore((state) => state.setMobileNumber);
  const setFilteredZonebooks = useZonebookStore((state) => state.setFilteredZonebooks);
  const setTempFilteredZonebooks = useZonebookStore((state) => state.setTempFilteredZonebooks);
  const [hasSetInitialZonebookPool, setHasSetInitialZonebookPool] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const methods = useForm<MeterReaderType>({
    resolver: zodResolver(meterReaderSchema),
    reValidateMode: "onChange",
    defaultValues: { employeeId: undefined, restDay: undefined, zoneBooks: [] },
  });

  const { handleSubmit, reset } = methods;

  const resetToDefaults = () => {
    reset();
    setMobileNumber(undefined);
    setSelectedEmployee(undefined);
    setSelectedRestDay(undefined);
    setMeterReaderZonebooks([]);
    setHasSetInitialZonebookPool(false);
    setFilteredZonebooks([]);
    setTempFilteredZonebooks([]);
    refetch();
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-all-unassigned-zoneBooks"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_MR_BE}/meter-readers/zone-books?status=unassigned`,
        );
        return res.data;
        // return await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/zone-book/unassigned`);
      } catch (error) {
        toast.error("Error", { description: JSON.stringify(error), position: "top-right" });
      }
    },
    enabled: !hasSetInitialZonebookPool && !!addMeterReaderDialogIsOpen,
  });

  const transformSelectedPersonnelToSubmit = async (
    employee: MeterReaderType,
  ): Promise<SubmitEmployeeType> => {
    return {
      employeeId: employee.employeeId!,
      restDay: selectedRestDay ? (selectedRestDay === "sunday" ? "0" : "6") : "",
      zoneBooks: meterReaderZonebooks.map((zb) => {
        return { zone: zb.zone, book: zb.book };
      }),
    };
  };

  // post
  const personnelMutation = useMutation({
    mutationFn: async (employee: MeterReaderType) => {
      try {
        const transformedEmployee = await transformSelectedPersonnelToSubmit({ ...employee });

        return await axios.post(`${process.env.NEXT_PUBLIC_MR_BE}/meter-readers`, transformedEmployee);
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess: async () => {
      setIsSubmitting(false);
      setAddMeterReaderDialogIsOpen(false);
      resetToDefaults();

      const fetchMeterReaders = await axios.get(
        `${process.env.NEXT_PUBLIC_MR_BE}/meter-readers?status=assigned`,
      );

      queryClient.setQueryData(["get-all-meter-readers"], fetchMeterReaders.data);

      toast.success("Success", {
        description: "You have successfully added a meter reader!",
        position: "top-right",
      });
    },
    onError: (error: unknown) => {
      setIsSubmitting(false);
      toast.error("Error", { description: JSON.stringify(error), position: "top-right" });
    },
  });

  // submit
  const submitPersonnel = (employee: MeterReaderType) => {
    if (selectedRestDay !== undefined && selectedRestDay) {
      personnelMutation.mutateAsync(employee);
    } else toast.error("No rest day", { description: "Please select a rest day", position: "top-right" });
  };

  useEffect(() => {
    if (data && !hasSetInitialZonebookPool) {
      setFilteredZonebooks(data);
      setTempFilteredZonebooks(data);
      setHasSetInitialZonebookPool(true);
    }
  }, [
    data,
    hasSetInitialZonebookPool,
    setFilteredZonebooks,
    setTempFilteredZonebooks,
    setHasSetInitialZonebookPool,
  ]);

  return (
    <Dialog
      open={addMeterReaderDialogIsOpen}
      onOpenChange={() => {
        setAddMeterReaderDialogIsOpen(!addMeterReaderDialogIsOpen);
        resetToDefaults();
      }}
      modal
    >
      <DialogTrigger asChild className="my-2">
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
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(submitPersonnel)} id="add-meter-reader-form">
            <SearchPersonnelCombobox />
            <MeterReaderTabs loading={isLoading} />
          </form>
        </FormProvider>

        <DialogFooter className="grid grid-cols-2">
          <DialogClose asChild>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                setAddMeterReaderDialogIsOpen(false);
                resetToDefaults();
              }}
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            size="lg"
            disabled={!selectedEmployee ? true : isSubmitting ? true : false}
            type="submit"
            form="add-meter-reader-form"
            className="flex items-center gap-2"
          >
            Add {isSubmitting && <LoadingSpinner />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
