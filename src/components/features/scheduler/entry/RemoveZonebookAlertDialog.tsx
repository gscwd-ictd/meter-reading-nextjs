"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@mr/components/ui/AlertDialog";
import { Button } from "@mr/components/ui/Button";
import { Trash2 } from "lucide-react";

type Props = {
  zoneBook: string;
  onDelete: (id: string) => void;
  triggerLabel?: string;
};

export function RemoveZonebookAlertDialog({ zoneBook, onDelete, triggerLabel = "Remove" }: Props) {
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
            Zone book <code>{zoneBook}</code> will be removed from the assigned list.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90 text-white"
            onClick={() => onDelete(zoneBook)}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
