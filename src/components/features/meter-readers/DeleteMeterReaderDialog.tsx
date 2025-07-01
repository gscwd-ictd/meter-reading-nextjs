import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@mr/components/ui/AlertDialog";
import { MeterReader } from "@mr/lib/types/personnel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { UserRoundXIcon } from "lucide-react";
import { FunctionComponent, useState } from "react";
import { toast } from "sonner";

type DeleteMeterReaderDialogProps = {
  selectedMeterReader: MeterReader;
};

export const DeleteMeterReaderDialog: FunctionComponent<DeleteMeterReaderDialogProps> = ({
  selectedMeterReader,
}) => {
  const [deleteMeterReaderDialogIsOpen, setDeleteMeterReaderDialogIsOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const deleteMeterReader = useMutation({
    mutationFn: async (meterReaderId: string) => {
      try {
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_MR_BE}/meter-readers/${meterReaderId}`);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: async () => {
      toast.success("Success", {
        description: `Successfully Removed ${selectedMeterReader.name} from the list of meter readers!`,
        position: "top-right",
        duration: 1500,
      });

      const fetchMeterReaders = await axios.get(
        `${process.env.NEXT_PUBLIC_MR_BE}/meter-readers?status=assigned`,
      );

      queryClient.setQueryData(["get-all-meter-readers"], fetchMeterReaders.data);

      setDeleteMeterReaderDialogIsOpen(false);
    },
    onError: () => {
      toast.error("Error", {
        description: `Cannot remove ${selectedMeterReader.name}. Something went wrong. Please try again later`,
        position: "top-right",
        duration: 1500,
      });
    },
  });

  return (
    <AlertDialog
      open={deleteMeterReaderDialogIsOpen}
      onOpenChange={() => {
        setDeleteMeterReaderDialogIsOpen(!deleteMeterReaderDialogIsOpen);
      }}
    >
      <AlertDialogTrigger asChild>
        <button className="flex w-full items-center justify-start gap-2 rounded p-2 text-sm hover:bg-red-600 hover:text-white">
          <UserRoundXIcon className="size-4" />
          Delete Meter Reader
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete meter reader</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to remove <span className="font-bold text-black">{selectedMeterReader.name}</span> as
            a meter reader?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-[6rem]">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="w-[6rem] bg-red-600"
            onClick={() => {
              // onDelete(selectedMeterReader.meterReaderId);
              deleteMeterReader.mutateAsync(selectedMeterReader.meterReaderId);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
