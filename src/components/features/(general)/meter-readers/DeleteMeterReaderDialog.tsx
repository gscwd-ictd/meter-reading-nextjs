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
import { FunctionComponent } from "react";
import { toast } from "sonner";

type DeleteMeterReaderDialogProps = {
  selectedMeterReader: MeterReader;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const DeleteMeterReaderDialog: FunctionComponent<DeleteMeterReaderDialogProps> = ({
  selectedMeterReader,
  open,
  setOpen,
}) => {
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

      setOpen(false);
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
      open={open}
      onOpenChange={() => {
        setOpen(!open);
      }}
    >
      <AlertDialogTrigger asChild>
        <button className="flex w-full items-center justify-start gap-2 rounded p-2 text-sm hover:bg-red-600 hover:text-white">
          <UserRoundXIcon className="size-4" />
          Remove Meter Reader
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove meter reader</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to remove <span className="text-primary font-bold">{selectedMeterReader.name}</span>{" "}
            as a meter reader?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-[6rem]">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="w-[6rem] bg-red-600 text-white"
            onClick={() => {
              deleteMeterReader.mutateAsync(selectedMeterReader.id);
            }}
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
