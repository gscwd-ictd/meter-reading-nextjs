"use client";

import { FunctionComponent, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@mr/components/ui/Dialog";
import { Button } from "@mr/components/ui/Button";
import { Input } from "@mr/components/ui/Input";
import { Label } from "@mr/components/ui/Label";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";
import { Area } from "@mr/lib/types/zonebook";

type Zonebook = {
  zoneBook: string;
  zone: string;
  book: number;
  area?: string;
};

export const AssignAreaZonebookDialog: FunctionComponent = () => {
  const [area, setArea] = useState({} as Area);

  const assignAreaZonebookDialogIsOpen = useZonebookStore((state) => state.assignAreaZonebookDialogIsOpen);
  const setAssignAreaZonebookDialogIsOpen = useZonebookStore(
    (state) => state.setAssignAreaZonebookDialogIsOpen,
  );
  const selectedZonebook = useZonebookStore((state) => state.selectedZonebook);
  const setSelectedZonebook = useZonebookStore((state) => state.setSelectedZonebook);

  return (
    <Dialog
      open={assignAreaZonebookDialogIsOpen}
      onOpenChange={() => {
        setAssignAreaZonebookDialogIsOpen(!assignAreaZonebookDialogIsOpen);
        setSelectedZonebook(null);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-primary">Assign Area to Zonebook</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="zoneBook" className="text-right">
              Zone Book
            </Label>
            <Input id="zoneBook" defaultValue={selectedZonebook?.zoneBook} disabled className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="zone" className="text-right">
              Zone
            </Label>
            <Input id="zone" defaultValue={selectedZonebook?.zone} disabled className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="book" className="text-right">
              Book
            </Label>
            <Input id="book" defaultValue={selectedZonebook?.book} disabled className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="area" className="text-right">
              Area
            </Label>
            --area--
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setAssignAreaZonebookDialogIsOpen(false)}>
            Cancel
          </Button>
          <Button>Assign area</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
