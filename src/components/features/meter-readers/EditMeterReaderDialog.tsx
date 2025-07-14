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
import { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from "react";
import { useMeterReadersStore } from "@mr/components/stores/useMeterReadersStore";
import { SquarePenIcon, Users2Icon } from "lucide-react";
import { MeterReader, MeterReaderWithZonebooks } from "@mr/lib/types/personnel";
import { toast } from "sonner";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";
import { EditMeterReaderTabs } from "./EditMeterReaderTabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type EditMeterReaderDialogProps = {
  editMeterReaderDialogIsOpen: boolean;
  setEditMeterReaderDialogIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedMeterReader: MeterReader;
};

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Zonebook } from "@mr/lib/types/zonebook";

const meterReaderSchema = z.object({
  employeeId: z.string(),
  mobileNumber: z.string().regex(/^\d{9}$/, {
    message: "Mobile number must be exactly 9 digits",
  }),
  zoneBooks: z.array(
    z.object({
      zone: z.string(),
      book: z.string(),
    }),
  ),
  restDay: z.string().optional(),
});

type MeterReaderType = z.infer<typeof meterReaderSchema>;

type ZonebookToSubmit = Pick<Zonebook, "zone" | "book">;

type SubmitMeterReaderType = {
  employeeId: string;
  restDay: string;
  zoneBooks: Array<ZonebookToSubmit>;
  mobileNumber: string;
};

