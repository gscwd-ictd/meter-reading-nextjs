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
import { Button } from "@mr/components/ui/Button";
import { MeterReaderWithZonebooks } from "@mr/lib/types/personnel";
import { Trash2 } from "lucide-react";

type Props = {
  meterReader: MeterReaderWithZonebooks;
  onDelete: (id: string) => void;
  triggerLabel?: string;
};

export function RemoveMeterReaderAlertDialog({ meterReader, onDelete, triggerLabel = "Remove" }: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="flex gap-1">
          <Trash2 size={16} />
          <span className="hidden sm:hidden md:hidden lg:block">{triggerLabel}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Meter reader <span className="text-primary">{meterReader.name}</span> will be removed from the
            entry.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90 text-white"
            onClick={() => onDelete(meterReader.scheduleMeterReaderId!)}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
