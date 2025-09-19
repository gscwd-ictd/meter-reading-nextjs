import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@mr/components/ui/AlertDialog";

type Props = {
  onDelete: (id: string) => void;
};

export function RemoveMeterReaderAlertDialog({ onDelete }: Props) {
  const removeMeterReaderEntryIsOpen = useSchedulesStore((state) => state.removeMeterReaderEntryIsOpen);
  const setRemoveMeterReaderEntryIsOpen = useSchedulesStore((state) => state.setRemoveMeterReaderEntryIsOpen);
  const meterReader = useSchedulesStore((state) => state.selectedMeterReader);

  const handleRemove = (id: string) => {
    onDelete(id);
  };

  return (
    <AlertDialog
      open={removeMeterReaderEntryIsOpen}
      onOpenChange={() => {
        setRemoveMeterReaderEntryIsOpen(!removeMeterReaderEntryIsOpen);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Meter reader <span className="text-primary">{meterReader?.name}</span> will be removed from this
            day&apos;s schedule entry.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90 text-white"
            onClick={() => handleRemove(meterReader?.scheduleMeterReaderId!)}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