export const EditMeterReaderDialog: FunctionComponent<EditMeterReaderDialogProps> = ({
  editMeterReaderDialogIsOpen,
  setEditMeterReaderDialogIsOpen,
  selectedMeterReader,
}) => {
  const setSelectedMeterReader = useMeterReadersStore((state) => state.setSelectedMeterReader);
  const setSelectedRestDay = useMeterReadersStore((state) => state.setSelectedRestDay);
  const setMeterReaderZonebooks = useZonebookStore((state) => state.setMeterReaderZonebooks);
  const zonebookSelectorIsOpen = useZonebookStore((state) => state.zonebookSelectorIsOpen);
  const setFilteredZonebooks = useZonebookStore((state) => state.setFilteredZonebooks);
  const setTempFilteredZonebooks = useZonebookStore((state) => state.setTempFilteredZonebooks);
  const setMobileNumber = useMeterReadersStore((state) => state.setMobileNumber);
  const queryClient = useQueryClient();
  const [hasSetInitialZonebookPool, setHasSetInitialZonebookPool] = useState<boolean>(false);

  const methods = useForm<MeterReaderType>({
    resolver: zodResolver(meterReaderSchema),
    reValidateMode: "onChange",
    defaultValues: { mobileNumber: "", restDay: undefined, zoneBooks: [] },
  });

  const { handleSubmit, setValue, reset } = methods;

  const resetToDefaults = () => {
    reset();
    setMobileNumber(undefined);
    setSelectedMeterReader(undefined);
    setSelectedRestDay(undefined);
    setMeterReaderZonebooks([]);
  };

  // transform the meterReader object
  const transformSelectedPersonnelToSubmit = async (
    meterReader: MeterReaderType,
  ): Promise<SubmitMeterReaderType> => {
    return {
      employeeId: meterReader.employeeId,
      mobileNumber: `+639${meterReader.mobileNumber}`,
      restDay: meterReader.restDay ? (meterReader.restDay === "sunday" ? "0" : "6") : "",
      zoneBooks: meterReader.zoneBooks.map((zb) => {
        return { zone: zb.zone, book: zb.book };
      }),
    };
  };

  // post
  const meterReaderMutation = useMutation({
    mutationFn: async (meterReader: MeterReaderType) => {
      try {
        const transformedEmployee = await transformSelectedPersonnelToSubmit({ ...meterReader });

        return await axios.put(
          `${process.env.NEXT_PUBLIC_MR_BE}/meter-readers/${selectedMeterReader.meterReaderId}`,
          transformedEmployee,
        );
      } catch (error) {
        console.log(error);
        toast.error("Error", { description: JSON.stringify(error) });
      }
    },
    onSuccess: async () => {
      setEditMeterReaderDialogIsOpen(false);
      resetToDefaults();

      const fetchMeterReaders = await axios.get(
        `${process.env.NEXT_PUBLIC_MR_BE}/meter-readers?status=assigned`,
      );

      queryClient.setQueryData(["get-all-meter-readers"], fetchMeterReaders.data);

      toast.success("Success", {
        description: "You have successfully updated this meter reader!",
        position: "top-right",
      });
    },
  });

  const submitMeterReader = (meterReader: MeterReaderType) => {
    meterReaderMutation.mutateAsync(meterReader);
  };

  // get meter reader by id
  const { data: meterReader } = useQuery({
    queryKey: ["get-meter-reader-by-id", selectedMeterReader.meterReaderId],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_MR_BE}/meter-readers/${selectedMeterReader.meterReaderId}`,
      );

      return res.data as MeterReaderWithZonebooks;
    },
    enabled: !!editMeterReaderDialogIsOpen,
  });

  //! get the filtered zonebooks
  const { data: zoneBooks, isLoading } = useQuery({
    queryKey: ["get-all-zoneBooks"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/zone-book`);
        return res.data as Zonebook[];
      } catch (error) {
        console.log(error);
      }
    },
    enabled: !hasSetInitialZonebookPool,
  });

  // set the selected employee to undefined when the modal is closed
  useEffect(() => {
    if (editMeterReaderDialogIsOpen && meterReader) {
      setSelectedMeterReader({ ...meterReader, mobileNumber: meterReader.mobileNumber.slice(4) });

      setMobileNumber(meterReader.mobileNumber.slice(4));

      setValue("employeeId", meterReader.employeeId);

      setValue("mobileNumber", meterReader.mobileNumber.slice(4));

      setValue("restDay", meterReader.restDay);

      setValue("zoneBooks", meterReader?.zoneBooks);

      setMeterReaderZonebooks(meterReader?.zoneBooks); // this refers to the meter reader's assigned zonebooks

      setSelectedRestDay(meterReader?.restDay);
    }
  }, [
    setEditMeterReaderDialogIsOpen,
    setMobileNumber,
    editMeterReaderDialogIsOpen,
    selectedMeterReader,
    meterReader,
    setMeterReaderZonebooks,
    setSelectedMeterReader,
    setSelectedRestDay,
    setValue,
  ]);

  //! this will be the zonebooks unassigned pool
  useEffect(() => {
    if (zoneBooks && !hasSetInitialZonebookPool && meterReader) {
      const filteredZonebooks = zoneBooks.filter(
        (orig) => !meterReader.zoneBooks.some((current) => current.zoneBook === orig.zoneBook),
      );

      setFilteredZonebooks(filteredZonebooks); // this refers to the unassigned pool
      setTempFilteredZonebooks(filteredZonebooks); // this refers to the copied unassigned pool
      setHasSetInitialZonebookPool(true);
    }
  }, [zoneBooks, hasSetInitialZonebookPool, setFilteredZonebooks, setTempFilteredZonebooks, meterReader]);

  return (
    <Dialog
      open={editMeterReaderDialogIsOpen}
      onOpenChange={() => {
        setEditMeterReaderDialogIsOpen(!editMeterReaderDialogIsOpen);
        resetToDefaults();
      }}
    >
      <DialogTrigger asChild>
        <button className="flex w-full items-center justify-start gap-2 rounded p-2 text-sm hover:bg-amber-400">
          <SquarePenIcon className="size-4" />
          Update Details
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
            <Users2Icon className="size-5" /> Update Meter Reader
          </DialogTitle>

          <DialogDescription className="text-gray-500">Edit meter reader details</DialogDescription>
        </DialogHeader>
        {selectedMeterReader && (
          <FormProvider {...methods}>
            <form id="edit-meter-reader-form" onSubmit={handleSubmit(submitMeterReader)}>
              <EditMeterReaderTabs loading={isLoading} />
            </form>
          </FormProvider>
        )}

        <DialogFooter className="grid grid-cols-2">
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              setEditMeterReaderDialogIsOpen(false);
              resetToDefaults();
            }}
          >
            Cancel
          </Button>

          <Button
            size="lg"
            disabled={!selectedMeterReader ? true : false}
            type="submit"
            form="edit-meter-reader-form"
            className="dark:text-white"
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
