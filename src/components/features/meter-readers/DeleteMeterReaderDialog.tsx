import { useMeterReadersStore } from "@mr/components/stores/useMeterReadersStore";
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
import { UserRoundXIcon } from "lucide-react";
import { FunctionComponent, useEffect, useState } from "react";
import { toast } from "sonner";

type DeleteMeterReaderDialogProps = {
  selectedMeterReader: MeterReader;
};

export const DeleteMeterReaderDialog: FunctionComponent<DeleteMeterReaderDialogProps> = ({
  selectedMeterReader,
}) => {
  const [deleteMeterReaderDialogIsOpen, setDeleteMeterReaderDialogIsOpen] = useState<boolean>(false);

  const meterReaders = useMeterReadersStore((state) => state.meterReaders);
  const setMeterReaders = useMeterReadersStore((state) => state.setMeterReaders);

  //! REMOVE THIS LATER
  useEffect(() => {
    if (deleteMeterReaderDialogIsOpen && selectedMeterReader) {
    }
  }, [deleteMeterReaderDialogIsOpen, selectedMeterReader]);

  //! REPLACE THIS WITH ROUTE
  const onDelete = (meterReaderEmployeeId: string) => {
    // delete one and return the remaining meter readers
    const remainingMeterReaders = meterReaders.filter(
      (meterReader) => meterReader.employeeId !== meterReaderEmployeeId,
    );
    setMeterReaders(remainingMeterReaders);
  };

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
              onDelete(selectedMeterReader.employeeId);
              toast.success("Success", {
                description: `Successfully Removed ${selectedMeterReader.name} from the list of meter readers!`,
                position: "top-right",
                duration: 1500,
              });
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
